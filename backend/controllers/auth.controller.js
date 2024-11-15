import pool from "../config/db.js";
import { generatePassword, hashPassword } from "../utils/functions.js";

import jwt from "jsonwebtoken";
import { verifyPassword } from "../utils/functions.js";
import errorProvider from "../utils/errorProvider.js";
const JWT_SECRET = process.env.JWT_SECRET || "uov@exam";

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
    return next(errorProvider(400, "Missing credentials"));
  }

  try {
    const password = await generatePassword();
    // show the generated password for only login testing
    console.log("Generated password:", password);
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
        return next(errorProvider(409, "User already exists"));
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
      return next(errorProvider(500, "User already exists"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
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

export const login = async (req, res, next) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [user] = await conn.execute(
        "SELECT user_id, password, role_id FROM user WHERE user_name = ?",
        [user_name]
      );

      // Log the retrieved user data
      console.log("Database result:", user);

      if (user.length == 0) {
        console.log("User not found in database");
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const { user_id, password: hashedPassword, role_id } = user[0];
      // Log passwords only for debugging
      console.log("Plaintext password:", password);
      console.log("Hashed password from DB:", hashedPassword);

      // Verify the password
      const isPasswordValid = await verifyPassword(password, hashedPassword);
      console.log("Is password valid:", isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Generate JWT Token
      const token = jwt.sign({ user_id, role_id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Send response
      res
        .cookie("access-token", token, { httpOnly: true })
        .status(200)
        .json({ message: "Login successful" });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "An error occurred during login" });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: "Failed to establish database connection" });
  }
};
