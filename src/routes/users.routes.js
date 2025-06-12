const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

// Ruta para crear usuario
router.post("/create", usersController.crearUsuario);

module.exports = router;
