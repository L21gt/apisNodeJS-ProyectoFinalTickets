const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models");

// Timeout generoso por si acaso
jest.setTimeout(30000);

beforeAll(async () => {
  // Usamos sync force: true para este test aislado para asegurar IDs limpios
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("Message Routes Integration Tests", () => {
  let adminToken;
  let userToken;
  let messageId; // Variable para guardar el ID real

  beforeAll(async () => {
    // Crear Admin
    const admin = await db.User.create({
      firstName: "Admin",
      lastName: "Msg",
      email: "admin@msg.com",
      password: "pass",
      role: "admin",
    });
    const jwt = require("jsonwebtoken");
    adminToken = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET
    );

    // Crear Usuario (para probar seguridad)
    const user = await db.User.create({
      firstName: "User",
      lastName: "Msg",
      email: "user@msg.com",
      password: "pass",
      role: "user",
    });
    userToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
  });

  test("POST /api/messages - Public user can send message", async () => {
    const res = await request(app).post("/api/messages").send({
      name: "Guest User",
      email: "guest@test.com",
      subject: "Inquiry",
      message: "Hello world",
    });

    expect(res.statusCode).toBe(201);
    // Nota: El endpoint no devuelve el ID, así que lo capturaremos en el siguiente test (GET)
  });

  test("GET /api/messages - Admin can read messages", async () => {
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);

    // Acceder a .messages porque ahora hay paginación
    expect(res.body.messages.length).toBeGreaterThan(0);
    expect(res.body.messages[0].subject).toBe("Inquiry");

    // Capturar el ID real dinámicamente
    messageId = res.body.messages[0].id;
  });

  test("GET /api/messages - Regular user CANNOT read messages (403)", async () => {
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("PUT /api/messages/:id/status - Admin can update status", async () => {
    // Usamos la variable messageId que capturamos arriba
    const res = await request(app)
      .put(`/api/messages/${messageId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "read" });

    expect(res.statusCode).toBe(200);
    expect(res.body.msg.status).toBe("read");
  });

  test("DELETE /api/messages/:id - Admin can delete message", async () => {
    const res = await request(app)
      .delete(`/api/messages/${messageId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  test("DELETE /api/messages/:id - Not Found (404)", async () => {
    const res = await request(app)
      .delete("/api/messages/999999") // ID que no existe
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});
