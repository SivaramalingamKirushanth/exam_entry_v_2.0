import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";

export const createBatch = async (req, res, next) => {
  const { batch_id, academic_year, description, sub_id, m_id, status } =
    req.body;

  // Validate input data
  if (
    !batch_id ||
    !academic_year ||
    !description ||
    !sub_id ||
    !m_id ||
    !status
  ) {
    return next(
      errorProvider(
        400,
        "All fields (batch_id, academic_year, description, sub_id, m_id, status) are required"
      )
    );
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [batchResult] = await conn.execute(
        "INSERT INTO batch(batch_id, academic_year, description) VALUES (?, ?, ?)",
        [batch_id, academic_year, description]
      );

      const [batchDetailsResult] = await conn.execute(
        "INSERT INTO batch_curriculum_lecture(batch_id, sub_id, m_id, status) VALUES (?, ?, ?, ?)",
        [batch_id, sub_id, m_id, status]
      );

      await conn.commit();
      return res.status(201).json({
        message: "Batch and batch subject details created successfully",
        data: {
          batch: {
            batch_id,
            academic_year,
            description,
          },
          batch_curriculum_lecture: {
            batch_id,
            sub_id,
            m_id,
            status,
          },
        },
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
