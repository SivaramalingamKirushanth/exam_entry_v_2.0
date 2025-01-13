import express from "express";
import {
  addMedicalResitStudents,
  applyExam,
  createOrUpdateAdmission,
  fetchStudentsWithSubjects,
  fetchStudentWithSubjectsByUserId,
  generateIndexNumbers,
  getBatchAdmissionDetails,
  getLastAssignedIndexNumber,
  getLatestAdmissionTemplate,
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
router.post(
  "/createOrUpdateAdmission",
  verifyUser(["1"]),
  createOrUpdateAdmission
);
router.post(
  "/getLatestAdmissionTemplate",
  verifyUser(["1"]),
  getLatestAdmissionTemplate
);
router.post(
  "/fetchStudentsWithSubjects",
  // verifyUser(["1"]),
  fetchStudentsWithSubjects
);
router.post(
  "/getBatchAdmissionDetails",
  verifyUser(["1", "5"]),
  getBatchAdmissionDetails
);
router.post(
  "/fetchStudentWithSubjectsByUserId",
  verifyUser(["5"]),
  fetchStudentWithSubjectsByUserId
);

export default router;
