import express from "express";
import {
  createFaculty,
  getAllFaculties,
  getFacultyById,
  getAllDepartments,
  getDepartmentById,
  getDegreeById,
  getAllDegrees,
  getDepartmentsByFaculty,
  getDegreesByDepartment,
} from "../controllers/course.controller.js";

const router = express.Router();

router.post("/createFaculty", createFaculty);

router.get("/getAllFaculties", getAllFaculties);
router.post("/getFacultyById", getFacultyById);
router.get("/getAllDepartments", getAllDepartments);
router.post("/getDepartmentById", getDepartmentById);
router.get("/getAllDegrees", getAllDegrees);
router.post("/getDegreeById", getDegreeById);
router.post("/getDepartmentsByFaculty", getDepartmentsByFaculty);
router.post("/getDegreesByDepartment", getDegreesByDepartment);

export default router;
