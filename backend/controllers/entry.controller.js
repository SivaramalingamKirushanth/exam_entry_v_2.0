export const applyExam = async (req, res, next) => {
    const { user_id } = req.user;
  
    if (!user_id) {
      return next(errorProvider(400, "User ID is required."));
    }
  
    try {
      const conn = await pool.getConnection();
      try {
        const [result] = await conn.query("CALL ApplyExam(?);", [user_id]);
  
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