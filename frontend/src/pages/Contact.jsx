import { useState } from 'react';
import { useForm } from 'react-hook-form';
import messageService from '../services/messageService';
import { toast } from 'react-toastify';

const Contact = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await messageService.sendMessage(data);
      toast.success('Message sent! We will contact you soon. 📨');
      reset(); // Limpiar formulario
    } catch (error) {
      console.error(error);
      toast.error('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center fw-bold text-primary-custom mb-5">Contact Us</h2>

      <div className="row mb-5 g-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-primary-custom">
            <div className="card-body">
              <h4 className="card-title text-secondary-custom fw-bold">Questions or Concerns?</h4>
              <p className="card-text mt-3">Before you write, check here first!</p>
              <ul className="text-muted small">
                <li>For details about a specific event (schedule, location), please check the event page.</li>
                <li>For questions about a purchase, check the <strong>"My Tickets"</strong> section.</li>
              </ul>
              <p className="card-text small">For anything else, please use the contact form below. We're here to help!</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-primary-custom">
            <div className="card-body">
              <h4 className="card-title text-secondary-custom fw-bold">Sell Your Event With Us</h4>
              <p className="card-text mt-3">Want to list your concert or workshop on EVENTS4U?</p>
              <p className="card-text small text-muted">
                Our admin team handles the entire setup. You focus on the event, we handle the ticketing.
              </p>
              <p className="fw-bold text-primary-custom small">
                To get started, send us a message below selecting the subject "Sell an Event".
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0 p-4">
            <h4 className="mb-4 text-center">Send us a message</h4>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input className="form-control" placeholder="Your name" {...register('name', { required: true })} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" placeholder="you@example.com" {...register('email', { required: true })} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Subject</label>
                <select className="form-select" {...register('subject', { required: true })}>
                  <option value="">Select a reason...</option>
                  <option value="General Question">General Question</option>
                  <option value="Account Problem">Account Problem</option>
                  <option value="Sell an Event">Sell an Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows="5" placeholder="Write your message here..." {...register('message', { required: true })}></textarea>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;