import Employee from "../models/Employee.js";
import Log from "../models/Log.js";

export const listEmployees = async (req, res) => {
  const employees = await Employee.findAll({
    where: { organisation_id: req.user.orgId }
  });
  res.json(employees);
};

export const getEmployee = async (req, res) => {
  const emp = await Employee.findOne({
    where: { id: req.params.id, organisation_id: req.user.orgId }
  });

  if (!emp) return res.status(404).json({ message: "Not found" });

  res.json(emp);
};

export const createEmployee = async (req, res) => {
  const emp = await Employee.create({
    organisation_id: req.user.orgId,
    ...req.body
  });

  // ⭐ Log in required readable format
  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: `User '${req.user.userId}' created employee ${emp.id}.`,
    meta: null
  });

  res.status(201).json(emp);
};

export const updateEmployee = async (req, res) => {
  const emp = await Employee.findOne({
    where: { id: req.params.id, organisation_id: req.user.orgId }
  });

  if (!emp) return res.status(404).json({ message: "Not found" });

  await emp.update(req.body);

  // ⭐ Log readable update message
  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: `User '${req.user.userId}' updated employee ${emp.id}.`,
    meta: null
  });

  res.json(emp);
};

export const deleteEmployee = async (req, res) => {
  const emp = await Employee.findOne({
    where: { id: req.params.id, organisation_id: req.user.orgId }
  });

  if (!emp) return res.status(404).json({ message: "Not found" });

  await emp.destroy();

  // ⭐ Log readable delete message
  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: `User '${req.user.userId}' deleted employee ${req.params.id}.`,
    meta: null
  });

  res.json({ success: true });
};
