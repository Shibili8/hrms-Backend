import Organisation from "./Organisation.js";
import User from "./User.js";
import Employee from "./Employee.js";
import Team from "./Team.js";
import EmployeeTeam from "./EmployeeTeam.js";
import Log from "./Log.js";

// -------------------------
// Organisation relations
// -------------------------
User.belongsTo(Organisation, { foreignKey: "organisation_id" });
Organisation.hasMany(User, { foreignKey: "organisation_id" });

Employee.belongsTo(Organisation, { foreignKey: "organisation_id" });
Organisation.hasMany(Employee, { foreignKey: "organisation_id" });

Team.belongsTo(Organisation, { foreignKey: "organisation_id" });
Organisation.hasMany(Team, { foreignKey: "organisation_id" });

// -------------------------
// Employee-Team relations (M2M through EmployeeTeam)
// -------------------------

// EmployeeTeam belongs to Employee
EmployeeTeam.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee"
});

// EmployeeTeam belongs to Team
EmployeeTeam.belongsTo(Team, {
  foreignKey: "team_id",
  as: "team"
});

// Team → many EmployeeTeam records
Team.hasMany(EmployeeTeam, {
  foreignKey: "team_id",
  as: "members"
});

// Employee → many EmployeeTeam records
Employee.hasMany(EmployeeTeam, {
  foreignKey: "employee_id",
  as: "teamLinks"
});

// Many-to-many connector
Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: "employee_id",
});

Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: "team_id",
});

// -------------------------
// Logs
// -------------------------
Log.belongsTo(User, { foreignKey: "user_id" });
Log.belongsTo(Organisation, { foreignKey: "organisation_id" });

export {
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log,
};
