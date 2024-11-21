import express from "express";
import { createBatch } from "../controllers/batch.controller.js";

const router = express.Router();

router.post("/createBatch", createBatch);

export default router;
