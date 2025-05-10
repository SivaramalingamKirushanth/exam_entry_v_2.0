import express from "express";
import {
  getSubjectsByLecId,
  createSubject,
  updateSubject,
  getNoOfSubjects,
  getAllSubjects,
  getAllSubjectsWithExtraDetails,
  getSubjectById,
  getSubjectBybatchId,
  getStudentApplicationDetails,
  getSubjectsByDid,
  getAllSubjectsForLecturer,
  updateEligibility,
  updateSubjectStatus,
  updateMultipleEligibility,
  getAllSubjectsForDepartment,
  getAllSubjectsForFaculty,
  createSyllabus,
  getAllSyllabiWithExtraDetails,
  updateSyllabusStatus,
  getSyllabusById,
  getSyllabiByDegreeId,
  updateSyllabus,
  checkSubjectExistOnBSL,
  getAllSubjectsForGroupCreation,
  createGroup,
  getAllGroupsWithExtraDetails,
  updateGroupStatus,
  getGroupById,
  updateGroup,
  getNoOfGroups,
  getNoOfSyllabi,
  getSubjectsByGrp,
  getGroupsBySylLevSem,
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
router.post("/getSubjectsByGrp", verifyUser(["1"]), getSubjectsByGrp);
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
router.post(
  "/checkSubjectExistOnBSL",
  verifyUser(["4"]),
  checkSubjectExistOnBSL
);
router.post("/createSyllabus", verifyUser(["1"]), createSyllabus);
router.get(
  "/getAllSyllabiWithExtraDetails",
  verifyUser(["1"]),
  getAllSyllabiWithExtraDetails
);
router.put("/updateSyllabusStatus", verifyUser(["1"]), updateSyllabusStatus);
router.post("/getSyllabusById", verifyUser(["1"]), getSyllabusById);
router.post("/getSyllabiByDegreeId", verifyUser(["1"]), getSyllabiByDegreeId);
router.put("/updateSyllabus", verifyUser(["1"]), updateSyllabus);
router.post(
  "/getAllSubjectsForGroupCreation",
  verifyUser(["1"]),
  getAllSubjectsForGroupCreation
);
router.post("/createGroup", verifyUser(["1"]), createGroup);
router.get(
  "/getAllGroupsWithExtraDetails",
  verifyUser(["1"]),
  getAllGroupsWithExtraDetails
);
router.put("/updateGroupStatus", verifyUser(["1"]), updateGroupStatus);
router.post("/getGroupById", verifyUser(["1"]), getGroupById);
router.put("/updateGroup", verifyUser(["1"]), updateGroup);
router.get("/getNoOfGroups", verifyUser(["1"]), getNoOfGroups);
router.get("/getNoOfSyllabi", verifyUser(["1"]), getNoOfSyllabi);
router.post("/getGroupsBySylLevSem", verifyUser(["1"]), getGroupsBySylLevSem);

export default router;
