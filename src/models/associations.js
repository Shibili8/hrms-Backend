import Organisation from "./Organisation.js";
import User from "./User.js";
import Employee from "./Employee.js";
import Team from "./Team.js";
import EmployeeTeam from "./EmployeeTeam.js";
import Log from "./Log.js";

// User belongs to organisation
User.belongsTo(Organisation, { foreignKey: "organisation_id" });
Organisation.hasMany(User, { foreignKey: "organisation_id" });

// Employee relations
Employee.belongsTo(Organisation, { foreignKey: "organisation_id" });
Organisation.hasMany(Employee, { foreignKey: "organisation_id" });

// Team relations
Team.belongsTo(Organisation, { foreignKey: "organisation_id" });
Organisation.hasMany(Team, { foreignKey: "organisation_id" });

// Many-to-many employee <-> team
Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: "employee_id"
});

Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: "team_id"
});

// Logs
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
