const Report = require('../models/Report');

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('reports_id', 'fullName');
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error al obtener los reportes:', error);
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