import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Employee = sequelize.define(
  "employee",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
  },
  { timestamps: true, createdAt: "created_at", updatedAt: false }
);

export default Employee;
