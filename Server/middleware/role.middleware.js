/**
 * Role-based authorization middleware
 * Usage:
 * router.get(
 *   "/admin",
 *   authMiddleware,
 *   roleMiddleware("admin"),
 *   controller
 * );
 */

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // authMiddleware must run before this
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. User not authenticated.",
      });
    }

    // Check role
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden. You do not have permission to access this resource.",
      });
    }

    // User has required role
    next();
  };
};

module.exports = roleMiddleware;
