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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data.users || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error loading users');
        setLoading(false);
      }
    };
    fetchUsers();
  }, [refreshKey]);

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
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold text-secondary-custom">Users & Roles Management</h5>
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
                {users.map((user) => (
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
                ))}
              </tbody>
            </table>
          </div>
        )}
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