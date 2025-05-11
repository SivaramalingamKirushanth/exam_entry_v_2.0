import crypto from "crypto";
import bcrypt from "bcrypt";

export const generatePassword = async (length = 12) => {
  return crypto.randomBytes(length).toString("base64").slice(0, length);
};

export const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const verifyPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Password verification failed");
  }
};

export function parseString(input) {
  const regex = /^(\d{4})([A-Za-z()]+)(\d)(\d)$/;
  const match = input.match(regex);

  if (match) {
    const academic_year = match[1];
    const degree_name_short = match[2];
    const level = match[3];
    const sem_no = match[4];

    return {
      academic_year,
      degree_name_short,
      level,
      sem_no,
      batch_code: input,
    };
  } else {
    throw new Error("Invalid format");
  }
}

export function shallowCompare(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  for (let key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

export const fetchEmailsForUserType = async (conn, batchId, userType) => {
  try {
    let query;
    let values;

    if (userType === "4") {
      query = `SELECT u.email, btp.end_date, b.application_open FROM batch_subject_lecturer bsl
               JOIN lecturer l ON bsl.l_id = l.l_id
               JOIN user u ON l.user_id = u.user_id
               JOIN batch_time_periods btp ON btp.batch_id = bsl.batch_id
               JOIN batch b ON b.batch_id = btp.batch_id
               WHERE bsl.batch_id = ? AND btp.user_type = ?`;
      values = [batchId, userType];
    } else if (userType === "3") {
      query = `SELECT u.email, btp.end_date FROM batch b
               JOIN grp_sub gs ON b.grp_id = gs.grp_id
               JOIN subject s ON gs.sub_id = s.sub_id
               JOIN dep_sub ds ON s.sub_id = ds.sub_id
               JOIN department d ON ds.d_id = d.d_id
               JOIN user u ON d.user_id = u.user_id
               JOIN batch_time_periods btp ON btp.batch_id = b.batch_id
               WHERE b.batch_id = ? AND btp.user_type = ?`;
      values = [batchId, userType];
    } else if (userType === "2") {
      query = `SELECT u.email, btp.end_date FROM batch b
               JOIN fac_deg fd ON b.deg_id = fd.deg_id
               JOIN faculty f ON fd.f_id = f.f_id
               JOIN user u ON f.user_id = u.user_id
                JOIN batch_time_periods btp ON btp.batch_id = b.batch_id
               WHERE b.batch_id = ? AND btp.user_type = ?`;
      values = [batchId, userType];
    } else {
      return [];
    }

    const [rows] = await conn.execute(query, values);
    return rows.map((row) => ({
      email: row.email,
      endDate: row.end_date,
    }));
  } catch (error) {
    console.error("Error fetching emails:", error);
    return [];
  }
};
