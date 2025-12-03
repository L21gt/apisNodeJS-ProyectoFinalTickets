import { Link } from 'react-router-dom';

const PurchaseConfirmation = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="card shadow-lg border-0 p-5 d-inline-block" style={{ maxWidth: '600px' }}>
        <div className="mb-4 text-success display-1">
          ✅
        </div>
        <h2 className="fw-bold text-primary-custom mb-3">Thank you for your purchase!</h2>
        <p className="text-muted mb-4 lead">
          Your order has been processed successfully. We have sent the details to your email.
        </p>
        
        <div className="d-grid gap-3 col-8 mx-auto">
          <Link to="/my-tickets" className="btn btn-primary btn-lg">
            View My Tickets 🎟️
          </Link>
          <Link to="/" className="btn btn-outline-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmation;