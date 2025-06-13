const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/nodemailer");
const User = require("../models/User");

async function createUserService({ fullName, email, password, role }) {
  // 1. Verificar existencia
  let user = await User.findOne({ email });
  if (user) {
    // Lanza un error en vez de responder aquí
    throw new Error("Email ya registrado");
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
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  const verifyUrl = `http://localhost:4000/api/v1/auth/verify-email?token=${verifyToken}`;
  console.log(verifyToken);
  await sendMail(
    email,
    "Verifica tu cuenta",
    `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
     <a href="${verifyUrl}">${verifyUrl}</a>`
  );
  // Devuelve un objeto o mensaje, no responde aquí
  return { message: "Revisa tu correo para verificar tu cuenta." };
}
module.exports = { createUserService };
