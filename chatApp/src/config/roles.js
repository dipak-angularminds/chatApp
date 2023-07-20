const allRoles = {
  user: [],
  Administrator: ["admin", "getUsers", "manageUsers"],
  Recruiter: [],
  Interviewer: [],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
