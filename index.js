require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");

const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.json());

// Rutas de usuarios normales
app.use("/users", require("./src/routes/users.routes"));

// Rutas de administración de usuarios
app.use("/v1/admin/users", require("./src/routes/admin.users.routes"));

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
