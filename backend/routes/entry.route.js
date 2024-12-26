import express from "express";
import {
  addMedicalResitStudents,
  applyExam,
  getStudentSubjects,
  getStudentsWithoutIndexNumber,
} from "../controllers/entry.controller.js";
import { verifyUser } from "../utils/verifyUsers.js";

const router = express.Router();