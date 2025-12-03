const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Todas las rutas requieren estar logueado
router.use(verifyToken);

// POST /api/tickets/purchase - Comprar boletos
router.post("/purchase", ticketController.purchaseTickets);

// GET /api/tickets/my-tickets - Ver mis boletos
router.get("/my-tickets", ticketController.getMyTickets);

module.exports = router;
