const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Proteger todas las rutas de este archivo:
// Primero verifica token, LUEGO verifica si es admin
router.use(verifyToken);
router.use(isAdmin);

// GET /api/users - Listar usuarios
router.get('/', userController.getAllUsers);

// PUT /api/users/:id - Modificar usuario
router.put('/:id', userController.updateUser);

module.exports = router;