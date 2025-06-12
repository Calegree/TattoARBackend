require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const mongoose = require('mongoose');
const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.json());

// Rutas
app.use('/api/logs', require('./src/routes/logs.routes'));
app.use('/api/reports', require('./src/routes/reports.routes'));

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);

  module.exports = app;
});
