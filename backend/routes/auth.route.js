import express from "express";
import {
  studentRegister,
  lecturerRegister,
  login,
  me,
  logout,
  multipleStudentsRegister,
  resetPassword,
  forgotPassword,
  changePassword,
  multipleLecturersRegister,
} from "../controllers/auth.controller.js";
import { verifyUser } from "../utils/verifyUsers.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/studentRegister", verifyUser(["1"]), studentRegister);
router.post(
  "/multipleStudentsRegister",
  verifyUser(["1"]),
  upload.single("file"),
  multipleStudentsRegister
);
router.post("/lecturerRegister", verifyUser(["1"]), lecturerRegister);
router.post(
  "/multipleLecturersRegister",
  verifyUser(["1"]),
  upload.single("file"),
  multipleLecturersRegister
);
router.get("/me", verifyUser(["1", "2", "3", "4", "5"]), me);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post(
  "/changePassword",
  verifyUser(["1", "2", "3", "4", "5"]),
  changePassword
);

export default router;
