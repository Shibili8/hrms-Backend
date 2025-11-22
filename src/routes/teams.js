import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  listTeams,
  createTeam,
  assignEmployee
} from "../controllers/teamController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listTeams);
router.post("/", createTeam);
router.post("/:teamId/assign", assignEmployee);

export default router;
