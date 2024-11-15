import express from "express";
import {
  getAllStudents,
  getAllManagers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/getAllStudents", getAllStudents);
router.get("/getAllManagers", getAllManagers);

export default router;
