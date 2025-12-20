import { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import eventService from '../../services/eventService';
import { toast } from 'react-toastify';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales'); // 'sales' or 'attendees'
  
  // --- ESTADOS DE REPORTE DE VENTAS ---
  const [salesData, setSalesData] = useState([]);
  const [salesPage, setSalesPage] = useState(1);
  const [salesTotalPages, setSalesTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // --- ESTADOS DE LISTA DE ASISTENTES ---
  const [eventsList, setEventsList] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendeesData, setAttendeesData] = useState([]);
  const [attendeesPage, setAttendeesPage] = useState(1);
  const [attendeesTotalPages, setAttendeesTotalPages] = useState(1);

  // 1. SE DEFINE LA FUNCIÓN PRIMERO
  const fetchSales = async () => {
    try {
      // Usamos el estado actual de la página y fechas
      const data = await reportService.getSales(salesPage, 10, dateRange.start, dateRange.end);
      setSalesData(data.sales || []);
      setSalesTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error('Error loading sales report');
    }
  };

  // 2. LUEGO EL EFECTO QUE LA USA
  useEffect(() => {
    if (activeTab === 'sales') {
      fetchSales();
    }
    // Desactivamos la advertencia de dependencias para evitar bucles con 'fetchSales'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, salesPage]); 

  // Cargar Lista de Eventos (para el selector)
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventService.getAll(1, 100);
        setEventsList(data.events || []);
      } catch (error) { console.error(error); }
    };
    loadEvents();
  }, []);

  // Cargar Asistentes cuando se elige evento o cambia página
  useEffect(() => {
    if (activeTab === 'attendees' && selectedEventId) {
      const fetchAttendees = async () => {
        try {
          const data = await reportService.getAttendees(selectedEventId, attendeesPage, 10);
          setAttendeesData(data.attendees || []);
          setAttendeesTotalPages(data.totalPages || 1);
        } catch (error) {
          console.error(error);
          toast.error('Error loading attendees');
        }
      };
      fetchAttendees();
    }
  }, [selectedEventId, attendeesPage, activeTab]);

  const handleEventChange = (e) => {
    setSelectedEventId(e.target.value);
    setAttendeesPage(1);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setSalesPage(1); 
    fetchSales(); // Llamada manual al filtrar
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white">
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'sales' ? 'active fw-bold text-primary' : 'text-muted'}`}
              onClick={() => setActiveTab('sales')}
            >
              💰 Sales Report
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'attendees' ? 'active fw-bold text-primary' : 'text-muted'}`}
              onClick={() => setActiveTab('attendees')}
            >
              👥 Attendees List
            </button>
          </li>
        </ul>
      </div>

      <div className="card-body">
        {/* --- PESTAÑA VENTAS --- */}
        {activeTab === 'sales' && (
          <div>
            {/* Filtros */}
            <form onSubmit={handleFilterSubmit} className="row g-3 mb-4 align-items-end">
              <div className="col-md-3">
                <label className="form-label small fw-bold">Start Date</label>
                <input type="date" className="form-control" onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">End Date</label>
                <input type="date" className="form-control" onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
              </div>
              <div className="col-md-2">
                <button type="submit" className="btn btn-primary w-100">Filter</button>
              </div>
            </form>

            {/* Tabla Ventas */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="bg-light">
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Event</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4">No sales records found.</td></tr>
                  ) : (
                    salesData.map(sale => (
                      <tr key={sale.id}>
                        <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                        <td>{sale.User?.firstName} {sale.User?.lastName}<br/><small className="text-muted">{sale.User?.email}</small></td>
                        <td>{sale.Event?.title}</td>
                        <td>{sale.quantity}</td>
                        <td className="fw-bold text-success">${sale.totalPrice}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación Ventas */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button className="btn btn-outline-secondary btn-sm" disabled={salesPage === 1} onClick={() => setSalesPage(p => p - 1)}>&laquo; Prev</button>
              <span className="small">Page <strong>{salesPage}</strong> of <strong>{salesTotalPages}</strong></span>
              <button className="btn btn-outline-secondary btn-sm" disabled={salesPage === salesTotalPages} onClick={() => setSalesPage(p => p + 1)}>Next &raquo;</button>
            </div>
          </div>
        )}

        {/* --- PESTAÑA ASISTENTES --- */}
        {activeTab === 'attendees' && (
          <div>
            <div className="mb-4">
              <label className="form-label fw-bold">Select Event:</label>
              <select className="form-select" onChange={handleEventChange} value={selectedEventId}>
                <option value="">-- Choose an Event --</option>
                {eventsList.map(evt => (
                  <option key={evt.id} value={evt.id}>{evt.title}</option>
                ))}
              </select>
            </div>

            {selectedEventId && (
              <>
                <div className="table-responsive">
                  <table className="table table-striped align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Purchase Date</th>
                        <th>Ticket ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendeesData.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-4">No attendees yet.</td></tr>
                      ) : (
                        attendeesData.map((t, idx) => (
                          <tr key={t.id}>
                            <td>{((attendeesPage - 1) * 10) + idx + 1}</td>
                            <td className="fw-bold">{t.User?.firstName} {t.User?.lastName}</td>
                            <td>{t.User?.email}</td>
                            <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                            <td><small className="font-monospace text-muted">{t.orderId.substring(0,8)}...</small></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Paginación Asistentes */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <button className="btn btn-outline-secondary btn-sm" disabled={attendeesPage === 1} onClick={() => setAttendeesPage(p => p - 1)}>&laquo; Prev</button>
                  <span className="small">Page <strong>{attendeesPage}</strong> of <strong>{attendeesTotalPages}</strong></span>
                  <button className="btn btn-outline-secondary btn-sm" disabled={attendeesPage === attendeesTotalPages} onClick={() => setAttendeesPage(p => p + 1)}>Next &raquo;</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;