import express from "express";
import {
  getSubjectsByLecId,
  createSubject,
  updateSubject,
  getNoOfSubjects,
  getAllSubjects,
  getAllSubjectsWithExtraDetails,
  getSubjectById,
  getSubjectByDegLevSem,
  getSubjectBybatchId,
  getStudentApplicationDetails,
  getSubjectsByDid,
  getAllSubjectsForLecturer,
  updateEligibility,
  updateSubjectStatus,
  updateMultipleEligibility,
  checkSubjectExist,
  getAllSubjectsForDepartment,
  getAllSubjectsForFaculty,
  createSyllabus,
} from "../controllers/curriculum.controller.js";
import { verifyUser } from "../utils/verifyUsers.js";

const router = express.Router();

router.get("/getAllSubjects", verifyUser(["1"]), getAllSubjects);
router.get(
  "/getAllSubjectsWithExtraDetails",
  verifyUser(["1"]),

  getAllSubjectsWithExtraDetails
);
router.post("/getSubjectById", verifyUser(["1"]), getSubjectById);
router.post("/getSubjectByDegLevSem", verifyUser(["1"]), getSubjectByDegLevSem);
router.get("/getSubjectsByLecId", verifyUser(["1"]), getSubjectsByLecId);
router.get("/getSubjectsByHod_id", verifyUser(["1"]), getSubjectsByDid);
router.post("/createSubject", verifyUser(["1"]), createSubject);
router.get(
  "/getStudentApplicationDetails",
  verifyUser(["5"]),
  getStudentApplicationDetails
);
router.post(
  "/getSubjectBybatchId",
  verifyUser(["1", "2", "3", "4", "5"]),
  getSubjectBybatchId
);
router.put("/updateSubject", verifyUser(["1"]), updateSubject);
router.put("/updateSubjectStatus", verifyUser(["1"]), updateSubjectStatus);
router.get("/getNoOfSubjects", verifyUser(["1"]), getNoOfSubjects);
router.get(
  "/getAllSubjectsForLecturer",
  verifyUser(["4"]),
  getAllSubjectsForLecturer
);
router.get(
  "/getAllSubjectsForDepartment",
  verifyUser(["3"]),
  getAllSubjectsForDepartment
);
router.get(
  "/getAllSubjectsForFaculty",
  verifyUser(["2"]),
  getAllSubjectsForFaculty
);

router.put(
  "/updateEligibility",
  verifyUser(["1", "2", "3", "4"]),
  updateEligibility
);
router.put(
  "/updateMultipleEligibility",
  verifyUser(["1", "2", "3", "4"]),
  updateMultipleEligibility
);
router.post("/checkSubjectExist", verifyUser(["4"]), checkSubjectExist);
router.post("/createSyllabus", verifyUser(["1"]), createSyllabus);

export default router;
