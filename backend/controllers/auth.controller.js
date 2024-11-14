import pool from "../config/db.js";
import { generatePassword, hashPassword } from "../utils/functions.js";

export const studentRegister = async (req, res, next) => {
  const { user_name, name, d_id, email, contact_no, address, status } =
    req.body;
  const role_id = 5;

  // Check if all required fields are provided
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
    // Generate password and hash it
    const password = await generatePassword();
    const hashedPassword = await hashPassword(password);

    // Establish a connection for transaction
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Check if the user already exists
      const [userExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM user WHERE user_name = ?",
        [user_name]
      );
      if (userExists[0].count > 0) {
        conn.release(); // Release the connection
        return res.status(409).json({ error: "User already exists" });
      }

      // Insert into 'user' table
      const [userResult] = await conn.execute(
        "INSERT INTO user(user_name, password, role_id) VALUES (?,?,?)",
        [user_name, hashedPassword, role_id]
      );
      const user_id = userResult.insertId;

      // Insert into 'student' table
      const [studentResult] = await conn.execute(
        "INSERT INTO student(user_id) VALUES (?)",
        [user_id]
      );
      const s_id = studentResult.insertId;

      // Insert into 'student_detail' table
      await conn.execute(
        "INSERT INTO student_detail(s_id, name, d_id, email, contact_no, address, status) VALUES (?,?,?,?,?,?,?)",
        [s_id, name, d_id, email, contact_no, address, status]
      );

      // Commit the transaction
      await conn.commit();

      res.status(201).json({ message: "Student registered successfully" });
    } catch (error) {
      // Rollback the transaction in case of error
      await conn.rollback();
      res
        .status(500)
        .json({ error: "An error occurred while registering student" });
    } finally {
      conn.release(); // Always release the connection
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Failed to establish database connection" });
  }
};

export const managerRegister = async (req, res, next) => {
  const { user_name, name, email, contact_no, address, status } = req.body;
  const role_id = 4;

  // Check if all required fields are provided
  if (!user_name || !name || !email || !contact_no || !address || !status) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    // Generate password and hash it
    const password = await generatePassword();
    const hashedPassword = await hashPassword(password);

    // Establish a connection for transaction
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Check if the user already exists
      const [userExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM user WHERE user_name = ?",
        [user_name]
      );
      if (userExists[0].count > 0) {
        conn.release(); // Release the connection
        return res.status(409).json({ error: "User already exists" });
      }

      // Insert into 'user' table
      const [userResult] = await conn.execute(
        "INSERT INTO user(user_name, password, role_id) VALUES (?,?,?)",
        [user_name, hashedPassword, role_id]
      );
      const user_id = userResult.insertId;

      // Insert into 'student' table
      const [managerResult] = await conn.execute(
        "INSERT INTO manager(user_id) VALUES (?)",
        [user_id]
      );
      const m_id = managerResult.insertId;

      // Insert into 'student_detail' table
      await conn.execute(
        "INSERT INTO manager_detail(m_id, name, email, contact_no, address, status) VALUES (?,?,?,?,?,?)",
        [m_id, name, email, contact_no, address, status]
      );

      // Commit the transaction
      await conn.commit();

      res.status(201).json({ message: "Manger registered successfully" });
    } catch (error) {
      // Rollback the transaction in case of error
      await conn.rollback();
      res
        .status(500)
        .json({ error: "An error occurred while registering manager" });
    } finally {
      conn.release(); // Always release the connection
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Failed to establish database connection" });
  }
};
