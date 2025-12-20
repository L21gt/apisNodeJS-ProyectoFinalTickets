import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Enviamos credenciales al Backend
      const response = await authService.login(formData);
      
      // 2. Usa los datos que devuelve el servidor (response.user), 
      // NO los datos del formulario (formData).
      // El servidor es el que sabe el rol, tu id y tu nombre.
      if (response && response.token && response.user) {
        login(response.user, response.token); 
        toast.success(`Welcome back, ${response.user.firstName}! 👋`);
        navigate('/');
      } else {
        toast.error('Login failed: Invalid response from server');
      }

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0 rounded-3">
            <div className="card-body p-5">
              <h3 className="text-center fw-bold text-primary-custom mb-4">Welcome Back</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control form-control-lg" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">Password</label>
                  <input 
                    type="password" 
                    className="form-control form-control-lg" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 fw-bold mb-3"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="text-center mt-3">
                <small className="text-muted">Don't have an account? </small>
                <Link to="/register" className="fw-bold text-decoration-none">Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;