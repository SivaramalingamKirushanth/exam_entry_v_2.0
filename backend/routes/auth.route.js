import express from "express";
import {
  studentRegister,
  managerRegister,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/studentRegister", studentRegister);
router.post("/managerRegister", managerRegister);

export default router;
