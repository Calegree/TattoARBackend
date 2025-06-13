const Log = require('../models/Log');

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error al obtener los logs:', error);
    res.status(500).json({ mensaje: 'Error al obtener los logs' });
  }
};