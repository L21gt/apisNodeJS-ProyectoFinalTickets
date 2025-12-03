const { Event, Category } = require("../models");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

/**
 * Función auxiliar para subir un buffer a Cloudinary
 * (Convierte el archivo en memoria a un stream que Cloudinary entienda)
 */
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "events4u" }, // Carpeta en tu Cloudinary
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    // Convertir buffer a stream
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

/**
 * Crear un nuevo evento con imagen.
 * @route POST /api/events
 */
exports.createEvent = async (req, res) => {
  try {
    // 1. Validar que venga una imagen
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "La imagen del evento es obligatoria." });
    }

    // 2. Subir imagen a Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);
    const imageUrl = result.secure_url;

    // 3. Obtener datos del cuerpo (form-data)
    const {
      title,
      description,
      date,
      location,
      categoryId,
      ticketType,
      price,
      totalTickets,
    } = req.body;

    // 4. Crear evento en Base de Datos
    const newEvent = await Event.create({
      title,
      description,
      date,
      location,
      categoryId,
      imageUrl, // La URL que nos dio Cloudinary
      ticketType,
      price,
      totalTickets,
      availableTickets: totalTickets, // Al inicio, disponibles = totales
    });

    res.status(201).json({
      message: "Evento creado exitosamente",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error al crear evento:", error);
    res.status(500).json({ message: "Error en el servidor al crear evento" });
  }
};

/**
 * Listar todos los eventos (Público).
 * Incluye paginación y filtrado básico.
 * @route GET /api/events
 */
exports.getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Event.findAndCountAll({
      limit,
      offset,
      order: [["date", "ASC"]], // Los eventos más próximos primero
      include: [{ model: Category, attributes: ["name"] }], // Traer el nombre de la categoría
    });

    res.status(200).json({
      totalEvents: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      events: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener eventos" });
  }
};

/**
 * Obtener un evento por ID
 * @route GET /api/events/:id
 */
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [{ model: Category, attributes: ["name"] }],
    });

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener evento" });
  }
};

/**
 * Actualizar un evento existente
 * @route PUT /api/events/:id
 */
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 1. Si viene una nueva imagen, la subimos a Cloudinary
    let imageUrl = event.imageUrl; // Mantener la anterior por defecto
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // 2. Actualizar campos (si vienen en el body)
    const {
      title,
      description,
      date,
      location,
      categoryId,
      ticketType,
      price,
      totalTickets,
    } = req.body;

    await event.update({
      title,
      description,
      date,
      location,
      categoryId,
      imageUrl,
      ticketType,
      price,
      totalTickets,
      // Nota: No actualizamos 'availableTickets' automáticamente para no romper la lógica de ventas ya hechas.
      // Si cambias el total, el admin debería calcular el disponible manualmente o dejarlo así.
    });

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating event" });
  }
};
