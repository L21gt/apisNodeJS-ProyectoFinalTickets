const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models");

// Timeout extendido para entornos Windows/Docker (2 minutos)
jest.setTimeout(120000);

beforeAll(async () => {
  try {
    // 1. Asegurar que las tablas existan sin borrarlas
    await db.sequelize.sync({ force: false });

    // 2. Limpieza segura de datos (Evita deadlocks de TRUNCATE)

    await db.Ticket.destroy({ where: {} });
    await db.Event.destroy({ where: {} });
    await db.User.destroy({ where: {} });
    await db.Category.destroy({ where: {} });
  } catch (error) {
    console.error("Error cleaning the Database:", error);
  }
});

describe("Ticket Routes Coverage Tests", () => {
  let userToken;
  let eventId;

  beforeAll(async () => {
    // Setup: Crear Usuario, Categoría y Evento
    const user = await db.User.create({
      firstName: "Ticket",
      lastName: "Buyer",
      email: "buyer_final@test.com",
      password: "pass",
      role: "user",
    });
    const jwt = require("jsonwebtoken");
    userToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    // Crear Categoría y Evento
    const cat = await db.Category.create({ name: "TicketCategory" });
    const event = await db.Event.create({
      title: "Concert Final",
      description: "Description",
      date: new Date(),
      location: "Venue",
      categoryId: cat.id,
      ticketType: "General",
      price: 50,
      totalTickets: 10,
      availableTickets: 10,
      imageUrl: "http://image.com",
    });
    eventId = event.id;
  });

  test("POST /purchase - Success (201)", async () => {
    const res = await request(app)
      .post("/api/tickets/purchase")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        eventId: eventId,
        quantity: 1,
        cardDetails: { number: "1234567890123456" },
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toContain("successful");
  });

  test("POST /purchase - Invalid Data (400)", async () => {
    const res = await request(app)
      .post("/api/tickets/purchase")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ eventId: eventId }); // Falta cantidad

    expect(res.statusCode).toBe(400);
  });

  test("POST /purchase - Not Enough Tickets (400)", async () => {
    // Intentar comprar más de lo disponible (100 > 9 restantes)
    const res = await request(app)
      .post("/api/tickets/purchase")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        eventId: eventId,
        quantity: 100,
        cardDetails: { number: "123" },
      });

    expect(res.statusCode).toBe(400);
  });

  test("GET /my-tickets - List user tickets (200)", async () => {
    const res = await request(app)
      .get("/api/tickets/my-tickets")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    // Accedemos al array dentro de la propiedad .tickets
    expect(res.body.tickets.length).toBeGreaterThanOrEqual(1);
  });
});
