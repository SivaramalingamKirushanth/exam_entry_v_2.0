import express from "express";
import {
  createBatch,
  createCurriculumLecture,
} from "../controllers/batch.controller.js";

const router = express.Router();

router.post("/createBatch", createBatch);
router.post("/createCurriculumLecture", createCurriculumLecture);

export default router;