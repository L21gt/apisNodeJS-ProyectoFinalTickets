import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import { useAuth } from '../context/AuthContext'; // Importar hook
import { toast } from 'react-toastify';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener usuario real
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getById(id);
        setEvent(data);
      } catch (error) {
        console.error(error);
        toast.error('Event not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const addToCart = () => {
    // 1. VALIDACIÓN DE SESIÓN
    if (!user) {
      toast.info('Please log in to purchase tickets 🎟️');
      navigate('/login'); // Aquí es donde te redirigía antes
      return;
    }

    // 2. Lógica de Carrito (LocalStorage)
    const cartItem = {
      eventId: event.id,
      title: event.title,
      price: event.price,
      image: event.imageUrl,
      ticketType: event.ticketType,
      quantity: parseInt(quantity)
    };

    // Obtener carrito actual
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Verificar si ya existe para sumar cantidad
    const existingItemIndex = currentCart.findIndex(item => item.eventId === event.id);
    
    if (existingItemIndex >= 0) {
      currentCart[existingItemIndex].quantity += parseInt(quantity);
    } else {
      currentCart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event("storage")); // Notificar al Navbar para actualizar contador
    toast.success(`${quantity} tickets added to cart! 🛒`);
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (!event) return null;

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Imagen */}
        <div className="col-md-6 mb-4">
          <img src={event.imageUrl} className="img-fluid rounded shadow" alt={event.title} />
        </div>

        {/* Detalles */}
        <div className="col-md-6">
          <h2 className="fw-bold text-primary-custom">{event.title}</h2>
          <p className="text-muted fs-5">📅 {new Date(event.date).toLocaleDateString()} • 📍 {event.location}</p>
          
          <div className="my-4">
            <h4 className="fw-bold text-success">${event.price} <small className="text-muted fs-6">/ ticket</small></h4>
            <span className="badge bg-secondary-custom me-2">{event.Category?.name}</span>
            <span className={`badge ${event.availableTickets > 0 ? 'bg-success' : 'bg-danger'}`}>
              {event.availableTickets > 0 ? `${event.availableTickets} Available` : 'Sold Out'}
            </span>
          </div>

          <p className="lead" style={{fontSize: '1rem'}}>{event.description}</p>

          <hr />

          {/* Selector de Cantidad y Botón */}
          {event.availableTickets > 0 ? (
            <div className="d-flex align-items-end gap-3 mt-4">
              <div style={{maxWidth: '100px'}}>
                <label className="form-label fw-bold small">Quantity</label>
                <input 
                  type="number" 
                  className="form-control" 
                  min="1" 
                  max={Math.min(10, event.availableTickets)} // Máximo 10 o los que queden
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                />
              </div>
              <button 
                className="btn btn-primary btn-lg fw-bold flex-grow-1"
                onClick={addToCart}
              >
                Add to Cart 🛒
              </button>
            </div>
          ) : (
            <div className="alert alert-danger fw-bold text-center">
              🚫 This event is Sold Out
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;