const bcrypt = require("bcrypt");
const User = require("../models/User");

async function createUserService({ fullName, email, password, role }) {
  try {
    // 1. Verificar existencia
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ code: 400, message: "Email ya registrado" });
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
        designs,
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

    res
      .status(201)
      .json({ message: "Revisa tu correo para verificar tu cuenta." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, message: "Error en el servidor" });
  }
}
module.exports = { createUserService };
