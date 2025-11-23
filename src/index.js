import express from "express";
import sequelize from "./db.js";
import dotenv from "dotenv";
import "./models/associations.js"; 
import cors from "cors";

import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import teamRoutes from "./routes/teams.js";
import logRoutes from "./routes/logs.js";

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors({
  origin: "https://hrms-backend-4-zf5z.onrender.com/api", 
  credentials: true   
}));

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/logs", logRoutes);

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
