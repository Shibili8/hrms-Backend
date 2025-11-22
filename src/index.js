import express from "express";
import sequelize from "./db.js";
import dotenv from "dotenv";
import "./models/associations.js"; // Auto-load associations

import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import teamRoutes from "./routes/teams.js";
import logRoutes from "./routes/logs.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Debug
console.log("ENV USER =", process.env.DB_USER);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/logs", logRoutes);

// Health check
app.get("/api/health", (_, res) => res.send({ status: "ok" }));

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB Authenticated");

    await sequelize.sync();
    console.log("DB Synced");

    app.listen(PORT, () => console.log("Server running on " + PORT));
  } catch (err) {
    console.error("Startup error:", err);
  }
})();
