const User = require("../models/User");
const Design = require("../models/Design");

// Usuarios por rol
const getUsersByRole = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    res.json(result);
  } catch (err) {
    console.error("Error en getUsersByRole:", err);
    res.status(500).json({
      error: "Error al obtener usuarios por rol",
      details: err.message,
    });
  }
};

// Diseños por estilo
const getDesignsByStyle = async (req, res) => {
  try {
    const result = await Design.aggregate([
      { $unwind: "$styles" }, // si styles es un array
      { $group: { _id: "$styles", count: { $sum: 1 } } },
    ]);
    res.json(result);
  } catch (err) {
    console.error("Error en getDesignsByStyle:", err);
    res.status(500).json({
      error: "Error al obtener diseños por estilo",
      details: err.message,
    });
  }
};

// Top 3 diseños con más likes
const getTopLikedDesigns = async (req, res) => {
  try {
    const designs = await Design.find()
      .sort({ likes: -1 })
      .limit(3)
      .populate("author", "fullName profileImageUrl")
      .select("name styles likes author");

    const mappedDesigns = designs.map((design) => ({
      name: design.name || "Sin nombre",
      styles: design.styles || [],
      likes: design.likes || 0,
      author: design.author
        ? {
            _id: design.author._id,
            fullName: design.author.fullName,
            profileImageUrl: design.author.profileImageUrl || null,
          }
        : null,
    }));

    res.json(mappedDesigns);
  } catch (err) {
    console.error("Error en getTopLikedDesigns:", err);
    res.status(500).json({
      error: "Error al obtener diseños populares",
      details: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

// Estilos de tattooers
const getTattooerStyles = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $match: { role: "tattooer" } },
      { $unwind: "$styles" },
      { $group: { _id: "$styles", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    console.error("Error en getTattooerStyles:", err);
    res.status(500).json({
      error: "Error al obtener estilos de tattooers",
      details: err.message,
    });
  }
};

// Total de tatuajes
const getTotalTattoos = async (req, res) => {
  try {
    const count = await Design.countDocuments({ state: "active" });
    res.json({ total: count });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al contar tatuajes", details: err.message });
  }
};

module.exports = {
  getUsersByRole,
  getDesignsByStyle,
  getTopLikedDesigns,
  getTattooerStyles,
  getTotalTattoos,
};
