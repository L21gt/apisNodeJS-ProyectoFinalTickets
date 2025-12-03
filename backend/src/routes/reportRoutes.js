const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Todas las rutas de reportes son solo para Admin
router.use(verifyToken, isAdmin);

// GET /api/reports/stats
router.get("/stats", reportController.getDashboardStats);

// Reporte de ventas
router.get("/sales", reportController.getSalesReport);

// Asistentes por evento
router.get("/attendees/:eventId", reportController.getEventAttendees);

module.exports = router;
