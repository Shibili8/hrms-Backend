import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const EmployeeTeam = sequelize.define(
  "employee_team",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employee_id: DataTypes.INTEGER,
    team_id: DataTypes.INTEGER,
    assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
);

export default EmployeeTeam;
