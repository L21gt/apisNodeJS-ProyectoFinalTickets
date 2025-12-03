import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import categoryService from '../../services/categoryService';
import { toast } from 'react-toastify';

// Ahora recibimos una prop extra: "categoryToEdit"
const CreateCategoryModal = ({ show, onClose, onCategorySaved, categoryToEdit }) => {
  const { register, handleSubmit, reset, setValue } = useForm();

  // EFECTO: Si hay una categoría para editar, llenamos el campo. Si no, limpiamos.
  useEffect(() => {
    if (categoryToEdit) {
      setValue('name', categoryToEdit.name);
    } else {
      reset({ name: '' });
    }
  }, [categoryToEdit, setValue, reset, show]);

  const onSubmit = async (data) => {
    try {
      if (categoryToEdit) {
        // MODO EDICIÓN
        await categoryService.update(categoryToEdit.id, data);
        toast.success('Categoría actualizada exitosamente');
      } else {
        // MODO CREACIÓN
        await categoryService.create(data);
        toast.success('Categoría creada exitosamente');
      }
      
      onCategorySaved(); // Avisar al padre para recargar la tabla
      onClose(); // Cerrar modal
    } catch (error) {
      console.error(error);
      // Si el backend envía un mensaje específico (ej. "Ya existe..."), úsalo.
      // Si no, usa el mensaje genérico.
      const serverMessage = error.response?.data?.message || 'Error al guardar categoría';
      toast.error(serverMessage);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block modal-overlay-custom" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {categoryToEdit ? 'Edit Category' : 'New Category'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="form-label fw-bold">Category Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Concerts, Sports..."
                  {...register('name', { required: true })} 
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {categoryToEdit ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;