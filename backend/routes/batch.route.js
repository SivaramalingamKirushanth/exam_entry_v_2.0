import express from "express";
import {
  addStudentsToTheBatchTable,
  createBatch,
  getAllBatches,
  getBatchByFacultyId,
  getBatchById,
  getBathchesByStudent,
  getNoOfBatches,
  getStudentsByBatchId,
  updateBatch,
} from "../controllers/batch.controller.js";
import { verifyUser } from "../utils/verifyUsers.js";

const router = express.Router();

router.get("/getAllBatches", verifyUser(["1"]), getAllBatches);
router.post("/createBatch", verifyUser(["1"]), createBatch);
router.get("/getNoOfBatches", getNoOfBatches);
router.get("/getBathchesByStudent", verifyUser(["5"]), getBathchesByStudent);
router.post(
  "/addStudentsToTheBatchTable",
  verifyUser(["1"]),
  addStudentsToTheBatchTable
);
router.post("/getStudentsByBatchId", verifyUser(["1"]), getStudentsByBatchId);
router.post("/getBatchById", verifyUser(["1"]), getBatchById);
router.post("/getBatchByFacultyId", verifyUser(["1,2"]), getBatchByFacultyId);
router.put("/updateBatch", verifyUser(["1"]), updateBatch);

export default router;
