import express from "express";
import {
  getCurriculumsByLec_id,
  getCurriculumsByHod_id,
  createCurriculum,
  updateCurriculum,
  getNoOfCurriculums,
} from "../controllers/curriculum.controller.js";

const router = express.Router();

router.get("/getCurriculumsByLec_id", getCurriculumsByLec_id);
router.get("/getCurriculumsByHod_id", getCurriculumsByHod_id);
router.post("/createCurriculum", createCurriculum);
router.put("/updateCurriculum", updateCurriculum);
router.get("/getNoOfCurriculums", getNoOfCurriculums);

export default router;
