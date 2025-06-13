const Log = require('../models/log');

exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los logs' });
  }
};