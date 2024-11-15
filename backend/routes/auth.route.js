import express from "express";
import {
  studentRegister,
  managerRegister,
  login,
} from "../controllers/auth.controller.js";
import { verifyAdmin } from "../utils/verifyUsers.js";

const router = express.Router();

router.post("/studentRegister", studentRegister);
router.post("/managerRegister", managerRegister);
router.get("/login", login);

export default router;
