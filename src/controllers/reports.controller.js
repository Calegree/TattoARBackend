const Report = require('../models/Report');

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error al obtener los reportes:', error);
    res.status(500).json({ mensaje: 'Error al obtener los reportes' });
  }
}
exports.rejectReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { state: 'rejected' },
      { new: true }
    );
    if (!updatedReport) {
      return res.status(404).json({ mensaje: 'Reporte no encontrado' });
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error al actualizar el reporte:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el reporte' });
  }
};

exports.acceptReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { state: 'resolved' },
      { new: true }
    );
    if (!updatedReport) {
      return res.status(404).json({ mensaje: 'Reporte no encontrado' });
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    console.error('Error al actualizar el reporte:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el reporte' });
  }
};