const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ code: 401, message: "No autorizado" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res
        .status(401)
        .json({ code: 401, message: "Usuario no encontrado" });
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ code: 401, message: "Token inválido o expirado" });
  }
};

