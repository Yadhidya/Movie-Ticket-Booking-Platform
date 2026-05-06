import { useState, useEffect } from 'react';
import { Ticket as TicketIcon, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './MyTicketsPage.css';

const MyTicketsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem('smart_user_profile') || '{}');
    const username = userProfile.username;

    if (username) {
      fetch(`/api/tickets?username=${username}`)
        .then(res => res.json())
        .then(data => {
          const backendBookings = data.map(t => ({
            bookingId: `DB-${t.id}`,
            eventName: t.eventName,
            totalAmount: t.price,
            bookingDate: new Date().toISOString(),
            eventDate: 'Syncing...',
            eventVenue: 'Syncing...',
            customerName: t.customerName
          }));
          
          const savedBookings = JSON.parse(localStorage.getItem('smart_bookings') || '[]');
          const userLocalBookings = savedBookings.filter(b => b.customerName === username);
          
          // Use a Map to de-duplicate by some criteria or just combine
          setBookings([...backendBookings, ...userLocalBookings]);
        })
        .catch(err => {
          console.error("Backend fetch failed:", err);
          const savedBookings = JSON.parse(localStorage.getItem('smart_bookings') || '[]');
          setBookings(savedBookings);
        });
    } else {
      const savedBookings = JSON.parse(localStorage.getItem('smart_bookings') || '[]');
      setBookings(savedBookings);
    }
  }, []);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this ticket?")) {
      const updatedBookings = bookings.filter(b => b.bookingId !== bookingId);
      setBookings(updatedBookings);
      localStorage.setItem('smart_bookings', JSON.stringify(updatedBookings));
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="my-tickets-empty animate-fade-in">
        <TicketIcon size={64} className="empty-icon" />
        <h2>No Tickets Found</h2>
        <p>You haven't booked any tickets yet. Explore upcoming events and secure your spot!</p>
        <Link to="/">
          <Button variant="primary">Browse Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="my-tickets-container animate-fade-in">
      <div className="page-header">
        <h1 className="text-gradient">My Tickets</h1>
        <p className="page-subtitle">View and manage your event bookings</p>
      </div>

      <div className="tickets-grid">
        {bookings.map((booking, index) => (
          <Card key={index} className="history-ticket-card">
            <div className="history-ticket-header">
              <span className="booking-id-badge">{booking.bookingId}</span>
              <span className="booking-date">
                Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="history-ticket-body">
              <h3 className="history-event-title">{booking.eventName}</h3>
              
              <div className="history-details-list">
                <div className="history-detail-item">
                  <Calendar size={14} className="history-icon" />
                  <span>{booking.eventDate}</span>
                </div>
                <div className="history-detail-item">
                  <MapPin size={14} className="history-icon" />
                  <span>{booking.eventVenue}</span>
                </div>
              </div>
            </div>

            <div className="history-ticket-footer" style={{paddingBottom: '0.5rem'}}>
              <div className="history-meta">
                <span className="history-meta-label">Seats</span>
                <span className="history-meta-value">{booking.selectedSeats?.join(', ') || booking.tickets}</span>
              </div>
              <div className="history-meta text-right">
                <span className="history-meta-label">Total Paid</span>
                <span className="history-meta-value highlight-price">₹{booking.totalAmount}</span>
              </div>
            </div>
            
            <div style={{padding: '0.5rem 1.5rem 1.5rem', background: 'rgba(0, 0, 0, 0.2)'}}>
              <Button variant="outline" style={{width: '100%', borderColor: '#ef4444', color: '#ef4444'}} onClick={() => handleCancelBooking(booking.bookingId)}>Cancel Ticket</Button>
            </div>
            
            {/* Decorative Ticket Edges */}
            <div className="ticket-edge ticket-edge-left"></div>
            <div className="ticket-edge ticket-edge-right"></div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyTicketsPage;
