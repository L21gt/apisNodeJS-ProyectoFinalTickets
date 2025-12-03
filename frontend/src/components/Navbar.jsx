import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">EVENTS4U 🎟️</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">Contact Us</NavLink>
            </li>

            {/* Cart Link (Visible to all) */}
            <li className="nav-item">
              <NavLink className="nav-link position-relative" to="/cart">
                🛒 Cart
              </NavLink>
            </li>

            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Sign In</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link btn btn-accent-custom px-4 ms-2" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {/* My Tickets (Logged users) */}
                <li className="nav-item">
                  <NavLink className="nav-link" to="/my-tickets">My Tickets</NavLink>
                </li>

                {user.role === 'admin' && (
                  <li className="nav-item">
                    <NavLink className="nav-link text-warning" to="/admin">Admin Panel</NavLink>
                  </li>
                )}
                
                <li className="nav-item ms-3">
                  <NavLink to="/profile" className="nav-link text-white fw-bold">
                    Hello, {user.firstName || (user.role === 'admin' ? 'Admin' : 'User')}
                  </NavLink>
                </li>
                
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-link nav-link text-danger">Log Out</button>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;