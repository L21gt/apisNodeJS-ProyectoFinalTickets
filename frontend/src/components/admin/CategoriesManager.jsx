import { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import { toast } from 'react-toastify';
import CreateCategoryModal from './CreateCategoryModal';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // ESTADO NUEVO: Para saber cuál estamos editando (null = creando nueva)
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data.categories || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar categorías');
        setLoading(false);
      }
    };
    fetchCategories();
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(old => old + 1);
  };

  // Función para abrir modal en modo CREAR
  const handleCreate = () => {
    setSelectedCategory(null); // Limpiamos selección
    setShowModal(true);
  };

  // Función para abrir modal en modo EDITAR
  const handleEdit = (category) => {
    setSelectedCategory(category); // Guardamos la categoría a editar
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.delete(id);
      toast.success('Category deleted');
      handleRefresh();
    } catch (error) {
      console.error(error);
      toast.error('Error deleting (check if it has associated events)');
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 fw-bold text-secondary-custom">Categories Management</h5>
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Category
        </button>
      </div>
      
      <div className="card-body p-0">
        {loading ? (
          <div className="p-4 text-center">Cargando...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4" style={{ width: '10%' }}>ID</th>
                  <th>Name</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-4">No categories found.</td></tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="ps-4 text-muted">#{cat.id}</td>
                      <td className="fw-bold text-primary-custom">{cat.name}</td>
                      <td className="text-end pe-4">
                        {/* BOTÓN EDITAR ACTIVO */}
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="btn btn-sm btn-outline-primary me-2" 
                          title="Editar nombre"
                        >
                          ✏️
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="btn btn-sm btn-outline-danger" 
                          title="Eliminar categoría"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateCategoryModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onCategorySaved={handleRefresh}
        categoryToEdit={selectedCategory} // Pasamos la categoría seleccionada
      />
    </div>
  );
};

export default CategoriesManager;