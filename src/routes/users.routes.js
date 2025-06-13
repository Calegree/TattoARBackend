const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

// Obtener perfil propio (ejemplo)
router.get("/me", usersController.getProfile);

module.exports = router;
