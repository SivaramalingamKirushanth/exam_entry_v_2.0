import pool from "../config/db.js";
import { generatePassword, hashPassword } from "../utils/functions.js";

// Student Registration..............
export const studentRegister = async (req, res, next) => {
<<<<<<< HEAD
  const {
    user_name,
    name,
    batch,
    department,
    email,
    contact_no,
    address,
    status,
  } = req.body;
  const role_id = 5;

  try {
    const password = await generatePassword();
    const hashedPassword = await hashPassword(password);

    if (
      user_name === "" ||
      name === "" ||
      batch === "" ||
      department === "" ||
      email === "" ||
      contact_no === "" ||
      address === "" ||
      status === ""
    ) {
      throw new Error("missing credentials");
    }

    const query1 =
      "INSERT INTO user(user_name, password, role_id) VALUES (?, ?, ?)";
    const [rows] = await pool.execute(query1, [
      user_name,
      hashedPassword,
      role_id,
    ]);

    if (rows) {
      console.log("insert to user table success");
    } else {
      throw new Error("insert to user table failed");
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error adding student:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding student: " + error });
=======
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
>>>>>>> 5f3013a9ace6b34c7cb9b500230f584dc6f8793b
  }
};

// Manager Registration..............
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
