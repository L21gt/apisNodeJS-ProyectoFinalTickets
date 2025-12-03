const authController = require("../../src/controllers/authController");
const { User } = require("../../src/models");
const jwt = require("jsonwebtoken");
const httpMocks = require("node-mocks-http");

jest.mock("../../src/models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock("jsonwebtoken");

describe("Auth Controller Coverage", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  // --- LOGIN ---
  test("Login Success", async () => {
    req.body = { email: "test@test.com", password: "pass" };
    User.findOne.mockResolvedValue({
      id: 1,
      email: "test@test.com",
      role: "user",
      status: "active",
      comparePassword: jest.fn().mockResolvedValue(true),
    });
    jwt.sign.mockReturnValue("token");
    await authController.login(req, res);
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
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 2, ...req.body });
    await authController.register(req, res);
    expect(res.statusCode).toBe(201);
  });

  test("Register Fail: Duplicate email", async () => {
    req.body = { email: "dup@test.com" };
    User.findOne.mockResolvedValue({ id: 1 });
    await authController.register(req, res);
    expect(res.statusCode).toBe(400);
  });

  // --- UPDATE PROFILE (Nuevo) ---
  test("Update Profile Success", async () => {
    req.user = { id: 1 };
    req.body = { firstName: "NewName" };

    const mockUser = {
      id: 1,
      firstName: "Old",
      save: jest.fn(),
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
      comparePassword: jest.fn().mockResolvedValue(true),
      save: jest.fn(),
    };
    User.findByPk.mockResolvedValue(mockUser);

    await authController.updateProfile(req, res);
    expect(res.statusCode).toBe(200);
  });

  test("Update Password Fail: Wrong current password", async () => {
    req.user = { id: 1 };
    req.body = { currentPassword: "wrong", newPassword: "new" };

    const mockUser = {
      id: 1,
      comparePassword: jest.fn().mockResolvedValue(false),
    };
    User.findByPk.mockResolvedValue(mockUser);

    await authController.updateProfile(req, res);
    expect(res.statusCode).toBe(401);
  });
});
