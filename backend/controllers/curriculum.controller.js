import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";

export const getAllSubjects = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const [results] = await conn.query("CALL GetAllSubjects();");

      return res.status(200).json(results[0]); // First result set contains the data
    } catch (error) {
      console.error("Error fetching subject details:", error);
      return next(errorProvider(500, "Failed to fetch subject details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getSubjectById = async (req, res, next) => {
  const { sub_id } = req.body;

  if (!sub_id) {
    return next(errorProvider(400, "Missing sub_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [results] = await conn.query("CALL GetSubjectById(?);", [sub_id]);

      if (results[0].length === 0) {
        return res.status(404).json({
          message: "No subject details found for the given sub_id.",
        });
      }

      return res.status(200).json(results[0][0]); // First result set, first record
    } catch (error) {
      console.error("Error fetching subject details:", error);
      return next(errorProvider(500, "Failed to fetch subject details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllSubjectsWithExtraDetails = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const [results] = await conn.query(
        "CALL GetAllSubjectsWithExtraDetails();"
      );

      return res.status(200).json(results[0]); // First result set contains the data
    } catch (error) {
      console.error("Error fetching subject details:", error);
      return next(errorProvider(500, "Failed to fetch subject details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getSubjectByDegLevSem = async (req, res, next) => {
  const { deg_id, level, sem_no } = req.body;

  if (!deg_id || !level || !sem_no) {
    return next(errorProvider(400, "Missing required fields."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [results] = await conn.query(
        "CALL GetSubjectByDegLevSem(?, ?, ?);",
        [deg_id, level, sem_no]
      );

      return res.status(200).json(results[0]); // First result set contains the data
    } catch (error) {
      console.error("Error fetching subject details:", error);
      return next(errorProvider(500, "Failed to fetch subject details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getSubjectsByLecId = async (req, res, next) => {
  const { m_id } = req.user;

  if (!m_id) {
    return next(errorProvider(400, "Missing m_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [results] = await conn.query("CALL GetSubjectsByLecId(?);", [m_id]);

      if (results[0].length === 0) {
        return res
          .status(404)
          .json({ message: "No subject details found for the given m_id." });
      }

      return res.status(200).json({ subject: results[0] }); // First result set contains the data
    } catch (error) {
      console.error("Error fetching subject details:", error);
      return next(errorProvider(500, "Failed to fetch subject details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getSubjectsByDid = async (req, res, next) => {
  const { m_id } = req.user;

  if (!m_id) {
    return next(errorProvider(400, "Missing hod_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [results] = await conn.query("CALL GetSubjectsByDid(?);", [m_id]);

      if (results[0].length === 0) {
        return res.status(404).json({
          message: "No subject details found for the given hod_id.",
        });
      }

      return res.status(200).json({ subject: results[0] }); // First result set contains the data
    } catch (error) {
      console.error("Error fetching subject details by hod_id:", error);
      return next(
        errorProvider(
          500,
          "Failed to fetch subject details for the given hod_id"
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

export const createSubject = async (req, res, next) => {
  const {
    sub_code,
    sub_name,
    sem_no,
    deg_id,
    level,
    status = "true",
  } = req.body;

  if (!sub_code || !sub_name || !sem_no || !deg_id || !level || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.query("CALL CreateSubject(?, ?, ?, ?, ?, ?);", [
        sub_code,
        sub_name,
        sem_no,
        deg_id,
        level,
        status,
      ]);

      let desc = `Subject created sub_code=${sub_code}, sub_name=${sub_name}, sem_no=${sem_no}, deg_id=${deg_id}, level=${level}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res.status(201).json({
        message: "subject record created successfully",
      });
    } catch (error) {
      console.error("Error creating subject:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while creating the subject record"
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

export const updateSubject = async (req, res, next) => {
  const { sub_code, sub_name, sem_no, deg_id, level, sub_id } = req.body;

  if (!sub_id) {
    return next(errorProvider(400, "Subject ID (sub_id) is required"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [result] = await conn.query(
        "CALL UpdateSubject(?, ?, ?, ?, ?, ?);",
        [sub_id, sub_code, sub_name, sem_no, deg_id, level]
      );

      if (result.affectedRows === 0) {
        return next(
          errorProvider(404, "Subject record not found or no changes made")
        );
      }

      let desc = `Subject updated for sub_id=${sub_id}, sub_code=${sub_code}, sub_name=${sub_name}, sem_no=${sem_no}, deg_id=${deg_id}, level=${level}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res.status(200).json({ message: "Subject updated successfully" });
    } catch (error) {
      console.error("Error updating subject:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while updating the subject record"
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

export const updateSubjectStatus = async (req, res, next) => {
  const { status, id: sub_id } = req.body;

  if (!sub_id || !status) {
    return next(errorProvider(400, "Subject ID (sub_id) is required"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [result] = await conn.query("CALL updateSubjectStatus(?, ?);", [
        sub_id,
        status,
      ]);

      if (result.affectedRows === 0) {
        return next(
          errorProvider(404, "Subject record not found or no changes made")
        );
      }

      let desc = `Subject status changed for sub_id=${sub_id} to status=${status}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res
        .status(200)
        .json({ message: "subject status updated successfully" });
    } catch (error) {
      console.error("Error updating subject:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while updating the subject record"
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

export const getNoOfSubjects = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query("CALL GetNoOfSubjects();");
      return res.status(200).json({ count: result[0][0].subject_count });
    } catch (error) {
      console.error("Error retrieving number of subjects:", error);
      return next(
        errorProvider(500, "An error occurred while fetching subject count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getSubjectBybatchId = async (req, res, next) => {
  const { batch_id } = req.body;

  if (!batch_id) {
    return next(errorProvider(400, "Batch ID is required."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query("CALL GetSubjectByBatchId(?);", [
        batch_id,
      ]);

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching subject details:", error);
      return next(errorProvider(500, "Failed to fetch subject details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getStudentApplicationDetails = async (req, res, next) => {
  const { user_id } = req.user;

  if (!user_id) {
    return next(errorProvider(400, "User ID is required."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query(
        "CALL GetStudentApplicationDetails(?);",
        [user_id]
      );

      const studentDetails = results[0][0]; // First result set
      const subjects = results[1]; // Second result set

      if (!subjects.length) {
        return next(errorProvider(404, "No subjects found for this batch."));
      }

      const batchId = subjects[0].batch_id; // Ensure batch ID is retrieved

      if (!batchId) {
        return next(errorProvider(500, "Batch ID is missing."));
      }

      // Dynamic attendance query
      const attendanceQuery = `
        SELECT ${subjects.map((s) => `sub_${s.sub_id}`).join(", ")}
        FROM batch_${batchId}_students
        WHERE s_id = ?
      `;

      const [attendanceResult] = await conn.execute(attendanceQuery, [
        studentDetails.s_id,
      ]);

      if (!attendanceResult.length) {
        return next(
          errorProvider(
            404,
            "No attendance found for this student in the batch"
          )
        );
      }

      // Format the response
      const attendance = attendanceResult[0];
      const response = {
        ...studentDetails,
        subjects: subjects.map((subject) => ({
          sub_code: subject.sub_code,
          sub_name: subject.sub_name,
          sub_id: subject.sub_id,
          attendance: attendance[`sub_${subject.sub_id}`] || "N/A",
        })),
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching student application details:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while fetching student application details"
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

export const getAllSubjectsForLecturer = async (req, res, next) => {
  const { user_id } = req.user;

  if (!user_id) {
    return next(errorProvider(400, "User ID is required."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      // Call the stored procedure
      const [subjects] = await conn.query(
        "CALL GetAllSubjectsForLecturer(?);",
        [user_id]
      );

      if (!subjects.length) {
        return res.status(404).json({
          message: "No subjects found for the given user ID.",
        });
      }

      return res.status(200).json(subjects[0]);
    } catch (error) {
      console.error("Error fetching subjects for Lecturer:", error);

      if (error.code === "45000") {
        return next(errorProvider(400, error.sqlMessage));
      }

      return next(
        errorProvider(
          500,
          "An error occurred while fetching subjects for the Lecturer."
        )
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getAllSubjectsForDepartment = async (req, res, next) => {
  const { user_id, role_id } = req.user;

  if (!user_id) {
    return next(errorProvider(400, "User ID is required."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [departments] = await conn.query(
        "SELECT d_id FROM department WHERE user_id = ? AND status = 'true'",
        [user_id]
      );

      if (departments.length === 0) {
        return res.status(404).json({ message: "No active departments found" });
      }
      let department = departments[0];
      const result = [];

      // Step 2: Get active degrees under this faculty
      const [degrees] = await conn.query(
        "CALL GetActiveDegreesInDepartment(?)",
        [department.d_id]
      );

      if (degrees[0].length > 0) {
        for (const degree of degrees[0]) {
          // Step 2: Get active degrees under this faculty
          const [batches] = await conn.query(
            "CALL GetActiveBatchesWithinDeadline(?, ?)",
            [degree.deg_id, role_id]
          );

          if (batches[0].length > 0) {
            for (const batch of batches[0]) {
              const { batch_id, batch_code } = batch;

              // Step 3: Get subjects for this batch
              const [subjects] = await conn.query(
                "CALL GetSubjectsForBatch(?)",
                [batch_id]
              );

              if (subjects[0].length > 0) {
                const subjectData = [];

                for (const subject of subjects[0]) {
                  const { sub_id, sub_code, sub_name } = subject;

                  subjectData.push({
                    sub_id,
                    sub_code,
                    sub_name,
                  });
                }

                result.push({
                  batch_id,
                  batch_code,
                  deg_name: degree.deg_name,
                  subjects: subjectData,
                });
              }
            }
          }
        }
      }

      res.status(200).json(result);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getAllSubjectsForFaculty = async (req, res, next) => {
  const { user_id, role_id } = req.user;

  if (!user_id) {
    return next(errorProvider(400, "User ID is required."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      // Step 1: Get faculty ID for the dean
      const [faculty] = await conn.query(
        "SELECT f_id FROM faculty WHERE user_id = ? AND status = 'true'",
        [user_id]
      );

      if (faculty.length === 0) {
        return res.status(404).json({ message: "Faculty not found" });
      }
      const facultyId = faculty[0].f_id;

      // Step 2: Get active departments under this faculty
      const [departments] = await conn.query(
        "CALL GetDepartmentsByFacultyId(?)",
        [facultyId]
      );

      if (departments[0].length === 0) {
        return res.status(404).json({ message: "No active departments found" });
      }

      const result = [];

      for (const department of departments[0]) {
        // Step 2: Get active degrees under this faculty
        const [degrees] = await conn.query(
          "CALL GetActiveDegreesInDepartment(?)",
          [department.d_id]
        );

        if (degrees[0].length > 0) {
          for (const degree of degrees[0]) {
            // Step 2: Get active degrees under this faculty
            const [batches] = await conn.query(
              "CALL GetActiveBatchesWithinDeadline(?, ?)",
              [degree.deg_id, role_id]
            );

            if (batches[0].length > 0) {
              for (const batch of batches[0]) {
                const { batch_id, batch_code } = batch;

                // Step 3: Get subjects for this batch
                const [subjects] = await conn.query(
                  "CALL GetSubjectsForBatch(?)",
                  [batch_id]
                );

                if (subjects[0].length > 0) {
                  const subjectData = [];

                  for (const subject of subjects[0]) {
                    const { sub_id, sub_code, sub_name } = subject;

                    subjectData.push({
                      sub_id,
                      sub_code,
                      sub_name,
                    });
                  }

                  result.push({
                    batch_id,
                    batch_code,
                    deg_name: degree.deg_name,
                    subjects: subjectData,
                  });
                }
              }
            }
          }
        }
      }

      res.status(200).json(result);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const updateEligibility = async (req, res, next) => {
  const { user_id, role_id } = req.user;
  const { batch_id, sub_id, eligibility, s_id, remark } = req.body;

  if (
    !user_id ||
    !s_id ||
    !sub_id ||
    !batch_id ||
    !eligibility ||
    !role_id ||
    !remark
  ) {
    return next(errorProvider(400, "Missing required fields."));
  }

  let status_from;
  let status_to;

  if (eligibility == "true") {
    status_from = "false";
    status_to = "true";
  } else {
    status_from = "true";
    status_to = "false";
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.query("CALL UpdateEligibility(?, ?, ?, ?, ?, ?);", [
        user_id,
        s_id,
        sub_id,
        batch_id,
        eligibility,
        role_id,
      ]);

      await conn.query("CALL LogEligibilityChange(?, ?, ?, ?, ?, ?, ?);", [
        user_id,
        s_id,
        batch_id,
        sub_id,
        status_from,
        status_to,
        remark,
      ]);

      await conn.commit();

      return res
        .status(200)
        .json({ message: "Eligibility updated successfully." });
    } catch (error) {
      await conn.rollback();
      console.error("Error updating eligibility:", error);

      if (error.code === "45000") {
        return next(errorProvider(403, error.sqlMessage));
      }

      return next(
        errorProvider(500, "An error occurred while updating eligibility.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const updateMultipleEligibility = async (req, res, next) => {
  const { user_id, role_id } = req.user;
  const { batch_id, sub_id, eligibility, s_ids, remark } = req.body;

  if (
    !user_id ||
    !s_ids.length ||
    !sub_id ||
    !batch_id ||
    !eligibility ||
    !role_id
  ) {
    return next(errorProvider(400, "Missing required fields."));
  }

  let status_from;
  let status_to;

  if (eligibility == "true") {
    status_from = "false";
    status_to = "true";
  } else {
    status_from = "true";
    status_to = "false";
  }

  try {
    const conn = await pool.getConnection();
    try {
      for (let s_id of s_ids) {
        await conn.query("CALL UpdateEligibility(?, ?, ?, ?, ?, ?);", [
          user_id,
          s_id,
          sub_id,
          batch_id,
          eligibility,
          role_id,
        ]);

        await conn.query("CALL LogEligibilityChange(?, ?, ?, ?, ?, ?, ?);", [
          user_id,
          s_id,
          batch_id,
          sub_id,
          status_from,
          status_to,
          remark,
        ]);
      }

      await conn.commit();

      return res
        .status(200)
        .json({ message: "Eligibility updated successfully." });
    } catch (error) {
      console.error("Error updating eligibilities:", error);
      await conn.rollback();

      if (error.code === "45000") {
        return next(errorProvider(403, error.sqlMessage));
      }

      return next(
        errorProvider(500, "An error occurred while updating eligibility.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const checkSubjectExist = async (req, res, next) => {
  const { user_id } = req.user;
  const { batch_id, sub_id } = req.body;

  if (!sub_id || !batch_id || !user_id) {
    return res.status(200).json({ subjectExists: false });
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [subjectExistsResult] = await conn.query(
        "CALL CheckSubjectExist(?, ?, ?, @subjectExists); SELECT @subjectExists AS subjectExists;",
        [batch_id, sub_id, user_id]
      );

      const subjectExists = subjectExistsResult[1][0].subjectExists;

      await conn.commit();

      return res.status(200).json({ subjectExists });
    } catch (error) {
      console.error("Error during cheking subject existence:", error);
      await conn.rollback();

      return next(
        errorProvider(500, "An error occurred while cheking subject existence.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const createSyllabus = async (req, res, next) => {
  const {
    deg_id,
    commenced_year,
    expired_year = "",
    status = "true",
  } = req.body;

  if (!deg_id || !commenced_year || !status) {
    return res
      .status(400)
      .json({ message: "deg_id, commenced_year, status fields are required" });
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.query("CALL CreateSyllabus(?, ?, ?, ?);", [
        deg_id,
        commenced_year,
        expired_year,
        status,
      ]);

      let desc = `Syllabus created deg_id=${deg_id}, commenced_year=${commenced_year}, expired_year=${expired_year}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res.status(201).json({
        message: "syllabus created successfully",
      });
    } catch (error) {
      console.error("Error creating syllabus:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while creating the subject record"
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

export const getAllSyllabiWithExtraDetails = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const [results] = await conn.query(
        "CALL GetAllSyllabiWithExtraDetails();"
      );

      return res.status(200).json(results[0]); // First result set contains the data
    } catch (error) {
      console.error("Error fetching Syllabi details:", error);
      return next(errorProvider(500, "Failed to fetch Syllabi details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const updateSyllabusStatus = async (req, res, next) => {
  const { status, id: syl_id } = req.body;

  if (!syl_id || !status) {
    return next(errorProvider(400, "Syllabus ID (syl_id) is required"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [result] = await conn.query("CALL updateSyllabusStatus(?, ?);", [
        syl_id,
        status,
      ]);

      if (result.affectedRows === 0) {
        return next(
          errorProvider(404, "Subject record not found or no changes made")
        );
      }

      let desc = `Subject status changed for syl_id=${syl_id} to status=${status}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res
        .status(200)
        .json({ message: "subject status updated successfully" });
    } catch (error) {
      console.error("Error updating subject:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while updating the subject record"
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

export const getSyllabusById = async (req, res, next) => {
  const { syl_id } = req.body;

  if (!syl_id) {
    return next(errorProvider(400, "Missing syl_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [results] = await conn.query("CALL GetSyllabusById(?);", [syl_id]);

      if (results[0].length === 0) {
        return res.status(404).json({
          message: "No syllabus details found for the given syl_id.",
        });
      }

      return res.status(200).json(results[0][0]); // First result set, first record
    } catch (error) {
      console.error("Error fetching syllabus details:", error);
      return next(errorProvider(500, "Failed to fetch syllabus details"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};
