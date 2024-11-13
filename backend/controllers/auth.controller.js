import pool from "../config/db.js";
import { generatePassword, hashPassword } from "../utils/functions.js";

export const studentRegister = async (req, res, next) => {
  const { user_name, name, d_id, email, contact_no, address, status } =
    req.body;
  const role_id = 5;

  try {
    // Validate required fields at once
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

    // Generate and hash password
    const password = await generatePassword();
    const hashedPassword = await hashPassword(password);

    // Check if user already exists
    const [userExists] = await pool.execute(
      "SELECT COUNT(*) AS count FROM user WHERE user_name = ?",
      [user_name]
    );
    if (userExists[0].count > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Begin user creation transaction
    await pool.getConnection(async (conn) => {
      try {
        await conn.beginTransaction();

        // Insert into 'user' table
        const [results1] = await conn.execute(
          "INSERT INTO user(user_name, password, role_id) VALUES (?,?,?)",
          [user_name, hashedPassword, role_id]
        );
        const user_id = results1.insertId;

        // Insert into 'student' table
        const [results2] = await conn.execute(
          "INSERT INTO student(user_id) VALUES (?)",
          [user_id]
        );
        const s_id = results2.insertId;

        // Insert into 'student_detail' table
        await conn.execute(
          "INSERT INTO student_detail(s_id, name, d_id, email, contact_no, address, status) VALUES (?,?,?,?,?,?,?)",
          [s_id, name, d_id, email, contact_no, address, status]
        );

        await conn.commit();
        res.status(201).json("Student registered successfully");
      } catch (error) {
        await conn.rollback();
        throw error;
      } finally {
        conn.release();
      }
    });
  } catch (error) {
    console.error("Error adding student:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while adding student: " + error.message,
      });
  }
};

export const managerRegister = async (req, res, next) => {
  const { user_name, name, email, contact_no, address, status } = req.body;
  const role_id = 4;

  try {
    const password = await generatePassword();
    const hashedPassword = await hashPassword(password);

    if (
      user_name == "" ||
      name == "" ||
      email == "" ||
      contact_no == "" ||
      address == "" ||
      status == ""
    ) {
      throw new Error("missing credentials");
    }

    const [userExit] = await pool.execute(
      "SELECT COUNT(*) AS count FROM user WHERE user_name = ?",
      [user_name]
    );

    if (userExit[0].count > 0) {
      throw new Error("User already exists");
    }

    const query1 =
      "INSERT INTO user(user_name, password, role_id) VALUES (?,?,?)";

    const [results1] = await pool.execute(query1, [
      user_name,
      hashedPassword,
      role_id,
    ]);

    if (results1) {
      const user_id = results1.insertId;
      const query2 = "INSERT INTO manager(user_id) VALUES (?)";
      const [results2] = await pool.execute(query2, [user_id]);

      if (results2) {
        const m_id = results2.insertId;
        const query3 =
          "INSERT INTO manager_detail(m_id, name, email, contact_no, address, status) VALUES (?,?,?,?,?,?)";
        const [results3] = await pool.execute(query3, [
          m_id,
          name,
          email,
          contact_no,
          address,
          status,
        ]);

        if (results3) {
          return res.status(201).json("manager_detail created successfully");
        } else {
          throw new Error("insert to manager_detail failed");
        }
      } else {
        throw new Error("insert to the manager table failed");
      }
    } else {
      throw new Error("insert to user table failed");
    }
  } catch (error) {
    console.error("Error adding manager:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding manager." + error });
  }
};
