import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Cargar el carrito al iniciar
  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('You must log in to pay');
      navigate('/login');
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (savedCart.length === 0) {
      toast.info('Your cart is empty');
      navigate('/');
    }
    setCartItems(savedCart);
  }, [isAuthenticated, navigate]);

  // 2. Calcular Totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceFee = subtotal * 0.10; // 10% de cargo por servicio simulado
  const total = subtotal + serviceFee;

  // 3. Procesar el Pago
  const onSubmit = async (cardData) => {
    setLoading(true);
    try {
      // Procesamos cada item del carrito
      for (const item of cartItems) {
        await ticketService.purchase({
          eventId: item.eventId,
          quantity: item.quantity,
          cardDetails: {
            number: cardData.cardNumber,
            name: cardData.cardName,
            expiry: cardData.expiry,
            cvv: cardData.cvv
          }
        });
      }

      // Si todo sale bien:
      toast.success('Purchase completed successfully! 🎉');
      localStorage.removeItem('cart'); // Limpiar carrito
      navigate('/confirmation'); // Redirigir a "Mis Tickets"

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Payment processing error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold text-primary-custom">Checkout</h2>

      <div className="row">
        <div className="col-md-7 mb-4">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="mb-3 text-secondary-custom">Payment Method</h4>
            <p className="text-muted small">Enter your card details (Simulation).</p>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label className="form-label">Name on Card</label>
                <input className="form-control" placeholder="John Doe" {...register('cardName', { required: true })} />
                {errors.cardName && <small className="text-danger">Required</small>}
              </div>

              <div className="mb-3">
                <label className="form-label">Card Number</label>
                <input className="form-control" placeholder="0000 0000 0000 0000" maxLength="16" {...register('cardNumber', { required: true, minLength: 16 })} />
                {errors.cardNumber && <small className="text-danger">Invalid number</small>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Expiry (MM/YY)</label>
                  <input className="form-control" placeholder="12/25" {...register('expiry', { required: true })} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">CVV</label>
                  <input className="form-control" placeholder="123" maxLength="3" {...register('cvv', { required: true })} />
                </div>
              </div>

              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox" required />
                <label className="form-check-label small">
                  I accept the Terms and Conditions and Privacy Policy.
                </label>
              </div>

              <button type="submit" className="btn btn-accent-custom w-100 py-3 fs-5" disabled={loading}>
                {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow border-0 p-4 bg-light">
            <h4 className="mb-4 text-primary-custom">Order Summary</h4>
            
            {cartItems.map((item, index) => (
              <div key={index} className="d-flex mb-3 pb-3 border-bottom">
                <img 
                  src={item.image} 
                  alt="evt" 
                  className="rounded me-3" 
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-bold">{item.title}</h6>
                  <small className="text-muted">{item.ticketType} x {item.quantity}</small>
                </div>
                <div className="fw-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3 text-muted">
              <span>Service Fee (10%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            
            <div className="d-flex justify-content-between fs-4 fw-bold text-secondary-custom border-top pt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;