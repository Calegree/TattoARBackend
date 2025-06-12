//Rutas específicas (ej. /usuarios)
const express = require('express');
const router = express.Router();
const { crearUsuario } = require('../controllers/users.controller.js');

router.post('/', crearUsuario);

module.exports = router;
