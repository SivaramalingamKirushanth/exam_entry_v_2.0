import pool from "../config/db.js";
import { generatePassword, hashPassword } from "../utils/functions.js";

export const studentRegister = async (req, res, next) => {
  const { user_name, name, d_id, email, contact_no, address, status } =
    req.body;
  const role_id = 5;

  if (
    !user_name ||
    !name ||
    !d_id ||
    !email ||
    !contact_no ||
    !address ||
    !status
  ) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const password = await generatePassword();
    const hashedPassword = await hashPassword(password);

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [userExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM user WHERE user_name = ?",
        [user_name]
      );
      if (userExists[0].count > 0) {
        conn.release();
        return res.status(409).json({ error: "User already exists" });
      }

      const [userResult] = await conn.execute(
        "INSERT INTO user(user_name, password, role_id) VALUES (?,?,?)",
        [user_name, hashedPassword, role_id]
      );
      const user_id = userResult.insertId;

      const [studentResult] = await conn.execute(
        "INSERT INTO student(user_id) VALUES (?)",
        [user_id]
      );
      const s_id = studentResult.insertId;

      await conn.execute(
        "INSERT INTO student_detail(s_id, name, d_id, email, contact_no, address, status) VALUES (?,?,?,?,?,?,?)",
        [s_id, name, d_id, email, contact_no, address, status]
      );

      await conn.commit();

      res.status(201).json({ message: "Student registered successfully" });
    } catch (error) {
      await conn.rollback();
      res
        .status(500)
        .json({ error: "An error occurred while registering student" });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Failed to establish database connection" });
  }
};

export const managerRegister = async (req, res, next) => {
  const { user_name, name, email, contact_no, address, status } = req.body;
  const role_id = 4;

  if (!user_name || !name || !email || !contact_no || !address || !status) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const password = await generatePassword();
    const hashedPassword = await hashPassword(password);

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [userExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM user WHERE user_name = ?",
        [user_name]
      );
      if (userExists[0].count > 0) {
        conn.release();
        return res.status(409).json({ error: "User already exists" });
      }

      const [userResult] = await conn.execute(
        "INSERT INTO user(user_name, password, role_id) VALUES (?,?,?)",
        [user_name, hashedPassword, role_id]
      );
      const user_id = userResult.insertId;

      const [managerResult] = await conn.execute(
        "INSERT INTO manager(user_id) VALUES (?)",
        [user_id]
      );
      const m_id = managerResult.insertId;

      await conn.execute(
        "INSERT INTO manager_detail(m_id, name, email, contact_no, address, status) VALUES (?,?,?,?,?,?)",
        [m_id, name, email, contact_no, address, status]
      );

      await conn.commit();

      res.status(201).json({ message: "Manger registered successfully" });
    } catch (error) {
      await conn.rollback();
      res
        .status(500)
        .json({ error: "An error occurred while registering manager" });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Failed to establish database connection" });
  }
};
