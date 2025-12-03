const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models");

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("Report Routes Integration Tests", () => {
  let adminToken;
  let eventId;

  beforeAll(async () => {
    // 1. Setup Admin
    const admin = await db.User.create({
      firstName: "Admin",
      lastName: "Report",
      email: "admin@rep.com",
      password: "pass",
      role: "admin",
    });
    const jwt = require("jsonwebtoken");
    adminToken = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET
    );

    // 2. Setup Category & Event
    const cat = await db.Category.create({ name: "RepCat" });
    const event = await db.Event.create({
      title: "Rep Event",
      description: "Desc",
      date: new Date(),
      location: "Loc",
      categoryId: cat.id,
      ticketType: "General",
      price: 100,
      totalTickets: 50,
      availableTickets: 48,
      imageUrl: "http://img.com",
    });
    eventId = event.id;

    // 3. Setup Tickets (Simulate sales)
    await db.Ticket.create({
      userId: admin.id,
      eventId: event.id,
      orderId: "ORD-1",
      quantity: 2,
      totalPrice: 200,
      status: "valid",
    });
  });

  test("GET /api/reports/stats - Should return dashboard numbers", async () => {
    const res = await request(app)
      .get("/api/reports/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    // Check if numbers match our seed data
    expect(parseFloat(res.body.totalRevenue)).toBe(200);
    expect(parseInt(res.body.totalTickets)).toBe(2);
  });

  test("GET /api/reports/sales - Should filter by date", async () => {
    // Usamos un rango amplio para evitar problemas de zona horaria en los tests
    // Inicio: Ayer
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const startStr = startDate.toISOString().split("T")[0];

    // Fin: Mañana
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    const endStr = endDate.toISOString().split("T")[0];

    const res = await request(app)
      .get(`/api/reports/sales?startDate=${startStr}&endDate=${endStr}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1); // Debe encontrar al menos la venta que creamos
  });

  test("GET /api/reports/attendees/:id - Should list attendees", async () => {
    const res = await request(app)
      .get(`/api/reports/attendees/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].quantity).toBe(2);
  });
});
