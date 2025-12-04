const { Ticket, Event, sequelize } = require("../models");
const { v4: uuidv4 } = require("uuid"); // libreria para generar IDs únicos
const { Op } = require("sequelize"); // Operadores de Sequelize

/**
 * Comprar boletos.
 * Maneja transacciones para asegurar que el inventario se descuente correctamente.
 * @route POST /api/tickets/purchase
 */
exports.purchaseTickets = async (req, res) => {
  // Iniciamos una transacción
  const t = await sequelize.transaction();

  try {
    const { eventId, quantity, cardDetails } = req.body;
    const userId = req.user.id; // Viene del token (middleware)

    // 1. Validaciones básicas
    if (!eventId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Datos de compra inválidos" });
    }

    // 2. Simulación de Pago (Requisito acordado)
    if (!cardDetails || !cardDetails.number) {
      return res
        .status(400)
        .json({ message: "Se requiere información de pago" });
    }
    // Aquí iría la llamada a Stripe/PayPal. Asumimos éxito.

    // 3. Buscar el evento (Bloqueando la fila para evitar condiciones de carrera)
    const event = await Event.findByPk(eventId, { transaction: t });

    if (!event) {
      await t.rollback();
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // 4. Verificar disponibilidad
    if (event.availableTickets < quantity) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "No hay suficientes boletos disponibles" });
    }

    // 5. Crear los Tickets
    const orderId = uuidv4(); // Generar un ID único para la orden
    const totalPrice = event.price * quantity;

    const newTicket = await Ticket.create(
      {
        userId,
        eventId,
        orderId,
        quantity,
        totalPrice,
        status: "valid",
      },
      { transaction: t }
    );

    // 6. Descontar del inventario
    event.availableTickets -= quantity;
    await event.save({ transaction: t });

    // 7. Confirmar transacción (Commit)
    await t.commit();

    res.status(201).json({
      message: "Compra realizada con éxito",
      ticket: newTicket,
      remaining: event.availableTickets,
    });
  } catch (error) {
    // Si algo falla, deshacer todo (Rollback)
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Error al procesar la compra" });
  }
};

/**
 * Obtener boletos del usuario actual
 * @route GET /api/tickets/my-tickets
 */
exports.getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, page = 1, limit = 10 } = req.query; // type: 'upcoming' | 'history'
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Filtro de fecha basado en el evento asociado
    const dateFilter =
      type === "upcoming"
        ? { [Op.gte]: new Date() } // Eventos futuros
        : type === "history"
        ? { [Op.lt]: new Date() } // Eventos pasados
        : null; // Si no envía tipo, traer todos (opcional)

    // Configuración de la consulta
    const queryOptions = {
      where: { userId },
      include: [
        {
          model: Event,
          attributes: ["title", "date", "location", "imageUrl"],
          where: dateFilter ? { date: dateFilter } : {}, // Aplicar filtro al evento
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    };

    const { count, rows } = await Ticket.findAndCountAll(queryOptions);

    res.status(200).json({
      totalTickets: count,
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
      tickets: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
};
