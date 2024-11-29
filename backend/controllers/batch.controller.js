import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";
import { parseString } from "../utils/functions.js";
import lodash from "lodash";

export const getAllBatches = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [batches] = await conn.execute(`SELECT * FROM batch`);

      if (!batches.length) {
        return next(errorProvider(404, "No Bathces found"));
      }

      const temp = [];
      batches.forEach((obj) => {
        temp.push({
          ...parseString(obj.batch_code),
          status: obj.status,
          batch_id: obj.batch_id,
        });
      });

      return res.status(200).json(temp);
    } catch (error) {
      console.error("Error retrieving batches:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving batches")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getBatchById = async (req, res, next) => {
  const { batch_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [batch] = await conn.execute(
        `SELECT * FROM batch WHERE batch_id = ?`,
        [batch_id]
      );

      if (!batch.length) {
        return next(errorProvider(404, "No Bathces found"));
      }

      let details = parseString(batch[0].batch_code);

      const [degFacDepResults] = await conn.execute(
        `SELECT d.deg_id, dd.d_id, fd.f_id FROM degree d INNER JOIN dep_deg dd ON d.deg_id = dd.deg_id INNER JOIN fac_dep fd ON dd.d_id = fd.d_id WHERE d.short = ?`,
        [details.degree_name_short]
      );

      const [batCurLecResult] = await conn.execute(
        `SELECT * FROM batch_curriculum_lecturer WHERE batch_id = ?`,
        [batch_id]
      );

      const subjects = {};
      batCurLecResult.forEach((obj) => {
        subjects[obj.sub_id] = obj.m_id.toString();
      });

      return res.status(200).json({
        status: batch[0].status,
        ...details,
        ...degFacDepResults[0],
        subjects,
        batch_id,
      });
    } catch (error) {
      console.error("Error retrieving batch:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving batch")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const createBatch = async (req, res, next) => {
  const { batch_code, subjects, status } = req.body;

  try {
    const conn = await pool.getConnection();

    try {
      if (!batch_code || !status || !Object.keys(subjects).length) {
        return next(
          errorProvider(
            400,
            "All fields (batch_code, status, subjects) are required"
          )
        );
      }

      await conn.beginTransaction();

      const [batchExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM batch WHERE batch_code = ?",
        [batch_code]
      );

      if (batchExists[0].count > 0) {
        conn.release();
        return next(errorProvider(409, "Batch already exists"));
      }

      let description = "";
      let batchCurriculumLectureSqlValues = "";
      let batchStudentsSubColsSql = "";
      Object.entries(subjects).forEach((arr, ind) => {
        if (ind != 0) {
          description += ",";
          batchCurriculumLectureSqlValues += ",";
        }
        description += arr[0];
        batchCurriculumLectureSqlValues += "(?, ?, ?)";
        batchStudentsSubColsSql += `,sub_${arr[0]} VARCHAR(50) NOT NULL`;
      });

      const [batchResult] = await conn.execute(
        "INSERT INTO batch(batch_code,description,status ) VALUES (?, ?, ?)",
        [batch_code, description, status]
      );

      const batch_id = batchResult.insertId;

      let values = [];
      Object.entries(subjects).forEach((arr, ind) => {
        values.push(batch_id, arr[0], arr[1]);
      });

      const [batchDetailsResult] = await conn.execute(
        `INSERT INTO batch_curriculum_lecturer(batch_id, sub_id, m_id) VALUES ${batchCurriculumLectureSqlValues}`,
        values
      );

      for (const sub_id of Object.keys(subjects)) {
        const createTableQuery = `
          CREATE TABLE batch_${batch_id}_sub_${sub_id} (
            s_id INT(11) NOT NULL,
            eligibility VARCHAR(50) NOT NULL
          )
        `;
        await conn.query(createTableQuery);
        console.log(
          `Table batch_${batch_id}_sub_${sub_id} created successfully`
        );
      }

      const [createTableForTheBatchStudentsResult] = await conn.execute(
        `CREATE TABLE batch_${batch_id}_students (s_id INT(11) NOT NULL,applied_to_exam VARCHAR(50) NOT NULL,admission_ready VARCHAR(50) NOT NULL ${batchStudentsSubColsSql})`
      );

      await conn.commit();
      return res.status(201).json({
        message: "Batch and batch subject details created successfully",
      });
    } catch (error) {
      await conn.rollback();
      console.error("Error creating batch and details:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while creating the batch and details"
        )
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const updateBatch = async (req, res, next) => {
  const {
    old_subjects,
    old_batch_code,
    batch_code,
    subjects,
    status,
    batch_id,
    old_status,
  } = req.body;

  if (
    lodash.isEqual(old_subjects, subjects) &&
    old_batch_code == batch_code &&
    old_status == status
  ) {
    return res.status(200).json({
      message: "No changes to update",
    });
  }

  try {
    const conn = await pool.getConnection();

    try {
      if (
        !batch_id ||
        !batch_code ||
        !status ||
        !Object.keys(subjects).length
      ) {
        return next(
          errorProvider(
            400,
            "All fields (batch_id, status,batch_code,subjects) are required"
          )
        );
      }

      await conn.beginTransaction();

      const [batchExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM batch WHERE batch_id = ?",
        [batch_id]
      );

      if (batchExists[0].count == 0) {
        conn.release();
        return next(errorProvider(409, "Batch not found"));
      }

      if (
        lodash.isEqual(old_subjects, subjects) &&
        old_batch_code == batch_code &&
        old_status != status
      ) {
        const [statusUpdateResult] = await conn.execute(
          "UPDATE batch SET status=? WHERE batch_id = ?",
          [status, batch_id]
        );

        await conn.commit();
        return res.status(200).json({
          message: "Status updated",
        });
      }

      let description = "";
      let batchCurriculumLectureSqlValues = "";
      let values = [];
      let batchStudentsSubColsSql = "";

      if (subjects) {
        Object.entries(subjects).forEach((arr, ind) => {
          if (ind != 0) {
            description += ",";
            batchCurriculumLectureSqlValues += ",";
          }
          description += arr[0];
          batchCurriculumLectureSqlValues += "(?, ?, ?)";
          values.push(batch_id, arr[0], arr[1]);
          batchStudentsSubColsSql += `ADD COLUMN sub_${arr[0]} VARCHAR(50) NOT NULL`;
        });
      }

      const [batchResult] = await conn.execute(
        "UPDATE batch SET batch_code=?,description=?,status=? WHERE batch_id = ?",
        [batch_code, description, status, batch_id]
      );

      if (Object.keys(old_subjects).length) {
        const old_sub_codes = Object.keys(old_subjects);
        const new_sub_codes = Object.keys(subjects);
        if (!lodash.isEqual(old_sub_codes, new_sub_codes)) {
          //delete subjects tables and columns
          let deleteTablesSql = "DROP TABLE IF EXISTS ";
          let deleteColumnsSql = `ALTER TABLE batch_${batch_id}_students `;
          Object.keys(old_subjects).forEach((sub_id, ind) => {
            if (ind != 0) {
              deleteTablesSql += ",";
              deleteColumnsSql += ",";
            }
            deleteTablesSql += `batch_${batch_id}_sub_${sub_id}`;
            deleteColumnsSql + `DROP COLUMN ${sub_id}`;
          });
          await conn.query(deleteTablesSql);
          console.log(`'${deleteTablesSql}' deleted successfully`);
          await conn.query(deleteColumnsSql);
          console.log(`'${deleteColumnsSql}' deleted successfully`);

          //create subjects tables
          for (const sub_id of Object.keys(subjects)) {
            const createTableQuery = `
          CREATE TABLE batch_${batch_id}_sub_${sub_id} (
            s_id INT(11) NOT NULL,
            eligibility VARCHAR(50) NOT NULL
          )
        `;
            await conn.query(createTableQuery);
            console.log(
              `Table batch_${batch_id}_sub_${sub_id} created successfully`
            );
          }

          //create subjects columns for batch student table
          const [createSubjectsColumnsResult] = await conn.execute(
            `ALTER TABLE table_name ${batchStudentsSubColsSql}`
          );
        }

        const [deleteOldBatCurLecRowsResult] = await conn.execute(
          "DELETE FROM batch_curriculum_lecturer WHERE batch_id = ?",
          [batch_id]
        );
      }

      const [batchDetailsResult] = await conn.execute(
        `INSERT INTO batch_curriculum_lecturer(batch_id, sub_id, m_id) VALUES ${batchCurriculumLectureSqlValues}`,
        values
      );

      await conn.commit();
      return res.status(201).json({
        message: "Batch and batch subject details updated successfully",
      });
    } catch (error) {
      await conn.rollback();
      console.error("Error updating batch and details:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while updating the batch and details"
        )
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getStudentsByBatchId = async (req, res, next) => {
  const { batch_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const query = `SELECT s_id FROM batch_${batch_id}_students`;

      if (batch_id) {
        const [StudentsInTheBatch] = await conn.execute(query);

        if (!StudentsInTheBatch.length) {
          return res.status(200).json([]);
        }

        let StudentsInTheBatchArr = StudentsInTheBatch.map((obj) => {
          let { s_id } = obj;
          return s_id;
        });

        return res.status(200).json(StudentsInTheBatchArr);
      }
    } catch (error) {
      console.error("Error retrieving students:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while retrieving students in the batch"
        )
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const addStudentsToTheBatchTable = async (req, res, next) => {
  let { batch_id, oldData, selectedStudents } = req.body;
  if (!oldData || !oldData?.length) {
    oldData = [];
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const newSelections = selectedStudents.filter(
        (s_id) => !oldData.includes(s_id)
      );

      const removedSelections = oldData.filter(
        (s_id) => !selectedStudents.includes(s_id)
      );

      if (removedSelections.length) {
        let removeQuery = "s_id = ?";
        removedSelections.forEach((s_id, ind) => {
          if (ind != 0) {
            removeQuery += " OR s_id = ?";
          }
        });

        const [removeStudentsResults] = await conn.execute(
          `DELETE FROM batch_${batch_id}_students WHERE ${removeQuery}`,
          removedSelections
        );
      }

      if (newSelections.length) {
        let addQuery = "(?,'false','false')";
        newSelections.forEach((s_id, ind) => {
          if (ind != 0) {
            addQuery += ",(?,'false','false')";
          }
        });

        const [addStudentsResults] = await conn.execute(
          `INSERT INTO batch_${batch_id}_students(s_id,applied_to_exam,admission_ready) VALUES ${addQuery}`,
          newSelections
        );
      }

      await conn.commit();
      return res.status(200).json({
        message: "Students of the batch updated successfully",
      });
    } catch (error) {
      console.error("Error updating students of the batch:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while updating students of the batch"
        )
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getNoOfBatches = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        "SELECT COUNT(*) AS batch_count FROM batch"
      );

      const { batch_count } = result[0];

      return res.status(200).json({
        count: batch_count,
      });
    } catch (error) {
      console.error("Error retrieving number of batches:", error);
      return next(
        errorProvider(500, "An error occurred while the batch count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getBatchByFacultyId = async (req, res, next) => {
  const { f_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        "SELECT b.batch_id, b.batch_code, d.deg_name FROM fac_dep fd JOIN dep_deg dd ON fd.d_id = dd.d_id JOIN degree d ON dd.deg_id = d.deg_id JOIN batch b ON b.batch_code LIKE CONCAT('%', d.short, '%') WHERE fd.f_id = ? AND b.status = 'true'",
        [f_id]
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error retrieving batches by faculty id:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while retrieving batches by faculty id"
        )
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};
