const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // este es el admin que recibe la notificación
  type: { type: String, enum: ["tattooer", "design", "claim"], required: true },
  description: { type: String },
  image: { type: String, required: false },
  title: { type: String, required: true },
  link: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationsSchema);
