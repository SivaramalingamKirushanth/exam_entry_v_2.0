import express from "express";
import {
  getCurriculumsByLec_id,
  getCurriculumsByHod_id,
  createCurriculum,
  updateCurriculum,
} from "../controllers/curriculum.controller.js";

const router = express.Router();

router.get("/getCurriculumsByLec_id", getCurriculumsByLec_id);
router.get("/getCurriculumsByHod_id", getCurriculumsByHod_id);
router.post("/createCurriculum", createCurriculum);
router.put("/updateCurriculum", updateCurriculum);

export default router;
