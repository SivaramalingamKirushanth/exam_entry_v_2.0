import express from "express";
import {
  addStudentsToTheBatchTable,
  createBatch,
  getAllBatches,
  getBatchById,
  getNoOfBatches,
  getStudentsByBatchId,
  updateBatch,
} from "../controllers/batch.controller.js";

const router = express.Router();

router.get("/getAllBatches", getAllBatches);
router.post("/createBatch", createBatch);
router.get("/getNoOfBatches", getNoOfBatches);
router.post("/addStudentsToTheBatchTable", addStudentsToTheBatchTable);
router.post("/getStudentsByBatchId", getStudentsByBatchId);
router.post("/getBatchById", getBatchById);
router.put("/updateBatch", updateBatch);

export default router;
