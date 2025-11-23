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
  const { first_name, last_name, email, phone } = req.body;

  if (!first_name?.trim()) {
    return res.status(400).json({ message: "First name is required" });
  }
  if (!last_name?.trim()) {
    return res.status(400).json({ message: "Last name is required" });
  }
  if (!email?.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const existing = await Employee.findOne({
    where: { email, organisation_id: req.user.orgId }
  });

  if (existing) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const emp = await Employee.create({
    organisation_id: req.user.orgId,
    first_name,
    last_name,
    email,
    phone
  });

  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: `User '${req.user.userId}' created employee ${emp.id}.`,
  });

  res.status(201).json(emp);
};

export const updateEmployee = async (req, res) => {
  const { first_name, last_name, email } = req.body;

  if (!first_name?.trim()) {
    return res.status(400).json({ message: "First name is required" });
  }
  if (!last_name?.trim()) {
    return res.status(400).json({ message: "Last name is required" });
  }
  if (!email?.trim()) {
    return res.status(400).json({ message: "Email is required" });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  const emp = await Employee.findOne({
    where: { id: req.params.id, organisation_id: req.user.orgId }
  });

  if (!emp) return res.status(404).json({ message: "Employee not found" });

  const duplicate = await Employee.findOne({
    where: {
      email,
      organisation_id: req.user.orgId,
      id: { $ne: emp.id }
    }
  });

  if (duplicate) {
    return res.status(400).json({ message: "Email already exists" });
  }

  await emp.update(req.body);

  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: `User '${req.user.userId}' updated employee ${emp.id}.`,
  });

  res.json(emp);
};


export const deleteEmployee = async (req, res) => {
  const emp = await Employee.findOne({
    where: { id: req.params.id, organisation_id: req.user.orgId }
  });

  if (!emp) return res.status(404).json({ message: "Not found" });

  await emp.destroy();


  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: `User '${req.user.userId}' deleted employee ${req.params.id}.`,
    meta: null
  });

  res.json({ success: true });
};
