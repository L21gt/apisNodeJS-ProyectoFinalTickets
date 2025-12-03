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
    const messages = await Message.findAll({
      // Ordenar: primero status ('new' < 'read' alfabéticamente? No, 'new' es antes que 'read' no funciona así directo en ENUM a veces,
      // pero usaremos ordenamiento compuesto: Status y luego Fecha).
      // Truco: Ordenamos por fecha descendente, y en el frontend separamos.
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener mensajes" });
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
    await Message.destroy({ where: { id } });
    res.status(200).json({ message: "Mensaje eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar mensaje" });
  }
};
