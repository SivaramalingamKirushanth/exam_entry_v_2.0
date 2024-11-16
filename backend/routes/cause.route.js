import express from "express";
import {
  getAllFaculties,
  getFacultyById,
  getAllDepartments,
  getDepartmentById,
} from "../controllers/cause.controller.js";

const router = express.Router();

router.get("/getAllFaculties", getAllFaculties);
router.post("/getFacultyById", getFacultyById);
router.get("/getAllDepartments", getAllDepartments);
router.post("/getDepartmentById", getDepartmentById);

export default router;
