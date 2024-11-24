import express from "express";
import {
  createBatch,
  getAllBatches,
  getNoOfBatches,
} from "../controllers/batch.controller.js";

const router = express.Router();

router.get("/getAllBatches", getAllBatches);
router.post("/createBatch", createBatch);
router.get("/getNoOfBatches", getNoOfBatches);

export default router;
