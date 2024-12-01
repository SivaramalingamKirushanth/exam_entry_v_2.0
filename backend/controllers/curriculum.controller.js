import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";

export const getAllCurriculums = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT * FROM curriculum WHERE status = 'true'`;

      const [results] = await conn.execute(query);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching curriculum details:", error);
      return next(errorProvider(500, "Failed to fetch curriculum details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getCurriculumById = async (req, res, next) => {
  const { sub_id } = req.body;
  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT curriculum.*,dep_deg.d_id,fac_dep.f_id FROM curriculum INNER JOIN dep_deg ON curriculum.deg_id = dep_deg.deg_id INNER JOIN fac_dep ON dep_deg.d_id = fac_dep.d_id WHERE sub_id = ?`;

      const [results] = await conn.execute(query, [sub_id]);

      if (results.length === 0) {
        return res.status(404).json({
          message: "No curriculum details found for the given sub_id.",
        });
      }

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching curriculum details:", error);
      return next(errorProvider(500, "Failed to fetch curriculum details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllCurriculumsWithExtraDetails = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT curriculum.*,degree.deg_name AS degree_name FROM curriculum JOIN degree ON curriculum.deg_id = degree.deg_id`;

      const [results] = await conn.execute(query);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching curriculum details:", error);
      return next(errorProvider(500, "Failed to fetch curriculum details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getCurriculumByDegLevSem = async (req, res, next) => {
  const { deg_id, level, sem_no } = req.body;

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT * FROM curriculum WHERE deg_id = ? AND level = ? AND sem_no = ? AND status = 'true'`;

      const [results] = await conn.execute(query, [deg_id, level, sem_no]);
      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching curriculum details:", error);
      return next(errorProvider(500, "Failed to fetch curriculum details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getCurriculumsByLecId = async (req, res, next) => {
  const { m_id } = req.user;

  if (!m_id) {
    return next(errorProvider(400, "Missing m_id "));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT curriculum.* FROM curriculum JOIN batch_curriculum_lecture ON 
          curriculum.sub_id = batch_curriculum_lecture.sub_id 
        WHERE 
          batch_curriculum_lecture.m_id = ?
      `;

      const [results] = await conn.execute(query, [m_id]);

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No curriculum details found for the given m_id." });
      }

      return res.status(200).json({ curriculum: results });
    } catch (error) {
      console.error("Error fetching curriculum details:", error);
      return next(errorProvider(500, "Failed to fetch curriculum details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getCurriculumsByHodId = async (req, res, next) => {
  const { m_id } = req.user;

  if (!m_id) {
    return next(errorProvider(400, "Missing hod_id"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT 
          curriculum.sub_id, 
          curriculum.sub_name, 
          curriculum.sem_no, 
          curriculum.deg_id, 
          curriculum.level, 
          curriculum.status
        FROM 
          curriculum
        INNER JOIN 
          dep_deg ON curriculum.deg_id = dep_deg.deg_id
        INNER JOIN 
          dep_hod ON dep_deg.d_id = dep_hod.d_id
        WHERE 
          dep_hod.m_id = ? AND curriculum.status = 'Active'
      `;

      const [results] = await conn.execute(query, [m_id]);

      if (results.length === 0) {
        return res.status(404).json({
          message: "No curriculum details found for the given hod_id.",
        });
      }

      return res.status(200).json({ curriculum: results });
    } catch (error) {
      console.error("Error fetching curriculum details by hod_id:", error);
      return next(
        errorProvider(
          500,
          "Failed to fetch curriculum details for the given hod_id"
        )
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const createCurriculum = async (req, res, next) => {
  const { sub_code, sub_name, sem_no, deg_id, level, status } = req.body;

  if (!sub_code || !sub_name || !sem_no || !deg_id || !level || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        `INSERT INTO curriculum (sub_code, sub_name, sem_no, deg_id, level, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [sub_code, sub_name, sem_no, deg_id, level, status]
      );

      return res.status(201).json({
        message: "Curriculum record created successfully",
      });
    } catch (error) {
      console.error("Error creating curriculum:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while creating the curriculum record"
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

export const updateCurriculum = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const { sub_code, sub_name, sem_no, deg_id, level, status, sub_id } =
        req.body;

      if (!sub_id) {
        return next(errorProvider(400, "Subject ID (sub_id) is required"));
      }

      const [result] = await conn.execute(
        `UPDATE curriculum 
          SET 
            sub_code = ?,
            sub_name = ?, 
            sem_no = ?, 
            deg_id = ?, 
            level = ?, 
            status = ? 
          WHERE sub_id = ?`,
        [sub_code, sub_name, sem_no, deg_id, level, status, sub_id]
      );

      if (result.affectedRows === 0) {
        return next(
          errorProvider(404, "Curriculum record not found or no changes made")
        );
      }

      return res
        .status(200)
        .json({ message: "Curriculum updated successfully" });
    } catch (error) {
      console.error("Error updating curriculum:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while updating the curriculum record"
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
export const getNoOfCurriculums = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        "SELECT COUNT(*) AS curriculum_count FROM curriculum"
      );

      const { curriculum_count } = result[0];

      return res.status(200).json({
        count: curriculum_count,
      });
    } catch (error) {
      console.error("Error retrieving number of curriculums:", error);
      return next(
        errorProvider(500, "An error occurred while the curriculum count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getCurriculumBybatchId = async (req, res, next) => {
  const { batch_id } = req.body;

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT c.sub_code, c.sub_name, c.sub_id FROM batch_curriculum_lecturer bcl INNER JOIN curriculum c ON bcl.sub_id = c.sub_id WHERE bcl.batch_id = ?`;

      const [results] = await conn.execute(query, [batch_id]);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching curriculum details:", error);
      return next(errorProvider(500, "Failed to fetch curriculum details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getStudentApplicationDetails = async (req, res, next) => {
  const { user_id } = req.user;

  if (!user_id) {
    return next(errorProvider(400, "User ID  required"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [batchIdsResults] = await conn.execute(
        "SELECT sd.batch_ids from student_detail sd INNER JOIN student s ON sd.s_id = s.s_id WHERE s.user_id = ?",
        [user_id]
      );

      const batch_idS_Arr = batchIdsResults[0].batch_ids.split(",");
      const batch_id = batch_idS_Arr[batch_idS_Arr.length - 1];

      if (!batch_id) {
        return next(errorProvider(400, "Batch ID required"));
      }

      const [studentDetails] = await conn.execute(
        `SELECT 
          sd.name, 
          sd.index_num, 
          s.s_id, 
          u.user_name,
          f.f_name 
        FROM faculty f INNER JOIN fac_dep fd ON f.f_id = fd.f_id INNER JOIN student_detail sd ON 
        fd.d_id = sd.d_id
        INNER JOIN student s ON sd.s_id = s.s_id
        INNER JOIN user u ON s.user_id = u.user_id
        WHERE u.user_id = ?`,
        [user_id]
      );

      if (!studentDetails.length) {
        return next(errorProvider(404, "Student not found"));
      }

      const { name, index_num, s_id, user_name, f_name } = studentDetails[0];

      // Step 2: Get the subject codes and names for the batch
      const [subjects] = await conn.execute(
        `SELECT c.sub_code, c.sub_name ,c.sub_id
         FROM curriculum c
         INNER JOIN batch_curriculum_lecturer bcl ON c.sub_id = bcl.sub_id
         WHERE bcl.batch_id = ?`,
        [batch_id]
      );

      if (!subjects.length) {
        return next(errorProvider(404, "No subjects found for this batch"));
      }

      // Step 3: Dynamically query attendance from batch_<batch_id>_students
      const subjectColumns = subjects
        .map((subject) => `sub_${subject.sub_id}`)
        .join(", ");
      const attendanceQuery = `
        SELECT ${subjectColumns}
        FROM batch_${batch_id}_students
        WHERE s_id = ?
      `;

      const [attendanceResult] = await conn.execute(attendanceQuery, [s_id]);

      if (!attendanceResult.length) {
        return next(
          errorProvider(
            404,
            "No attendance found for this student in the batch"
          )
        );
      }

      // Step 4: Format the response
      const attendance = attendanceResult[0];
      const response = {
        name,
        index_num,
        user_name,
        f_name,
        subjects: subjects.map((subject) => ({
          sub_code: subject.sub_code,
          sub_name: subject.sub_name,
          attendance: attendance[`sub_${subject.sub_id}`] || "N/A", // Handle missing data
        })),
      };

      await conn.commit();
      res.status(200).json(response);
    } catch (error) {
      await conn.rollback();
      console.error("Error fetching student batch details:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while fetching student batch details"
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
