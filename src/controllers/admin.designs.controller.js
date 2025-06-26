const Design = require("../models/Design");


exports.banDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDesign = await Design.findByIdAndUpdate(
      id,
      { state: 'banned' },
      { new: true }
    );
    if (!updatedDesign) {
      return res.status(404).json({ mensaje: 'Diseño no encontrado' });
    }
    res.status(200).json(updatedDesign);
  }

 catch (error) {
  res.status(500).json({ mensaje: 'Error al banear el diseño' });
  }
};

