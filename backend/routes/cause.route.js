import express from "express";
import {
  getAllFaculties,
  getFacultyById,
  getAllDepartments,
  getDepartmentById,
  getDegreeById,
  getAllDegrees,
  getDepartmentsByFaculty,
  getDegreesByDepartment,
} from "../controllers/cause.controller.js";

const router = express.Router();

router.get("/getAllFaculties", getAllFaculties);
router.post("/getFacultyById", getFacultyById);
router.get("/getAllDepartments", getAllDepartments);
router.post("/getDepartmentById", getDepartmentById);
router.get("/getAllDegrees", getAllDegrees);
router.post("/getDegreeById", getDegreeById);
router.post("/getDepartmentsByFaculty", getDepartmentsByFaculty);
router.post("/getDegreesByDepartment", getDegreesByDepartment);

export default router;
