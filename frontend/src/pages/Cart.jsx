import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const removeItem = (indexToRemove) => {
    const newCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2 className="fw-bold text-muted">Your cart is empty 🛒</h2>
        <p className="text-muted">Looks like you haven't added any tickets yet.</p>
        <Link to="/" className="btn btn-primary mt-3">Browse Events</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 fw-bold text-primary-custom">Your Shopping Cart</h2>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              {cartItems.map((item, index) => (
                <div key={index} className="d-flex align-items-center border-bottom p-3">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="rounded me-3 img-thumbnail-custom"
                    style={{ width: '80px', height: '80px' }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="mb-1 fw-bold text-primary-custom">{item.title}</h5>
                    <p className="mb-0 text-muted small">
                      {item.ticketType} x {item.quantity} tickets
                    </p>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold fs-5 mb-2">${(item.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => removeItem(index)} className="btn btn-sm btn-outline-danger">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4 mt-4 mt-md-0">
          <div className="card shadow border-0 p-4 bg-light">
            <h4 className="fw-bold mb-4 text-secondary-custom">Order Summary</h4>
            <div className="d-flex justify-content-between mb-3 fs-5">
              <span>Estimated Total:</span>
              <span className="fw-bold text-success">${total.toFixed(2)}</span>
            </div>
            <p className="text-muted small mb-4">
              Taxes and service fees will be calculated at checkout step.
            </p>
            <button 
              onClick={() => navigate('/checkout')} 
              className="btn btn-primary w-100 py-3 fs-5 fw-bold"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;