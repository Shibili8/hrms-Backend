import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { listEmployees, createEmployee } from "../controllers/employeeController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listEmployees);
router.post("/", createEmployee);

export default router;
