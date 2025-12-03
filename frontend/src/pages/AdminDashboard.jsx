import { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import EventsManager from '../components/admin/EventsManager';
import AdminInbox from '../components/admin/AdminInbox';
import UsersManager from '../components/admin/UsersManager';
import CategoriesManager from '../components/admin/CategoriesManager';
import DashboardStats from '../components/admin/DashboardStats';
import Reports from '../components/admin/Reports';

// Importaremos los componentes reales luego. Por ahora usamos placeholders.
const Placeholder = ({ title }) => (
  <div className="card p-5 text-center">
    <h2>{title}</h2>
    <p className="text-muted">Este módulo está en construcción 🚧</p>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');

  // Función para decidir qué renderizar según el tab activo
  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <DashboardStats />;
      case 'events':
        return <EventsManager />;
      case 'users':
        return <UsersManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'reports':
        return <Reports />;
      case 'inbox':
        return <AdminInbox />; // Componente real de la bandeja de entrada
      default:
        return <Placeholder title="Select an option" />;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="col-md-9 col-lg-10 p-4">
          {/* LIMPIEZA: Usamos .text-primary-custom */}
          <h2 className="mb-4 fw-bold text-primary-custom">
            Admin Panel
          </h2>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;