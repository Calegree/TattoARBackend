const mongoose = require("mongoose");

const { Schema, model } = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },

    username: { type: String },
    
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["client", "tattooer", "admin"],
      default: "client",
    },

    cities: { type: [String], enum: ["Santiago", "Valparaíso", "Concepción", "La Serena", "Antofagasta", "Temuco", "Arica", "Puerto Montt"], default: [] },
    styles: { type: [String], enum: ["moderno", "tradicional", "realista", "geométrico", "minimalista", "japones", "tribal", "acuarela", "blackwork"], default: [] },

    profileImageUrl: String,

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Design" }],
    socialMedia: {
      instagram: String,
      facebook: String,
      whatsapp: String,
    },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },

    designs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Design" }],
    portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: "Design" }],
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
