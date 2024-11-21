import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";

export const createBatch = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const { batch_id, academic_year, description } = req.body;

      if (!batch_id || !academic_year || !description) {
        return res.status(400).json({
          message:
            "All fields (batch_id, academic_year, description) are required",
        });
      }

      const [result] = await conn.execute(
        `INSERT INTO batch (batch_id, academic_year, description) 
           VALUES (?, ?, ?)`,
        [batch_id, academic_year, description]
      );

      return res.status(201).json({
        message: "Batch created successfully",
        batch: { batch_id, academic_year, description },
      });
    } catch (error) {
      console.error("Error creating batch:", error);
      return next(
        errorProvider(500, "An error occurred while creating the batch")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const createCurriculumLecture = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const { batch_id, sub_id, m_id, status } = req.body;

      if (!batch_id || !sub_id || !m_id || !status) {
        return res.status(400).json({
          message: "All fields (batch_id, sub_id, m_id, status) are required",
        });
      }

      const [result] = await conn.execute(
        `INSERT INTO batch_curriculum_lecture (batch_id, sub_id, m_id, status)
           VALUES (?, ?, ?, ?)`,
        [batch_id, sub_id, m_id, status]
      );

      return res.status(201).json({
        message: "Batch-Subject-Manager relationship created successfully",
        data: { batch_id, sub_id, m_id, status },
      });
    } catch (error) {
      console.error(
        "Error creating batch-subject-manager relationship:",
        error
      );
      return next(
        errorProvider(500, "An error occurred while creating the relationship")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};