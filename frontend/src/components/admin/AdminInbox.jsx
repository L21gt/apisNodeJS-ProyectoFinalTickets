import { useState, useEffect } from 'react';
import messageService from '../../services/messageService';
import { toast } from 'react-toastify';

const AdminInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // SOLUCIÓN ERROR 1: Definimos la carga DENTRO del useEffect
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await messageService.getAllMessages();
        setMessages(data || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Error loading messages');
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  // Cambiar estado (Leído <-> Nuevo)
  const toggleStatus = async (msg) => {
    const newStatus = msg.status === 'new' ? 'read' : 'new';
    try {
      // Actualización optimista (UI primero)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: newStatus } : m));
      
      await messageService.updateStatus(msg.id, newStatus);
      toast.success(newStatus === 'read' ? 'Message marked as read' : 'Message marked as unread');
    } catch (error) {
      console.error(error);
      toast.error('Error updating status');
      // Si falla, podrías recargar la lista aquí, pero por simplicidad lo dejamos así
    }
  };

  // Eliminar mensaje
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await messageService.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success('Message deleted');
    } catch (error) {
      console.error(error);
      toast.error('Error deleting message');
    }
  };

  const newMessages = messages.filter(m => m.status === 'new');
  const readMessages = messages.filter(m => m.status === 'read');

  if (loading) return <div className="text-center p-5">Loading inbox...</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0 fw-bold text-secondary-custom">Inbox</h5>
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
              
              {/* SECCIÓN: NUEVOS MENSAJES */}
              {newMessages.length > 0 && (
                <tr className="bg-light">
                  <td colSpan="5" className="fw-bold text-primary-custom ps-4 py-2 border-bottom-0">
                    📩 New Messages ({newMessages.length})
                  </td>
                </tr>
              )}
              
              {newMessages.map((msg) => (
                // LIMPIEZA: Usamos clase CSS .bg-message-new
                <tr key={msg.id} className="bg-message-new">
                  <td className="ps-4 text-muted small">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="fw-bold">
                    {msg.name}<br/>
                    <span className="small text-muted fw-normal">{msg.email}</span>
                  </td>
                  <td className="fw-bold text-primary-custom">
                    {msg.subject}
                  </td>
                  {/* Quitamos el style duplicado y usamos clase */}
                  <td className="text-truncate col-message">
                    {msg.message}
                  </td>
                  <td className="text-end pe-4">
                    <button 
                      onClick={() => toggleStatus(msg)} 
                      className="btn btn-sm btn-outline-success me-2"
                      title="Mark as read"
                    >
                      ✔ Read
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

              {/* SECCIÓN: MENSAJES LEÍDOS */}
              {readMessages.length > 0 && (
                <tr className="bg-light">
                  <td colSpan="5" className="fw-bold text-secondary-custom ps-4 py-2 border-bottom-0 mt-3">
                    📂 Messages Read
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
                      title="Mark as unread"
                    >
                      ↩ Unread
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
                    There are no messages in the inbox.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInbox;