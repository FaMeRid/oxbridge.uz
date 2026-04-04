const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
};

const PERMISSIONS = {
  student: [
    "read:own_profile",
    "update:own_profile",
    "read:own_submissions",
    "create:submission",
    "read:tests",
    "read:own_results",
  ],
  teacher: [
    "read:own_profile",
    "update:own_profile",
    "read:own_submissions",
    "create:submission",
    "read:tests",
    "read:own_results",
    "read:students",
    "read:student_submissions",
    "update:submission_grade",
    "create:assignment",
    "read:class_analytics",
  ],
  admin: [
    "read:own_profile",
    "update:own_profile",
    "read:own_submissions",
    "create:submission",
    "read:tests",
    "read:own_results",
    "read:students",
    "read:student_submissions",
    "update:submission_grade",
    "create:assignment",
    "read:class_analytics",
    "create:test",
    "update:test",
    "delete:test",
    "read:all_users",
    "update:user_role",
    "delete:user",
    "read:system_analytics",
    "read:logs",
  ],
};

module.exports = { ROLES, PERMISSIONS };