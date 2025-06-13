const express = require("express");
const router = express.Router();
const adminUsersController = require("../controllers/admin.users.controller");

// Listar usuarios
router.get("/", adminUsersController.listUsers);

// Crear usuario
router.post("/", adminUsersController.createUser);

// Detallar usuario
router.get("/:userId", adminUsersController.getUser);

// Actualizar usuario
router.put("/:userId", adminUsersController.updateUser);

// Eliminar usuario
router.delete("/:userId", adminUsersController.deleteUser);

// Cambiar estado de usuario
router.put("/:userId/status", adminUsersController.changeStatus);

module.exports = router;
