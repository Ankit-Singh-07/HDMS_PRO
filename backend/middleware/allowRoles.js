/**
 * Role based access control middleware
 * Usage: allowRoles("doctor"), allowRoles("patient"), allowRoles("admin")
 */

const allowRoles = (...roles) => {
  return (req, res, next) => {
    // Safety check
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "UNAUTHORIZED" });
    }

    // Role check
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "ACCESS_DENIED 🚫" });
    }

    next();
  };
};

module.exports = allowRoles;
