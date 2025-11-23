import Team from "../models/Team.js";
import EmployeeTeam from "../models/EmployeeTeam.js";
import Log from "../models/Log.js";

export const listTeams = async (req, res) => {
  const teams = await Team.findAll({
    where: { organisation_id: req.user.orgId }
  });

  res.json(teams);
};

export const createTeam = async (req, res) => {
  const team = await Team.create({
    organisation_id: req.user.orgId,
    ...req.body
  });

  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: "team_created",
    meta: { teamId: team.id }
  });

  res.status(201).json(team);
};

export const updateTeam = async (req, res) => {
  const team = await Team.findOne({
    where: { id: req.params.id, organisation_id: req.user.orgId }
  });

  if (!team) return res.status(404).json({ message: "Not found" });

  await team.update(req.body);

  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: "team_updated",
    meta: { teamId: team.id }
  });

  res.json(team);
};

export const deleteTeam = async (req, res) => {
  const team = await Team.findOne({
    where: { id: req.params.id, organisation_id: req.user.orgId }
  });

  if (!team) return res.status(404).json({ message: "Not found" });

  await team.destroy();

  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: "team_deleted",
    meta: { teamId: req.params.id }
  });

  res.json({ success: true });
};

export const assignEmployee = async (req, res) => {
  const { employeeId } = req.body;
  const { teamId } = req.params;

  await EmployeeTeam.create({ employee_id: employeeId, team_id: teamId });

  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: "employee_assigned_to_team",
    meta: { employeeId, teamId }
  });

  res.json({ success: true });
};

export const unassignEmployee = async (req, res) => {
  const { employeeId } = req.body;
  const { teamId } = req.params;

  await EmployeeTeam.destroy({
    where: { employee_id: employeeId, team_id: teamId }
  });

  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: "employee_unassigned_from_team",
    meta: { employeeId, teamId }
  });

  res.json({ success: true });
};
