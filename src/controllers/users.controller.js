const User = require("../models/user");

// Crear usuario normal
exports.createUser = async (req, res) => {
  try {
    const nuevoUsuario = new User(req.body);
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ mensaje: "Solicitud no válida" });
  }
};

// Obtener perfil propio (ejemplo)
exports.getProfile = async (req, res) => {
  // Implementa lógica según autenticación
  res.json({ mensaje: "Perfil de usuario" });
};
