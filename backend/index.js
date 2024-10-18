import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import db from "./config/db.js";

dotenv.config();

const port = 8080;

const app = express();
app.use(express.json());
app.use(cookieParser());

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
// Function to get users from the "batch" table
// async function getUsers() {
//   try {
//     const [rows] = await db.query("SELECT * FROM batch");
//     console.log(rows);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     throw error;
//   }
// }

// getUsers();
