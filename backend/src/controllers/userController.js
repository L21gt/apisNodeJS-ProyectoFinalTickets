const { User } = require("../models");

/**
 * Obtener lista de usuarios con filtros y paginación
 * @route GET /api/users?page=1&limit=10&role=admin&status=active
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Extraer filtros de la URL
    const { role, status, search } = req.query;

    const whereClause = {};

    // Aplicar filtro de Rol si existe
    if (role && role !== "") {
      whereClause.role = role;
    }

    // Aplicar filtro de Estado si existe
    if (status && status !== "") {
      whereClause.status = status;
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting users" });
  }
};

/**
 * Actualizar rol o estado de un usuario (Solo Admin).
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Evitar que un admin se bloquee a sí mismo o se quite permisos
    if (user.id === req.user.id) {
      return res
        .status(400)
        .json({ message: "Not possible to update your own user" });
    }

    // Actualizar campos
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
};
