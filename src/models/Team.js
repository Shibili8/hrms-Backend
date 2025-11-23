import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Team = sequelize.define(
  "team",
  {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    organisation_id: { type: DataTypes.INTEGER, allowNull: false},
    name: { type: DataTypes.STRING, allowNull: false},
    description: { type: DataTypes.TEXT, allowNull: true}
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

export default Team;
