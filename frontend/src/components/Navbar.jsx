import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* EL LOGO YA FUNCIONA COMO HOME */}
        <Link className="navbar-brand fw-bold text-uppercase" to="/">
          🎟️ Events4U
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-tickets">My Tickets</Link>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link text-warning" to="/admin">Admin Panel</Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            ) : (
              <div className="dropdown">
                <button 
                  className="btn btn-secondary btn-sm dropdown-toggle d-flex align-items-center gap-2" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <span>👤 {user.firstName}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
            <Link to="/cart" className="btn btn-light btn-sm position-relative">
              🛒
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;