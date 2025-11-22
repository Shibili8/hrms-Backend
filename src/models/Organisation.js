import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Organisation = sequelize.define(
  "organisation",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Organisation;
