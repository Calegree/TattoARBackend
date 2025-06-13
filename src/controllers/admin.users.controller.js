const User = require("../models/User");
const bcrypt = require("bcrypt");

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
  const { fullName, email, password, role } = req.body;
  try {
    // Verifica si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ mensaje: "El email ya está registrado" });
    }
    // Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      role,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
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

// Listar tatuadores
exports.listTattooers = async (req, res) => {
  try {
    const { city, style, search } = req.query;
    const filter = { role: "tattooer" };
    if (city) filter.city = city;
    if (search) filter.fullName = { $regex: search, $options: "i" };
    if (style) filter["styles"] = { $regex: style, $options: "i" };
    const tattooers = await User.find(filter).select("-password -__v");
    res.status(200).json(tattooers);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar tatuadores" });
  }
};
