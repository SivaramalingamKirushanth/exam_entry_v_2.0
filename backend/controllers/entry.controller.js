import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";
import { fetchEmailsForUserType } from "../utils/functions.js";
import mailer from "../utils/mailer.js";

export const applyExam = async (req, res, next) => {
  const { removedSubjects } = req.body;
  const { user_id } = req.user;

  if (!user_id) {
    return next(errorProvider(400, "User ID is required."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      let remSubStr = removedSubjects.join(",");

      // Call the stored procedure and retrieve the OUT parameter
      await conn.query("CALL ApplyExam(?, ?,@out_batch_id);", [
        user_id,
        remSubStr,
      ]);

      // Retrieve the OUT parameter value
      const [[result]] = await conn.query("SELECT @out_batch_id AS batch_id");
      const batch_id = result.batch_id;

      const desc = `removed subjects: ${remSubStr}`;

      await conn.query("CALL LogStudentAction(?, ?, ?);", [
        user_id,
        batch_id,
        desc,
      ]);
      await conn.commit();

      return res.status(200).json({
        message: "Exam application processed successfully.",
      });
    } catch (error) {
      console.error("Error during exam application:", error);
      await conn.rollback();

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

export const applyResitExam = async (req, res, next) => {
  const { subjects_string, batch_id } = req.body;
  const { user_id } = req.user;

  if (!user_id || !subjects_string || !batch_id) {
    return next(
      errorProvider(400, "User ID,subjects_string, batch_id are required.")
    );
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query("CALL InsertResitApplication(?, ?, ?);", [
        user_id,
        batch_id,
        subjects_string,
      ]);

      const desc = `Resit subjects: ${subjects_string}`;

      await conn.query("CALL LogStudentAction(?, ?, ?);", [
        user_id,
        batch_id,
        desc,
      ]);
      await conn.commit();

      return res.status(200).json({
        message: "Exam application processed successfully.",
      });
    } catch (error) {
      console.error("Error during exam application:", error);
      await conn.rollback();

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

export const applyMedicalExam = async (req, res, next) => {
  const { subjects_string, batch_id } = req.body;
  const { user_id } = req.user;

  if (!user_id || !subjects_string || !batch_id) {
    return next(
      errorProvider(400, "User ID,subjects_string, batch_id are required.")
    );
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query("CALL InsertMedicalApplication(?, ?, ?);", [
        user_id,
        batch_id,
        subjects_string,
      ]);

      const desc = `Medical subjects: ${subjects_string}`;

      await conn.query("CALL LogStudentAction(?, ?, ?);", [
        user_id,
        batch_id,
        desc,
      ]);
      await conn.commit();

      return res.status(200).json({
        message: "Exam application processed successfully.",
      });
    } catch (error) {
      console.error("Error during exam application:", error);
      await conn.rollback();

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

export const acceptMedicalResitStudents = async (req, res, next) => {
  const { s_id, batch_id } = req.body;

  if (!s_id || !batch_id) {
    return res.status(400).json({ message: "s_id and batch_id are required." });
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Get resit_id for the student and batch
      const [resitReq] = await conn.query(
        "SELECT resit_id FROM resit_request WHERE batch_id = ? AND s_id = ? LIMIT 1",
        [batch_id, s_id]
      );

      // 2. Get medical_id for the student and batch
      const [medicalReq] = await conn.query(
        "SELECT medical_id FROM medical_request WHERE batch_id = ? AND s_id = ? LIMIT 1",
        [batch_id, s_id]
      );

      // 3. Collect subject IDs from both tables
      const resit_id = resitReq[0]?.resit_id || null;
      const medical_id = medicalReq[0]?.medical_id || null;

      const resitSubjects = resit_id
        ? (
            await conn.query(
              "SELECT sub_id FROM resit_subject WHERE resit_id = ? AND eligibility='true'",
              [resit_id]
            )
          )[0]
        : [];

      const medicalSubjects = medical_id
        ? (
            await conn.query(
              "SELECT sub_id FROM medical_subject WHERE medical_id = ? AND eligibility='true'",
              [medical_id]
            )
          )[0]
        : [];

      // 4. Call the procedure for resit subjects
      for (const { sub_id } of resitSubjects) {
        await conn.query("CALL AcceptMedicalResitStudents(?, ?, ?, ?)", [
          batch_id,
          sub_id,
          s_id,
          "R",
        ]);

        let desc = `Resit student added for batch_id=${batch_id}, sub_id=${sub_id}, s_id=${s_id}`;
        await conn.query("CALL LogAdminAction(?);", [desc]);
      }

      await conn.query(
        "UPDATE resit_request SET status='true' WHERE resit_id=? ",
        [resit_id]
      );

      // 5. Call the procedure for medical subjects
      for (const { sub_id } of medicalSubjects) {
        await conn.query("CALL AcceptMedicalResitStudents(?, ?, ?, ?)", [
          batch_id,
          sub_id,
          s_id,
          "M",
        ]);
        let desc = `Medical student added for batch_id=${batch_id}, sub_id=${sub_id}, s_id=${s_id}`;
        await conn.query("CALL LogAdminAction(?);", [desc]);
      }

      await conn.query(
        "UPDATE medical_request SET status='true' WHERE medical_id=? ",
        [medical_id]
      );
      await conn.commit();

      return res.status(200).json({ message: "Student added successfully." });
    } catch (error) {
      console.error("Error adding medical/resit students:", error);
      await conn.rollback();

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

export const rejectMedicalResitApplication = async (req, res, next) => {
  const { s_id, batch_id } = req.body;

  if (!s_id || !batch_id) {
    return res.status(400).json({ message: "s_id and batch_id are required." });
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.query("CALL RejectMedicalResitApplication(?, ?);", [
        batch_id,
        s_id,
      ]);

      let desc = `Medical and Resit application of s_id=${s_id} for batch_id=${batch_id} rejected`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res
        .status(200)
        .json({ message: "Application rejected successfully." });
    } catch (error) {
      console.error("Error rejecting medical/resit students:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while rejecting medical/resit students."
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

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query("CALL GetStudentSubjects(?, ?);", [
        batch_id,
        s_id,
      ]);

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
    heldDate,
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

    const transformedHeldDate = heldDate
      ?.map((dateObj) => `${dateObj.year}:${dateObj.months.join(";")}`)
      .join(",");

    // Database connection and procedure execution
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query("CALL UpdateAdmissionData(?, ?, ?, ?, ?, ?, ?, ?)", [
        batch_id,
        generated_date,
        transformedSubjects,
        transformedDate,
        transformedHeldDate,
        description,
        instructions,
        provider,
      ]);

      let desc = `Admission created or updated for batch_id=${batch_id}, generated_date=${generated_date}, transformedSubjects=${transformedSubjects}, transformedDate=${transformedDate}, transformedHeldDate=${transformedHeldDate}, description=${description}, instructions=${instructions}, provider=${provider}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);
      await conn.commit();

      return res.status(200).json({
        message: "Admission data added or updated successfully.",
      });
    } catch (error) {
      console.error("Error adding or updating admission data:", error);
      await conn.rollback();

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

      if (rows[0].length === 0) {
        return res.status(404).json({
          message: "No admission template found.",
        });
      }

      const response = rows[0][0];
      if (response?.data) {
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
  const {
    batch_id,
    date,
    heldDate,
    description,
    no_of_groups,
    studentDetails,
    sub_id,
    ...groups
  } = req.body;

  console.log(no_of_groups);
  try {
    const transformedDate = date
      ?.map((dateObj) => `${dateObj.year}:${dateObj.months.join(";")}`)
      .join(",");

    const transformedHeldDate = heldDate
      ?.map((dateObj) => `${dateObj.year}:${dateObj.months.join(";")}`)
      .join(",");

    let venues = "";
    let dates = "";
    let times = "";
    for (let i = 1; i <= Number(no_of_groups); i++) {
      venues += `${i != 1 ? "," : ""}${
        groups?.[i]?.["hallNo"] ? "Hall-" + groups?.[i]?.["hallNo"] + "@" : ""
      }${groups?.[i]?.["center"] || ""}`;

      dates += `${i != 1 ? "," : ""}${
        groups?.[i]?.["actual_date"]?.split(" ")?.[0] || ""
      }`;
      times += `${i != 1 ? "," : ""}${groups?.[i]?.["fromTime"] || ""} - ${
        groups?.[i]?.["toTime"] || ""
      }`;
    }
    console.log(venues, dates, times);
    // Database connection and procedure execution
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        "CALL UpdateAttendanceData(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          batch_id,
          transformedDate,
          transformedHeldDate,
          description,
          no_of_groups,
          venues,
          dates,
          times,
          studentDetails,
          sub_id,
        ]
      );

      let desc = `Attendance created or updated for batch_id=${batch_id}, transformedDate=${transformedDate}, transformedHeldDate=${transformedHeldDate}, sub_id=${sub_id}, description=${description}, no_of_groups=${no_of_groups}, venues=${venues}, dates=${dates}, times=${times}, studentDetails=${studentDetails}`;

      await conn.query("CALL LogAdminAction(?);", [desc]);
      await conn.commit();

      return res.status(200).json({
        message: "Attendance data added or updated successfully.",
      });
    } catch (error) {
      console.error("Error adding or updating attendance data:", error);
      await conn.rollback();

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
  const { batch_id, sub_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      // Call the stored procedure
      const [rows] = await conn.query("CALL GetLatestAttendanceTemplate(?,?)", [
        batch_id,
        sub_id,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({
          message: "No attendance template found.",
        });
      }

      const response = rows[0][0];

      if (response?.data) {
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
        "SELECT sub_id FROM batch_subject_lecturer WHERE batch_id = ?",
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

export const getDeanDashboardData = async (req, res, next) => {
  const { user_id } = req.user;
  const { batch_id: batchId } = req.body;

  try {
    const conn = await pool.getConnection();

    try {
      const [faculty] = await conn.query(
        "SELECT f_id FROM faculty WHERE user_id = ? AND status = 'true'",
        [user_id]
      );

      if (faculty.length === 0) {
        return res.status(404).json({ message: "Faculty not found" });
      }
      const facultyId = faculty[0].f_id;
      const result = [];

      const [batches] = await conn.query("CALL GetBatchesByFacultyId(?)", [
        facultyId,
      ]);

      const batch = batches[0].find((bat) => bat.batch_id == batchId);

      if (!batch) {
        return res.status(403).json({ message: "No batch found" });
      }

      const { batch_id, batch_code, course_title, level, sem, academic_year } =
        batch;

      // Step 3: Get subjects for this batch
      const [subjects] = await conn.query("CALL GetSubjectsForBatch(?)", [
        batch_id,
      ]);

      if (subjects[0].length > 0) {
        const subjectData = [];

        for (const subject of subjects[0]) {
          const { sub_id, sub_code } = subject;

          // Step 4: Fetch data from dynamic table
          const [students] = await conn.query(
            "CALL GetDynamicTableData(?, ?)",
            [batch_id, sub_id]
          );

          const [remarks] = await conn.query(
            "CALL GetRemarksForSubject(?, ?)",
            [batch_id, sub_id]
          );

          const [requestedStudents] = await conn.query(
            "CALL RequestedStudents(?, ?);",
            [batch_id, sub_id]
          );

          let studentsData = [];
          if (students[0].length > 0) {
            for (const student of students[0]) {
              const { s_id, exam_type, eligibility } = student;

              const [studentData] = await conn.query(
                "SELECT sd.index_num, u.user_name FROM student_detail sd JOIN student s ON sd.s_id = s.s_id JOIN user u ON s.user_id = u.user_id WHERE sd.s_id=? ",
                [s_id]
              );

              studentsData.push({
                index_num: studentData[0]?.index_num || "",
                user_name: studentData[0]?.user_name || "",
                s_id,
                exam_type,
                eligibility,
              });
            }
          }

          if (requestedStudents[0].length > 0) {
            for (const student of requestedStudents[0]) {
              const { s_id, exam_type, eligibility } = student;

              if (!studentsData.some((stu) => stu.s_id == s_id)) {
                const [studentData] = await conn.query(
                  "SELECT sd.index_num, u.user_name FROM student_detail sd JOIN student s ON sd.s_id = s.s_id JOIN user u ON s.user_id = u.user_id WHERE sd.s_id=? ",
                  [s_id]
                );

                studentsData.push({
                  index_num: studentData[0]?.index_num || "",
                  user_name: studentData[0]?.user_name || "",
                  s_id,
                  exam_type,
                  eligibility,
                });
              }
            }
          }

          subjectData.push({
            sub_id,
            sub_code,
            students: studentsData,
            remarks: remarks[0],
          });
        }

        result.push({
          batch_id,
          batch_code,
          course_title,
          level,
          sem,
          academic_year,
          subjects: subjectData,
        });
      }

      res.status(200).json(result);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error in Dean Dashboard:", error);
    next(new Error("Failed to fetch data for Dean Dashboard"));
  }
};

export const getHodDashboardData = async (req, res, next) => {
  const { user_id } = req.user;
  const { batch_id: batchId } = req.body;

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
      const [batches] = await conn.query("CALL GetActiveBatchesOfDep(?)", [
        department.d_id,
      ]);

      const batch = batches[0].find((bat) => bat.batch_id == batchId);

      if (!batch) {
        return res.status(403).json({ message: "No batch found" });
      }

      const { batch_id, batch_code, course_title, level, sem, academic_year } =
        batch;

      // Step 3: Get subjects for this batch
      const [subjects] = await conn.query(
        "CALL GetSubjectBybatchAndDepartment(?, ?);",
        [batch_id, department.d_id]
      );

      if (subjects[0].length > 0) {
        const subjectData = [];

        for (const subject of subjects[0]) {
          const { sub_id, sub_code } = subject;

          // Step 4: Fetch data from dynamic table
          const [students] = await conn.query(
            "CALL GetDynamicTableData(?, ?)",
            [batch_id, sub_id]
          );

          const [remarks] = await conn.query(
            "CALL GetRemarksForSubject(?, ?)",
            [batch_id, sub_id]
          );

          const [requestedStudents] = await conn.query(
            "CALL RequestedStudents(?, ?);",
            [batch_id, sub_id]
          );

          let studentsData = [];
          if (students[0].length > 0) {
            for (const student of students[0]) {
              const { s_id, exam_type, eligibility } = student;

              const [studentData] = await conn.query(
                "SELECT sd.index_num, u.user_name FROM student_detail sd JOIN student s ON sd.s_id = s.s_id JOIN user u ON s.user_id = u.user_id WHERE sd.s_id=? ",
                [s_id]
              );

              studentsData.push({
                index_num: studentData[0]?.index_num || "",
                user_name: studentData[0]?.user_name || "",
                s_id,
                exam_type,
                eligibility,
              });
            }
          }

          if (requestedStudents[0].length > 0) {
            for (const student of requestedStudents[0]) {
              const { s_id, exam_type, eligibility } = student;

              if (!studentsData.some((stu) => stu.s_id == s_id)) {
                const [studentData] = await conn.query(
                  "SELECT sd.index_num, u.user_name FROM student_detail sd JOIN student s ON sd.s_id = s.s_id JOIN user u ON s.user_id = u.user_id WHERE sd.s_id=? ",
                  [s_id]
                );

                studentsData.push({
                  index_num: studentData[0]?.index_num || "",
                  user_name: studentData[0]?.user_name || "",
                  s_id,
                  exam_type,
                  eligibility,
                });
              }
            }
          }

          subjectData.push({
            sub_id,
            sub_code,
            students: studentsData,
            remarks: remarks[0],
          });
        }

        result.push({
          batch_id,
          batch_code,
          course_title,
          level,
          sem,
          academic_year,
          subjects: subjectData,
        });
      }

      res.status(200).json(result);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error in HOD Dashboard:", error);
    next(new Error("Failed to fetch data for HOD Dashboard"));
  }
};

export const getAppliedStudentsForSubject = async (req, res, next) => {
  const { user_id, role_id } = req.user;
  const { batch_id, sub_id } = req.body;

  if (!user_id || !batch_id || !sub_id || !role_id) {
    return next(errorProvider(400, "Missing required fields."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query(
        "CALL GetAppliedStudentsByBatchAndSubject(?, ?, ?, ?);",
        [user_id, batch_id, sub_id, role_id]
      );

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching applied students for subject:", error);

      if (error.code === "45000") {
        return next(errorProvider(403, error.sqlMessage));
      }

      return next(
        errorProvider(500, "An error occurred while fetching applied students.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getAppliedStudentsForSubjectOfFaculty = async (req, res, next) => {
  const { user_id, role_id } = req.user;
  const { batch_id, sub_id } = req.body;

  if (!batch_id || !sub_id) {
    return next(errorProvider(400, "required fields are missing"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [faculty] = await conn.query(
        "SELECT f_id FROM faculty WHERE user_id = ? AND status = 'true'",
        [user_id]
      );

      if (faculty.length === 0) {
        return res.status(404).json({ message: "Faculty not found" });
      }
      const facultyId = faculty[0].f_id;

      // Step 2: Get active degrees under this faculty
      const [degrees] = await conn.query("CALL GetActiveDegreesInFaculty(?)", [
        facultyId,
      ]);

      if (degrees[0].length > 0) {
        const [deg] = await conn.query(
          "SELECT deg_id FROM batch WHERE batch_id = ?",
          [batch_id]
        );
        const degree = degrees[0].find((item) => item.deg_id == deg[0].deg_id);

        if (degree) {
          const [batches] = await conn.query(
            "CALL GetActiveBatchesOfDegWithinDeadline(?, ?)",
            [degree.deg_id, role_id]
          );

          if (batches[0].length > 0) {
            const batch = batches[0].find((obj) => obj.batch_id == batch_id);
            if (batch) {
              const [subjects] = await conn.query(
                "CALL GetSubjectsForBatch(?)",
                [batch_id]
              );

              if (subjects[0].length > 0) {
                const subject = subjects[0].find((obj) => obj.sub_id == sub_id);
                if (subject) {
                  const [results] = await conn.query(
                    "CALL GetAppliedStudentsForSubjectOfFacOrDep(?, ?, ?);",
                    [batch_id, sub_id, role_id]
                  );

                  return res.status(200).json(results[0]);
                } else {
                  return next(errorProvider(404, "No matching subject found."));
                }
              } else {
                return next(errorProvider(404, "No subjects found."));
              }
            } else {
              return next(errorProvider(404, "No matching batch found."));
            }
          } else {
            return next(errorProvider(404, "No batches found."));
          }
        } else {
          return next(errorProvider(404, "No matching degree found."));
        }
      } else {
        return next(errorProvider(404, "No degrees found."));
      }
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getAppliedStudentsForSubjectOfDepartment = async (
  req,
  res,
  next
) => {
  const { user_id, role_id } = req.user;
  const { batch_id, sub_id } = req.body;

  if (!batch_id || !sub_id || !user_id) {
    return next(errorProvider(400, "required fields are missing"));
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

      const [subjects] = await conn.query(
        "CALL GetSubjectBybatchAndDepartment(?, ?);",
        [batch_id, department.d_id]
      );

      if (subjects[0].length > 0) {
        const subject = subjects[0].find((obj) => obj.sub_id == sub_id);
        if (subject) {
          const [results] = await conn.query(
            "CALL GetAppliedStudentsForSubjectOfFacOrDep(?, ?, ?);",
            [batch_id, sub_id, role_id]
          );

          return res.status(200).json(results[0]);
        } else {
          return next(errorProvider(404, "No matching subject found."));
        }
      } else {
        return next(errorProvider(404, "No subjects found."));
      }
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getAppliedResitStudentsByBatchAndSubject = async (
  req,
  res,
  next
) => {
  const { user_id, role_id } = req.user;
  const { batch_id, sub_id } = req.body;

  if (!user_id || !batch_id || !sub_id || !role_id) {
    return next(errorProvider(400, "Missing required fields."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query(
        "CALL GetAppliedResitStudentsByBatchAndSubject(?, ?, ?, ?);",
        [user_id, batch_id, sub_id, role_id]
      );

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching applied students for subject:", error);

      if (error.code === "45000") {
        return next(errorProvider(403, error.sqlMessage));
      }

      return next(
        errorProvider(500, "An error occurred while fetching applied students.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getAppliedMedicalStudentsByBatchAndSubject = async (
  req,
  res,
  next
) => {
  const { user_id, role_id } = req.user;
  const { batch_id, sub_id } = req.body;

  if (!user_id || !batch_id || !sub_id || !role_id) {
    return next(errorProvider(400, "Missing required fields."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query(
        "CALL GetAppliedMedicalStudentsByBatchAndSubject(?, ?, ?, ?);",
        [user_id, batch_id, sub_id, role_id]
      );

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching applied students for subject:", error);

      if (error.code === "45000") {
        return next(errorProvider(403, error.sqlMessage));
      }

      return next(
        errorProvider(500, "An error occurred while fetching applied students.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getStudentMedicalResitApplications = async (req, res, next) => {
  const { batch_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "CALL GetStudentMedicalResitApplications()"
      );

      if (rows[0].length === 0) {
        return res.status(404).json({
          message: "No requests found.",
        });
      }

      const grouped = {};

      for (const row of rows[0]) {
        const key = `${row.s_id}-${row.batch_id}`;

        if (!grouped[key]) {
          grouped[key] = {
            s_id: row.s_id,
            _user_name: row._user_name,
            batch_id: row.batch_id,
            academic_year: row.academic_year,
            commenced_year: row.commenced_year,
            grp_course_title: row.grp_course_title,
            batch_code: row.batch_code,
            sem_no: row.sem_no,
            level: row.level,
            medical_reference: row.medical_reference,
            medical_id: row.medical_id,
            resit_id: row.resit_id,
            medical_subjects_verified: row.medical_subjects_verified,
            medical_payment_verified: row.medical_payment_verified,
            resit_reference: row.resit_reference,
            resit_subjects_verified: row.resit_subjects_verified,
            resit_payment_verified: row.resit_payment_verified,
            medical_subs: [],
            resit_subs: [],
          };
        }

        if (
          row.medical_sub_id &&
          !grouped[key].medical_subs.some(
            (sub) => sub.sub_id === row.medical_sub_id
          )
        ) {
          grouped[key].medical_subs.push({
            id: row.medical_subject_id,
            sub_id: row.medical_sub_id,
            sub_code: row.medical_sub_code,
            sub_name: row.medical_sub_name,
          });
        }

        if (
          row.resit_sub_id &&
          !grouped[key].resit_subs.some(
            (sub) => sub.sub_id === row.resit_sub_id
          )
        ) {
          grouped[key].resit_subs.push({
            id: row.resit_subject_id,
            sub_id: row.resit_sub_id,
            sub_code: row.resit_sub_code,
            sub_name: row.resit_sub_name,
            attempt_1: row.attempt_1,
            attempt_2: row.attempt_2,
            attempt_3: row.attempt_3,
          });
        }
      }

      const result = Object.values(grouped);

      return res.status(200).json(result);
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

export const updateReference = async (req, res, next) => {
  const { request, id, ref } = req.body;

  if (!request || !id || !ref) {
    return next(errorProvider(400, "Missing required fields."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      let procedure;

      if (request === "m") {
        procedure = "CALL UpdateMedicalReference(?, ?);";
      } else if (request === "r") {
        procedure = "CALL UpdateResitReference(?, ?);";
      } else {
        return next(errorProvider(400, "Invalid request type."));
      }

      await conn.query(procedure, [id, ref]);

      let desc = `Payment reference updated. request=${request}, id=${id}`;

      await conn.query("CALL LogAdminAction(?);", [desc]);
      await conn.commit();

      return res
        .status(200)
        .json({ message: "Reference updated successfully." });
    } catch (error) {
      console.error("Error updating reference:", error);
      await conn.rollback();

      return next(errorProvider(500, "Failed to update reference."));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const updateVerified = async (req, res, next) => {
  const { request, id, verified } = req.body;

  if (!request || !id || typeof verified !== "string") {
    return next(errorProvider(400, "Missing or invalid fields."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      let procedure;

      switch (request) {
        case "medical_subjects_verified":
          procedure = "CALL UpdateMedicalSubjectsVerified(?, ?);";
          break;
        case "medical_payment_verified":
          procedure = "CALL UpdateMedicalPaymentVerified(?, ?);";
          break;
        case "resit_subjects_verified":
          procedure = "CALL UpdateResitSubjectsVerified(?, ?);";
          break;
        case "resit_payment_verified":
          procedure = "CALL UpdateResitPaymentVerified(?, ?);";
          break;
        default:
          return next(errorProvider(400, "Invalid verification request type."));
      }

      await conn.query(procedure, [id, verified]);

      let desc = `verified updated. request=${request},id=${id},verified=${verified}`;

      await conn.query("CALL LogAdminAction(?);", [desc]);
      await conn.commit();

      return res
        .status(200)
        .json({ message: "Verification status updated successfully." });
    } catch (error) {
      console.error("Error updating verified status:", error);
      await conn.rollback();

      return next(errorProvider(500, "Failed to update verified status."));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const moveToMedical = async (req, res, next) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM resit_subject WHERE id=?;",
        [id]
      );

      const obj = rows[0];

      await conn.query("CALL MoveToMedical(?);", [id]);

      let desc = `Resit Subject moved to Medical Subject. resit_id=${obj.resit_id},sub_id=${obj.sub_id},attempt_1=${obj.attempt_1},attempt_2=${obj.attempt_2},attempt_3=${obj.attempt_3},eligibility=${obj.eligibility},`;

      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res
        .status(200)
        .json({ message: "Moved to Medical successfully." });
    } catch (error) {
      console.error("Error in MoveToMedical:", error);
      return next(errorProvider(500, "Failed to move to medical."));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const moveToResit = async (req, res, next) => {
  const { id, remark } = req.body;

  if (!id || !remark) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [rows] = await conn.query(
        "SELECT * FROM medical_subject WHERE id=?;",
        [id]
      );

      const obj = rows[0];

      await conn.query("CALL MoveToResit(?);", [id]);

      let desc = `Medical Subject moved to Resit Subject. medical_id=${obj.medical_id},sub_id=${obj.sub_id},eligibility=${obj.eligibility},`;

      await conn.query("CALL LogAdminAction(?);", [desc]);
      await conn.commit();

      return res.status(200).json({ message: "Moved to Resit successfully." });
    } catch (error) {
      console.error("Error in MoveToResit:", error);
      await conn.rollback();

      return next(errorProvider(500, "Failed to move to resit."));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const checkPendingMedicalResitRequests = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "CALL CheckPendingMedicalResitRequests();"
      );

      const result = rows[0][0];

      return res.status(200).json({
        medical: Boolean(result.medical_pending),
        resit: Boolean(result.resit_pending),
      });
    } catch (error) {
      console.error("Error checking pending requests:", error);
      return next(
        errorProvider(500, "An error occurred while checking pending requests.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getBatchDeadlineAndApprovalStatus = async (req, res, next) => {
  const { batch_id } = req.body;
  const role_id = req.user?.role_id;

  if (!batch_id || !role_id) {
    return res
      .status(400)
      .json({ message: "batch_id and user role_id are required." });
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "CALL GetBatchApprovalAndDeadline(?, ?)",
        [batch_id, role_id]
      );

      if (!rows || !rows[0]?.length) {
        return res.status(404).json({
          message: "No matching data found for the given batch and role.",
        });
      }

      const result = rows[0][0];

      return res.status(200).json({
        end_date: result?.end_date,
        admin_end: result?.admin_end,
        accepted_status: result?.accepted_status,
      });
    } catch (error) {
      console.error(
        "Error fetching batch deadline and approval status:",
        error
      );
      return next(
        errorProvider(500, "An error occurred while fetching batch info.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const setApproval = async (req, res, next) => {
  const { batch_id } = req.body;
  const role_id = req.user?.role_id;

  if (!batch_id || !role_id) {
    return next(errorProvider(400, "batch_id and user role_id are required."));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.query("CALL SetApproval(?, ?)", [batch_id, role_id]);

      return res.status(200).json({
        message: "Approval given successfully",
      });
    } catch (error) {
      console.error("Error changing approval status:", error);
      return next(
        errorProvider(500, "An error occurred while changing approval.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const upsertPayments = async (req, res, next) => {
  const payments = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const entries = Object.entries(payments);

      for (const [type, amount] of entries) {
        await conn.query("CALL UpsertPayment(?, ?)", [type, amount]);
      }

      return res
        .status(200)
        .json({ message: "Payments upserted successfully." });
    } catch (error) {
      console.error("Error upserting payment data:", error);
      return next(
        errorProvider(500, "An error occurred while upserting payment data.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getAllPayments = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query("CALL GetAllPayments()");

      const finalObj = {};
      rows[0].forEach((obj) => (finalObj[obj.type] = obj.amount));

      return res.status(200).json(finalObj);
    } catch (error) {
      console.error("Error retrieving payment data:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving payment data.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getEligibleMedicalSubjects = async (req, res, next) => {
  const { batch_id } = req.body;
  const { user_id } = req.user;

  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "CALL GetEligibleMedicalSubjectsByBatchAndUser(?, ?)",
        [batch_id, user_id]
      );

      if (rows[0].length === 0) {
        return res.status(404).json({
          message: "No eligible subjects found for the given user and batch.",
        });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error retrieving eligible medical subjects:", error);
      return next(
        errorProvider(500, "An error occurred while fetching subject data.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getEligibleResitSubjects = async (req, res, next) => {
  const { batch_id } = req.body;
  const { user_id } = req.user;

  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query(
        "CALL GetEligibleResitSubjectsByBatchAndUser(?, ?)",
        [batch_id, user_id]
      );

      if (rows[0].length === 0) {
        return res.status(404).json({
          message: "No eligible subjects found for the given user and batch.",
        });
      }

      const arr = rows[0].map((obj) => ({
        ...obj,
        type:
          [
            Number(obj.attempt_1),
            Number(obj.attempt_2),
            Number(obj.attempt_3),
          ].sort((a, b) => b - a)[0] >= obj.pass_grade
            ? "upgrade"
            : "resit",
      }));

      return res.status(200).json(arr);
    } catch (error) {
      console.error("Error retrieving eligible resit subjects:", error);
      return next(
        errorProvider(500, "An error occurred while fetching subject data.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const updateRequestReference = async (req, res, next) => {
  const { batch_id, type, reference } = req.body;
  const user_id = req.user?.user_id;

  if (!batch_id || !user_id || !type || !reference) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query("CALL UpdateRequestReference(?, ?, ?, ?)", [
        user_id,
        batch_id,
        type,
        reference,
      ]);

      const desc = `payment refrerence updated: reference=${reference}, type=${type} `;

      await conn.query("CALL LogStudentAction(?, ?, ?);", [
        user_id,
        batch_id,
        desc,
      ]);

      await conn.commit();

      return res.status(200).json({
        message: "Reference updated successfully.",
      });
    } catch (error) {
      console.error("Error updating reference:", error);
      await conn.rollback();

      return next(
        errorProvider(500, "An error occurred while updating the reference.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getSummarySubjectsData = async (req, res, next) => {
  const { batch_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query("CALL GetSummarySubjectsData(?);", [
        batch_id,
      ]);

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching summary subjects:", error);
      return next(
        errorProvider(500, "An error occurred while fetching summary subjects.")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection."));
  }
};

export const getDynamicBatchTablesData = async (req, res, next) => {
  const { batch_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [subjects] = await conn.query("CALL GetSubjectsForBatch(?)", [
        batch_id,
      ]);

      if (subjects[0].length < 0) {
        return res.status(404).json({
          message: "No subjects found for the batch.",
        });
      }
      const subjStr = subjects[0].map((obj) => obj.sub_id).join(",");

      const [rows] = await conn.query("CALL GetBatchDynamicTablesData(?, ?)", [
        batch_id,
        subjStr,
      ]);

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Error fetching dynamic table data:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while fetching dynamic table data."
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
