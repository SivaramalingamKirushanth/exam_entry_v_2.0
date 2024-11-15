import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";

export const getAllSubjectDetails = async (req, res, next) => {
  const m_id = req.params.m_id;

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
