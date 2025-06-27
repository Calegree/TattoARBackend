const Report = require('../models/Report');
const Notification = require('../models/Notification');

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('reports_id', 'fullName');
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los reportes' });
  }
}


// Unificada: Cambiar estado del reporte
exports.updateReportState = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ mensaje: 'Reporte no encontrado' });
    }

    // Alternar estado entre 'pendiente' y 'resuelto'
    report.state = report.state === 'resuelto' ? 'pendiente' : 'resuelto';
    await report.save();

    res.status(200).json(report);
  } catch (error) {
    console.error('Error al actualizar el reporte:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el reporte' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('user', 'fullName')
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error);
    res.status(500).json({ mensaje: 'Error al obtener las notificaciones' });
  }
}

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
