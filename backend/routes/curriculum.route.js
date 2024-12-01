import express from "express";
import {
  getCurriculumsByLecId,
  getCurriculumsByHodId,
  createCurriculum,
  updateCurriculum,
  getNoOfCurriculums,
  getAllCurriculums,
  getAllCurriculumsWithExtraDetails,
  getCurriculumById,
  getCurriculumByDegLevSem,
  getCurriculumBybatchId,
  getStudentApplicationDetails,
} from "../controllers/curriculum.controller.js";
import { verifyUser } from "../utils/verifyUsers.js";

const router = express.Router();

router.get("/getAllCurriculums", getAllCurriculums);
router.get(
  "/getAllCurriculumsWithExtraDetails",
  getAllCurriculumsWithExtraDetails
);
router.post("/getCurriculumById", getCurriculumById);
router.post("/getCurriculumByDegLevSem", getCurriculumByDegLevSem);
router.get("/getCurriculumsByLecId", getCurriculumsByLecId);
router.get("/getCurriculumsByHod_id", getCurriculumsByHodId);
router.post("/createCurriculum", createCurriculum);
router.get(
  "/getStudentApplicationDetails",
  verifyUser(["5"]),
  getStudentApplicationDetails
);
router.post("/getCurriculumBybatchId", getCurriculumBybatchId);
router.put("/updateCurriculum", updateCurriculum);
router.get("/getNoOfCurriculums", getNoOfCurriculums);

export default router;
