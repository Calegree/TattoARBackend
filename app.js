require('dotenv').config({path:'./.env'});
const express = require('express');
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(express.json());

app.use('/usuarios', require('./routes/users.routes.js'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});
