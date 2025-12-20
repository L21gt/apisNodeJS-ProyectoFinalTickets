import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import ticketService from '../services/ticketService';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { user } = useAuth(); // Obtenemos el usuario del contexto
  const navigate = useNavigate();
  
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Datos simulados de tarjeta
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: ''
  });

  // 1. Validar Sesión y Carrito al cargar
  useEffect(() => {
    // Si no hay usuario, mandar al login
    if (!user) {
      toast.warning('Please log in to complete your purchase');
      navigate('/login');
      return;
    }

    // Cargar carrito
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      toast.info('Your cart is empty');
      navigate('/');
      return;
    }
    setCart(savedCart);
    
    // Pre-llenar nombre en la tarjeta con el nombre del usuario
    setCardDetails(prev => ({ ...prev, name: `${user.firstName} ${user.lastName}` }));

  }, [user, navigate]);

  const handleInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Procesamos cada ítem del carrito individualmente
      // backend procesa una compra a la vez
      for (const item of cart) {
        await ticketService.purchase({
          eventId: item.eventId,
          quantity: item.quantity,
          cardDetails: { 
            number: cardDetails.number // Enviamos tarjeta para validación (mock)
          }
        });
      }

      // Si todo sale bien:
      toast.success('Purchase successful! Enjoy your events 🎉');
      
      // Limpiar carrito
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event("storage")); // Actualizar contador del navbar
      
      // Redirigir a confirmación o tickets
      navigate('/my-tickets');

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Transaction failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Evita parpadeos mientras redirige

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 fw-bold text-primary-custom">Checkout</h2>
      
      <div className="row">
        {/* Columna Izquierda: Formulario de Pago */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Payment Details 💳</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handlePayment}>
                <div className="mb-3">
                  <label className="form-label small text-muted fw-bold">Cardholder Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="name"
                    value={cardDetails.name} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label small text-muted fw-bold">Card Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="number"
                    value={cardDetails.number} 
                    onChange={handleInputChange} 
                    placeholder="0000 0000 0000 0000"
                    minLength="16"
                    maxLength="19"
                    required 
                  />
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label small text-muted fw-bold">Expiry Date</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="expiry"
                      value={cardDetails.expiry} 
                      onChange={handleInputChange} 
                      placeholder="MM/YY"
                      required 
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label small text-muted fw-bold">CVC</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="cvc"
                      value={cardDetails.cvc} 
                      onChange={handleInputChange} 
                      placeholder="123"
                      maxLength="4"
                      required 
                    />
                  </div>
                </div>

                <div className="alert alert-info small mt-2">
                  <i className="bi bi-info-circle"></i> This is a secure payment simulation. No real money will be charged.
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success w-100 py-3 fw-bold fs-5 mt-3"
                  disabled={loading}
                >
                  {loading ? 'Processing Payment...' : `Pay $${calculateTotal().toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen de Orden */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 bg-light">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 text-secondary-custom">Order Summary</h5>
              
              {cart.map((item, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                  <div>
                    <h6 className="mb-0 fw-bold">{item.title}</h6>
                    <small className="text-muted">{item.quantity} x {item.ticketType}</small>
                  </div>
                  <span className="fw-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-4 fs-5 fw-bold text-dark">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;