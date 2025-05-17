import express from "express";
import {
  acceptMedicalResitStudents,
  applyExam,
  applyMedicalExam,
  applyResitExam,
  checkPendingMedicalResitRequests,
  createOrUpdateAdmission,
  createOrUpdateAttendance,
  deleteBatchSubjectEntries,
  fetchStudentsWithSubjects,
  fetchStudentWithSubjectsByUserId,
  generateIndexNumbers,
  getAppliedMedicalStudentsByBatchAndSubject,
  getAppliedResitStudentsByBatchAndSubject,
  getAppliedStudentsForSubject,
  getAppliedStudentsForSubjectOfDepartment,
  getAppliedStudentsForSubjectOfFaculty,
  getBatchAdmissionDetails,
  getDeanDashboardData,
  getEligibleStudentsBySub,
  getHodDashboardData,
  getLastAssignedIndexNumber,
  getLatestAdmissionTemplate,
  getLatestAttendanceTemplate,
  getStudentMedicalResitApplications,
  getStudentSubjects,
  getStudentsWithoutIndexNumber,
  moveToMedical,
  moveToResit,
  rejectMedicalResitApplication,
  updateReference,
  updateVerified,
} from "../controllers/entry.controller.js";
import { verifyUser } from "../utils/verifyUsers.js";

const router = express.Router();

router.post("/applyExam", verifyUser(["5"]), applyExam);
router.post("/applyResitExam", verifyUser(["5"]), applyResitExam);
router.post("/applyMedicalExam", verifyUser(["5"]), applyMedicalExam);
router.post("/getStudentSubjects", verifyUser(["1"]), getStudentSubjects);
router.post(
  "/acceptMedicalResitStudents",
  verifyUser(["1"]),
  acceptMedicalResitStudents
);
router.post(
  "/rejectMedicalResitApplication",
  verifyUser(["1"]),
  rejectMedicalResitApplication
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
  verifyUser(["1"]),
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
router.post(
  "/getEligibleStudentsBySub",
  verifyUser(["1"]),
  getEligibleStudentsBySub
);
router.post(
  "/createOrUpdateAttendance",
  verifyUser(["1"]),
  createOrUpdateAttendance
);
router.post(
  "/getLatestAttendanceTemplate",
  verifyUser(["1"]),
  getLatestAttendanceTemplate
);
router.post(
  "/deleteBatchSubjectEntries",
  verifyUser(["1"]),
  deleteBatchSubjectEntries
);
router.get("/getDeanDashboardData", verifyUser(["2"]), getDeanDashboardData);
router.get("/getHodDashboardData", verifyUser(["3"]), getHodDashboardData);
router.post(
  "/getAppliedStudentsForSubject",
  verifyUser(["1", "4"]),
  getAppliedStudentsForSubject
);
router.post(
  "/getAppliedStudentsForSubjectOfFaculty",
  verifyUser(["2"]),
  getAppliedStudentsForSubjectOfFaculty
);
router.post(
  "/getAppliedStudentsForSubjectOfDepartment",
  verifyUser(["3"]),
  getAppliedStudentsForSubjectOfDepartment
);
router.post(
  "/getAppliedResitStudentsByBatchAndSubject",
  verifyUser(["1", "2", "3", "4"]),
  getAppliedResitStudentsByBatchAndSubject
);
router.post(
  "/getAppliedMedicalStudentsByBatchAndSubject",
  verifyUser(["1", "2", "3", "4"]),
  getAppliedMedicalStudentsByBatchAndSubject
);
router.get(
  "/getStudentMedicalResitApplications",
  verifyUser(["1"]),
  getStudentMedicalResitApplications
);
router.post("/updateReference", verifyUser(["1"]), updateReference);
router.post("/updateVerified", verifyUser(["1"]), updateVerified);
router.post("/moveToMedical", verifyUser(["1"]), moveToMedical);
router.post("/moveToResit", verifyUser(["1"]), moveToResit);
router.get(
  "/checkPendingMedicalResitRequests",
  verifyUser(["1"]),
  checkPendingMedicalResitRequests
);

export default router;
