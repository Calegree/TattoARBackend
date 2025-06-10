// Lógica de negocio (crear, listar, etc)
const Usuario = require('../models/Usuario');

exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
};
