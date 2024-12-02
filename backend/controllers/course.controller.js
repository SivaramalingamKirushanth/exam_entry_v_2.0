import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";
import { generatePassword, hashPassword } from "../utils/functions.js";

export const createFaculty = async (req, res, next) => {
  let { f_name, email, contact_no, status } = req.body;

  if (!status) {
    status = "false";
  }

  if (!f_name || !email || !contact_no) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Check if faculty already exists (based on f_name or email)
      const [facultyExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM faculty f LEFT JOIN user u ON f.user_id = u.user_id WHERE f.f_name = ? OR u.user_name = ?",
        [f_name, email]
      );

      if (facultyExists[0].count > 0) {
        conn.release();
        return next(errorProvider(409, "Faculty or email already exists"));
      }

      const password = await generatePassword();

      console.log("Generated password:", password);
      const hashedPassword = await hashPassword(password);

      const [userResult] = await conn.execute(
        "INSERT INTO user(user_name,email, password, role_id) VALUES (?,?,?,?)",
        [email, email, hashedPassword, "2"]
      );
      const user_id = userResult.insertId;

      // Insert into faculty table
      const [facultyResult] = await conn.execute(
        "INSERT INTO faculty (f_name, user_id, contact_no, status) VALUES (?, ?, ?, ?)",
        [f_name, user_id, contact_no, status]
      );

      await conn.commit();
      await mailer(email, email, password);

      return res.status(201).json({ message: "Faculty created successfully" });
    } catch (error) {
      await conn.rollback();
      console.error("Error while creating faculty:", error);
      return next(
        errorProvider(500, "An error occurred while creating faculty")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const updateFaculty = async (req, res, next) => {
  const { f_id, f_name, email, contact_no, status } = req.body;

  if (!f_id || !f_name || !email || !contact_no) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Check if faculty exists
      const [facultyExists] = await conn.execute(
        "SELECT * FROM faculty WHERE f_id = ?",
        [f_id]
      );

      if (!facultyExists.length) {
        conn.release();
        return next(errorProvider(404, "Faculty not found"));
      }

      // Update faculty table
      await conn.execute(
        "UPDATE faculty SET f_name = ?, contact_no = ?, status = ? WHERE f_id = ?",
        [f_name, contact_no, status, f_id]
      );

      await conn.execute(
        "UPDATE user SET user_name = ?, email = ?  WHERE user_id = ?",
        [email, email, facultyExists[0].user_id]
      );

      await conn.commit();

      return res.status(200).json({ message: "Faculty updated successfully" });
    } catch (error) {
      await conn.rollback();
      console.error("Error while updating faculty:", error);
      return next(
        errorProvider(500, "An error occurred while updating faculty")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const createDepartment = async (req, res, next) => {
  const { d_name, email, contact_no, status, f_id } = req.body;

  if (!d_name || !email || !contact_no || !f_id) {
    return next(errorProvider(400, "Missing required fields"));
  }

  if (!status) {
    status = "false";
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Check if department already exists
      const [departmentExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM department d LEFT JOIN user u ON d.user_id = u.user_id WHERE d.d_name = ? OR u.user_name = ? OR u.email = ?",
        [d_name, email, email]
      );

      if (departmentExists[0].count > 0) {
        conn.release();
        return next(errorProvider(409, "Department already exists"));
      }

      const password = await generatePassword();

      console.log("Generated password:", password);
      const hashedPassword = await hashPassword(password);

      const [userResult] = await conn.execute(
        "INSERT INTO user(user_name,email, password, role_id) VALUES (?,?,?,?)",
        [email, email, hashedPassword, "3"]
      );

      const user_id = userResult.insertId;

      // Insert into department table
      const [departmentResult] = await conn.execute(
        "INSERT INTO department (d_name, user_id, contact_no, status) VALUES (?, ?, ?, ?)",
        [d_name, user_id, contact_no, status]
      );
      const d_id = departmentResult.insertId;

      // Insert into fac_dep table
      await conn.execute("INSERT INTO fac_dep (f_id, d_id) VALUES (?, ?)", [
        f_id,
        d_id,
      ]);

      await conn.commit();
      await mailer(email, email, password);

      res.status(201).json({
        message: "Department created successfully",
      });
    } catch (error) {
      await conn.rollback();
      console.error("Error during department creation:", error);
      return next(
        errorProvider(500, "An error occurred while creating department")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const updateDepartment = async (req, res, next) => {
  const { d_id, d_name, email, contact_no, status, f_id } = req.body;

  if (!d_id || !d_name || !email || !contact_no || !f_id) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      const [departmentExists] = await conn.execute(
        "SELECT * FROM department WHERE d_id = ?",
        [d_id]
      );

      if (!departmentExists.length) {
        conn.release();
        return next(errorProvider(404, "Department not found"));
      }

      // Update department table
      await conn.execute(
        "UPDATE department SET d_name = ?, contact_no = ?, status = ? WHERE d_id = ?",
        [d_name, contact_no, status, d_id]
      );

      await conn.execute(
        "UPDATE user SET user_name = ?, email=? WHERE user_id = ?",
        [email, email, departmentExists[0].user_id]
      );

      // // Update fac_dep table
      await conn.execute("UPDATE fac_dep SET f_id = ? WHERE d_id = ?", [
        f_id,
        d_id,
      ]);

      await conn.commit();

      return res
        .status(200)
        .json({ message: "Department updated successfully" });
    } catch (error) {
      await conn.rollback();
      console.error("Error while updating department:", error);
      return next(
        errorProvider(500, "An error occurred while updating department")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const createDegree = async (req, res, next) => {
  const {
    deg_name,
    short,
    levels: levelsArr,
    no_of_sem_per_year,
    status,
    d_id,
  } = req.body;
  const levels = levelsArr.sort((a, b) => a - b).join(":");

  if (!deg_name || !short || !levels || !no_of_sem_per_year || !d_id) {
    return next(errorProvider(400, "Missing required fields"));
  }
  if (!status) {
    status = "false";
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Check if degree already exists
      const [degreeExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM degree WHERE deg_name = ? OR short = ?",
        [deg_name, short]
      );

      if (degreeExists[0].count > 0) {
        conn.release();
        return next(errorProvider(409, "Degree already exists"));
      }

      // Insert into degree table
      const [degreeResult] = await conn.execute(
        "INSERT INTO degree (deg_name, short, levels,no_of_sem_per_year, status) VALUES (?, ?,?, ?, ?)",
        [deg_name, short, levels, no_of_sem_per_year, status]
      );
      const deg_id = degreeResult.insertId;

      // Insert into dep_deg table
      await conn.execute("INSERT INTO dep_deg (d_id, deg_id) VALUES (?, ?)", [
        d_id,
        deg_id,
      ]);

      await conn.commit();

      res.status(201).json({
        message: "Degree added successfully",
        deg_id,
      });
    } catch (error) {
      await conn.rollback();
      console.error("Error during degree creation:", error);
      return next(
        errorProvider(500, "An error occurred while adding the degree")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const updateDegree = async (req, res, next) => {
  const {
    deg_id,
    deg_name,
    short,
    levels: levelsArr,
    no_of_sem_per_year,
    status,
    d_id,
  } = req.body;
  const levels = levelsArr.join(":");

  if (
    !deg_id ||
    !deg_name ||
    !short ||
    !levels ||
    !no_of_sem_per_year ||
    !d_id
  ) {
    return next(errorProvider(400, "Missing required fields"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Check if degree exists
      const [degreeExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM degree WHERE deg_id = ?",
        [deg_id]
      );

      if (degreeExists[0].count === 0) {
        conn.release();
        return next(errorProvider(404, "Degree not found"));
      }

      // Check if degree already exists
      const [degreeNameOrShortExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM degree WHERE deg_name = ? OR short = ? AND deg_id != ?",
        [deg_name, short, deg_id]
      );

      if (degreeNameOrShortExists[0].count > 0) {
        conn.release();
        return next(errorProvider(409, "Degree already exists"));
      }

      // Update degree table
      await conn.execute(
        "UPDATE degree SET deg_name = ?, short = ?, levels = ?, no_of_sem_per_year = ?, status = ? WHERE deg_id = ?",
        [deg_name, short, levels, no_of_sem_per_year, status, deg_id]
      );

      // Update dep_deg table
      await conn.execute("UPDATE dep_deg SET d_id = ? WHERE deg_id = ?", [
        d_id,
        deg_id,
      ]);

      await conn.commit();

      return res.status(200).json({ message: "Degree updated successfully" });
    } catch (error) {
      await conn.rollback();
      console.error("Error while updating degree:", error);
      return next(
        errorProvider(500, "An error occurred while updating the degree")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllFaculties = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT * FROM faculty where status = 'true'`;

      const [results] = await conn.execute(query);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching all faculties:", error);
      return next(errorProvider(500, "Failed to fetch all faculties"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllFacultiesWithExtraDetails = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT  f.*,u.user_name AS email, COUNT(DISTINCT fd.d_id) AS department_count, COUNT(DISTINCT dd.deg_id) AS degree_count FROM faculty f LEFT JOIN user u ON f.user_id = u.user_id LEFT JOIN fac_dep fd ON f.f_id = fd.f_id LEFT JOIN 
    dep_deg dd ON fd.d_id = dd.d_id  GROUP BY f.f_id`;

      const [results] = await conn.execute(query);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching all faculties:", error);
      return next(errorProvider(500, "Failed to fetch all faculties"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getFacultyById = async (req, res, next) => {
  const { f_id } = req.body;

  if (!f_id) {
    return next(errorProvider(400, "Missing f_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT f.*, u.user_name AS email FROM faculty f LEFT JOIN user u ON u.user_id = f.user_id WHERE f.f_id = ?`;

      const [results] = await conn.execute(query, [f_id]);

      if (results.length === 0) {
        return next(errorProvider(404, `No faculty found for f_id: ${f_id}`));
      }

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching faculty by ID:", error);
      return next(errorProvider(500, "Failed to fetch faculty by ID"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllDepartments = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT * FROM department where status = 'true'`;

      const [results] = await conn.execute(query);

      if (results.length === 0) {
        return next(errorProvider(404, "No departments found."));
      }

      return res.status(200).json({ departments: results });
    } catch (error) {
      console.error("Error fetching all departments:", error);
      return next(errorProvider(500, "Failed to fetch all departments"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllDepartmentsWithExtraDetails = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT  d.*,u.user_name AS email, f.f_name AS faculty_name, COUNT(DISTINCT dd.deg_id) AS degree_count FROM department d LEFT JOIN user u ON d.user_id = u.user_id LEFT JOIN fac_dep fd ON d.d_id = fd.d_id LEFT JOIN faculty f ON fd.f_id = f.f_id LEFT JOIN dep_deg dd ON d.d_id = dd.d_id GROUP BY d.d_id, d.d_name, f.f_name`;

      const [results] = await conn.execute(query);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching all faculties:", error);
      return next(errorProvider(500, "Failed to fetch all faculties"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getDepartmentById = async (req, res, next) => {
  const { d_id } = req.body;

  if (!d_id) {
    return next(errorProvider(400, "Missing d_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT d.*,fd.f_id, u.user_name AS email FROM department d INNER JOIN fac_dep fd ON d.d_id = fd.d_id LEFT JOIN user u ON u.user_id = d.user_id WHERE d.d_id = ?`;

      const [results] = await conn.execute(query, [d_id]);

      if (results.length === 0) {
        return next(
          errorProvider(404, `No department found for d_id: ${d_id}`)
        );
      }

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching department by ID:", error);
      return next(errorProvider(500, "Failed to fetch department by ID"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllDegrees = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT * FROM degree where status = 'true'`;

      const [results] = await conn.execute(query);

      if (results.length === 0) {
        return next(errorProvider(404, "No degrees found."));
      }

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching all degrees:", error);
      return next(errorProvider(500, "Failed to fetch all degrees"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllDegreesWithExtraDetails = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT dg.deg_id,dg.deg_name,dg.short,dg.levels,dg.no_of_sem_per_year,dg.status,d.d_id,d.d_name AS department_name,f.f_id,
    f.f_name AS faculty_name FROM degree dg LEFT JOIN dep_deg dd ON dg.deg_id = dd.deg_id LEFT JOIN department d ON dd.d_id = d.d_id LEFT JOIN fac_dep fd ON d.d_id = fd.d_id LEFT JOIN 
    faculty f ON fd.f_id = f.f_id`;

      const [results] = await conn.execute(query);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching all faculties:", error);
      return next(errorProvider(500, "Failed to fetch all faculties"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getDegreeById = async (req, res, next) => {
  const { deg_id } = req.body;

  if (!deg_id) {
    return next(errorProvider(400, "Missing deg_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT dg.*,d.d_id,f.f_id FROM degree dg LEFT JOIN dep_deg dd ON dg.deg_id = dd.deg_id LEFT JOIN department d ON dd.d_id = d.d_id LEFT JOIN fac_dep fd ON d.d_id = fd.d_id LEFT JOIN faculty f ON fd.f_id = f.f_id where dg.deg_id = ?`;
      const [results] = await conn.execute(query, [deg_id]);

      if (results.length === 0) {
        return next(
          errorProvider(404, `No degree found for deg_id: ${deg_id}`)
        );
      }

      return res
        .status(200)
        .json({ ...results[0], levels: results[0].levels.split(":") });
    } catch (error) {
      console.error("Error fetching degree by ID:", error);
      return next(errorProvider(500, "Failed to fetch degree by ID"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getDegreeByShort = async (req, res, next) => {
  const { short } = req.body;
  console.log(short);
  if (!short) {
    return next(errorProvider(400, "Missing short."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT deg_name FROM degree where short = ?`;
      const [results] = await conn.execute(query, [short]);

      if (results.length === 0) {
        return next(
          errorProvider(404, `No degree found for degree short: ${short}`)
        );
      }

      return res.status(200).json(results[0]);
    } catch (error) {
      console.error("Error fetching degree by short:", error);
      return next(errorProvider(500, "Failed to fetch degree by short"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getDepartmentsByFacultyId = async (req, res, next) => {
  const { f_id } = req.body;

  if (!f_id) {
    return next(errorProvider(400, "Missing f_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT department.* FROM department INNER JOIN fac_dep ON department.d_id = fac_dep.d_id WHERE fac_dep.f_id = ? AND department.status = 'true'`;

      const [results] = await conn.execute(query, [f_id]);

      if (results.length === 0) {
        return next(
          errorProvider(404, `No departments found for f_id: ${f_id}`)
        );
      }
      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching departments by f_id:", error);
      return next(errorProvider(500, "Failed to fetch departments by f_id"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getDegreesByDepartmentId = async (req, res, next) => {
  const { d_id } = req.body;

  if (!d_id) {
    return next(errorProvider(400, "Missing d_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT * FROM degree INNER JOIN dep_deg ON degree.deg_id = dep_deg.deg_id
        WHERE dep_deg.d_id = ? AND degree.status = 'true'`;

      const [results] = await conn.execute(query, [d_id]);

      if (results.length === 0) {
        return next(errorProvider(404, `No degrees found for d_id: ${d_id}`));
      }

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching degrees by d_id:", error);
      return next(errorProvider(500, "Failed to fetch degrees by d_id"));
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getNoOfFaculty = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        "SELECT COUNT(*) AS faculty_count FROM faculty"
      );

      const { faculty_count } = result[0];

      return res.status(200).json({
        count: faculty_count,
      });
    } catch (error) {
      console.error("Error retrieving number of faculty:", error);
      return next(
        errorProvider(500, "An error occurred while the faculty count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getNoOfDepartments = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        "SELECT COUNT(*) AS department_count FROM department"
      );

      const { department_count } = result[0];

      return res.status(200).json({
        count: department_count,
      });
    } catch (error) {
      console.error("Error retrieving number of departments:", error);
      return next(
        errorProvider(500, "An error occurred while the department count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getNoOfDegrees = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        "SELECT COUNT(*) AS degree_count FROM degree"
      );

      const { degree_count } = result[0];

      return res.status(200).json({
        count: degree_count,
      });
    } catch (error) {
      console.error("Error retrieving number of degrees:", error);
      return next(
        errorProvider(500, "An error occurred while the degree count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getNoOfDepartmentsByFaculty = async (req, res, next) => {
  try {
    const { f_id } = req.params;

    if (!f_id) {
      return res.status(400).json({ message: "Faculty ID is required" });
    }

    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        "SELECT COUNT(DISTINCT d_id) AS department_count FROM fac_dep WHERE f_id = ?",
        [f_id]
      );

      const { department_count } = result[0];

      return res.status(200).json({
        count: department_count,
      });
    } catch (error) {
      console.error("Error retrieving number of departments:", error);
      return next(
        errorProvider(500, "An error occurred while  the department count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};
export const getNoOfDegreesByDepartment = async (req, res, next) => {
  try {
    const { d_id } = req.params;

    if (!d_id) {
      return res
        .status(400)
        .json({ message: "Department ID (d_id) is required" });
    }

    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        "SELECT COUNT(DISTINCT deg_id) AS degree_count FROM dep_deg WHERE d_id = ?",
        [d_id]
      );

      const { degree_count } = result[0];

      return res.status(200).json({
        count: degree_count,
      });
    } catch (error) {
      console.error("Error retrieving number of degrees:", error);
      return next(
        errorProvider(500, "An error occurred while  the degree count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};
export const getNoOfDegreesByLevel = async (req, res, next) => {
  try {
    const { levels } = req.params;

    if (!levels) {
      return res.status(400).json({ message: "Levels is required" });
    }

    const conn = await pool.getConnection();
    try {
      const [result] = await conn.execute(
        "SELECT COUNT(*) AS degree_count FROM degree WHERE levels = ?",
        [levels]
      );

      const { degree_count } = result[0];

      return res.status(200).json({
        count: degree_count,
      });
    } catch (error) {
      console.error("Error retrieving degree count by levels:", error);
      return next(
        errorProvider(500, "An error occurred while the degree count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Database connection error:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getActiveFacultiesWithDepartmentsCount = async (
  req,
  res,
  next
) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT f.f_id,f.f_name,COUNT(fd.d_id) AS departments_count FROM faculty f LEFT JOIN fac_dep fd ON f.f_id = fd.f_id where f.status = 'true' GROUP BY fd.f_id`;

      const [results] = await conn.execute(query);

      return res.status(200).json(results);
    } catch (error) {
      console.error(
        "Error fetching active faculties with departments count:",
        error
      );
      return next(
        errorProvider(
          500,
          "Failed to fetching active faculties with departments count"
        )
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getActiveDepartmentsInAFacultyWithDegreesCount = async (
  req,
  res,
  next
) => {
  const { f_id } = req.body;

  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT d.d_id,d.d_name,COUNT(dd.deg_id) AS degrees_count FROM department d LEFT JOIN dep_deg dd ON d.d_id = dd.d_id LEFT JOIN fac_dep fd ON d.d_id = fd.d_id where fd.f_id = ? AND d.status = 'true' GROUP BY dd.d_id`;

      const [results] = await conn.execute(query, [f_id]);

      return res.status(200).json(results);
    } catch (error) {
      console.error(
        "Error fetching active departments with degrees count:",
        error
      );
      return next(
        errorProvider(
          500,
          "Failed to fetching active departments with degrees count"
        )
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getActiveDegreesInADepartmentWithLevelsCount = async (
  req,
  res,
  next
) => {
  const { d_id } = req.body;

  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT deg.deg_id,deg.deg_name,deg.levels FROM degree deg LEFT JOIN  dep_deg dd ON deg.deg_id = dd.deg_id where dd.d_id = ? AND deg.status = 'true'`;

      const [results] = await conn.execute(query, [d_id]);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching active degrees with level count:", error);
      return next(
        errorProvider(500, "Failed to fetching active degrees with level count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};

export const getAllLevelsInADegree = async (req, res, next) => {
  const { deg_id } = req.body;

  try {
    const conn = await pool.getConnection();

    try {
      const query = `SELECT deg.deg_id,deg.deg_name,deg.levels FROM degree deg LEFT JOIN  dep_deg dd ON deg.deg_id = dd.deg_id where dd.d_id = ? AND deg.status = 'true'`;

      const [results] = await conn.execute(query, [deg_id]);

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error fetching active degrees with level count:", error);
      return next(
        errorProvider(500, "Failed to fetching active degrees with level count")
      );
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error establishing database connection:", error);
    return next(errorProvider(500, "Failed to establish database connection"));
  }
};
