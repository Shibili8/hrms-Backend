import Organisation from "./Organisation.js";
import User from "./User.js";
import Employee from "./Employee.js";
import Team from "./Team.js";
import EmployeeTeam from "./EmployeeTeam.js";
import Log from "./Log.js";

User.belongsTo(Organisation, { foreignKey: "organisation_id" });
Organisation.hasMany(User, { foreignKey: "organisation_id" });

Employee.belongsTo(Organisation, { foreignKey: "organisation_id" });
Organisation.hasMany(Employee, { foreignKey: "organisation_id" });

Team.belongsTo(Organisation, { foreignKey: "organisation_id" });
Organisation.hasMany(Team, { foreignKey: "organisation_id" });

EmployeeTeam.belongsTo(Employee, {
  foreignKey: "employee_id",
  as: "employee",
  include: ["employee"]
});

EmployeeTeam.belongsTo(Team, {
  foreignKey: "team_id",
  as: "team"
});

Team.hasMany(EmployeeTeam, {
  foreignKey: "team_id",
  as: "members"
});


Employee.hasMany(EmployeeTeam, {
  foreignKey: "employee_id",
  as: "teamLinks"
});


Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: "employee_id",
});

Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: "team_id",
});


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
