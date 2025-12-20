const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Registra un nuevo usuario en la base de datos.
 * @route POST /api/auth/register
 * @returns {Object} 201 - Usuario creado (sin password)
 */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. Validar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email address already registered." });
    }

    // 2. Crear usuario (El hook del modelo encriptará el password)
    // Forzamos role: 'user' para evitar que alguien se registre como admin
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: "user",
      status: "active",
    });

    // 3. Responder (Excluyendo el password de la respuesta por seguridad)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error in the server while registering user" });
  }
};

/**
 * Inicia sesión y genera un Token JWT.
 * @route POST /api/auth/login
 * @returns {Object} 200 - Token de acceso
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Verificar estado (Si está bloqueado no entra)
    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ message: "Your account has been blocked. Contact support." });
    }

    // 3. Comparar contraseñas (Usando el método que definimos en el Modelo)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Generar Token JWT
    // El payload guarda el ID y el Rol para usarlos luego en los permisos
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // El token expira en 24 horas
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in the server while logging in" });
  }
};

/**
 * Actualizar perfil del usuario logueado
 * @route PUT /api/auth/profile
 */
exports.updateProfile = async (req, res) => {
  try {
    // Usamos el ID del token, NO de la URL (por seguridad)
    const userId = req.user.id;
    const { firstName, lastName, currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Si quiere cambiar contraseña, verificar la actual primero
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "You must enter your current password to change it",
        });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
      user.password = newPassword; // El hook del modelo la encriptará
    }

    // 2. Actualizar datos básicos
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();

    // Devolver usuario actualizado (sin password)
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};
