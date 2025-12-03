import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-white py-4 mt-auto" style={{ backgroundColor: 'var(--primary-color)' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="fw-bold">EVENTS4U 🎟️</h5>
            <p className="small opacity-75">
              Your trusted platform for the best events.<br/>
              © 2025 All rights reserved.
            </p>
          </div>
          
          <div className="col-md-6 text-md-end">
            <h6 className="fw-bold mb-3">Legal & Support</h6>
            <ul className="list-unstyled d-inline-flex gap-3">
              <li>
                <Link to="/terms" className="text-white text-decoration-none opacity-75 hover-opacity-100">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white text-decoration-none opacity-75 hover-opacity-100">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white text-decoration-none opacity-75 hover-opacity-100">
                  Help / Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;