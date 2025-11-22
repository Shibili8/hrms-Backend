import Team from "../models/Team.js";
import EmployeeTeam from "../models/EmployeeTeam.js";
import Log from "../models/Log.js";

export const listTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { organisation_id: req.user.orgId },
    });
    res.json(teams);
  } catch (err) {
    console.error("Error listing teams:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTeam = async (req, res) => {
  try {
    const team = await Team.create({
      organisation_id: req.user.orgId,
      ...req.body,
    });

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: "team_created",
      meta: { teamId: team.id },
    });

    res.status(201).json(team);
  } catch (err) {
    console.error("Error creating team:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const assignEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const { teamId } = req.params;

    await EmployeeTeam.create({
      employee_id: employeeId,
      team_id: teamId,
    });

    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: "employee_assigned_to_team",
      meta: { employeeId, teamId },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error assigning employee:", err);
    res.status(500).json({ message: "Server error" });
  }
};
