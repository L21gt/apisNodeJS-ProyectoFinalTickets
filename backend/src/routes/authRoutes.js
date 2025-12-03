const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Definir las rutas
// URL final: /api/auth/register
router.post("/register", authController.register);

// URL final: /api/auth/login
router.post("/login", authController.login);

// Editar perfil propio
router.put("/profile", verifyToken, authController.updateProfile);

module.exports = router;
