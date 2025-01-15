import express from "express";
import {
  studentRegister,
  managerRegister,
  login,
  me,
  logout,
  multipleStudentsRegister,
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
router.post("/managerRegister", verifyUser(["1"]), managerRegister);
router.get("/me", verifyUser(["1", "2", "3", "4", "5"]), me);
router.post("/login", login);
router.post("/logout", logout);

export default router;
