import { useState, useEffect } from 'react';
import messageService from '../../services/messageService';
import { toast } from 'react-toastify';

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true); 
  
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

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading inbox...</p>
      </div>
    );
  }

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
                <th className="ps-4">Date</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sección Mensajes Nuevos */}
              {newMessages.length > 0 && (
                <tr className="bg-light"><td colSpan="5" className="fw-bold text-primary ps-4">📩 New ({newMessages.length})</td></tr>
              )}
              {newMessages.map((msg) => (
                <tr key={msg.id} className="bg-white fw-bold">
                  <td className="ps-4 small">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td>{msg.name}<br/><small className="fw-normal">{msg.email}</small></td>
                  <td>{msg.subject}</td>
                  <td className="text-truncate" style={{maxWidth: '200px'}}>{msg.message}</td>
                  
                  {/* --- FLEXBOX FOR NEW MESSAGES --- */}
                  <td className="pe-4">
                    <div className="d-flex justify-content-end gap-2">
                        <button 
                            onClick={() => toggleStatus(msg)} 
                            className="btn btn-sm btn-outline-success" 
                            title="Mark as read"
                        >
                            ✔
                        </button>
                        <button 
                            onClick={() => handleDelete(msg.id)} 
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                        >
                            🗑️
                        </button>
                    </div>
                  </td>
                  {/* --------------------------------------- */}

                </tr>
              ))}

              {/* Sección Mensajes Leídos */}
              {readMessages.length > 0 && (
                <tr className="bg-light"><td colSpan="5" className="fw-bold text-secondary ps-4">📂 Read</td></tr>
              )}
              {readMessages.map((msg) => (
                <tr key={msg.id} className="text-muted">
                  <td className="ps-4 small">{new Date(msg.createdAt).toLocaleDateString()}</td>
                  <td>{msg.name}<br/><small>{msg.email}</small></td>
                  <td>{msg.subject}</td>
                  <td className="text-truncate" style={{maxWidth: '200px'}}>{msg.message}</td>
                  
                  {/* --- FLEXBOX FOR READ MESSAGES --- */}
                  <td className="pe-4">
                    <div className="d-flex justify-content-end gap-2">
                        <button 
                            onClick={() => toggleStatus(msg)} 
                            className="btn btn-sm btn-link text-secondary"
                            title="Mark as unread"
                        >
                            ↩
                        </button>
                        <button 
                            onClick={() => handleDelete(msg.id)} 
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                        >
                            🗑️
                        </button>
                    </div>
                  </td>
                  {/* ---------------------------------------- */}

                </tr>
              ))}

              {messages.length === 0 && (
                <tr><td colSpan="5" className="text-center py-5 text-muted">Inbox is empty.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
       <div className="card-footer bg-white py-3 d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>&laquo; Prev</button>
        <span className="text-muted small">Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
        <button className="btn btn-outline-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next &raquo;</button>
      </div>
    </div>
  );
};

export default AdminInbox;