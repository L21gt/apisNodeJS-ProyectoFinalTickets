import { useState, useEffect } from 'react';
import messageService from '../../services/messageService';
import { toast } from 'react-toastify';

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); // Aquí declaramos la variable
  
  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const data = await messageService.getAllMessages(page, 10);
        setMessages(data.messages || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error loading messages');
        setLoading(false);
      }
    };
    loadMessages();
  }, [page, refreshKey]);

  const toggleStatus = async (msg) => {
    const newStatus = msg.status === 'new' ? 'read' : 'new';
    try {
      await messageService.updateStatus(msg.id, newStatus);
      toast.success(`Message marked as ${newStatus}`);
      setRefreshKey(old => old + 1);
    } catch (error) {
      console.error(error);
      toast.error('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await messageService.deleteMessage(id);
      toast.success('Message deleted');
      setRefreshKey(old => old + 1);
    } catch (error) {
      console.error(error);
      toast.error('Error deleting');
    }
  };

  const newMessages = messages.filter(m => m.status === 'new');
  const readMessages = messages.filter(m => m.status === 'read');

  // --- Usamos la variable 'loading' ---
  if (loading) {
    return <div className="text-center p-5">Loading inbox...</div>;
  }
  // -----------------------------------------------------

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between">
        <h5 className="mb-0 fw-bold text-secondary-custom">Inbox (Page {page})</h5>
      </div>
      
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4 col-date">Date</th>
                <th className="col-sender">Sender</th>
                <th className="col-subject">Subject</th>
                <th className="col-message">Message</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              
              {/* NEW MESSAGES SECTION */}
              {newMessages.length > 0 && (
                <tr className="bg-light">
                  <td colSpan="5" className="fw-bold text-primary-custom ps-4 py-2 border-bottom-0">
                    📩 New Messages ({newMessages.length})
                  </td>
                </tr>
              )}
              
              {newMessages.map((msg) => (
                <tr key={msg.id} className="bg-message-new">
                  <td className="ps-4 small">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {msg.name}<br/>
                    <span className="small fw-normal opacity-75">{msg.email}</span>
                  </td>
                  <td className="fw-bold text-primary-custom">
                    {msg.subject}
                  </td>
                  <td className="text-truncate col-message">
                    {msg.message}
                  </td>
                  <td className="text-end pe-4">
                    <button 
                      onClick={() => toggleStatus(msg)} 
                      className="btn btn-sm btn-outline-success me-2"
                      title="Mark as Read"
                    >
                      ✔
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}

              {/* READ MESSAGES SECTION */}
              {readMessages.length > 0 && (
                <tr className="bg-light">
                  <td colSpan="5" className="fw-bold text-secondary-custom ps-4 py-2 border-bottom-0 mt-3">
                    📂 Read Messages
                  </td>
                </tr>
              )}

              {readMessages.map((msg) => (
                <tr key={msg.id} className="text-muted bg-message-read">
                  <td className="ps-4 small">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td>{msg.name}<br/><span className="small">{msg.email}</span></td>
                  <td>{msg.subject}</td>
                  <td className="text-truncate col-message">{msg.message}</td>
                  <td className="text-end pe-4">
                    <button 
                      onClick={() => toggleStatus(msg)} 
                      className="btn btn-sm btn-link text-decoration-none text-secondary me-2"
                      title="Mark as Unread"
                    >
                      ↩
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}

              {messages.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    Inbox is empty.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINACION */}
      <div className="card-footer bg-white py-3 d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>&laquo; Prev</button>
        <span className="text-muted small">Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
        <button className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next &raquo;</button>
      </div>
    </div>
  );
};

export default AdminInbox;