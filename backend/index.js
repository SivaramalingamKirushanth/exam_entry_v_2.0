import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import pool from "./config/db.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const port = 8080;

const app = express();
app.use(express.json());
app.use(cookieParser());

//ALL THE ROUTES
app.use("/api1/auth", authRouter);
///////////////////////////////////////////////////////////

app.use((err, req, res, next) => {
  const statuscode = err.statuscode;
  const message = err.message;
  return res.status(statuscode).json({
    success: false,
    message,
    statuscode,
  });
});

app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});

// export const getActiveStudents = async (req, res) => {
//   const { name, userName, conatctNo, email } = req.body;
//   const role_id = 4;
//   const password = "dfsdfdsf";
//   const hashedPassword = await bcrypt.sign(efe, wewewe);
//   try {
//     // Define the SQL query with placeholders for security
//     const query = `INSERT INTO manager_detail ( m_id, name, email, contact_no, address, status) VALUES ('?','?','?','?','?','?','?')`;

//     // Use the pool to get a promise-based connection and execute the query
//     const [rows] = await pool.execute(query, [
//       "active",
//       "stu",
//       "active",
//       "stu",
//       "active",
//       "stu",
//     ]);

//     // Send the result as a response
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error("Error fetching active students:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching active students." });
//   }
// };

// getUsers();
