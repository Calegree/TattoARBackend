const Design = require("../models/Design");

exports.banDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const design = await Design.findById(id);
    if (!design) {
      return res.status(404).json({ mensaje: "Diseño no encontrado" });
    }

    // Cambia el estado: si está "active" lo pone "banned", si está "banned" lo pone "active"
    const newState = design.state === "banned" ? "active" : "banned";
    design.state = newState;
    await design.save();
    res.status(200).json(design);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cambiar el estado del diseño" });
  }
};

exports.changeNotificationState = async (req, res) => {
  try {
    const { id } = req.params;
    const Notification = require("../models/Notification");
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ mensaje: "Notificación no encontrada" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cambiar el estado de la notificación" });
  }
};
