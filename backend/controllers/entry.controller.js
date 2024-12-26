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
  