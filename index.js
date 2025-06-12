require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");

const app = express();

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(express.json());

// Rutas
app.use("/users", require("./src/routes/users.routes"));

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
