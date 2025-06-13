const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Quien reporta
  reports_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Tatuador o diseño reportado
  type: { type: String, enum: ['tattooer', 'design','claim'], required: true },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  state: { type: String, enum: ['pending', 'resolved', 'rejected'], default: 'pending' },
  image: { type: String, required: false }, // URL de la imagen del report
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);