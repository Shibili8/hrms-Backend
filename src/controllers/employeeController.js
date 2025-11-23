import Employee from "../models/Employee.js";
import Log from "../models/Log.js";
import { Op } from "sequelize";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const listEmployees = async (req, res) => {
  const employees = await Employee.findAll({
    where: { organisation_id: req.user.orgId },
  });
  res.json(employees);
};

export const getEmployee = async (req, res) => {
  const emp = await Employee.findOne({
    where: { id: req.params.id, organisation_id: req.user.orgId },
  });

  if (!emp) return res.status(404).json({ message: "Employee not found" });

  res.json(emp);
};

export const createEmployee = async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;

  try {
    if (!first_name || !first_name.trim()) {
      return res.status(400).json({ message: "First name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existing = await Employee.findOne({
      where: {
        email,
        organisation_id: req.user.orgId,
      },
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Employee email already exists in this organisation" });
    }

    const emp = await Employee.create({
      organisation_id: req.user.orgId,
      first_name,
      last_name,
      email,
      phone,
    });

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: `User '${req.user.userId}' created employee ${emp.id}.`,
      meta: null,
    });

    res.status(201).json(emp);
  } catch (err) {
    console.error("Create employee error:", err);
    res
      .status(500)
      .json({ message: "Failed to create employee. Please try again." });
  }
};

export const updateEmployee = async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;

  try {
    const emp = await Employee.findOne({
      where: { id: req.params.id, organisation_id: req.user.orgId },
    });

    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (!first_name || !first_name.trim()) {
      return res.status(400).json({ message: "First name is required" });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const duplicate = await Employee.findOne({
      where: {
        email,
        organisation_id: req.user.orgId,
        id: { [Op.ne]: emp.id },
      },
    });

    if (duplicate) {
      return res
        .status(409)
        .json({ message: "Employee email already exists in this organisation" });
    }

    await emp.update({
      first_name,
      last_name,
      email,
      phone,
    });

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: `User '${req.user.userId}' updated employee ${emp.id}.`,
      meta: null,
    });

    res.json(emp);
  } catch (err) {
    console.error("Update employee error:", err);
    res
      .status(500)
      .json({ message: "Failed to update employee. Please try again." });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({
      where: { id: req.params.id, organisation_id: req.user.orgId },
    });

    if (!emp) return res.status(404).json({ message: "Employee not found" });

    await emp.destroy();

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: `User '${req.user.userId}' deleted employee ${req.params.id}.`,
      meta: null,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Delete employee error:", err);
    res
      .status(500)
      .json({ message: "Failed to delete employee. Please try again." });
  }
};
