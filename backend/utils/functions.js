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
