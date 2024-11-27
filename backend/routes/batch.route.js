import express from "express";
import {
  addStudentsToTheBatchTable,
  createBatch,
  getAllBatches,
  getNoOfBatches,
  getStudentsByBatchId,
} from "../controllers/batch.controller.js";

const router = express.Router();

router.get("/getAllBatches", getAllBatches);
router.post("/createBatch", createBatch);
router.get("/getNoOfBatches", getNoOfBatches);
router.post("/addStudentsToTheBatchTable", addStudentsToTheBatchTable);
router.post("/getStudentsByBatchId", getStudentsByBatchId);

export default router;
