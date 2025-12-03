import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const dateObj = new Date(event.date);
  const dateStr = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm border-0 transition-hover">
        
        {/* Imagen limpia usando clase CSS */}
        <div className="overflow-hidden rounded-top">
          <img 
            src={event.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'} 
            className="card-img-top w-100 img-card-custom" 
            alt={event.title}
          />
        </div>

        <div className="card-body d-flex flex-column">
          {/* Categoría */}
          <div className="mb-2">
            <span className="badge bg-secondary-custom text-white">
              {event.Category ? event.Category.name : 'Events'}
            </span>
          </div>

          {/* Título (Usando clase personalizada) */}
          <h5 className="card-title fw-bold text-truncate text-primary-custom">
            {event.title}
          </h5>

          {/* Detalles */}
          <p className="card-text text-muted small mb-1">
            📍 {event.location}
          </p>
          <p className="card-text text-muted small mb-3">
            📅 {dateStr} • {timeStr}
          </p>

          {/* Precio y Botón */}
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <span className="fw-bold fs-5 text-secondary-custom">
              ${event.price}
            </span>
            <Link 
              to={`/event/${event.id}`} 
              className="btn btn-sm btn-outline-primary fw-bold"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;