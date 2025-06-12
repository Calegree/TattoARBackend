const User = require("../models/user");

// Listar usuarios
exports.listUsers = async (req, res) => {
  try {
    const { role, city, email } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (city) filter.city = city;
    if (email) filter.email = email;
    const users = await User.find(filter);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar usuarios" });
  }
};

// Crear usuario
exports.createUser = async (req, res) => {
  try {
    const nuevoUsuario = new User(req.body);
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(400).json({ mensaje: "Solicitud no válida" });
  }
};

// Detallar usuario
exports.getUser = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.userId);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const usuario = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ mensaje: "Solicitud no válida" });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(204).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};

// Cambiar estado de usuario
exports.changeStatus = async (req, res) => {
  try {
    const usuario = await User.findByIdAndUpdate(
      req.params.userId,
      { status: req.body.status },
      { new: true }
    );
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(400).json({ mensaje: "Solicitud no válida" });
  }
};
