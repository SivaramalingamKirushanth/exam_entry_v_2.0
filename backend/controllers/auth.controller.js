import pool from "../config/db.js";
import { generatePassword, hashPassword } from "../utils/functions.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { verifyPassword } from "../utils/functions.js";
import errorProvider from "../utils/errorProvider.js";
const JWT_SECRET = process.env.JWT_SECRET || "abc123";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export const studentRegister = async (req, res, next) => {
  const { user_name, name, d_id, email, status } = req.body;
  const role_id = 5;

  if (!user_name || !name || !d_id || !email || !status) {
    return next(errorProvider(400, "Missing credentials"));
  }

  try {
    const password = await generatePassword();
    // show the generated password for only login testing
    console.log("Generated password:", password);

    let mailOptions = {
      from: `"Examination Branch" <${process.env.EMAIL}>`,
      to: email,
      subject: "Registration succesfull",
      text: "You are successfully registered for to examinations",
      html: `<h3>User name : ${user_name}</h3><h3>User name : ${password}</h3>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    const hashedPassword = await hashPassword(password);

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [userExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM user WHERE user_name = ? OR email = ?",
        [user_name, email]
      );

      if (userExists[0].count > 0) {
        conn.release();
        return next(errorProvider(409, "User already exists"));
      }

      const [userResult] = await conn.execute(
        "INSERT INTO user(user_name, email, password, role_id) VALUES (?,?,?,?)",
        [user_name, email, hashedPassword, role_id]
      );
      const user_id = userResult.insertId;

      const [studentResult] = await conn.execute(
        "INSERT INTO student(user_id) VALUES (?)",
        [user_id]
      );
      const s_id = studentResult.insertId;

      await conn.execute(
        "INSERT INTO student_detail(s_id, name, d_id, status) VALUES (?,?,?,?)",
        [s_id, name, d_id, status]
      );

      await conn.commit();

      return res
        .status(201)
        .json({ message: "Student registered successfully" });
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
  const { user_name, name, email, contact_no, status } = req.body;
  const role_id = 4;

  if (!user_name || !name || !email || !contact_no || !status) {
    return next(errorProvider(400, "Missing credentials"));
  }

  try {
    const password = await generatePassword();

    console.log("Generated password:", password);
    const hashedPassword = await hashPassword(password);

    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [userExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM user WHERE user_name = ? OR email = ?",
        [user_name, email]
      );

      if (userExists[0].count > 0) {
        conn.release();
        return next(errorProvider(409, "User already exists"));
      }

      const [userResult] = await conn.execute(
        "INSERT INTO user(user_name, email, password, role_id) VALUES (?,?,?,?)",
        [user_name, email, hashedPassword, role_id]
      );
      const user_id = userResult.insertId;

      const [managerResult] = await conn.execute(
        "INSERT INTO manager(user_id) VALUES (?)",
        [user_id]
      );
      const m_id = managerResult.insertId;

      await conn.execute(
        "INSERT INTO manager_detail(m_id, name, contact_no, status) VALUES (?,?,?,?)",
        [m_id, name, contact_no, status]
      );

      await conn.commit();

      res.status(201).json({ message: "Manger registered successfully" });
    } catch (error) {
      await conn.rollback();
      return next(
        errorProvider(500, "An error occurred while registering manager")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error during registration:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const login = async (req, res, next) => {
  const { user_name_or_email, password, remember_me } = req.body;

  if (!user_name_or_email || !password) {
    return next(errorProvider(400, "Missing credentials"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const [user] = await conn.execute(
        "SELECT user_id, password, role_id FROM user WHERE user_name = ? OR email = ?",
        [user_name_or_email, user_name_or_email]
      );

      if (user.length == 0) {
        console.log("User not found in database");
        return next(errorProvider(401, "Invalid username or password"));
      }

      const { user_id, password: hashedPassword, role_id } = user[0];

      const isPasswordValid = await verifyPassword(password, hashedPassword);

      if (!isPasswordValid) {
        return next(errorProvider(401, "Invalid username or password"));
      }

      const token = jwt.sign({ user_id, role_id }, JWT_SECRET, {
        expiresIn: remember_me ? "2 days" : "1h",
      });

      return res
        .cookie("access-token", token, { httpOnly: true })
        .status(200)
        .json({ message: "Login successful" });
    } catch (error) {
      console.error("Error during login:", error);
      return next(errorProvider(500, "An error occurred during login"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const me = async (req, res, next) => {
  const { user_id, role_id } = req.user;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    let query;
    let params;

    if (role_id == "5") {
      query =
        "SELECT u.email, u.user_name, sd.name, u.role_id FROM user u INNER JOIN student s ON u.user_id = s.user_id INNER JOIN student_detail sd ON s.s_id = sd.s_id WHERE u.user_id = ?";
      params = [user_id];
    } else if (role_id == "4") {
      query =
        "SELECT u.email, u.user_name, md.name, u.role_id FROM user u INNER JOIN manager m ON u.user_id = m.user_id INNER JOIN manager_detail md ON m.m_id = md.m_id WHERE u.user_id = ?";
      params = [user_id];
    } else if (role_id == "3") {
      query =
        "SELECT u.email, u.user_name, d.d_name as name, u.role_id FROM user u INNER JOIN department d ON u.user_id = d.user_id WHERE u.user_id = ?";
      params = [user_id];
    } else if (role_id == "2") {
      query =
        "SELECT u.email, u.user_name, f.f_name as name, u.role_id FROM user u INNER JOIN faculty f ON u.user_id = f.user_id WHERE u.user_id = ?";
      params = [user_id];
    } else if (role_id == "1") {
      query = "SELECT email, user_name, role_id FROM user WHERE user_id = ?";
      params = [user_id];
    }

    const [userDetails] = await conn.execute(query, params);
    await conn.commit();

    return res.status(200).json(userDetails[0]);
  } catch (error) {
    // Rollback only if transaction was started
    if (
      conn &&
      conn.connection &&
      conn.connection._protocol._queue.length > 0
    ) {
      await conn.rollback();
    }
    return next(
      errorProvider(500, "An error occurred while fetching user details")
    );
  } finally {
    // Release the connection
    if (conn) conn.release();
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("access-token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error during logout" });
  }
};
