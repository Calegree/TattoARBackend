const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // este es el admin que recibe la notificación
  type: { type: String, enum: ["tattooer", "design", "claim"], required: true },
  reason: { type: String, required: true },
  description: { type: String },
  state: {
    type: String,
    enum: ["pending", "resolved", "rejected"],
    default: "pending",
  },
  image: { type: String, required: false },
  date: { type: Date, default: Date.now },
  title: { type: String, required: true },
  link: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationsSchema);
