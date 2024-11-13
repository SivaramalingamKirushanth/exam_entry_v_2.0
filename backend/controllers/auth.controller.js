import pool from "../config/db.js";
import { generatePassword, hashPassword } from "../utils/functions.js";

// Student Registration..............
export const studentRegister = async (req, res, next) => {
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

    const query1 =
      "INSERT INTO user(user_name, password, role_id) VALUES (?,?,?)";

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
    console.error("Error adding manager:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding manager." + error });
  }
};
