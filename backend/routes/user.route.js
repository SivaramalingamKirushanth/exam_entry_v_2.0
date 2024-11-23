import express from "express";
import {
  getAllStudents,
  getAllManagers,
  updateStudent,
  updateManager,
  getAllHods,
  getAllDeans,
  getManagerById,
  deleteUser,
  getStudentById,
  getNoOfManagers,
  getNoOfStudents,
  getAllActiveManagers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/getAllStudents", getAllStudents);
router.get("/getAllManagers", getAllManagers);

router.get("/getAllActiveManagers", getAllActiveManagers);

router.post("/getManagerById", getManagerById);
router.post("/getStudentById", getStudentById);

router.put("/updateStudent", updateStudent);
router.put("/updateManager", updateManager);

router.get("/getAllHods", getAllHods);
router.get("/getAllDeans", getAllDeans);

router.delete("/deleteUser", deleteUser);

router.get("/getNoOfManagers", getNoOfManagers);
router.get("/getNoOfStudents", getNoOfStudents);
export default router;
