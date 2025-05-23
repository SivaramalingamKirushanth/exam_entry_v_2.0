import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";

export const getAllStudents = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [students] = await conn.query("CALL GetAllStudents();");

      if (!students[0].length) {
        return res.status(404).json({ message: "No students found" });
      }

      return res.status(200).json(students[0]);
    } catch (error) {
      console.error("Error retrieving students:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving students")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllLecturers = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [lecturers] = await conn.query("CALL GetAllLecturers();");

      if (!lecturers[0].length) {
        return res.status(404).json({ message: "No lecturers found" });
      }

      return res.status(200).json(lecturers[0]);
    } catch (error) {
      console.error("Error retrieving lecturers:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving lecturers")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllActiveLecturers = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [lecturers] = await conn.query("CALL GetAllActiveLecturers();");

      if (!lecturers[0].length) {
        return res.status(404).json({ message: "No active lecturers found" });
      }

      return res.status(200).json(lecturers[0]);
    } catch (error) {
      console.error("Error retrieving active lecturers:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while retrieving active lecturers"
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

export const getLecturerById = async (req, res, next) => {
  const { user_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [lecturer] = await conn.query("CALL GetLecturerById(?);", [
        user_id,
      ]);

      if (!lecturer[0].length) {
        return res.status(404).json({ message: "No lecturer found" });
      }

      return res.status(200).json(lecturer[0][0]);
    } catch (error) {
      console.error("Error retrieving lecturer:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving lecturer")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getStudentById = async (req, res, next) => {
  const { user_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [student] = await conn.query("CALL GetStudentById(?);", [user_id]);

      if (!student[0].length) {
        return res.status(404).json({ message: "No student found" });
      }

      return res.status(200).json(student[0][0]);
    } catch (error) {
      console.error("Error retrieving student:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving student")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getFacStudentByBatchId = async (req, res, next) => {
  const { batch_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [students] = await conn.query("CALL GetFacStudentByBatchId(?);", [
        batch_id,
      ]);

      if (!students[0].length) {
        return res
          .status(404)
          .json({ message: "No students found in current faculty" });
      }

      return res.status(200).json(students[0]);
    } catch (error) {
      console.error("Error retrieving students:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving students")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const updateStudent = async (req, res, next) => {
  const {
    name,
    f_id,
    email,
    s_id,
    user_name,
    contact_no,
    index_num = "",
  } = req.body;

  if (!s_id || !name || !f_id || !email || !user_name) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();
    try {
      const [results] = await conn.query(
        "CALL UpdateStudent(?, ?, ?, ?, ?, ?, ?);",
        [name, f_id, s_id, email, user_name, contact_no, index_num]
      );

      let desc = `Student updated for s_id=${s_id}, name=${name}, f_id=${f_id}, email=${email}, user_name=${user_name}, contact_no=${contact_no}, index_num=${index_num}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
      if (error.sqlMessage?.includes("Email or username already exists")) {
        return next(errorProvider(409, "Email or username already exists"));
      }
      console.error("Error updating student:", error);
      return next(
        errorProvider(500, "An error occurred while updating the student")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const updateStudentStatus = async (req, res, next) => {
  const { status, id: s_id } = req.body;

  if (!s_id || !status) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.query("CALL updateStudentStatus(?, ?);", [status, s_id]);

      let desc = `Student status changed for s_id=${s_id} to status=${status}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res
        .status(200)
        .json({ message: "Student status updated successfully" });
    } catch (error) {
      if (error.sqlMessage?.includes("Email or username already exists")) {
        return next(errorProvider(409, "Email or username already exists"));
      }
      console.error("Error updating student:", error);
      return next(
        errorProvider(500, "An error occurred while updating the student")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const updateLecturer = async (req, res, next) => {
  const { name, email, contact_no, l_id, user_name } = req.body;

  if (!l_id || !name || !email || !contact_no || !user_name) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.query("CALL UpdateLecturer(?, ?, ?, ?, ?);", [
        name,
        email,
        user_name,
        contact_no,
        l_id,
      ]);

      let desc = `Lecturer updated for l_id=${l_id}, name=${name}, email=${email}, user_name=${user_name}, contact_no=${contact_no}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res.status(200).json({ message: "Lecturer updated successfully" });
    } catch (error) {
      if (error.sqlMessage?.includes("Email or username already exists")) {
        return next(errorProvider(409, "Email or username already exists"));
      }
      console.error("Error updating lecturer:", error);
      return next(
        errorProvider(500, "An error occurred while updating the lecturer")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const updateLecturerStatus = async (req, res, next) => {
  const { status, id: l_id } = req.body;

  if (!l_id || !status) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.query("CALL updateLecturerStatus(?, ?);", [status, l_id]);

      let desc = `Lecturer status changed for l_id=${l_id} to status=${status}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      return res
        .status(200)
        .json({ message: "Lecturer status updated successfully" });
    } catch (error) {
      console.error("Error updating lecturer:", error);
      return next(
        errorProvider(500, "An error occurred while updating the lecturer")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getNoOfLecturers = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query("CALL GetNoOfLecturers();");

      const { lecturer_count } = result[0][0];

      return res.status(200).json({
        count: lecturer_count,
      });
    } catch (error) {
      console.error("Error retrieving number of lecturers:", error);
      return next(
        errorProvider(
          500,
          "An error occurred while fetching the lecturer count"
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

export const getNoOfStudents = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query("CALL GetNoOfStudents();");

      const { student_count } = result[0][0];

      return res.status(200).json({
        count: student_count,
      });
    } catch (error) {
      console.error("Error retrieving number of students:", error);
      return next(
        errorProvider(500, "An error occurred while fetching the student count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getSummaryData = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.query("CALL GetAdminSummary();");

      return res.status(200).json(result[0][0]);
    } catch (error) {
      console.error("Error retrieving summary data:", error);
      return next(
        errorProvider(500, "An error occurred while fetching the summary data")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const createVenue = async (req, res, next) => {
  let { short_code, description, seat_count } = req.body;

  if (!short_code || !description || !seat_count) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query("CALL CreateVenue(?, ?, ?);", [
        short_code,
        description,
        seat_count,
      ]);

      let desc = `Faculty created with short_code=${short_code}, description=${description}, seat_count=${seat_count}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      await conn.commit();

      return res.status(201).json({ message: "Venue created successfully" });
    } catch (error) {
      await conn.rollback();
      console.error("Error while creating Venue:", error);
      return next(errorProvider(500, "An error occurred while creating Venue"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const updateVenue = async (req, res, next) => {
  const { id, short_code, description, seat_count } = req.body;

  if (!id || !short_code || !description || !seat_count) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query("CALL UpdateVenue(?, ?, ?,?);", [
        id,
        short_code,
        description,
        seat_count,
      ]);

      let desc = `Venue updated for id=${id} with short_code=${short_code}, description=${description}, seat_count=${seat_count}`;
      await conn.query("CALL LogAdminAction(?);", [desc]);

      await conn.commit();

      return res.status(200).json({ message: "Venue updated successfully" });
    } catch (error) {
      await conn.rollback();
      console.error("Error while updating Venue:", error);
      return next(errorProvider(500, "An error occurred while updating Venue"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getVenues = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [venues] = await conn.query("CALL GetVenues();");

      if (!venues[0].length) {
        return res.status(404).json({ message: "No Venues found" });
      }

      return res.status(200).json(venues[0]);
    } catch (error) {
      console.error("Error retrieving venues:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving venues")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getVenueById = async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(errorProvider(400, "Missing id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [results] = await conn.query("CALL GetVenueById(?);", [id]);

      if (results[0].length === 0) {
        return next(errorProvider(404, `No Venue found for id: ${id}`));
      }

      return res.status(200).json(results[0][0]);
    } catch (error) {
      console.error("Error fetching Venue by ID:", error);
      return next(errorProvider(500, "Failed to fetch Venue by ID"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};
