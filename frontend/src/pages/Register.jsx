import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });
      toast.success('Account created successfully! Please sign in. 🎉');
      navigate('/login');
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5 mb-5">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-lg border-0 p-4">
          <h2 className="text-center mb-4 fw-bold text-primary-custom">
            Create Account
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  placeholder="John"
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  placeholder="Doe"
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="john@example.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="******"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="******"
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || "Passwords do not match"
                })}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-accent-custom btn-lg" disabled={loading}>
                {loading ? 'Creating...' : 'Sign Up'}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <small>
              Already have an account? <Link to="/login" className="fw-bold text-secondary-custom">Sign in here</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;