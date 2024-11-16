import pool from "../config/db.js";
import errorProvider from "../utils/errorProvider.js";

export const getAllFaculties = async (req, res, next) => {
  try {
    const conn = await pool.getConnection();

    try {
      const query = `
          SELECT * FROM faculty`;

      const [results] = await conn.execute(query);

      if (results.length === 0) {
        return res.status(404).json({ message: "No faculties found." });
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
        return res
          .status(404)
          .json({ message: `No faculty found for f_id: ${f_id}` });
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
        return res.status(404).json({ message: "No departments found." });
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
        return res
          .status(404)
          .json({ message: `No department found for d_id: ${d_id}` });
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
        return res.status(404).json({ message: "No degrees found." });
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
        return res
          .status(404)
          .json({ message: `No degree found for deg_id: ${deg_id}` });
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

export const getDepartmentsByFaculty = async (req, res, next) => {
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
        return res
          .status(404)
          .json({ message: `No departments found for f_id: ${f_id}` });
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

export const getDegreesByDepartment = async (req, res, next) => {
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
        return res
          .status(404)
          .json({ message: `No degrees found for d_id: ${d_id}` });
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
