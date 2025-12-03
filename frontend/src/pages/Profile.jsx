import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, logout } = useContext(AuthContext); // logout por si cambia password
  const [loading, setLoading] = useState(false);

  // Formulario 1: Datos Personales
  const { register: registerInfo, handleSubmit: submitInfo, setValue } = useForm();
  
  // Formulario 2: Contraseña
  const { register: registerPass, handleSubmit: submitPass, reset: resetPass, formState: { errors } } = useForm();

  // Cargar datos actuales
  useEffect(() => {
    if (user) {
      // Nota: user.firstName puede venir junto o separado dependiendo de cómo lo guardaste en el token
      // Si en el token solo guardaste el nombre completo, quizás necesites ajustar esto.
      // Asumiremos que el contexto tiene los datos frescos.
      setValue('firstName', user.firstName || '');
      // setValue('lastName', user.lastName || ''); // Si tienes apellido en el token
    }
  }, [user, setValue]);

  const onUpdateInfo = async (data) => {
    setLoading(true);
    try {
      await authService.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName
      });
      toast.success('Información actualizada. Por favor inicia sesión nuevamente para ver los cambios.');
      logout(); // Forzamos logout para refrescar el token con los nuevos datos
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  };

  const onUpdatePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await authService.updateProfile({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      toast.success('Contraseña cambiada exitosamente');
      resetPass();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-5 fw-bold text-primary-custom">Mi Perfil</h2>

      <div className="row g-5">
        {/* COLUMNA 1: INFORMACIÓN */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h4 className="mb-4 text-secondary-custom">Información Personal</h4>
            <form onSubmit={submitInfo(onUpdateInfo)}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input className="form-control" {...registerInfo('firstName')} placeholder="Tu nombre" />
              </div>
              <div className="mb-3">
                <label className="form-label">Apellido</label>
                <input className="form-control" {...registerInfo('lastName')} placeholder="Tu apellido" />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control bg-light" value={user?.email} readOnly disabled />
                <small className="text-muted">El email no se puede cambiar.</small>
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>

        {/* COLUMNA 2: CAMBIAR CONTRASEÑA */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h4 className="mb-4 text-secondary-custom">Cambiar Contraseña</h4>
            <form onSubmit={submitPass(onUpdatePassword)}>
              <div className="mb-3">
                <label className="form-label">Contraseña Actual</label>
                <input 
                  type="password" 
                  className="form-control" 
                  {...registerPass('currentPassword', { required: true })} 
                />
                {errors.currentPassword && <small className="text-danger">Requerido</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Nueva Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  {...registerPass('newPassword', { required: true, minLength: 6 })} 
                />
                {errors.newPassword && <small className="text-danger">Mínimo 6 caracteres</small>}
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmar Nueva Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  {...registerPass('confirmPassword', { required: true })} 
                />
              </div>
              <button type="submit" className="btn btn-outline-danger mt-3" disabled={loading}>
                Actualizar Contraseña
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;