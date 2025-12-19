import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      if (formData.currentPassword && formData.newPassword) {
        dataToSend.currentPassword = formData.currentPassword;
        dataToSend.newPassword = formData.newPassword;
      }

      // --- CORRECCIÓN AQUÍ ---
      // Eliminamos 'const updatedUser =' porque no lo usábamos.
      // Solo esperamos a que la operación termine.
      await userService.update(user.id, dataToSend);
      // -----------------------

      // Actualizar estado global
      const newUserState = { ...user, ...dataToSend };
      localStorage.setItem('user', JSON.stringify(newUserState));
      if (setUser) setUser(newUserState);

      toast.success('Profile updated successfully! 🚀');
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Error updating profile';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h4 className="mb-0 fw-bold text-primary-custom">My Profile</h4>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">First Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-secondary">Last Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-secondary">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control bg-light" 
                    name="email"
                    value={formData.email}
                    readOnly
                    title="Email cannot be changed"
                  />
                  <div className="form-text">Email cannot be changed directly.</div>
                </div>

                <hr className="my-4" />
                <h6 className="fw-bold text-secondary-custom mb-3">Security (Optional)</h6>

                <div className="mb-3">
                  <label className="form-label small">Current Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password to save changes"
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label small">New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg fw-bold" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;