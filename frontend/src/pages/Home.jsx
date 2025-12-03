import { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll();
        setEvents(data.events || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(evt => 
    evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evt.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* 1. HERO SECTION (Usando clase bg-gradient-custom) */}
      <div className="p-5 mb-4 rounded-3 text-white text-center bg-gradient-custom">
        <h1 className="display-4 fw-bold">Welcome to EVENTS4U</h1>
        <p className="lead">Discover and book the best events in the city.</p>
        
        <div className="d-flex justify-content-center mt-4">
          <input 
            type="text" 
            className="form-control form-control-lg w-50 shadow-sm" 
            placeholder="🔍 Search for events, places..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 2. LISTA DE EVENTOS */}
      <div className="container">
        {/* Usando clase border-bottom-custom */}
        <h3 className="mb-4 fw-bold pb-2 border-bottom-custom text-secondary-custom">
          Upcoming Events
        </h3>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Loading showtimes...</p>
          </div>
        ) : (
          <div className="row">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(evt => (
                <EventCard key={evt.id} event={evt} />
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4 className="text-muted">No events were found 😢</h4>
                <p>Try another search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;