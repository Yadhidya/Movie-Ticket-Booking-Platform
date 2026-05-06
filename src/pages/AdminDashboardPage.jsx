import { useState, useEffect } from 'react';
import { Trash2, ShieldCheck, PlusCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'bookings'
  const [newEvent, setNewEvent] = useState({
    title: '', category: 'Seminar', date: '', venue: '', price: 0,
    organizer: 'Homable films', availableTickets: 50, description: ''
  });

  useEffect(() => {
    // Check if admin is logged in (double check logic)
    const userProfile = JSON.parse(localStorage.getItem('smart_user_profile') || '{}');
    if (!userProfile.isAdmin) {
      window.location.href = '/';
    }

    setEvents(JSON.parse(localStorage.getItem('smart_events') || '[]'));
    setBookings(JSON.parse(localStorage.getItem('smart_bookings') || '[]'));
  }, []);

  const handleAddEvent = (e) => {
    e.preventDefault();
    const eventObj = {
      ...newEvent,
      id: Math.random().toString(36).substr(2, 9),
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    };
    const updatedEvents = [eventObj, ...events];
    setEvents(updatedEvents);
    localStorage.setItem('smart_events', JSON.stringify(updatedEvents));
    setNewEvent({ title: '', category: 'Seminar', date: '', venue: '', price: 0, organizer: 'CSE', availableTickets: 50, description: '' });
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter(e => e.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem('smart_events', JSON.stringify(updatedEvents));
    }
  };

  const handleIncreaseCapacity = (id) => {
    const amountStr = window.prompt("Enter number of extra tickets to add to this event:", "10");
    if (amountStr) {
      const amount = parseInt(amountStr);
      if (!isNaN(amount) && amount > 0) {
        const updatedEvents = events.map(e =>
          e.id === id ? { ...e, availableTickets: e.availableTickets + amount } : e
        );
        setEvents(updatedEvents);
        localStorage.setItem('smart_events', JSON.stringify(updatedEvents));
      }
    }
  };

  return (
    <div className="admin-container animate-fade-in">
      <div className="admin-header">
        <ShieldCheck size={32} className="admin-icon" />
        <div>
          <h1 className="text-gradient">Admin Dashboard</h1>
          <p>Manage events and view all bookings across the platform.</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'events' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Manage Movies
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookings' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings
        </button>
      </div>

      {activeTab === 'events' && (
        <div className="admin-content-grid">
          <Card className="add-event-panel">
            <h3>Add New Movie</h3>
            <form onSubmit={handleAddEvent} className="add-event-form">
              <div className="form-group">
                <label>Movie Title</label>
                <input type="text" className="form-input" required
                  value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
              </div>
              <div className="form-group-split">
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}>
                    <option value="Seminar">Action</option>
                    <option value="Workshop">Drama</option>
                    <option value="Technical Fest">Comedy</option>
                    <option value="Technical Fest">Horror</option>
                    <option value="Technical Fest">Romantic</option>
                    <option value="Technical Fest">Sci-Fi</option>
                    <option value="Technical Fest">Thriller</option>
                    <option value="Technical Fest">Animation</option>
                    <option value="Technical Fest">Documentary</option>
                    <option value="Technical Fest">Musical</option>
                    <option value="Technical Fest">Adventure</option>
                    <option value="Technical Fest">Family</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Production House</label>
                  <input type="text" className="form-input" required
                    value={newEvent.department} onChange={e => setNewEvent({ ...newEvent, department: e.target.value })} />

                </div>
              </div>
              <div className="form-group-split">
                <div className="form-group">
                  <label>Date & Time</label>
                  <input type="text" className="form-input" required placeholder="e.g., Nov 20, 2026"
                    value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Venue</label>
                  <input type="text" className="form-input" required
                    value={newEvent.venue} onChange={e => setNewEvent({ ...newEvent, venue: e.target.value })} />
                </div>
              </div>
              <div className="form-group-split">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" className="form-input" required min="0"
                    value={newEvent.price} onChange={e => setNewEvent({ ...newEvent, price: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Total Tickets</label>
                  <input type="number" className="form-input" required min="1"
                    value={newEvent.availableTickets} onChange={e => setNewEvent({ ...newEvent, availableTickets: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" required rows="3"
                  value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}></textarea>
              </div>
              <Button type="submit" variant="primary" className="full-width">Publish Event</Button>
            </form>
          </Card>

          <div className="event-list-panel">
            <h3>Active Events</h3>
            {events.length === 0 ? <p>No events found.</p> : (
              <div className="admin-list">
                {events.map(event => (
                  <div key={event.id} className="admin-list-item glass-panel">
                    <div className="item-details">
                      <h4>{event.title}</h4>
                      <span className="item-meta">{event.date} • {event.category} • {event.availableTickets} tickets left</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="icon-btn add-btn" onClick={() => handleIncreaseCapacity(event.id)} title="Add Ticket Capacity">
                        <PlusCircle size={18} />
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleDeleteEvent(event.id)} title="Delete Event">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <Card className="admin-bookings-panel">
          <h3>Platform Bookings</h3>
          {bookings.length === 0 ? <p>No tickets booked yet.</p> : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>User / Email</th>
                    <th>Department</th>
                    <th>Event</th>
                    <th>Tickets</th>
                    <th>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, idx) => (
                    <tr key={idx}>
                      <td><span className="booking-id-sm">{b.bookingId}</span></td>
                      <td>
                        <strong>{b.name}</strong><br />
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>{b.email}</span>
                      </td>
                      <td>{b.department}</td>
                      <td>{b.eventName}</td>
                      <td>{b.tickets}</td>
                      <td className="highlight-price">₹{b.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AdminDashboardPage;
