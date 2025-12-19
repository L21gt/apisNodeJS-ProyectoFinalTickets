import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext'; // Usamos el hook
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Función login del contexto

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // 1. Enviamos datos al Backend
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });

      // 2. CORRECCIÓN: Usamos la respuesta del servidor para loguearnos
      // response.user trae el ID y el Rol. response.token trae el JWT.
      if (response && response.token && response.user) {
        login(response.user, response.token);
        toast.success('Registration successful! Welcome 🎉');
        navigate('/');
      } else {
        // Fallback por si la API no auto-loguea
        toast.success('Registration successful! Please login.');
        navigate('/login');
      }

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="text-center fw-bold text-primary-custom mb-4">Create Account</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">First Name</label>
                    <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Last Name</label>
                    <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Password</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Confirm Password</label>
                  <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <div className="text-center mt-3">
                <small className="text-muted">Already have an account? </small>
                <Link to="/login" className="fw-bold text-decoration-none">Log in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;