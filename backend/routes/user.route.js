import express from "express";
import {
  getAllStudents,
  getAllManagers,
  updateStudent,
  updateManager,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/getAllStudents", getAllStudents);
router.get("/getAllManagers", getAllManagers);
router.put("/updateStudent", updateStudent);
router.put("/updateManager", updateManager);

export default router;
