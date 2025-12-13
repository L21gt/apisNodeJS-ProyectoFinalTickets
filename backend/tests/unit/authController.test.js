const authController = require("../../src/controllers/authController");
const { User } = require("../../src/models");
const jwt = require("jsonwebtoken");
const httpMocks = require("node-mocks-http");

// Mock de modelos y jwt
jest.mock("../../src/models", () => ({
  User: {
    findOne: jest.fn(), // Simula la búsqueda de un usuario por email
    create: jest.fn(), // Simula la creación de un nuevo usuario
    findByPk: jest.fn(), // Simula la búsqueda de un usuario por ID
  },
}));

jest.mock("jsonwebtoken"); // Simula la generación de tokens JWT

describe("Auth Controller Coverage", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest(); // Simula la solicitud HTTP
    res = httpMocks.createResponse(); // Simula la respuesta HTTP
    jest.clearAllMocks(); // Limpia los mocks antes de cada test
  });

  // --- LOGIN ---
  test("Login Success", async () => {
    req.body = { email: "test@test.com", password: "pass" }; // Datos de login simulados
    User.findOne.mockResolvedValue({
      // Simula usuario encontrado
      id: 1,
      email: "test@test.com",
      role: "user",
      status: "active",
      comparePassword: jest.fn().mockResolvedValue(true),
    });
    jwt.sign.mockReturnValue("token");
    await authController.login(req, res); // Llama al controlador de login
    expect(res.statusCode).toBe(200);
  });

  test("Login Fail: User not found", async () => {
    req.body = { email: "no@test.com", password: "pass" };
    User.findOne.mockResolvedValue(null);
    await authController.login(req, res);
    expect(res.statusCode).toBe(401);
  });

  test("Login Fail: Blocked user", async () => {
    req.body = { email: "blocked@test.com", password: "pass" };
    User.findOne.mockResolvedValue({ status: "blocked" });
    await authController.login(req, res);
    expect(res.statusCode).toBe(403);
  });

  test("Login Fail: Wrong password", async () => {
    req.body = { email: "test@test.com", password: "wrong" };
    User.findOne.mockResolvedValue({
      status: "active",
      comparePassword: jest.fn().mockResolvedValue(false),
    });
    await authController.login(req, res);
    expect(res.statusCode).toBe(401);
  });

  // --- REGISTER ---
  test("Register Success", async () => {
    req.body = {
      firstName: "A",
      lastName: "B",
      email: "n@t.com",
      password: "p",
    };
    User.findOne.mockResolvedValue(null); // Simula que no existe usuario con ese email
    User.create.mockResolvedValue({ id: 2, ...req.body }); // Simula creación exitosa
    await authController.register(req, res);
    expect(res.statusCode).toBe(201);
  });

  test("Register Fail: Duplicate email", async () => {
    req.body = { email: "dup@test.com" };
    User.findOne.mockResolvedValue({ id: 1 });
    await authController.register(req, res);
    expect(res.statusCode).toBe(400);
  });

  // --- UPDATE PROFILE ---
  test("Update Profile Success", async () => {
    req.user = { id: 1 };
    req.body = { firstName: "NewName" };

    const mockUser = {
      id: 1,
      firstName: "Old",
      save: jest.fn(), // Simula el guardado del usuario
    };
    User.findByPk.mockResolvedValue(mockUser);

    await authController.updateProfile(req, res);
    expect(res.statusCode).toBe(200);
    expect(mockUser.firstName).toBe("NewName");
  });

  test("Update Profile Fail: User not found", async () => {
    req.user = { id: 99 };
    User.findByPk.mockResolvedValue(null);
    await authController.updateProfile(req, res);
    expect(res.statusCode).toBe(404);
  });

  test("Update Password Success", async () => {
    req.user = { id: 1 };
    req.body = { currentPassword: "old", newPassword: "new" };

    const mockUser = {
      id: 1,
      comparePassword: jest.fn().mockResolvedValue(true), // Contraseña actual correcta
      save: jest.fn(),
    };
    User.findByPk.mockResolvedValue(mockUser); // Simula encontrar el usuario

    await authController.updateProfile(req, res);
    expect(res.statusCode).toBe(200);
  });

  test("Update Password Fail: Wrong current password", async () => {
    req.user = { id: 1 };
    req.body = { currentPassword: "wrong", newPassword: "new" };

    const mockUser = {
      id: 1,
      comparePassword: jest.fn().mockResolvedValue(false), // Contraseña actual incorrecta
    };
    User.findByPk.mockResolvedValue(mockUser);

    await authController.updateProfile(req, res);
    expect(res.statusCode).toBe(401);
  });
});
