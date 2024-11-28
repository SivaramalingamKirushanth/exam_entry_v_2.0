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
        temp.push(parseString(obj.batch_id));
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

      let details = parseString(batch_id);

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
  const { batch_id, subjects, status } = req.body;

  try {
    const conn = await pool.getConnection();

    try {
      if (!batch_id || !status) {
        return next(
          errorProvider(400, "All fields (batch_id, status) are required")
        );
      }

      await conn.beginTransaction();

      const [batchExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM batch WHERE batch_id = ?",
        [batch_id]
      );

      if (batchExists[0].count > 0) {
        conn.release();
        return next(errorProvider(409, "Batch already exists"));
      }

      let description = "";
      let batchCurriculumLectureSqlValues = "";
      let values = [];
      if (subjects) {
        Object.entries(subjects).forEach((arr, ind) => {
          if (ind != 0) {
            description += ",";
            batchCurriculumLectureSqlValues += ",";
          }
          description += arr[0];
          batchCurriculumLectureSqlValues += "(?, ?, ?)";
          values.push(batch_id, arr[0], arr[1]);
        });
      }

      const [batchResult] = await conn.execute(
        "INSERT INTO batch(batch_id,description,status ) VALUES (?, ?, ?)",
        [batch_id, description, status]
      );

      if (Object.keys(subjects).length) {
        const [batchDetailsResult] = await conn.execute(
          `INSERT INTO batch_curriculum_lecturer(batch_id, sub_id, m_id) VALUES ${batchCurriculumLectureSqlValues}`,
          values
        );

        for (const sub_id of Object.keys(subjects)) {
          const createTableQuery = `
          CREATE TABLE ${batch_id}_${sub_id} (
            s_id INT(11) NOT NULL,
            eligibility VARCHAR(50) NOT NULL
          )
        `;
          await conn.query(createTableQuery);
          console.log(`Table ${batch_id}_${sub_id} created successfully`);
        }
      }

      const [createTableForTheBatchStudentsResult] = await conn.execute(
        `CREATE TABLE batch_${batch_id} (s_id INT(11) NOT NULL,applied_to_exam VARCHAR(50) NOT NULL,admission_ready VARCHAR(50) NOT NULL)`
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
  const { old_subjets, subjects, old_batch_id, batch_id, old_status, status } =
    req.body;

  if (
    lodash.isEqual(old_subjets, subjects) &&
    old_batch_id == batch_id &&
    old_status == status
  ) {
    return res.status(200).json({
      message: "Nothing to update, same content",
    });
  }

  try {
    const conn = await pool.getConnection();

    try {
      if (!batch_id || !status) {
        return next(
          errorProvider(400, "All fields (batch_id, status) are required")
        );
      }

      await conn.beginTransaction();

      const [batchExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM batch WHERE batch_id = ?",
        [old_batch_id]
      );

      if (batchExists[0].count == 0) {
        conn.release();
        return next(errorProvider(409, "Batch not found"));
      }

      let description = "";
      let batchCurriculumLectureSqlValues = "";
      let values = [];
      if (subjects) {
        Object.entries(subjects).forEach((arr, ind) => {
          if (ind != 0) {
            description += ",";
            batchCurriculumLectureSqlValues += ",";
          }
          description += arr[0];
          batchCurriculumLectureSqlValues += "(?, ?, ?)";
          values.push(batch_id, arr[0], arr[1]);
        });
      }

      const [batchResult] = await conn.execute(
        "UPDATE batch SET batch_id=?,description=?,status=? WHERE batch_id = ?",
        [batch_id, description, status, old_batch_id]
      );

      if (Object.keys(old_subjets).length) {
        const [deleteOldBatCurLecRowsResult] = await conn.execute(
          "DELETE FROM batch_curriculum_lecturer WHERE batch_id = ?",
          [old_batch_id]
        );

        let deleteTablesSql = "DROP TABLE IF EXISTS ";
        Object.keys(old_subjets).forEach((sub_id, ind) => {
          if (ind != 0) {
            deleteTablesSql += ",";
          }
          deleteTablesSql += `${old_batch_id}_${sub_id}`;
        });
        await conn.query(deleteTablesSql);
        console.log(`\'${deleteTablesSql}\' deleted successfully`);
      }

      if (Object.keys(subjects).length) {
        const [batchDetailsResult] = await conn.execute(
          `INSERT INTO batch_curriculum_lecturer(batch_id, sub_id, m_id) VALUES ${batchCurriculumLectureSqlValues}`,
          values
        );

        for (const sub_id of Object.keys(subjects)) {
          const createTableQuery = `
          CREATE TABLE ${batch_id}_${sub_id} (
            s_id INT(11) NOT NULL,
            eligibility VARCHAR(50) NOT NULL
          )
        `;
          await conn.query(createTableQuery);
          console.log(`Table ${batch_id}_${sub_id} created successfully`);
        }
      }

      const [deleteTableForTheBatchStudentsResult] = await conn.execute(
        `DROP TABLE IF EXISTS batch_${old_batch_id}`
      );

      const [createTableForTheBatchStudentsResult] = await conn.execute(
        `CREATE TABLE batch_${batch_id} (s_id INT(11) NOT NULL,applied_to_exam VARCHAR(50) NOT NULL,admission_ready VARCHAR(50) NOT NULL)`
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
      const query = `SELECT s_id FROM batch_${batch_id}`;

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

  console.log(batch_id, oldData, selectedStudents);
  try {
    const conn = await pool.getConnection();
    try {
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
          `DELETE FROM batch_${batch_id} WHERE ${removeQuery}`,
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
          `INSERT INTO batch_${batch_id} VALUES ${addQuery}`,
          newSelections
        );
      }

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
