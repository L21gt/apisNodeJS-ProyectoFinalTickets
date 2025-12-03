import { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketService.getMyTickets();
        setTickets(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error loading your tickets');
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold text-primary-custom">My Tickets</h2>

      {tickets.length === 0 ? (
        <div className="text-center py-5 bg-white rounded shadow-sm">
          <h4>You have no tickets yet 🎟️</h4>
          <p className="text-muted">Explore events and save your spot!</p>
          <Link to="/" className="btn btn-primary mt-3">Go to Home</Link>
        </div>
      ) : (
        <div className="row">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="col-12 mb-3">
              <div className="card shadow-sm border-0 overflow-hidden">
                <div className="row g-0">
                  {/* Columna Imagen */}
                  <div className="col-md-3 col-lg-2">
                    <img 
                      src={ticket.Event?.imageUrl || 'https://via.placeholder.com/150'} 
                      className="img-fluid h-100 w-100" 
                      alt="Evento"
                      style={{ objectFit: 'cover', minHeight: '150px' }}
                    />
                  </div>
                  
                  {/* Columna Detalles */}
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
                        <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2">
                          Confirmed
                        </span>
                      </div>

                      <div className="row mt-3">
                        <div className="col-md-4">
                          <small className="text-muted d-block">Order ID</small>
                          <span className="font-monospace small">{ticket.orderId}</span>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted d-block">Tickets</small>
                          <span className="fw-bold">{ticket.quantity} x {ticket.Event?.ticketType}</span>
                        </div>
                        <div className="col-md-4 text-md-end mt-2 mt-md-0">
                          <small className="text-muted d-block">Total Paid</small>
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
    </div>
  );
};

export default MyTickets;