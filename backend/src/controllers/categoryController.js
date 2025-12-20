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
    res.status(500).json({ message: "Error getting categories" });
  }
};

/**
 * Crear una categoría
 */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Category name is required" });

    // Validar duplicados ANTES de intentar crear
    const existingCat = await Category.findOne({ where: { name } });
    if (existingCat) {
      return res.status(400).json({ message: "This category already exists" });
    }

    const category = await Category.create({ name });
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating category" });
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
      return res.status(404).json({ message: "Category not found" });
    }

    // Validar si el NUEVO nombre ya existe (y no es la misma categoría que estamos editando)
    const existingCat = await Category.findOne({ where: { name } });
    if (existingCat && existingCat.id !== parseInt(id)) {
      return res.status(400).json({ message: "This category already exists" });
    }

    category.name = name;
    await category.save();

    res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating category" });
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
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting category" });
  }
};
