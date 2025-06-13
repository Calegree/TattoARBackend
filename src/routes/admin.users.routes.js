const express = require("express");
const router = express.Router();
const adminUsersController = require("../controllers/admin.users.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Listar usuarios
router.get("/", authMiddleware, adminUsersController.listUsers);

// Listar tatuadores (solo admin)
router.get("/tattooers", authMiddleware, adminUsersController.listTattooers);

// Crear usuario
router.post("/", authMiddleware, adminUsersController.createUser);

// Detallar usuario
router.get("/:userId", authMiddleware, adminUsersController.getUser);

// Actualizar usuario
router.put("/:userId", authMiddleware, adminUsersController.updateUser);

// Eliminar usuario
router.delete("/:userId", authMiddleware, adminUsersController.deleteUser);

// Cambiar estado de usuario
router.put(
  "/:userId/status",
  authMiddleware,
  adminUsersController.changeStatus
);

module.exports = router;
