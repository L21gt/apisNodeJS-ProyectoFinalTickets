import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import EditUserModal from './EditUserModal';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Estados de Paginación y Filtros
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRole, setFilterRole] = useState('');   // '' = Todos
  const [filterStatus, setFilterStatus] = useState(''); // '' = Todos

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Enviamos página, límite y los dos filtros nuevos
        const data = await userService.getAll(page, 10, filterRole, filterStatus);
        
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error loading users');
        setLoading(false);
      }
    };
    fetchUsers();
  }, [refreshKey, page, filterRole, filterStatus]); // Recargar si cambia algo

  // Resetear página a 1 cuando se cambia un filtro
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleUserUpdated = () => {
    setRefreshKey(old => old + 1);
  };

  const toggleBlock = async (user) => {
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    const confirmMsg = newStatus === 'blocked' 
      ? `Are you sure you want to BLOCK ${user.firstName}?` 
      : `Do you want to ACTIVATE ${user.firstName} again?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await userService.update(user.id, { status: newStatus });
      toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'activated'}`);
      handleUserUpdated();
    } catch (error) {
      console.error(error);
      toast.error('Error changing status');
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3 flex-wrap gap-3">
        <h5 className="mb-0 fw-bold text-secondary-custom">Users & Roles Management</h5>
        
        {/* BARRA DE FILTROS */}
        <div className="d-flex gap-2">
          <select 
            className="form-select form-select-sm" 
            value={filterRole}
            onChange={(e) => handleFilterChange(setFilterRole, e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="">All Roles</option>
            <option value="admin">Admins Only</option>
            <option value="user">Users Only</option>
          </select>

          <select 
            className="form-select form-select-sm" 
            value={filterStatus}
            onChange={(e) => handleFilterChange(setFilterStatus, e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>
      
      <div className="card-body p-0">
        {loading ? (
          <div className="p-4 text-center">Loading users...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4">No users found matching filters.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className={user.status === 'blocked' ? 'bg-light text-muted' : ''}>
                      <td className="ps-4 fw-bold text-primary-custom">
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-primary-custom' : 'bg-secondary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          Edit Role
                        </button>
                        
                        <button 
                          onClick={() => toggleBlock(user)}
                          className={`btn btn-sm ${user.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        >
                          {user.status === 'active' ? 'Block' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONTROLES DE PAGINACIÓN */}
      <div className="card-footer bg-white py-3 d-flex justify-content-between align-items-center">
        <button 
          className="btn btn-outline-secondary" 
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}
        >
          &laquo; Previous
        </button>
        
        <span className="text-muted small">
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>
        
        <button 
          className="btn btn-outline-secondary" 
          disabled={page === totalPages} 
          onClick={() => setPage(p => p + 1)}
        >
          Next &raquo;
        </button>
      </div>

      <EditUserModal 
        show={showModal} 
        user={selectedUser}
        onClose={() => setShowModal(false)} 
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
};

export default UsersManager;