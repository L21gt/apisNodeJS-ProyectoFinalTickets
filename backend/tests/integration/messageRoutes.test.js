const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models");

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("Message Routes Integration Tests", () => {
  let adminToken;
  let userToken;
  let messageId;

  beforeAll(async () => {
    // Create Admin
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

    // Create User (for security check)
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
    messageId = 1; // Assuming it's the first message
  });

  test("GET /api/messages - Admin can read messages", async () => {
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].subject).toBe("Inquiry");
  });

  test("GET /api/messages - Regular user CANNOT read messages (403)", async () => {
    const res = await request(app)
      .get("/api/messages")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("PUT /api/messages/:id/status - Admin can update status", async () => {
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
});
