import express from "express";
import { getAllSubjectDetails } from "../controllers/curriculum.controller.js";

const router = express.Router();

router.get("/getAllSubjectDetails/:m_id", getAllSubjectDetails);

export default router;
