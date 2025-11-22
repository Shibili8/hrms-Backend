import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define(
  "user",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: DataTypes.INTEGER,
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: DataTypes.STRING,
    name: DataTypes.STRING,
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default User;
