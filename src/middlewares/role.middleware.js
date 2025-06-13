module.exports = (requiredRole) => (req, res, next) => {
  if (req.user.role !== requiredRole)
    return res.status(403).json({ code: 403, message: "Acceso denegado" });
  next();
};
