import express from "express";
import {
  getAllStudents,
  getAllLecturers,
  updateStudent,
  updateLecturer,
  getLecturerById,
  getStudentById,
  getNoOfLecturers,
  getNoOfStudents,
  getAllActiveLecturers,
  updateStudentStatus,
  updateLecturerStatus,
  getSummaryData,
  getFacStudentByBatchId,
  getVenues,
  createVenue,
  updateVenue,
  getVenueById,
  getStudentsByDeg,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUsers.js";

const router = express.Router();

router.get("/getAllStudents", verifyUser(["1"]), getAllStudents);
router.get("/getAllLecturers", verifyUser(["1"]), getAllLecturers);

router.get("/getAllActiveLecturers", verifyUser(["1"]), getAllActiveLecturers);

router.post("/getLecturerById", verifyUser(["1"]), getLecturerById);
router.post("/getStudentById", verifyUser(["1"]), getStudentById);

router.put("/updateStudent", verifyUser(["1"]), updateStudent);
router.put("/updateStudentStatus", verifyUser(["1"]), updateStudentStatus);
router.put("/updateLecturer", verifyUser(["1"]), updateLecturer);
router.put("/updateLecturerStatus", verifyUser(["1"]), updateLecturerStatus);

router.get("/getNoOfLecturers", verifyUser(["1"]), getNoOfLecturers);
router.get("/getNoOfStudents", verifyUser(["1"]), getNoOfStudents);

router.get("/getSummaryData", verifyUser(["1"]), getSummaryData);

router.post(
  "/getFacStudentByBatchId",
  verifyUser(["1"]),
  getFacStudentByBatchId
);

router.get("/getVenues", verifyUser(["1"]), getVenues);
router.post("/createVenue", verifyUser(["1"]), createVenue);
router.put("/updateVenue", verifyUser(["1"]), updateVenue);
router.post("/getVenueById", verifyUser(["1"]), getVenueById);
router.post("/getStudentsByDeg", verifyUser(["1"]), getStudentsByDeg);

export default router;
