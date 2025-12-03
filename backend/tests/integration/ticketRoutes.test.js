const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models");

// Timeout razonable (no necesitamos 5 minutos si usamos truncate)
jest.setTimeout(60000);

beforeAll(async () => {
  try {
    // 1. Asegurar que las tablas existan (sin borrarlas)
    await db.sequelize.sync({ force: false });

    // 2. Limpieza quirúrgica (Borrar datos en orden para no romper relaciones)
    // Borramos primero los hijos (Tickets), luego los padres (Events, Users), luego abuelos (Category)
    await db.Ticket.destroy({ where: {}, truncate: true, cascade: true });
    await db.Event.destroy({ where: {}, truncate: true, cascade: true });
    await db.User.destroy({ where: {}, truncate: true, cascade: true });
    await db.Category.destroy({ where: {}, truncate: true, cascade: true });
  } catch (error) {
    console.error("Error limpiando DB en TicketRoutes:", error);
  }
});

afterAll(async () => {
  try {
    await db.sequelize.close();
  } catch (error) {
    console.error("Error cerrando conexión:", error);
  }
});

describe("Ticket Routes Coverage Tests", () => {
  let userToken;
  let eventId;

  beforeAll(async () => {
    // Crear datos de prueba
    const user = await db.User.create({
      firstName: "B",
      lastName: "O",
      email: "buyer@tik.com",
      password: "pass",
      role: "user",
    });
    const jwt = require("jsonwebtoken");
    userToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    const cat = await db.Category.create({ name: "TikCat" });
    const event = await db.Event.create({
      title: "Concert",
      description: "D",
      date: new Date(),
      location: "L",
      categoryId: cat.id,
      ticketType: "Gen",
      price: 10,
      totalTickets: 5,
      availableTickets: 5,
      imageUrl: "x",
    });
    eventId = event.id;
  });

  test("POST /purchase - Invalid Data (400)", async () => {
    const res = await request(app)
      .post("/api/tickets/purchase")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ eventId: eventId });

    expect(res.statusCode).toBe(400);
  });

  test("POST /purchase - Success (201)", async () => {
    const res = await request(app)
      .post("/api/tickets/purchase")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ eventId: eventId, quantity: 1, cardDetails: { number: "123" } });

    expect(res.statusCode).toBe(201);
  });

  test("POST /purchase - Not Enough Tickets (400)", async () => {
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
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});
