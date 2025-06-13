const User = require("../models/User");
const Report = require("../models/Report");

// Detallar usuario
exports.getMe = async (req, res) => {
  try {
    // Assuming user ID is available in req.user.id (e.g., after authentication middleware)
     const usuario = await User.findById(req.user.id);
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ mensaje: "Error al obtener usuario" });
  }
};

exports.listTattooers = async (req, res) => {
  try {
    const { city, style, search } = req.query;
    const filter = { role: "tattooer" };

    if (city) filter.city = city;
    if (search) filter.fullName = { $regex: search, $options: "i" };
    if (style) filter["styles"] = { $regex: style, $options: "i" }; // si tienes un campo styles

    const tattooers = await User.find(filter).select("-password -__v");
    res.status(200).json(tattooers);
  } catch (error) {
    console.error("Error al listar tatuadores:", error);
    res.status(500).json({ mensaje: "Error al listar tatuadores" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const usuario = await User.findByIdAndUpdate(req.user.id, req.body, {
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
exports.deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(204).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ mensaje: "Error al eliminar usuario" });
  }
};

exports.getUserById = async (req, res) => {
  try {

    const usuario = await User.findById(req.params.userId).select("-password -email -role -city -favorites -status -designs");
    if (!usuario)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// manage user favorites
exports.listFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.status(200).json(user.favorites);
  } catch (error) {
    console.error("Error al listar favoritos:", error);
    res.status(500).json({ code: 500, message: 'Error al obtener favoritos' });
  }
};
exports.addFavorite = async (req, res) => {
  try {
    const { designId } = req.body;
    if (!designId) return res.status(400).json({ code: 400, message: 'designId requerido' });

    const user = await User.findById(req.user.id);
    if (!user.favorites.includes(designId)) {
      user.favorites.push(designId);
      await user.save();
    }

    res.status(201).json({ code: 201, message: 'Agregado correctamente a favoritos.' });
  } catch (error) {
    console.error("Error al agregar a favoritos:", error);
    res.status(500).json({ code: 500, message: 'Error al agregar favorito' });
  }
};
exports.removeFavorite = async (req, res) => {
  try {
    const { designId } = req.params;
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(favId => favId.toString() !== designId);
    await user.save();

    res.status(204).json({ code: 204, message: 'Solicitud procesada correctamente.' });
  } catch (error) {
    console.error("Error al eliminar favorito:", error);
    res.status(500).json({ code: 500, message: 'Error al eliminar favorito' });
  }
};

// Report 

exports.sendReport = async (req, res) => {
  try {
    const { reports_id, type, reason, description, image } = req.body;

    if (!reports_id || !type || !reason || !description) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    // Crear el nuevo reporte
    const newReport = new Report({
      user_id: req.user.id, // Asegúrate de que el middleware de autenticación esté estableciendo `req.user`
      reports_id,
      type,
      reason,
      description,
      image
    });

    await newReport.save();

    // Si es un reporte a un tatuador o diseño, incrementar su contador
    if (type === 'tattooer' || type === 'design') {
      await User.findByIdAndUpdate(
        reports_id,
        { $inc: { reportCounter: 1 } },
        { new: true }
      );
    }

    res.status(201).json({ mensaje: 'Reporte enviado correctamente', reporte: newReport });
  } catch (error) {
    console.error('Error al enviar el reporte:', error);
    res.status(500).json({ mensaje: 'Error al enviar el reporte' });
  }
};

