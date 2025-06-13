const bcrypt = require("bcrypt");
const User = require("../models/User");

async function createUserService({ fullName, email, password, role }) {
  let user = await User.findOne({ email });
  if (user) throw new Error("Email ya registrado");
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  user = new User({ fullName, email, password: hashed, role });
  await user.save();
  return user;
}

module.exports = { createUserService };
