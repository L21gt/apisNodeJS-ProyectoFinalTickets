const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Publica: Para llenar el dropdown del modal
router.get("/", categoryController.getAllCategories);

// Privada: Para el panel de administración
router.post("/", verifyToken, isAdmin, categoryController.createCategory);

// Privada: Eliminar categoría
router.delete("/:id", verifyToken, isAdmin, categoryController.deleteCategory);

// Privada: Editar categoría
router.put("/:id", verifyToken, isAdmin, categoryController.updateCategory);

module.exports = router;
