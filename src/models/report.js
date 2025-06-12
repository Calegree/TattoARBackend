const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Quien reporta
  reports_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Tatuador o Tattoo reportado
  type: { type: String, enum: ['tattooer', 'design'], required: true },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  state: { type: String, enum: ['pending', 'resolved', 'rejected'], default: 'pendiente' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);