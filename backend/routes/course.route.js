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
  getNoOfFaculty,
  getNoOfDepartments,
  getNoOfDegrees,
  getNoOfDepartmentsByFaculty,
  getNoOfDegreesByDepartment,
  getNoOfDegreesByLevel,
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

router.get("/getNoOfFaculty", getNoOfFaculty);
router.get("/getNoOfDepartments", getNoOfDepartments);
router.get("/getNoOfDegrees", getNoOfDegrees);

router.post("/getNoOfDepartmentsByFaculty/:f_id", getNoOfDepartmentsByFaculty);
router.post("/getNoOfDegreesByDepartment/:d_id", getNoOfDegreesByDepartment);
router.post("/getNoOfDegreesByLevel/:levels", getNoOfDegreesByLevel);

export default router;
