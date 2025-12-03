import { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import { toast } from 'react-toastify';

// Componente interno para las tarjetas (Cards)
const StatCard = ({ title, value, color, icon }) => (
  <div className="col-md-3 mb-4">
    <div className="card shadow-sm border-0 h-100 text-white" style={{ backgroundColor: color }}>
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <h6 className="text-uppercase mb-1 opacity-75" style={{ fontSize: '0.8rem' }}>{title}</h6>
          <h2 className="fw-bold mb-0">{value}</h2>
        </div>
        <div className="fs-1 opacity-50">{icon}</div>
      </div>
    </div>
  </div>
);

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTickets: 0,
    totalUsers: 0,
    activeEvents: 0,
    recentSales: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await reportService.getDashboardStats();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar estadísticas');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center p-5">Cargando tablero...</div>;


  return (
    <div>
      <div className="row mb-4">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="var(--color-yale-blue)" icon="💰" />
        <StatCard title="Tickets Sold" value={stats.totalTickets} color="var(--color-air-force)" icon="🎟️" />
        <StatCard title="Total Users" value={stats.totalUsers} color="var(--color-cambridge)" icon="👥" />
        <StatCard title="Active Events" value={stats.activeEvents} color="var(--color-sage)" icon="📅" />
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold text-secondary-custom">Recent Sales</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Date</th>
                  <th>Customer</th>
                  <th>Event</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSales.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-4 text-muted">No sales found.</td></tr>
                ) : (
                  stats.recentSales.map(sale => (
                    <tr key={sale.id}>
                      <td className="ps-4 text-muted small">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        {sale.User ? `${sale.User.firstName} ${sale.User.lastName}` : 'Deleted User'}
                      </td>
                      <td>{sale.Event?.title}</td>
                      <td className="fw-bold text-success">${sale.totalPrice}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardStats;