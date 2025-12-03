import { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import { toast } from 'react-toastify';
import CreateEventModal from './CreateEventModal';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // ESTADO NUEVO: Evento seleccionado para editar
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll();
        setEvents(data.events || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error loading events');
        setLoading(false);
      }
    };
    fetchEvents();
  }, [refreshKey]);

  const handleEventSaved = () => {
    setRefreshKey(old => old + 1);
  };

  // Abrir modal para CREAR
  const handleCreate = () => {
    setSelectedEvent(null);
    setShowModal(true);
  };

  // Abrir modal para EDITAR
  const handleEdit = (evt) => {
    setSelectedEvent(evt);
    setShowModal(true);
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 fw-bold" style={{ color: 'var(--secondary-color)' }}>Events List</h5>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Create Event
        </button>
      </div>
      
      <div className="card-body p-0">
        {loading ? (
          <div className="p-4 text-center">Loading events...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th scope="col" className="ps-4">Image</th>
                  <th scope="col">Event Name</th>
                  <th scope="col">Date</th>
                  <th scope="col">Category</th>
                  <th scope="col">Tickets</th>
                  <th scope="col" className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-4">No events found.</td></tr>
                ) : (
                  events.map((evt) => (
                    <tr key={evt.id}>
                      <td className="ps-4">
                        <img 
                          src={evt.imageUrl || 'https://via.placeholder.com/50'} 
                          alt={evt.title} 
                          className="img-thumbnail-custom"
                        />
                      </td>
                      <td>
                        <div className="fw-bold">{evt.title}</div>
                        <small className="text-muted">{evt.location}</small>
                      </td>
                      <td>{new Date(evt.date).toLocaleDateString()}</td>
                      <td>
                        <span className="badge bg-secondary-custom opacity-75">
                          {evt.Category ? evt.Category.name : 'Uncategorized'}
                        </span>
                      </td>
                      <td>
                        <small>
                          Total: {evt.totalTickets}<br/>
                          Avail: <strong>{evt.availableTickets}</strong>
                        </small>
                      </td>
                      <td className="text-end pe-4">
                        {/* BOTÓN EDITAR AGREGADO */}
                        <button 
                          onClick={() => handleEdit(evt)}
                          className="btn btn-sm btn-outline-primary me-2" 
                          title="Edit Event"
                        >
                          ✏️
                        </button>
                        <button className="btn btn-sm btn-outline-danger" title="Delete Event">🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateEventModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onEventCreated={handleEventSaved}
        eventToEdit={selectedEvent} // Pasamos el evento a editar
      />
    </div>
  );
};

export default EventsManager;