import { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros y Paginación
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' o 'history'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        // Llamamos al servicio con el tipo (filtro) y página
        const data = await ticketService.getMyTickets(activeTab, page);
        setTickets(data.tickets || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error loading tickets');
        setLoading(false);
      }
    };
    fetchTickets();
  }, [activeTab, page]); // Recargar si cambia el Tab o la Página

  // Resetear a página 1 cuando cambiamos de tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 fw-bold text-primary-custom">My Tickets</h2>

      {/* TABS DE NAVEGACIÓN */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link px-4 ${activeTab === 'upcoming' ? 'active fw-bold text-primary-custom' : 'text-muted'}`}
            onClick={() => handleTabChange('upcoming')}
          >
            🎫 Active Tickets
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link px-4 ${activeTab === 'history' ? 'active fw-bold text-primary-custom' : 'text-muted'}`}
            onClick={() => handleTabChange('history')}
          >
            📜 Transaction History
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <>
          {tickets.length === 0 ? (
            <div className="text-center py-5 bg-white rounded shadow-sm border">
              <h4>No tickets found in this section 🕵️</h4>
              <p className="text-muted">Check the other tab or explore events.</p>
              <Link to="/" className="btn btn-primary mt-3">Go to Home</Link>
            </div>
          ) : (
            <div className="row">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="col-12 mb-3">
                  <div className="card shadow-sm border-0 overflow-hidden">
                    <div className="row g-0">
                      <div className="col-md-3 col-lg-2 bg-light d-flex align-items-center justify-content-center">
                        <img 
                          src={ticket.Event?.imageUrl || 'https://via.placeholder.com/150'} 
                          className="img-fluid" 
                          alt="Event"
                          style={{ objectFit: 'cover', height: '100%', minHeight: '140px' }}
                        />
                      </div>
                      
                      <div className="col-md-9 col-lg-10">
                        <div className="card-body h-100 d-flex flex-column justify-content-center">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="card-title fw-bold text-primary-custom mb-1">
                                {ticket.Event?.title || 'Event Deleted'}
                              </h5>
                              <p className="card-text text-muted small mb-2">
                                📅 {new Date(ticket.Event?.date).toLocaleDateString()} • 
                                📍 {ticket.Event?.location}
                              </p>
                            </div>
                            <span className={`badge ${activeTab === 'upcoming' ? 'bg-success' : 'bg-secondary'} px-3 py-2`}>
                              {activeTab === 'upcoming' ? 'Valid' : 'Completed'}
                            </span>
                          </div>

                          <div className="row mt-3 border-top pt-3">
                            <div className="col-md-4">
                              <small className="text-muted d-block text-uppercase" style={{fontSize: '0.75rem'}}>Order ID</small>
                              <span className="font-monospace text-dark">{ticket.orderId}</span>
                            </div>
                            <div className="col-md-4">
                              <small className="text-muted d-block text-uppercase" style={{fontSize: '0.75rem'}}>Tickets</small>
                              <span className="fw-bold">{ticket.quantity} x {ticket.Event?.ticketType}</span>
                            </div>
                            <div className="col-md-4 text-md-end mt-2 mt-md-0">
                              <small className="text-muted d-block text-uppercase" style={{fontSize: '0.75rem'}}>Total Paid</small>
                              <span className="fs-5 fw-bold text-secondary-custom">${ticket.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4 gap-3 align-items-center">
              <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                &laquo; Prev
              </button>
              <span className="text-muted">Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
              <button className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Next &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyTickets;