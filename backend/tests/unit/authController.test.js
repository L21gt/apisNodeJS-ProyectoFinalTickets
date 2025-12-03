// CORRECCIÓN DE RUTAS: Agregamos 'src' para encontrar los archivos
const authController = require('../../src/controllers/authController');
const { User } = require('../../src/models');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

// Mocks (Simulaciones)
// También corregimos la ruta aquí dentro del mock
jest.mock('../../src/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  }
}));

jest.mock('jsonwebtoken');

describe('Auth Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    jest.clearAllMocks();
  });

  /* -------------------------------------------------------------------------- */
  /* TEST DE LOGIN                               */
  /* -------------------------------------------------------------------------- */
  
  test('Login exitoso: Debería retornar 200 y un token', async () => {
    // 1. Arrange
    req.body = { email: 'test@test.com', password: 'password123' };

    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: 'hashedPassword',
      role: 'user',
      status: 'active',
      comparePassword: jest.fn().mockResolvedValue(true)
    };
    User.findOne.mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue('fake-token-123');

    // 2. Act
    await authController.login(req, res);

    // 3. Assert
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toHaveProperty('token', 'fake-token-123');
  });

  test('Login fallido: Usuario no encontrado debería retornar 401', async () => {
    req.body = { email: 'noexiste@test.com', password: '123' };
    User.findOne.mockResolvedValue(null);

    await authController.login(req, res);

    expect(res.statusCode).toBe(401);
    expect(res._getJSONData().message).toBe('Credenciales inválidas');
  });

  /* -------------------------------------------------------------------------- */
  /* TEST DE REGISTRO                              */
  /* -------------------------------------------------------------------------- */

  test('Registro exitoso: Debería crear usuario y retornar 201', async () => {
    req.body = { 
      firstName: 'Nuevo', 
      lastName: 'User', 
      email: 'new@test.com', 
      password: '123' 
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 2,
      ...req.body,
      role: 'user'
    });

    await authController.register(req, res);

    expect(res.statusCode).toBe(201);
    expect(User.create).toHaveBeenCalled();
  });
});