import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import eventService from '../../services/eventService';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Aceptamos la prop "eventToEdit"
const CreateEventModal = ({ show, onClose, onEventCreated, eventToEdit }) => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories'); 
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    if (show) fetchCategories();
  }, [show]);

  // EFECTO: Pre-llenar formulario si estamos EDITANDO
  useEffect(() => {
    if (eventToEdit) {
      setValue('title', eventToEdit.title);
      setValue('description', eventToEdit.description);
      // Formatear fecha para el input datetime-local (YYYY-MM-DDTHH:mm)
      const dateStr = new Date(eventToEdit.date).toISOString().slice(0, 16);
      setValue('date', dateStr);
      setValue('location', eventToEdit.location);
      setValue('categoryId', eventToEdit.categoryId);
      setValue('ticketType', eventToEdit.ticketType);
      setValue('price', eventToEdit.price);
      setValue('totalTickets', eventToEdit.totalTickets);
    } else {
      reset(); // Si es crear nuevo, limpiar
    }
  }, [eventToEdit, setValue, reset, show]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    
    // Agregar campos
    Object.keys(data).forEach(key => {
      if (key === 'image') {
        if (data.image[0]) formData.append('image', data.image[0]);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      if (eventToEdit) {
        // MODO EDICIÓN
        await eventService.update(eventToEdit.id, formData);
        toast.success('Event updated successfully!');
      } else {
        // MODO CREACIÓN
        await eventService.create(formData);
        toast.success('Event created successfully!');
      }
      
      reset();
      onEventCreated();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error saving event');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block modal-overlay-custom" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary-custom text-white">
            <h5 className="modal-title">
              {eventToEdit ? 'Edit Event' : 'Create New Event'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              
              <div className="mb-3">
                <label className="form-label">Event Title</label>
                <input className="form-control" {...register('title', { required: true })} />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" {...register('description', { required: true })}></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date & Time</label>
                  <input type="datetime-local" className="form-control" {...register('date', { required: true })} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Category</label>
                  <select className="form-select" {...register('categoryId', { required: true })}>
                    <option value="">Select...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input className="form-control" {...register('location', { required: true })} />
              </div>

              <div className="mb-3">
                <label className="form-label">Image {eventToEdit && <small className="text-muted">(Leave empty to keep current)</small>}</label>
                {/* La imagen no es requerida en edición */}
                <input type="file" className="form-control" accept="image/*" {...register('image', { required: !eventToEdit })} />
              </div>

              <hr />
              <h6 className="text-secondary-custom fw-bold">Ticket Settings</h6>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Ticket Name</label>
                  <input className="form-control" {...register('ticketType', { required: true })} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Price ($)</label>
                  <input type="number" step="0.01" className="form-control" {...register('price', { required: true })} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Total Quantity</label>
                  <input type="number" className="form-control" {...register('totalTickets', { required: true })} />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;