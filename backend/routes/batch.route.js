import express from "express";
import {
  createBatch,
  getNoOfBatches,
} from "../controllers/batch.controller.js";

const router = express.Router();

router.post("/createBatch", createBatch);
router.get("/getNoOfBatches", getNoOfBatches);

export default router;
