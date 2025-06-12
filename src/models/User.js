
const mongoose = require("mongoose");

const { Schema, model } = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: { type: String, enum: ["client", "tattooer"], default: "client" },

    city: String,

    profileImageUrl: String,

    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Design" }],
    socialMedia: {
      instagram: String,
      facebook: String,
      whatsapp: String,
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },

    designs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Design" }],
  },
  { timestamps: true }
);



module.exports = model("User", userSchema);
