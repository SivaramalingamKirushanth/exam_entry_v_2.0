import express from "express";
import {
  studentRegister,
  managerRegister,
  login,
  me,
  logout,
} from "../controllers/auth.controller.js";
import { verifyUser } from "../utils/verifyUsers.js";

const router = express.Router();

router.post("/studentRegister", studentRegister);
router.post("/managerRegister", managerRegister);
router.get("/me", verifyUser(["1", "2", "3", "4", "5"]), me);
router.post("/login", login);
router.post("/logout", logout);

export default router;
