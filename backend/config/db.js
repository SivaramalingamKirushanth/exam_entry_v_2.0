import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Create configuration using separate environment variables
const connectionConfig = {
  host: process.env.DB_HOST || "localhost", // Default host if not set
  port: parseInt(process.env.DB_PORT, 10) || 3306, // Default MySQL port is 3306
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "", // Default password if not set
  database: process.env.DB_NAME || "exam_entry", // Default database name if not set
  // Add your additional options here
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  multipleStatements: true,
  connectTimeout: 10000,
};

// Create the connection pool with the complete config
const pool = mysql.createPool(connectionConfig);

pool.getConnection((err, connection) => {
  if (err) {
    console.log(
      "Trying to connect to MySQL Port:",
      process.env.DB_PORT,
      "Host:",
      process.env.DB_HOST
    );
    console.error(
      `Error connecting to MySQL at ${connectionConfig.host}:${connectionConfig.port}`,
      err
    );
  } else {
    console.log("Connected to MySQL");
    connection.release(); // Release the connection back to the pool
  }
});

// Export the connection pool
export default pool.promise(); // Enable promise-based queries
