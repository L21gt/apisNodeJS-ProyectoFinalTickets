const { Category } = require("../models");

/**
 * Obtener todas las categorías
 * @route GET /api/categories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

/**
 * Crear una categoría
 */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "El nombre es obligatorio" });

    // Validar duplicados ANTES de intentar crear
    // (Aunque la BD tiene restricción unique, es más limpio validarlo aquí)
    const existingCat = await Category.findOne({ where: { name } });
    if (existingCat) {
      return res
        .status(400)
        .json({ message: "Ya existe una categoría con ese nombre" });
    }

    const category = await Category.create({ name });
    res.status(201).json({ message: "Categoría creada", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Actualizar una categoría
 */
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    // Validar si el NUEVO nombre ya existe (y no es la misma categoría que estamos editando)
    const existingCat = await Category.findOne({ where: { name } });
    if (existingCat && existingCat.id !== parseInt(id)) {
      return res
        .status(400)
        .json({ message: "Ya existe otra categoría con ese nombre" });
    }

    category.name = name;
    await category.save();

    res.status(200).json({ message: "Categoría actualizada", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

/**
 * Eliminar una categoría
 * @route DELETE /api/categories/:id
 */
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    // Opcional: Validar si hay eventos usando esta categoría antes de borrar
    // Por ahora haremos un borrado directo
    const deleted = await Category.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json({ message: "Categoría eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
};
