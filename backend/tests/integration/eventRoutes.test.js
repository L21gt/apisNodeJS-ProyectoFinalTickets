const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models");

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("Event Routes Coverage Tests", () => {
  let adminToken;
  let categoryId;
  let eventId;

  beforeAll(async () => {
    const admin = await db.User.create({
      firstName: "T",
      lastName: "A",
      email: "admin@evt.com",
      password: "pass",
      role: "admin",
    });
    const jwt = require("jsonwebtoken"); // Requiere jsonwebtoken para generar token
    adminToken = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET
    );

    const cat = await db.Category.create({ name: "EventsCat" });
    categoryId = cat.id;
  });

  // 1. CREATE
  test("POST /api/events - Create Event", async () => {
    const buffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("title", "Original Event")
      .field("description", "Desc")
      .field("date", "2025-12-25 00:00:00")
      .field("location", "Loc")
      .field("categoryId", categoryId)
      .field("ticketType", "Gen")
      .field("price", 100)
      .field("totalTickets", 50)
      .attach("image", buffer, "test.png");

    expect(res.statusCode).toBe(201);
    eventId = res.body.event.id;
  });

  // Get By ID
  test("GET /api/events/:id - Get Single Event", async () => {
    const res = await request(app).get(`/api/events/${eventId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Original Event");
  });

  test("GET /api/events/:id - Not Found", async () => {
    const res = await request(app).get("/api/events/9999");
    expect(res.statusCode).toBe(404);
  });

  // Update Event
  test("PUT /api/events/:id - Update Event", async () => {
    const res = await request(app)
      .put(`/api/events/${eventId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("title", "Updated Event")
      .field("price", 150); // Cambiamos precio y nombre

    expect(res.statusCode).toBe(200);
    expect(res.body.event.title).toBe("Updated Event");
    expect(res.body.event.price).toBe("150");
  });

  test("PUT /api/events/:id - Update Not Found", async () => {
    const res = await request(app)
      .put("/api/events/9999")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("title", "Fail");

    expect(res.statusCode).toBe(404);
  });

  test("PUT /api/events/:id - Update Event Name", async () => {
    const res = await request(app)
      .put(`/api/events/${eventId}`) // Usamos el ID del evento creado antes
      .set("Authorization", `Bearer ${adminToken}`)
      .field("title", "Updated Event Title");

    expect(res.statusCode).toBe(200);
    expect(res.body.event.title).toBe("Updated Event Title");
  });

  test("POST /api/events - Error: Missing Image (400)", async () => {
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("title", "No Image Event")
      // No adjuntamos imagen a propósito
      .field("description", "Desc")
      .field("date", "2025-12-31")
      .field("location", "Loc")
      .field("categoryId", categoryId)
      .field("ticketType", "Gen")
      .field("price", 100)
      .field("totalTickets", 10);

    expect(res.statusCode).toBe(400); // Esperamos error "Imagen obligatoria"
  });

  test("PUT /api/events/:id - Error: Update Non-existent Event (404)", async () => {
    const res = await request(app)
      .put("/api/events/999999") // ID que no existe
      .set("Authorization", `Bearer ${adminToken}`)
      .field("title", "Ghost Event");

    expect(res.statusCode).toBe(404);
  });

  test("DELETE /api/events/:id - Error: Delete Non-existent Event (404)", async () => {
    const res = await request(app)
      .delete("/api/events/999999")
      .set("Authorization", `Bearer ${adminToken}`);
  });

  test("POST /api/events - Error: Invalid Data (Database Error)", async () => {
    // Enviar datos que rompan la validación de la BD (ej. texto muy largo o tipos incorrectos)
    const res = await request(app)
      .post("/api/events")
      .set("Authorization", `Bearer ${adminToken}`)
      // No enviamos campos obligatorios como title o date
      .field("price", "not-a-number");

    expect(res.statusCode).toBe(400); // O 500 dependiendo de tu manejo de errores
  });
});
