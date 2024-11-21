import express from "express";
import {
  createFaculty,
  updateFaculty,
  createDepartment,
  updateDepartment,
  createDegree,
  updateDegree,
  getAllFaculties,
  getFacultyById,
  getAllDepartments,
  getDepartmentById,
  getDegreeById,
  getAllDegrees,
  getDepartmentsByFacultyId,
  getDegreesByDepartmentId,
} from "../controllers/course.controller.js";

const router = express.Router();

router.post("/createFaculty", createFaculty);
router.put("/updateFaculty", updateFaculty);

router.post("/createDepartment", createDepartment);
router.put("/updateDepartment", updateDepartment);

router.post("/createDegree", createDegree);
router.put("/updateDegree", updateDegree);

router.get("/getAllFaculties", getAllFaculties);
router.post("/getFacultyById", getFacultyById);

router.get("/getAllDepartments", getAllDepartments);
router.post("/getDepartmentById", getDepartmentById);

router.get("/getAllDegrees", getAllDegrees);
router.post("/getDegreeById", getDegreeById);

router.post("/getDepartmentsByFacultyId", getDepartmentsByFacultyId);
router.post("/getDegreesByDepartmentId", getDegreesByDepartmentId);

export default router;
