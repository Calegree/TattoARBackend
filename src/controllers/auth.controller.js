const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendMail } = require('../utils/nodemailer');


// @route   POST /auth/register
// @desc    Register new user
// @access  Public
exports.register = async (req, res) => {
  const {
    fullName,
    email,
    password,
    role,
    city,
    profileImageUrl,
    favorites = [],
    socialMedia = {},
    status,
    designs = []
  } = req.body;

  try {
    // 1. Verificar existencia
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ code: 400, message: 'Email ya registrado' });
    }

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // 3. Generar token de verificación con los datos del usuario
    const verifyToken = jwt.sign(
      {
        fullName,
        email,
        password: hashed,
        role,
        city,
        profileImageUrl,
        favorites,
        socialMedia,
        status,
        designs
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    const verifyUrl = `http://localhost:4000/api/v1/auth/verify-email?token=${verifyToken}`;
    console.log(verifyToken)

    await sendMail(
      email,
      'Verifica tu cuenta',
      `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
       <a href="${verifyUrl}">${verifyUrl}</a>`
    );
    
    res.status(201).json({ message: 'Revisa tu correo para verificar tu cuenta.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: 'Error en el servidor' });
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
// @desc    Logout (token invalidation frontend implementation)
// @access  Private
exports.logout = async (req, res) => {
  res.status(204).send();
};

// @route   GET /users/me
// @desc    Get authenticated user profile
// @access  Private
exports.getProfile = async (req, res) => {
  res.status(200).json(req.user);
};


exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ code:404, message: 'Usuario no encontrado' });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code:500, message: 'Error en el servidor' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const userData = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica que el usuario no exista ya
    let user = await User.findOne({ email: userData.email });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya está registrado.' });
    }

    // Crea el usuario en la base de datos
    user = new User({
      ...userData,
      status: 'active' // o verified: true
    });
    await user.save();

    res.status(200).json({ message: 'Cuenta verificada y usuario creado correctamente.' });
  } catch (err) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const resetUrl = `http://localhost:4000/api/v1/auth/reset-password?token=${resetToken}`;
    console.log(resetToken)
    await sendMail(
      user.email,
      'Recupera tu contraseña',
      `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
       <a href="${resetUrl}">${resetUrl}</a>`
    );
    
    res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
exports.resetPasswordWithToken = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (err) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};