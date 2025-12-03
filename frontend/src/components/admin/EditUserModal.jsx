import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import userService from '../../services/userService';
import { toast } from 'react-toastify';

const EditUserModal = ({ show, onClose, user, onUserUpdated }) => {
  const { register, handleSubmit, setValue } = useForm();

  // Cargar datos del usuario (Solo el Rol, el estado lo manejamos fuera)
  useEffect(() => {
    if (user) {
      setValue('role', user.role);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      // Solo enviamos el rol para actualizar
      await userService.update(user.id, { role: data.role });
      toast.success('User role updated successfully');
      onUserUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error updating user role');
    }
  };

  if (!show || !user) return null;

  return (
    <div className="modal fade show d-block modal-overlay-custom" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-secondary-custom text-white">
            <h5 className="modal-title">Edit User Role</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label text-muted small">User</label>
                <input type="text" className="form-control bg-light" value={user.email} readOnly disabled />
              </div>

              <hr />

              {/* Único Campo Editable: ROL */}
              <div className="mb-4">
                <label className="form-label fw-bold text-primary-custom">Assign Role</label>
                <select className="form-select form-select-lg" {...register('role')}>
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
                <div className="form-text mt-2">
                  <small>
                    ⚠️ <strong>Admin:</strong> Full access to the panel, can delete events and users.<br/>
                    👤 <strong>User:</strong> Can only buy tickets and view their history.
                  </small>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Role</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;