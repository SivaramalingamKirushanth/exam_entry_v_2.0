import express from "express";
import {
  getAllStudents,
  getAllManagers,
  updateStudent,
  updateManager,
  getAllHODs,
  getAllDeans,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/getAllStudents", getAllStudents);
router.get("/getAllManagers", getAllManagers);
router.put("/updateStudent", updateStudent);
router.put("/updateManager", updateManager);

router.get("/getAllHODs", getAllHODs);
router.get("/getAllDeans", getAllDeans);

export default router;
