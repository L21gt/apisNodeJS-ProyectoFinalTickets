import { useState, useEffect } from 'react';
import eventService from '../../services/eventService';
import { toast } from 'react-toastify';
import CreateEventModal from './CreateEventModal';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Estados de Paginación y Filtro
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState(''); // '' (All), 'upcoming', 'past'

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Pasamos el tipo de filtro al servicio
        const data = await eventService.getAll(page, 10, filterType); 
        setEvents(data.events || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error loading events');
        setLoading(false);
      }
    };
    fetchEvents();
  }, [refreshKey, page, filterType]); // Recargar si cambia el filtro

  const handleEventCreated = () => setRefreshKey(old => old + 1);
  const handleCreate = () => { setSelectedEvent(null); setShowModal(true); };
  const handleEdit = (evt) => { setSelectedEvent(evt); setShowModal(true); };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 fw-bold text-secondary-custom">Events List</h5>
        
        <div className="d-flex gap-3">
          {/* FILTRO DE FECHA */}
          <select 
            className="form-select" 
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
          >
            <option value="">All Events</option>
            <option value="upcoming">Upcoming Only</option>
            <option value="past">Past Events</option>
          </select>

          <button className="btn btn-primary text-nowrap" onClick={handleCreate}>
            + Create Event
          </button>
        </div>
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
                        <img src={evt.imageUrl || 'https://via.placeholder.com/50'} alt={evt.title} className="img-thumbnail-custom"/>
                      </td>
                      <td><div className="fw-bold">{evt.title}</div><small className="text-muted">{evt.location}</small></td>
                      
                      {/* Colorear fecha si ya pasó */}
                      <td className={new Date(evt.date) < new Date() ? "text-danger" : "text-success"}>
                        {new Date(evt.date).toLocaleDateString()}
                      </td>
                      
                      <td><span className="badge bg-secondary-custom opacity-75">{evt.Category?.name}</span></td>
                      <td><small>Total: {evt.totalTickets}<br/>Avail: <strong>{evt.availableTickets}</strong></small></td>
                      <td className="text-end pe-4">
                        <button onClick={() => handleEdit(evt)} className="btn btn-sm btn-outline-primary me-2">✏️</button>
                        <button className="btn btn-sm btn-outline-danger">🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card-footer bg-white py-3 d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>&laquo; Prev</button>
        <span className="text-muted small">Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
        <button className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next &raquo;</button>
      </div>

      <CreateEventModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onEventCreated={handleEventCreated}
        eventToEdit={selectedEvent}
      />
    </div>
  );
};

export default EventsManager;