import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  listTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  unassignEmployee
} from "../controllers/teamController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", listTeams);
router.post("/", createTeam);
router.put("/:id", updateTeam);
router.delete("/:id", deleteTeam);

router.post("/:teamId/assign", assignEmployee);
router.delete("/:teamId/unassign", unassignEmployee);  // <— THIS WAS MISSING

export default router;
