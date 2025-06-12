const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema(
  {
    instagram: String,
    facebook: String,
    whatsapp: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["client", "tattooer", "admin"],
      default: "client",
    },
    city: String,
    bio: String,
    profileImageUrl: String,
    favorites: [String],
    socialMedia: socialMediaSchema,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
