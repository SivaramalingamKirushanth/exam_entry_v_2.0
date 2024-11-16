import express from "express";
import {
  getAllFaculties,
  getFacultyById,
  getAllDepartments,
  getDepartmentById,
  getDegreeById,
  getAllDegrees,
} from "../controllers/cause.controller.js";

const router = express.Router();

router.get("/getAllFaculties", getAllFaculties);
router.post("/getFacultyById", getFacultyById);
router.get("/getAllDepartments", getAllDepartments);
router.post("/getDepartmentById", getDepartmentById);
router.get("/getAllDegrees", getAllDegrees);
router.post("/getDegreeById", getDegreeById);

export default router;
