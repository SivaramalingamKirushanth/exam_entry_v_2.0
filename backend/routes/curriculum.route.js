import express from "express";
import {
  getCurriculumsByLec_id,
  getCurriculumsByHod_id,
} from "../controllers/curriculum.controller.js";

const router = express.Router();

router.get("/getCurriculumsByLec_id", getCurriculumsByLec_id);
router.get("/getCurriculumsByHod_id", getCurriculumsByHod_id);

export default router;
