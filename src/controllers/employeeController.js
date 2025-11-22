import Employee from "../models/Employee.js";
import Log from "../models/Log.js";

export const listEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { organisation_id: req.user.orgId },
    });

    res.json(employees);
  } catch (err) {
    console.error("Error listing employees:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create({
      organisation_id: req.user.orgId,
      ...req.body,
    });

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: "employee_created",
      meta: { employeeId: employee.id },
    });

    res.status(201).json(employee);
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ message: "Server error" });
  }
};
