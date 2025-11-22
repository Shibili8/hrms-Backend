import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Log = sequelize.define(
  "log",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    organisation_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    action: DataTypes.STRING,
    meta: DataTypes.JSONB,
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
);

export default Log;
