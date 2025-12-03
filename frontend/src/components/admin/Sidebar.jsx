const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'stats', label: 'Dashboards 📊' },
    { id: 'events', label: 'Events Manager 📅' },
    { id: 'users', label: 'Users / Roles 👥' },
    { id: 'categories', label: 'Categories 🏷️' },
    { id: 'reports', label: 'Reports 📈' },
    { id: 'inbox', label: 'Admin Inbox 📩' },
  ];

  return (
    // LIMPIEZA: Usamos .sidebar-custom
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white h-100 sidebar-custom">
      
      <h4 className="fs-5 text-center mb-4 border-bottom pb-3">Admin Menu</h4>
      
      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item) => (
          <li className="nav-item mb-2" key={item.id}>
            <button
              // LIMPIEZA: Usamos .nav-link-custom
              className={`nav-link nav-link-custom ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;