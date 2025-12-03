import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card p-4">
          <h2 className="text-center mb-4 fw-bold text-primary-custom">
            Sign In
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="name@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="********"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            <div className="d-grid gap-2 mt-4">
              <button type="submit" className="btn btn-primary btn-lg">
                Sign In
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <small>
              Don't have an account? <Link to="/register" className="fw-bold">Sign up here</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;