import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import reportService from '../../services/reportService';
import eventService from '../../services/eventService'; 
import { toast } from 'react-toastify';

// Chart.js Imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, 
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales'); // 'sales' or 'attendees'
  
  // Sales Report State
  const { register: registerSales, handleSubmit: handleSalesSubmit } = useForm();
  const [salesData, setSalesData] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [searchedSales, setSearchedSales] = useState(false);

  // Attendees List State
  const { register: registerAttendees, handleSubmit: handleAttendeesSubmit } = useForm();
  const [attendeesData, setAttendeesData] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [eventsList, setEventsList] = useState([]);

  // Load events for the dropdown (Attendees tab)
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await eventService.getAll();
        setEventsList(data.events || []);
      } catch (error) {
        console.error("Error loading events list", error);
      }
    };
    loadEvents();
  }, []);

  // --- SALES LOGIC ---
  const onSalesSubmit = async (data) => {
    if (new Date(data.endDate) < new Date(data.startDate)) {
      toast.warning('End date cannot be before start date');
      return;
    }
    setSalesLoading(true);
    setSearchedSales(true);
    try {
      const result = await reportService.getSales(data.startDate, data.endDate);
      setSalesData(result);
    } catch (error) {
      console.error(error);
      toast.error('Error generating sales report');
    } finally {
      setSalesLoading(false);
    }
  };

  // Prepare Chart Data
  // We group sales by date for the chart
  const salesByDate = salesData.reduce((acc, sale) => {
    const date = new Date(sale.createdAt).toLocaleDateString('en-US');
    acc[date] = (acc[date] || 0) + parseFloat(sale.totalPrice);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(salesByDate).reverse(), // Dates
    datasets: [
      {
        label: 'Revenue ($)',
        data: Object.values(salesByDate).reverse(), // Amounts
        borderColor: '#1B4079', // Yale Blue
        backgroundColor: 'rgba(27, 64, 121, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sales Trend' },
    },
  };

  const totalRevenue = salesData.reduce((sum, sale) => sum + parseFloat(sale.totalPrice), 0);

  // --- ATTENDEES LOGIC ---
  const onAttendeesSubmit = async (data) => {
    if (!data.eventId) {
      toast.warning('Please select an event');
      return;
    }
    setAttendeesLoading(true);
    try {
      const result = await reportService.getAttendees(data.eventId);
      setAttendeesData(result);
      if (result.length === 0) toast.info('No attendees found for this event yet.');
    } catch (error) {
      console.error(error);
      toast.error('Error loading attendees list');
    } finally {
      setAttendeesLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      {/* TABS HEADER */}
      <div className="card-header bg-white pt-3 pb-0">
        <ul className="nav nav-tabs card-header-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'sales' ? 'active fw-bold text-primary-custom' : 'text-muted'}`}
              onClick={() => setActiveTab('sales')}
            >
              📊 Sales Report
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'attendees' ? 'active fw-bold text-primary-custom' : 'text-muted'}`}
              onClick={() => setActiveTab('attendees')}
            >
              👥 Attendees List
            </button>
          </li>
        </ul>
      </div>
      
      <div className="card-body p-4">
        
        {/* === TAB 1: SALES REPORT === */}
        {activeTab === 'sales' && (
          <div className="fade-in">
            <form onSubmit={handleSalesSubmit(onSalesSubmit)} className="row g-3 align-items-end mb-4">
              <div className="col-md-4">
                <label className="form-label fw-bold">Start Date</label>
                <input type="date" className="form-control" {...registerSales('startDate', { required: true })} />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-bold">End Date</label>
                <input type="date" className="form-control" {...registerSales('endDate', { required: true })} />
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary w-100" disabled={salesLoading}>
                  {salesLoading ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </form>

            {searchedSales && (
              <>
                <hr />
                {/* CHART SECTION */}
                {salesData.length > 0 ? (
                  <div className="mb-5 p-3 bg-light rounded" style={{ height: '350px' }}>
                    <Line data={chartData} options={chartOptions} />
                  </div>
                ) : (
                  <div className="alert alert-info text-center">No sales found in this date range.</div>
                )}

                {/* TABLE SECTION */}
                {salesData.length > 0 && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="text-secondary-custom">Detailed Transaction Log</h6>
                      <h4 className="fw-bold text-success">Total Revenue: ${totalRevenue.toFixed(2)}</h4>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="bg-light">
                          <tr>
                            <th className="ps-4">Date</th>
                            <th>Event</th>
                            <th>Customer</th>
                            <th>Qty</th>
                            <th className="text-end pe-4">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesData.map((sale) => (
                            <tr key={sale.id}>
                              <td className="ps-4 small text-muted">
                                {new Date(sale.createdAt).toLocaleDateString('en-US')} <br/>
                                {new Date(sale.createdAt).toLocaleTimeString('en-US')}
                              </td>
                              <td className="fw-bold">{sale.Event?.title || 'Deleted Event'}</td>
                              <td>
                                {sale.User?.firstName} {sale.User?.lastName}<br/>
                                <span className="small text-muted">{sale.User?.email}</span>
                              </td>
                              <td>{sale.quantity}</td>
                              <td className="text-end pe-4 fw-bold text-secondary-custom">
                                ${sale.totalPrice}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* === TAB 2: ATTENDEES LIST === */}
        {activeTab === 'attendees' && (
          <div className="fade-in">
            <form onSubmit={handleAttendeesSubmit(onAttendeesSubmit)} className="row g-3 align-items-end mb-4">
              <div className="col-md-8">
                <label className="form-label fw-bold">Select Event</label>
                <select className="form-select" {...registerAttendees('eventId', { required: true })}>
                  <option value="">-- Choose an event --</option>
                  {eventsList.map(evt => (
                    <option key={evt.id} value={evt.id}>{evt.title}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-secondary w-100" disabled={attendeesLoading}>
                  {attendeesLoading ? 'Loading...' : 'Get Attendee List'}
                </button>
              </div>
            </form>

            <hr />

            {attendeesData.length > 0 && (
              <>
                <div className="d-flex justify-content-between mb-3 align-items-center">
                  <h5 className="fw-bold text-secondary-custom">Guest List ({attendeesData.length})</h5>
                  <button className="btn btn-sm btn-outline-success" onClick={() => window.print()}>
                    🖨️ Print List
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="ps-4">Attendee Name</th>
                        <th>Email</th>
                        <th>Ticket Type</th>
                        <th>Qty</th>
                        <th>Order ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendeesData.map((t) => (
                        <tr key={t.id}>
                          <td className="ps-4 fw-bold">{t.User?.firstName} {t.User?.lastName}</td>
                          <td>{t.User?.email}</td>
                          <td><span className="badge bg-info text-dark">Standard</span></td>
                          <td>{t.quantity}</td>
                          <td className="font-monospace small text-muted">{t.orderId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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