const { PERMISSIONS } = require("../constants/roles");

const authorize = (...allowedPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userPermissions = PERMISSIONS[req.user.role] || [];
    const hasPermission = allowedPermissions.some((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};

module.exports = authorize;