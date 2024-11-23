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
  getAllFacultiesWithExtraDetails,
  getAllDepartmentsWithExtraDetails,
} from "../controllers/course.controller.js";

const router = express.Router();

////////FACULTY
router.post("/createFaculty", createFaculty);
router.put("/updateFaculty", updateFaculty);
router.get("/getAllFaculties", getAllFaculties);
router.post("/getFacultyById", getFacultyById);
router.get("/getNoOfFaculty", getNoOfFaculty);
router.post("/getNoOfDepartmentsByFaculty/:f_id", getNoOfDepartmentsByFaculty);
router.get("/getAllFacultiesWithExtraDetails", getAllFacultiesWithExtraDetails);

////////DEPARTMENT
router.post("/createDepartment", createDepartment);
router.put("/updateDepartment", updateDepartment);
router.get("/getAllDepartments", getAllDepartments);
router.post("/getDepartmentById", getDepartmentById);
router.post("/getDepartmentsByFacultyId", getDepartmentsByFacultyId);
router.get("/getNoOfDepartments", getNoOfDepartments);
router.post("/getNoOfDegreesByDepartment/:d_id", getNoOfDegreesByDepartment);
router.get(
  "/getAllDepartmentsWithExtraDetails",
  getAllDepartmentsWithExtraDetails
);

////////DEGREE
router.post("/createDegree", createDegree);
router.put("/updateDegree", updateDegree);
router.get("/getAllDegrees", getAllDegrees);
router.post("/getDegreeById", getDegreeById);
router.post("/getDegreesByDepartmentId", getDegreesByDepartmentId);
router.get("/getNoOfDegrees", getNoOfDegrees);
router.post("/getNoOfDegreesByLevel/:levels", getNoOfDegreesByLevel);

export default router;
