import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import Log from "../models/Log.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const logs = await Log.findAll({
      where: { organisation_id: req.user.orgId },
      order: [["timestamp", "DESC"]],
    });

    res.json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
