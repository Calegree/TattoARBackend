const mongoose = require("mongoose");

module.exports = (modelName) => async (req, res, next) => {
  const Model = mongoose.model(modelName);
  const item = await Model.findById(req.params.designId || req.params.id);
  if (!item)
    return res.status(404).json({ code: 404, message: `${modelName} no encontrado` });

  if (item.author.toString() !== req.user.id)
    return res.status(403).json({ code: 403, message: "No autorizado para modificar este recurso" });

  next();
};
