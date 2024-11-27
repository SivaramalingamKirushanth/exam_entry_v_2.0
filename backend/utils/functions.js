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
      batch_id: input,
    };
  } else {
    throw new Error("Invalid format");
  }
}
