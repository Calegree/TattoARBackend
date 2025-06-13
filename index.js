require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const mongoose = require('mongoose');
const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.json());

// Rutas de autenticación
app.use("/v1/auth", require("./src/routes/auth.routes"));

// Rutas de usuarios normales
app.use("/v1/users", require("./src/routes/users.routes"));

// Rutas de administración de usuarios
app.use("/v1/admin/users", require("./src/routes/admin.users.routes"));

// Rutas
app.use('/v1/logs', require('./src/routes/logs.routes'));
app.use('/v1/reports', require('./src/routes/reports.routes'));

// Rutas de diseños
app.use("/v1/designs", require("./src/routes/designs.routes"));

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);

  module.exports = app;
});
