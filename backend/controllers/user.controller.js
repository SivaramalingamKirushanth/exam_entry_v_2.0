import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";

export const getAllStudents = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [students] = await conn.execute(
        `SELECT 
            u.user_id, 
            u.user_name, 
            sd.name, 
            sd.d_id, 
            sd.email, 
            sd.contact_no, 
            sd.address, 
            sd.status 
          FROM user u
          INNER JOIN student s ON u.user_id = s.user_id
          INNER JOIN student_detail sd ON s.s_id = sd.s_id
          WHERE u.role_id = 5`
      );

      // Debugging log
      console.log("Retrieved students:", students);
      if (!students.length) {
        return res.status(404).json({ message: "No students found" });
      }

      return res.status(200).json({ students });
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

export const getAllManagers = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [managers] = await conn.execute(
        `SELECT 
            u.user_id, 
            u.user_name, 
            md.name, 
            md.email, 
            md.contact_no, 
            md.address, 
            md.status 
          FROM user u
          INNER JOIN manager m ON u.user_id = m.user_id
          INNER JOIN manager_detail md ON m.m_id = md.m_id
          WHERE u.role_id = 4`
      );

      console.log("Retrieved managers:", managers); // Debugging log
      if (!managers.length) {
        return res.status(404).json({ message: "No managers found" });
      }

      return res.status(200).json({ managers });
    } catch (error) {
      console.error("Error retrieving managers:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving managers")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};
