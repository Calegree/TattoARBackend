const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const r2 = require("../config/r2.config");

// Función para subir archivos a R2
const uploadToR2 = async (buffer, fileName, mimetype) => {
  const params = {
    Bucket: process.env.R2_BUCKET,
    Key: `profileImg/${fileName}`,
    Body: buffer,
    ContentType: mimetype,
  };

  try {
    const result = await r2.upload(params).promise();
    
    // Generar URL pública personalizada
    // Si tienes un dominio personalizado configurado en R2
    if (process.env.R2_DEV_ENDPOINT) {
      return `${process.env.R2_DEV_ENDPOINT}/profileImg/${fileName}`;
    }
    
    // Si no tienes dominio personalizado, usar la URL directa de R2
    return result.Location;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw error;
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Subir imagen de perfil
exports.uploadProfileImage = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No se envió ningún archivo." });
      }

      // Sube el archivo a R2 y obtén la URL
      const ext = path.extname(req.file.originalname);
      const fileName = `profile_${Date.now()}${ext}`;
      const url = await uploadToR2(
        req.file.buffer,
        fileName,
        req.file.mimetype
      );

      return res.json({ url });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al subir la imagen." });
    }
  },
];

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
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ mensaje: "Error al listar usuarios" });
  }
};

// Crear usuario
const { createUserService } = require("../services/user.service");

exports.createUser = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    const user = await createUserService({ fullName, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    console.error("Error al crear usuario:", err);
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
    console.error("Error al obtener usuario:", error);
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
    console.error("Error al actualizar usuario:", error);
    res.status(400).json({ mensaje: "Solicitud no válida" });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(204).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
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
    console.error("Error al cambiar estado de usuario:", error);
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
    console.error("Error al listar tatuadores:", error);
    res.status(500).json({ mensaje: "Error al listar tatuadores" });
  }
};
