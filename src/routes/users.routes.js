const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const authenticate = require("../middlewares/auth.middleware");

 
// Obtener perfil propio (ejemplo)
router.get("/me", usersController.getProfile);

// Favoritos
router.get("/me/favorites", authenticate, usersController.listFavorites);
router.post("/me/favorites", authenticate, usersController.addFavorite);
router.delete("/me/favorites/:designId", authenticate, usersController.removeFavorite);

module.exports = router;
