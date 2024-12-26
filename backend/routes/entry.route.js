import express from "express";
import {
  addMedicalResitStudents,
  applyExam,
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
export default router;
