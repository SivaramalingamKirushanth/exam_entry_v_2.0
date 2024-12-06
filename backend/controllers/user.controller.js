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
            sd.f_id, 
            u.email, 
            sd.status 
          FROM user u
          INNER JOIN student s ON u.user_id = s.user_id
          INNER JOIN student_detail sd ON s.s_id = sd.s_id
          WHERE u.role_id = 5`
      );

      if (!students.length) {
        return res.status(404).json({ message: "No students found" });
      }

      return res.status(200).json(students);
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
            u.email, 
            md.contact_no, 
            md.status,
            md.m_id 
          FROM user u
          INNER JOIN manager m ON u.user_id = m.user_id
          INNER JOIN manager_detail md ON m.m_id = md.m_id
          WHERE u.role_id = 4`
      );

      return res.status(200).json(managers);
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

export const getAllActiveManagers = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [managers] = await conn.execute(
        `SELECT 
            md.name, 
            u.email, 
            md.contact_no, 
            md.status,
            md.m_id 
          FROM manager m INNER JOIN manager_detail md ON m.m_id = md.m_id INNER JOIN user u ON m.user_id = u.user_id
          WHERE md.status = 'true'`
      );

      return res.status(200).json(managers);
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

export const getManagerById = async (req, res, next) => {
  const { user_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [manager] = await conn.execute(
        `SELECT 
            u.user_id, 
            u.user_name, 
            md.name, 
            u.email, 
            md.contact_no, 
            md.status,
            md.m_id 
          FROM user u
          INNER JOIN manager m ON u.user_id = m.user_id
          INNER JOIN manager_detail md ON m.m_id = md.m_id
          WHERE u.user_id = ?`,
        [user_id]
      );

      if (!manager.length) {
        return res.status(404).json({ message: "No manager found" });
      }

      return res.status(200).json(manager[0]);
    } catch (error) {
      console.error("Error retrieving manager:", error);
      return next(
        errorProvider(500, "An error occurred while retrieving manager")
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
      const [student] = await conn.execute(
        `SELECT 
            u.user_id, 
            u.user_name, 
            sd.name, 
            u.email, 
            sd.status,
            sd.s_id,
            sd.f_id
          FROM user u
          INNER JOIN student s ON u.user_id = s.user_id
          INNER JOIN student_detail sd ON s.s_id = sd.s_id 
          WHERE u.user_id = ?`,
        [user_id]
      );

      if (!student.length) {
        return res.status(404).json({ message: "No student found" });
      }

      return res.status(200).json(student[0]);
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

export const getStudentByDegShort = async (req, res, next) => {
  const { short } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [students] = await conn.execute(
        `SELECT sd.s_id,sd.name,u.user_name FROM student_detail sd INNER JOIN fac_dep fd ON sd.f_id = fd.f_id INNER JOIN dep_deg dd ON fd.d_id = dd.d_id INNER JOIN degree d ON dd.deg_id = d.deg_id INNER JOIN student s ON sd.s_id = s.s_id INNER JOIN user u ON s.user_id = u.user_id WHERE d.short = ? AND sd.status = 'true'`,
        [short]
      );

      if (!students.length) {
        return res
          .status(404)
          .json({ message: "No students found in current faculty" });
      }

      return res.status(200).json(students);
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

export const updateStudent = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const { name, f_id, email, status, s_id } = req.body;

      const [result] = await conn.execute(
        `UPDATE student_detail 
          SET 
            name = ?, 
            f_id = ?, 
            status = ? 
          WHERE s_id = ?`,
        [name, f_id, status, s_id]
      );

      const [emailResult] = await conn.execute(
        `UPDATE user u INNER JOIN student s ON u.user_id = s.user_id SET u.email = ? WHERE s.s_id = ?`,
        [email, s_id]
      );

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Student not found or no changes made" });
      }

      return res.status(200).json({ message: "Student updated successfully" });
    } catch (error) {
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

export const updateManager = async (req, res, next) => {
  const { name, email, contact_no, status, m_id } = req.body;

  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        `UPDATE manager_detail 
          SET 
            name = ?, 
            contact_no = ?, 
            status = ? 
          WHERE m_id = ?`,
        [name, contact_no, status, m_id]
      );

      const [emailResult] = await conn.execute(
        `UPDATE user u INNER JOIN manager m ON u.user_id = m.user_id SET u.email = ? WHERE m.m_id = ?`,
        [email, m_id]
      );

      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Manager not found or no changes made" });
      }

      return res.status(200).json({ message: "Manager updated successfully" });
    } catch (error) {
      console.error("Error updating manager:", error);
      return next(
        errorProvider(500, "An error occurred while updating the manager")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const deleteUser = async (req, res, next) => {
  //const { user_id } = req.body;

  const user_id = 1;

  if (!user_id) {
    return res.status(400).json({
      message: "user_id is required",
    });
  }

  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [student] = await conn.execute(
        `SELECT s_id FROM student WHERE user_id = ?`,
        [user_id]
      );

      if (student.length > 0) {
        const s_id = student[0].s_id;

        await conn.execute(`DELETE FROM student_detail WHERE s_id = ?`, [s_id]);
        await conn.execute(`DELETE FROM student WHERE user_id = ?`, [user_id]);
      } else {
        const [manager] = await conn.execute(
          `SELECT m_id FROM manager WHERE user_id = ?`,
          [user_id]
        );

        if (manager.length > 0) {
          const m_id = manager[0].m_id;

          await conn.execute(`DELETE FROM manager_detail WHERE m_id = ?`, [
            m_id,
          ]);

          await conn.execute(`DELETE FROM manager WHERE user_id = ?`, [
            user_id,
          ]);
        }
      }

      const [result] = await conn.execute(
        `DELETE FROM user WHERE user_id = ?`,
        [user_id]
      );

      await conn.commit();

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      return res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);

      await conn.rollback();

      return next(
        errorProvider(500, "An error occurred while deleting the user")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getNoOfManagers = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        "SELECT COUNT(*) AS manager_count FROM manager"
      );

      const { manager_count } = result[0];

      return res.status(200).json({
        count: manager_count,
      });
    } catch (error) {
      console.error("Error retrieving number of managers:", error);
      return next(
        errorProvider(500, "An error occurred while the manager count")
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
      const [result] = await conn.execute(
        "SELECT COUNT(*) AS student_count FROM student"
      );

      const { student_count } = result[0];

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
