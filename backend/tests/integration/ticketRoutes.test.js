const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models");

// Timeout EXTREMO para que no falle por tiempo
jest.setTimeout(120000);

beforeAll(async () => {
  // Solo sincronizamos, NO borramos ni recreamos (más rápido y seguro)
  await db.sequelize.sync({ force: false });
});

afterAll(async () => {
  // Forzamos el cierre inmediato
  await db.sequelize.close();
});

describe("Ticket Routes Tests", () => {
  let userToken;
  let eventId;

  // Creamos datos con nombres aleatorios para no chocar con otros tests
  const randomSuffix = Math.floor(Math.random() * 10000);

  beforeAll(async () => {
    try {
      const user = await db.User.create({
        firstName: "Ticket",
        lastName: "Buyer",
        email: `buyer${randomSuffix}@test.com`, // Email único
        password: "pass",
        role: "user",
      });
      const jwt = require("jsonwebtoken");
      userToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET
      );

      const cat = await db.Category.create({ name: `Cat${randomSuffix}` }); // Categoría única

      const event = await db.Event.create({
        title: `Event${randomSuffix}`,
        description: "D",
        date: new Date(),
        location: "L",
        categoryId: cat.id,
        ticketType: "Gen",
        price: 10,
        totalTickets: 10,
        availableTickets: 10,
        imageUrl: "x",
      });
      eventId = event.id;
    } catch (err) {
      console.error("Setup Error:", err);
    }
  });

  test("POST /purchase - Success", async () => {
    const res = await request(app)
      .post("/api/tickets/purchase")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ eventId: eventId, quantity: 1, cardDetails: { number: "123" } });

    expect(res.statusCode).toBe(201);
  });
});
