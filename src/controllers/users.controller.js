const User = require('../models/User'); // Adjust the path as necessary
exports.getProfile = async (req, res) => {
  try {
    // Assuming user ID is available in req.user.id (e.g., after authentication middleware)
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Replace with your user model and fetching logic
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
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

