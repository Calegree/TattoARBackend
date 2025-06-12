const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');

// @route   POST /auth/register
// @desc    Register new user
// @access  Public
exports.register = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ code:400, message: 'Email ya registrado' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    user = new User({ fullName, email, password: hashed, role });
    await user.save();
    res.status(201).json({ fullName: user.fullName, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code:500, message: 'Error en el servidor' });
  }
};

// @route   POST /auth/login
// @desc    Login user
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ code:401, message: 'Credenciales inválidas' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ code:401, message: 'Credenciales inválidas' });
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(200).json({ token, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code:500, message: 'Error en el servidor' });
  }
};

// @route   POST /auth/logout
// @desc    Logout (token invalidation TBD)
// @access  Private
exports.logout = async (req, res) => {
  // Implement token blacklist if needed
  res.status(204).send();
};

// @route   GET /users/me
// @desc    Get authenticated user profile
// @access  Private
exports.getProfile = async (req, res) => {
  res.status(200).json(req.user);
};
