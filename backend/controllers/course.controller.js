import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";

export const createFaculty = async (req, res, next) => {
  let { f_name, email, contact_no, status, m_id } = req.body;

  // Default status to "inactive" if it is not provided or is empty
  if (!status) {
    status = "inactive";
  }

  if (!f_name || !email || !contact_no || !m_id) {
    return next(errorProvider(400, "Missing required fields"));
  }

  // Ensure status is  "active" or "inactive"
  if (status !== "active" && status !== "inactive") {
    return next(errorProvider(400, "Invalid status value"));
  }

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Insert into faculty table
      const [facultyResult] = await conn.execute(
        "INSERT INTO faculty (f_name, email, contact_no, status) VALUES (?, ?, ?, ?)",
        [f_name, email, contact_no, status]
      );
      const f_id = facultyResult.insertId;

      // Insert into fac_dean table
      await conn.execute("INSERT INTO fac_dean (f_id, m_id) VALUES (?, ?)", [
        f_id,
        m_id,
      ]);

      await conn.commit();

      return res
        .status(201)
        .json({ message: "Faculty created successfully", f_id });
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

export const createDepartment = async (req, res, next) => {
  const { d_name, email, contact_no, status, f_id, m_id } = req.body;

  // Validate required fields
  if (!d_name || !email || !contact_no || !f_id || !m_id) {
    return next(errorProvider(400, "Missing required fields"));
  }

  // Validate status active or inactive
  const departmentStatus = status === "active" ? "active" : "inactive";

  try {
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // Check if department already exists
      const [departmentExists] = await conn.execute(
        "SELECT COUNT(*) AS count FROM department WHERE d_name = ? OR email = ?",
        [d_name, email]
      );

      if (departmentExists[0].count > 0) {
        conn.release();
        return next(errorProvider(409, "Department already exists"));
      }

      // Insert into department table
      const [departmentResult] = await conn.execute(
        "INSERT INTO department (d_name, email, contact_no, status) VALUES (?, ?, ?, ?)",
        [d_name, email, contact_no, departmentStatus]
      );
      const d_id = departmentResult.insertId;

      // Insert into dep_hod table
      await conn.execute("INSERT INTO dep_hod (d_id, m_id) VALUES (?, ?)", [
        d_id,
        m_id,
      ]);

      // Insert into fac_dep table
      await conn.execute("INSERT INTO fac_dep (f_id, d_id) VALUES (?, ?)", [
        f_id,
        d_id,
      ]);

      await conn.commit();

      res.status(201).json({
        message: "Department created successfully",
        d_id,
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

export const addDegree = async (req, res, next) => {
  const { deg_name, short, level, status, d_id } = req.body;

  // Validate required fields
  if (!deg_name || !short || !level || !d_id) {
    return next(errorProvider(400, "Missing required fields"));
  }

  // Validate status active or inactive
  const degreeStatus = status === "active" ? "active" : "inactive";

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
        "INSERT INTO degree (deg_name, short, levels, status) VALUES (?, ?, ?, ?)",
        [deg_name, short, level, degreeStatus]
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

export const getAllFaculties = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `
          SELECT * FROM faculty`;

      const [results] = await conn.execute(query);

      if (results.length === 0) {
        return next(errorProvider(404, "No faculties found."));
      }

      return res.status(200).json({ faculties: results });
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
  // const { f_id } = req.body;
  const f_id = 1;

  if (!f_id) {
    return next(errorProvider(400, "Missing f_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
          SELECT * FROM faculty WHERE f_id = ? `;

      const [results] = await conn.execute(query, [f_id]);

      if (results.length === 0) {
        return next(errorProvider(404, `No faculty found for f_id: ${f_id}`));
      }

      return res.status(200).json({ faculty: results[0] });
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
        SELECT * FROM department`;

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

export const getDepartmentById = async (req, res, next) => {
  // const { d_id } = req.body;
  const d_id = 1;

  if (!d_id) {
    return next(errorProvider(400, "Missing d_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT * FROM department WHERE d_id = ?`;

      const [results] = await conn.execute(query, [d_id]);

      if (results.length === 0) {
        return next(
          errorProvider(404, `No department found for d_id: ${d_id}`)
        );
      }

      return res.status(200).json({ department: results[0] });
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
        SELECT * FROM degree`;

      const [results] = await conn.execute(query);

      if (results.length === 0) {
        return next(errorProvider(404, "No degrees found."));
      }

      return res.status(200).json({ degrees: results });
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

export const getDegreeById = async (req, res, next) => {
  // const { deg_id } = req.body;
  const deg_id = 1;

  if (!deg_id) {
    return next(errorProvider(400, "Missing deg_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT * FROM degree WHERE deg_id = ?`;

      const [results] = await conn.execute(query, [deg_id]);

      if (results.length === 0) {
        return next(
          errorProvider(404, `No degree found for deg_id: ${deg_id}`)
        );
      }

      return res.status(200).json({ degree: results[0] });
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

export const getDepartmentsByFacultyId = async (req, res, next) => {
  // const { f_id } = req.body;
  const f_id = 1;

  if (!f_id) {
    return next(errorProvider(400, "Missing f_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
          SELECT * FROM department INNER JOIN fac_dep  ON department.d_id = fac_dep.d_id
          WHERE fac_dep.f_id = ?`;

      const [results] = await conn.execute(query, [f_id]);

      if (results.length === 0) {
        return next(
          errorProvider(404, `No departments found for f_id: ${f_id}`)
        );
      }

      return res.status(200).json({ departments: results });
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
  // const { d_id } = req.body;
  const d_id = 1;

  if (!d_id) {
    return next(errorProvider(400, "Missing d_id."));
  }

  try {
    const conn = await pool.getConnection();

    try {
      const query = `
        SELECT *FROM degree INNER JOIN dep_deg ON degree.deg_id = dep_deg.deg_id
        WHERE dep_deg.d_id = ?`;

      const [results] = await conn.execute(query, [d_id]);

      if (results.length === 0) {
        return next(errorProvider(404, `No degrees found for d_id: ${d_id}`));
      }

      return res.status(200).json({ degrees: results });
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
