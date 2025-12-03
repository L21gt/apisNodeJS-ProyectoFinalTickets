const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/models");

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("Category Routes Coverage Tests", () => {
  let adminToken;
  let userToken;
  let categoryId;

  beforeAll(async () => {
    // Setup usuarios
    const admin = await db.User.create({
      firstName: "A",
      lastName: "A",
      email: "admin@cat.com",
      password: "pass",
      role: "admin",
    });
    const user = await db.User.create({
      firstName: "U",
      lastName: "U",
      email: "user@cat.com",
      password: "pass",
      role: "user",
    });

    const jwt = require("jsonwebtoken");
    adminToken = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET
    );
    userToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
  });

  // 1. CREATE
  test("POST /api/categories - Admin creates category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Music" });

    expect(res.statusCode).toBe(201);
    categoryId = res.body.category.id;
  });

  test("POST /api/categories - Validation Error (No name)", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({});

    expect(res.statusCode).toBe(400); // Cubre la línea de validación
  });

  // 2. READ
  test("GET /api/categories - List all", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.statusCode).toBe(200);
    expect(res.body.categories.length).toBeGreaterThan(0);
  });

  // 3. UPDATE (Cubrimos el PUT)
  test("PUT /api/categories/:id - Admin updates category", async () => {
    const res = await request(app)
      .put(`/api/categories/${categoryId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Live Music" });

    expect(res.statusCode).toBe(200);
    expect(res.body.category.name).toBe("Live Music");
  });

  test("PUT /api/categories/:id - Not Found Error", async () => {
    const res = await request(app)
      .put("/api/categories/9999")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Ghost" });

    expect(res.statusCode).toBe(404); // Cubre el caso de error
  });

  // 4. DELETE (Cubrimos el DELETE)
  test("DELETE /api/categories/:id - Admin deletes category", async () => {
    const res = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  test("DELETE /api/categories/:id - Not Found Error", async () => {
    const res = await request(app)
      .delete("/api/categories/9999")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});
