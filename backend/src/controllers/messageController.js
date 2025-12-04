const { Message } = require("../models");

/**
 * Enviar un mensaje de contacto (Público)
 * @route POST /api/messages
 */
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    await Message.create({ name, email, subject, message });

    res.status(201).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
};

/**
 * Obtener todos los mensajes (Solo Admin)
 * Ordenados: Primero los 'new', luego por fecha.
 * @route GET /api/messages
 */
exports.getAllMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Message.findAndCountAll({
      limit,
      offset,
      // Ordenar: Primero los 'new' (n antes que r), luego por fecha más reciente
      order: [
        ["status", "ASC"],
        ["createdAt", "DESC"],
      ],
    });

    res.status(200).json({
      totalMessages: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      messages: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

/**
 * Cambiar estado a leido/no leido (Solo Admin)
 * @route PUT /api/messages/:id/status
 */
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'read' o 'new'

    const msg = await Message.findByPk(id);
    if (!msg) return res.status(404).json({ message: "Mensaje no encontrado" });

    msg.status = status;
    await msg.save();

    res.status(200).json({ message: "Estado actualizado", msg });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar mensaje" });
  }
};

/**
 * Eliminar mensaje (Solo Admin)
 * @route DELETE /api/messages/:id
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Sequelize.destroy devuelve el número de filas eliminadas
    const deletedRows = await Message.destroy({ where: { id } });

    // Si no borró nada, significa que el ID no existía
    if (deletedRows === 0) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    res.status(200).json({ message: "Mensaje eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar mensaje" });
  }
};
