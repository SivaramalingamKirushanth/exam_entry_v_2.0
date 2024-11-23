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
} from "../controllers/curriculum.controller.js";

const router = express.Router();

router.get("/getAllCurriculums", getAllCurriculums);
router.get(
  "/getAllCurriculumsWithExtraDetails",
  getAllCurriculumsWithExtraDetails
);
router.post("/getCurriculumById", getCurriculumById);
router.get("/getCurriculumsByLecId", getCurriculumsByLecId);
router.get("/getCurriculumsByHod_id", getCurriculumsByHodId);
router.post("/createCurriculum", createCurriculum);
router.put("/updateCurriculum", updateCurriculum);
router.get("/getNoOfCurriculums", getNoOfCurriculums);

export default router;
