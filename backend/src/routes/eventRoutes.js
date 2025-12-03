const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const upload = require("../middlewares/uploadMiddleware");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Rutas Públicas
// GET /api/events - Ver todos los eventos (Home page)
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

// Rutas Protegidas (Solo Admin)
// POST /api/events - Crear evento (Con subida de imagen 'image')
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  eventController.createEvent
);

// Editar Evento
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  eventController.updateEvent
);

module.exports = router;
