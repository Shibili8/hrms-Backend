import Team from "../models/Team.js";
import EmployeeTeam from "../models/EmployeeTeam.js";
import Employee from "../models/Employee.js";
import Log from "../models/Log.js";

export const listTeams = async (req, res) => {
  const teams = await Team.findAll({
    where: { organisation_id: req.user.orgId },
    include: [
      {
        model: EmployeeTeam,
        as: "members",
        include: [
          {
            model: Employee,
            as: "employee"
          }
        ]
      }
    ]
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
    action: `User '${req.user.userId}' created team ${team.id}.`,
    meta: null
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
    action: `User '${req.user.userId}' updated team ${team.id}.`,
    meta: null
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
    action: `User '${req.user.userId}' deleted team ${req.params.id}.`,
    meta: null
  });

  res.json({ success: true });
};

export const assignEmployee = async (req, res) => {
  const { employeeId } = req.body;
  const { teamId } = req.params;

  await EmployeeTeam.create({
    employee_id: employeeId,
    team_id: teamId
  });

  await Log.create({
    organisation_id: req.user.orgId,
    user_id: req.user.userId,
    action: `User '${req.user.userId}' assigned employee ${employeeId} to team ${teamId}.`,
    meta: null
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
    action: `User '${req.user.userId}' unassigned employee ${employeeId} from team ${teamId}.`,
    meta: null
  });

  res.json({ success: true });
};
