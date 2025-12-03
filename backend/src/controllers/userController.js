const { User } = require('../models');

/**
 * Obtener lista de usuarios (Solo Admin).
 * Soporta paginación simple.
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Paginación: pagina 1 por defecto, 10 usuarios por pagina
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] }, // ¡Importante! Nunca devolver passwords
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      totalUsers: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users: rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
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
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Evitar que un admin se bloquee a sí mismo o se quite permisos
    if (user.id === req.user.id) {
       return res.status(400).json({ message: 'No puedes modificar tu propio usuario.' });
    }

    // Actualizar campos
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.status(200).json({ message: 'Usuario actualizado correctamente', user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};