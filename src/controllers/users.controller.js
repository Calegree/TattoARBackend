const User = require("../models/User");

// Detallar usuario
exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// Actualizar usuario
exports.updateMe = async (req, res) => {
  try {
    const usuario = await User.findByIdAndUpdate(req.user.id, req.body, {
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
exports.deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(204).json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
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
    res.status(500).json({ mensaje: "Error al obtener usuario" });
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

