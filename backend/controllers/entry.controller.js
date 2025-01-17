import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";

export const applyExam = async (req, res, next) => {
  const { user_id } = req.user;

  if (!user_id) {
    return next(errorProvider(400, "User ID is required."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      // Call the stored procedure and retrieve the OUT parameter
      await conn.query("CALL ApplyExam(?, @out_batch_id);", [user_id]);

      // Retrieve the OUT parameter value
      const [[result]] = await conn.query("SELECT @out_batch_id AS batch_id");
      const batch_id = result.batch_id;

      await conn.query("CALL LogStudentAction(?, ?);", [user_id, batch_id]);

      return res.status(200).json({
        message: "Exam application processed successfully.",
      });
    } catch (error) {
      console.error("Error during exam application:", error);

      if (error.code === "45000") {
        return next(errorProvider(400, error.sqlMessage));
      }

      return next(
        errorProvider(
          500,
          "An error occurred while processing the exam application."
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

export const addMedicalResitStudents = async (req, res, next) => {
  const { data, batch_id } = req.body;

  if (!data || !batch_id) {
    return res
      .status(400)
      .json({ message: "Transformed data and batch_id are required." });
  }

  try {
    const conn = await pool.getConnection();
    try {
      for (const [sub_id, students] of Object.entries(data)) {
        for (const { s_id, type } of students) {
          await conn.query("CALL AddMedicalResitStudents(?, ?, ?, ?)", [
            batch_id,
            sub_id,
            s_id,
            type,
          ]);

          let desc = `Medical or Resit Student for batch_id=${batch_id}, sub_id=${sub_id}, s_id=${s_id}, type=${type}`;
          await conn.query("CALL LogAdminAction(?);", [desc]);
        }
      }

      return res.status(200).json({ message: "Students added successfully." });
    } catch (error) {
      console.error("Error adding medical/resit students:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while adding medical/resit students."
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

export const getStudentSubjects = async (req, res, next) => {
  const { batch_id, s_id } = req.body;
  console.log(batch_id, s_id);
  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query("CALL GetStudentSubjects(?, ?);", [
        batch_id,
        s_id,
      ]);
      console.log(results);
      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching student subjects:", error);
      return next(
        errorProvider(500, "An error occurred while fetching student subjects.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getStudentsWithoutIndexNumber = async (req, res, next) => {
  const { batch_id } = req.body;

  if (!batch_id) {
    return res.status(400).json({ message: "Batch ID is required." });
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [results] = await conn.query(
        "CALL GetStudentsWithoutIndexNumber(?);",
        [batch_id]
      );
      console.log(results[1]);
      const count = results[0][0]?.students_without_index || 0;
      const user_names = results[1]?.map((obj) => obj.user_name);
      return res.status(200).json({
        count,
        user_names,
      });
    } catch (error) {
      console.error("Error fetching students without index number:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while checking students without index numbers."
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

export const generateIndexNumbers = async (req, res, next) => {
  const { batch_id, course, batch, startsFrom } = req.body;

  if (!batch_id || !course || !batch || !startsFrom) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query(
        "CALL GenerateIndexNumbers(?, ?, ?, ?);",
        [batch_id, course, batch, parseInt(startsFrom, 10)]
      );
      console.log(results);
      return res.status(200).json({
        message: "Index numbers generated successfully.",
        data: results[0], // List of updated students
      });
    } catch (error) {
      console.error("Error generating index numbers:", error);
      return next(
        errorProvider(500, "An error occurred while generating index numbers.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getLastAssignedIndexNumber = async (req, res, next) => {
  const { course, batch } = req.body;

  if (!course || !batch) {
    return next(errorProvider(400, "Course and batch are required."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query(
        "CALL GetLastAssignedIndexNumber(?, ?);",
        [course, batch]
      );

      let lastIndex = results[0][0]?.last_assigned_index || 0;
      lastIndex = lastIndex ? Number(String(lastIndex).slice(2)) : 0;

      return res.status(200).json({
        lastIndex,
      });
    } catch (error) {
      console.error("Error fetching last assigned index number:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while fetching the last assigned index number."
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

export const createOrUpdateAdmission = async (req, res, next) => {
  const {
    batch_id,
    generated_date,
    subjects,
    date,
    description,
    instructions,
    provider,
  } = req.body;

  try {
    // Transform `subjects` array
    const transformedSubjects = subjects
      .map((subjectArray) => subjectArray.join(":"))
      .join(",");

    // Transform `date` array
    const transformedDate = date
      .map((dateObj) => `${dateObj.year}:${dateObj.months.join(";")}`)
      .join(",");

    // Database connection and procedure execution
    const conn = await pool.getConnection();
    try {
      await conn.query("CALL UpdateAdmissionData(?, ?, ?, ?, ?, ?, ?)", [
        batch_id,
        generated_date,
        transformedSubjects,
        transformedDate,
        description,
        instructions,
        provider,
      ]);

      let desc = `Admission created or updated for batch_id=${batch_id}, generated_date=${generated_date}, transformedSubjects=${transformedSubjects}, transformedDate=${transformedDate}, description=${description}, instructions=${instructions}, provider=${provider}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res.status(200).json({
        message: "Admission data added or updated successfully.",
      });
    } catch (error) {
      console.error("Error adding or updating admission data:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while adding or updating admission data."
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

export const getLatestAdmissionTemplate = async (req, res, next) => {
  const { batch_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      // Call the stored procedure
      const [rows] = await conn.query("CALL GetLatestAdmissionTemplate(?)", [
        batch_id,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({
          message: "No admission template found.",
        });
      }

      const response = rows[0][0];

      if (response.data) {
        response.data = JSON.parse(response.data);
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching latest admission template:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while fetching the latest admission template."
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

export const fetchStudentsWithSubjects = async (req, res, next) => {
  const { batch_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query("CALL FetchStudentsWithSubjects(?);", [
        batch_id,
      ]);

      // Format the result as an object with P, M, and R groups
      const groupedResults = { P: [], M: [], R: [] };

      results[0].forEach((row) => {
        const {
          s_id,
          name,
          index_num,
          user_name,
          exam_type,
          sub_id,
          eligibility,
        } = row;

        // Determine the group based on exam_type
        const group = groupedResults[exam_type];

        // Check if student already exists in the group
        let student = group.find((student) => student.s_id === s_id);

        if (!student) {
          student = {
            s_id,
            name,
            index_num,
            user_name,
            subjects: [],
          };
          group.push(student);
        }

        // Add subject to the student's subjects array
        student.subjects.push({ sub_id, eligibility });
      });

      // Sort each group by lexicographical order of index_num
      Object.keys(groupedResults).forEach((key) => {
        groupedResults[key].sort((a, b) =>
          a.index_num.localeCompare(b.index_num)
        );
      });

      res.status(200).json(groupedResults);
    } catch (error) {
      console.error("Error fetching students with subjects:", error);
      return next(
        errorProvider(500, "An error occurred while fetching students.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getBatchAdmissionDetails = async (req, res, next) => {
  const { batch_id } = req.body;

  if (!batch_id) {
    return next(errorProvider(400, "Batch ID is required."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      // Execute the stored procedure
      const [results] = await conn.query("CALL GetBatchAdmissionDetails(?);", [
        batch_id,
      ]);

      // Return the first result set
      return res.status(200).json(results[0][0]);
    } catch (error) {
      console.error("Error fetching batch admission details:", error);
      return next(
        errorProvider(500, "Failed to fetch batch admission details")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const fetchStudentWithSubjectsByUserId = async (req, res, next) => {
  const { batch_id } = req.body;
  const { user_id } = req.user;

  if (!batch_id) {
    return next(errorProvider(400, "Batch ID is required."));
  }

  if (!user_id) {
    return next(errorProvider(400, "User ID is required."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      // Execute the stored procedure
      const [results] = await conn.query(
        "CALL FetchStudentWithSubjectsByUserId(?, ?);",
        [batch_id, user_id]
      );

      // Parse the results
      const studentData = results[0][0];
      const subjects = results[1];

      const [attendanceResults] = await conn.query(
        "CALL FetchStudentEligibilityByBatchIdAndSId(?, ?);",
        [batch_id, studentData.s_id]
      );

      const attendanceData = attendanceResults[0];

      // Combine data into final response format
      const response = {
        s_id: studentData.s_id,
        name: studentData.name,
        user_name: studentData.user_name,
        index_num: studentData.index_num,
        subjects: subjects.map((subject) => ({
          sub_id: subject.sub_id,
          sub_name: subject.sub_name,
          sub_code: subject.sub_code,
          eligibility:
            attendanceData.find((obj) => obj.sub_id == subject.sub_id)
              ?.eligibility || "false",
        })),
      };

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching student with subjects:", error);
      return next(errorProvider(500, "Failed to fetch student with subjects"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getEligibleStudentsBySub = async (req, res, next) => {
  const { batch_id, sub_id } = req.body;

  if (!batch_id || !sub_id) {
    return next(errorProvider(400, "Batch ID and Subject ID are required."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      // Call the stored procedure
      const [rows] = await conn.query("CALL GetEligibleStudentsBySub(?, ?);", [
        batch_id,
        sub_id,
      ]);

      // Map results to the desired structure
      const appliedStudents = rows[0].map((row) => ({
        s_id: row.s_id,
        exam_type: row.exam_type,
        index_num: row.index_num,
      }));

      console.log(appliedStudents);
      return res.status(200).json(appliedStudents);
    } catch (error) {
      console.error("Error fetching eligible students:", error);

      if (error.code === "45000") {
        return next(errorProvider(400, error.sqlMessage));
      }

      return next(
        errorProvider(
          500,
          "An error occurred while fetching eligible students."
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

export const createOrUpdateAttendance = async (req, res, next) => {
  const { batch_id, date, description } = req.body;

  try {
    const transformedDate = date
      .map((dateObj) => `${dateObj.year}:${dateObj.months.join(";")}`)
      .join(",");

    // Database connection and procedure execution
    const conn = await pool.getConnection();
    try {
      await conn.query("CALL UpdateAttendaceData(?, ?, ?)", [
        batch_id,
        transformedDate,
        description,
      ]);

      let desc = `Admission created or updated for batch_id=${batch_id}, transformedDate=${transformedDate}, description=${description}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res.status(200).json({
        message: "Attendance data added or updated successfully.",
      });
    } catch (error) {
      console.error("Error adding or updating attendance data:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while adding or updating attendance data."
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

export const getLatestAttendanceTemplate = async (req, res, next) => {
  const { batch_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      // Call the stored procedure
      const [rows] = await conn.query("CALL GetLatestAttendanceTemplate(?)", [
        batch_id,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({
          message: "No attendance template found.",
        });
      }

      const response = rows[0][0];

      if (response.data) {
        response.data = JSON.parse(response.data);
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching latest attendance template:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while fetching the latest attendance template."
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

export const deleteBatchSubjectEntries = async (req, res, next) => {
  const { batch_id } = req.body;

  if (!batch_id) {
    return next(errorProvider(400, "Batch ID is required."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      // Begin transaction
      await conn.beginTransaction();

      // Step 1: Fetch all sub_ids for the given batch_id
      const [subjects] = await conn.query(
        "SELECT sub_id FROM batch_curriculum_lecturer WHERE batch_id = ?",
        [batch_id]
      );

      if (subjects.length === 0) {
        return res.status(404).json({
          message: `No subjects found for batch ID ${batch_id}.`,
        });
      }

      // Step 2: Iterate through each sub_id and delete rows from corresponding table
      for (const { sub_id } of subjects) {
        const tableName = `batch_${batch_id}_sub_${sub_id}`;

        // Delete all rows from the dynamically constructed table
        await conn.query(`DELETE FROM ??`, [tableName]);
      }

      let batchStudentTableName = `batch_${batch_id}_students`;

      await conn.query(`UPDATE ?? SET applied_to_exam='false'`, [
        batchStudentTableName,
      ]);

      let desc = `Drop all the entries of batch_id=${batch_id}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      // Commit transaction
      await conn.commit();

      return res.status(200).json({
        message: `All subject entries for the batch have been successfully deleted.`,
      });
    } catch (error) {
      // Rollback transaction on error
      await conn.rollback();
      console.error("Error during subject entries deletion:", error);
      return next(
        errorProvider(500, "Failed to delete subject entries for the batch.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};
