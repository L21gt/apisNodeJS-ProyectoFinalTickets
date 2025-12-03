const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Ruta Pública: Enviar mensaje
router.post("/", messageController.sendMessage);

// Rutas Protegidas (Solo Admin)
router.get("/", verifyToken, isAdmin, messageController.getAllMessages);
router.put(
  "/:id/status",
  verifyToken,
  isAdmin,
  messageController.updateMessageStatus
);
router.delete("/:id", verifyToken, isAdmin, messageController.deleteMessage);

module.exports = router;
