import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const EmployeeTeam = sequelize.define(
  "employee_team",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "employee_teams", // optional (consistent naming)
  }
);

export default EmployeeTeam;
