import { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import categoryService from '../services/categoryService';
import EventCard from '../components/EventCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cargar Categorías (Solo una vez)
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Cargar Eventos (Cada vez que cambie Página, Categoría o Búsqueda)
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Enviamos TODOS los filtros al backend
        const data = await eventService.getAll(page, 9, 'upcoming', selectedCategory, searchTerm);
        
        setEvents(data.events || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce simple: Esperar un poco si el usuario está escribiendo búsqueda
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(timeoutId);

  }, [page, selectedCategory, searchTerm]); 

  // Resetear a página 1 cuando cambian los filtros (importante para no quedar en pag 10 sin resultados)
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1); 
  };

  const handlePrev = () => { if (page > 1) setPage(p => p - 1); };
  const handleNext = () => { if (page < totalPages) setPage(p => p + 1); };

  return (
    <div>
      {/* HERO SECTION */}
      <div className="p-5 mb-4 rounded-3 text-white text-center bg-gradient-custom">
        <h1 className="display-4 fw-bold">Welcome to EVENTS4U</h1>
        <p className="lead">Discover and book the best events in the city.</p>
        
        <div className="row justify-content-center mt-4 g-2">
          {/* Buscador de Texto */}
          <div className="col-md-5">
            <input 
              type="text" 
              className="form-control form-control-lg shadow-sm" 
              placeholder="🔍 Search events, locations..." 
              value={searchTerm}
              // Al escribir, reseteamos a página 1
              onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
            />
          </div>
          
          {/* Filtro de Categoría */}
          <div className="col-md-3">
            <select 
              className="form-select form-select-lg shadow-sm cursor-pointer"
              value={selectedCategory}
              // Al cambiar categoría, reseteamos a página 1
              onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* EVENT LIST */}
      <div className="container mb-5">
        <div className="d-flex justify-content-between align-items-center border-bottom-custom pb-2 mb-4">
          <h3 className="fw-bold text-secondary-custom mb-0">Upcoming Events</h3>
          {/* Mostramos el total real que viene del backend */}
          <small className="text-muted">Page {page} of {totalPages}</small>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2">Finding best events...</p>
          </div>
        ) : (
          <>
            <div className="row">
              {events.length > 0 ? (
                events.map(evt => (
                  <EventCard key={evt.id} event={evt} />
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <h4 className="text-muted">No events match your filters 😢</h4>
                  <p>Try a different category or search term.</p>
                  <button 
                    className="btn btn-link" 
                    onClick={() => { setSearchTerm(''); setSelectedCategory(''); setPage(1); }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
                <button className="btn btn-outline-secondary px-4" disabled={page === 1} onClick={handlePrev}>&laquo; Previous</button>
                <span className="text-muted fw-bold">Page {page} of {totalPages}</span>
                <button className="btn btn-outline-secondary px-4" disabled={page === totalPages} onClick={handleNext}>Next &raquo;</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;