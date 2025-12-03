import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const EventDetails = () => {
  const { id } = useParams(); // Obtener el ID de la URL
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getById(id);
        // Ajuste: A veces el backend devuelve el objeto directo o dentro de { event: ... }
        // Si usaste el método findByPk directo en backend, devuelve el objeto.
        setEvent(data); 
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('The event could not be loaded');
        navigate('/'); // Si falla, volver al home
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleAddToCart = () => {
    // 1. Verificación de seguridad: Si NO está logueado, lo mandamos al Login y detenemos la función.
    if (!isAuthenticated) {
      toast.info('Please log in to purchase');
      navigate('/login');
      return; // SE DETIENE si no hay usuario
    }

    // 2. Obtener el carrito actual del almacenamiento local (o iniciar vacío)
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // 3. Crear el objeto del nuevo item con los datos del evento actual
    const newItem = {
      eventId: event.id,
      title: event.title,
      price: event.price,
      image: event.imageUrl,
      quantity: parseInt(quantity),
      ticketType: event.ticketType
    };

    // 4. Agregar el nuevo item a la lista
    currentCart.push(newItem);

    // 5. Guardar la lista actualizada en el almacenamiento local
    localStorage.setItem('cart', JSON.stringify(currentCart));

    // 6. Notificar y redirigir al Checkout
    toast.success('Added to cart! 🛒');
    navigate('/cart'); 
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (!event) return null;

  return (
    <div className="container mt-4">
      <button onClick={() => navigate(-1)} className="btn btn-link text-secondary-custom mb-3 ps-0 text-decoration-none">
        ← Back
      </button>
      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm border-0">
            <img 
              src={event.imageUrl || 'https://via.placeholder.com/800x400'} 
              className="card-img-top img-detail-main" 
              alt={event.title}
            />
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h2 className="fw-bold text-primary-custom mb-0">{event.title}</h2>
                <span className="badge bg-secondary-custom fs-6">
                  {event.Category ? event.Category.name : 'Event'}
                </span>
              </div>

              <div className="mb-4 text-muted">
                <p className="mb-1">
                  📅 <strong>Date:</strong> {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <p className="mb-1">
                  📍 <strong>Location:</strong> {event.location}
                </p>
              </div>
              <h5 className="fw-bold text-secondary-custom">Event Description</h5>
              <p className="card-text" style={{ whiteSpace: 'pre-line' }}>{event.description}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0 p-4 sticky-top" style={{ top: '20px' }}>
            <h4 className="fw-bold text-center mb-4 text-primary-custom">Reserve your spot</h4>
            
            <div className="mb-3">
              <label className="form-label text-muted small">Ticket Type</label>
              <input type="text" className="form-control bg-light" value={event.ticketType} disabled readOnly />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small">Price per ticket</label>
              <div className="fs-3 fw-bold text-secondary-custom">${event.price}</div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted small">Quantity</label>
              <select className="form-select form-select-lg" value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="d-grid">
              <button onClick={handleAddToCart} className="btn btn-accent-custom btn-lg py-3">
                Add to Cart 🛒
              </button>
            </div>

            <div className="mt-3 text-center">
              <small className="text-muted">
                Available: <strong>{event.availableTickets}</strong>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventDetails;