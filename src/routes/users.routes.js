const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

// Crear usuario normal
router.post("/create", usersController.createUser);

// Obtener perfil propio (ejemplo)
router.get("/me", usersController.getProfile);

module.exports = router;
