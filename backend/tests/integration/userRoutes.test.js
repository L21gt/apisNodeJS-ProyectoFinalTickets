const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models");

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("User Routes Integration Tests", () => {
  let adminToken;
  let targetUserId;

  beforeAll(async () => {
    // Create Admin
    const admin = await db.User.create({
      firstName: "Super",
      lastName: "Admin",
      email: "admin@users.com",
      password: "pass",
      role: "admin",
    });
    const jwt = require("jsonwebtoken");
    adminToken = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET
    );

    // Create Target User
    const user = await db.User.create({
      firstName: "Target",
      lastName: "User",
      email: "target@users.com",
      password: "pass",
      role: "user",
    });
    targetUserId = user.id;
  });

  test("GET /api/users - Admin can list users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.users.length).toBeGreaterThanOrEqual(2); // Admin + Target
  });

  test("PUT /api/users/:id - Admin can block user", async () => {
    const res = await request(app)
      .put(`/api/users/${targetUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "blocked" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.status).toBe("blocked");
  });

  test("PUT /api/users/:id - Admin can promote user to admin", async () => {
    const res = await request(app)
      .put(`/api/users/${targetUserId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "admin" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.role).toBe("admin");
  });

  test("PUT /api/users/:id - Admin CANNOT block themselves (400)", async () => {
    // Obtenemos el ID del admin desde el token decodificado
    // En este test setup, sabemos que creamos al admin primero.
    // Se intentar bloquear al usuario que tiene el token de admin.

    // Primero averiguamos el ID del admin (buscándolo por email)
    const adminUser = await db.User.findOne({
      where: { email: "admin@users.com" },
    });

    const res = await request(app)
      .put(`/api/users/${adminUser.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "blocked" });

    expect(res.statusCode).toBe(400); // "No puedes modificar tu propio usuario"
  });
});
