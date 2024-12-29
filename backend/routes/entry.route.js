import express from "express";
import {
  addAdmissionData,
  addMedicalResitStudents,
  applyExam,
  generateIndexNumbers,
  getLastAssignedIndexNumber,
  getStudentSubjects,
  getStudentsWithoutIndexNumber,
} from "../controllers/entry.controller.js";
import { verifyUser } from "../utils/verifyUsers.js";

const router = express.Router();

router.put("/applyExam", verifyUser(["5"]), applyExam);
router.post("/getStudentSubjects", verifyUser(["1"]), getStudentSubjects);
router.post(
  "/addMedicalResitStudents",
  verifyUser(["1"]),
  addMedicalResitStudents
);
router.post(
  "/getStudentsWithoutIndexNumber",
  verifyUser(["1"]),
  getStudentsWithoutIndexNumber
);
router.post("/generateIndexNumbers", verifyUser(["1"]), generateIndexNumbers);
router.post(
  "/getLastAssignedIndexNumber",
  verifyUser(["1"]),
  getLastAssignedIndexNumber
);
router.post("/addAdmissionData", verifyUser(["1"]), addAdmissionData);
export default router;
