import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Ticket as TicketIcon } from 'lucide-react';
import EventDetails from '../components/events/EventDetails';
import BookingForm from '../components/events/BookingForm';
import Button from '../components/ui/Button';
import './EventDetailsPage.css';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, booked
  const [bookingSummary, setBookingSummary] = useState(null);

  useEffect(() => {
    const allEvents = JSON.parse(localStorage.getItem('smart_events') || '[]');
    const foundEvent = allEvents.find(e => e.id === id);
    if (foundEvent) {
      setEvent({ ...foundEvent });
    }
  }, [id]);

  const handleBookTickets = (formData) => {
    const totalAmount = formData.tickets * event.price;
    const newAvailable = event.availableTickets - formData.tickets;
    
    setEvent(prev => ({ ...prev, availableTickets: newAvailable, bookedSeats: [...(prev.bookedSeats || []), ...formData.selectedSeats] }));

    const userProfile = JSON.parse(localStorage.getItem('smart_user_profile') || '{}');
    const summary = {
      ...formData,
      eventName: event.title,
      eventDate: event.date,
      eventVenue: event.venue,
      totalAmount,
      bookingId: 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      bookingDate: new Date().toISOString(),
      customerName: userProfile.username || formData.name // Use logged in username if available
    };
    
    // Sync with backend ORM
    fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: summary.eventName,
        customerName: summary.customerName,
        price: summary.totalAmount
      })
    })
    .then(res => res.json())
    .then(savedTicket => {
      console.log("Successfully saved ticket to Spring Boot backend:", savedTicket);
    })
    .catch(err => {
      console.error("Failed to sync booking to backend. Proceeding with local storage.", err);
    });

    setBookingSummary(summary);
    setBookingStatus('booked');

    // Update available tickets across the entire app
    const allEvents = JSON.parse(localStorage.getItem('smart_events') || '[]');
    const updatedEvents = allEvents.map(e => e.id === id ? { 
      ...e, 
      availableTickets: newAvailable,
      bookedSeats: [...(e.bookedSeats || []), ...formData.selectedSeats] 
    } : e);
    localStorage.setItem('smart_events', JSON.stringify(updatedEvents));

    // Save to local storage bookings (keep for backward compatibility/offline fallback)
    const existingBookings = JSON.parse(localStorage.getItem('smart_bookings') || '[]');
    localStorage.setItem('smart_bookings', JSON.stringify([summary, ...existingBookings]));
  };

  const handleBookAgain = () => {
    setBookingStatus('idle');
    setBookingSummary(null);
  };

  if (!event) {
    return <div className="event-page-container"><p>Loading...</p></div>;
  }

  return (
    <div className="event-page-container animate-fade-in">
      <div className="page-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>

      <div className="event-layout-grid">
        <div className="event-left-col">
          <EventDetails event={event} />
        </div>

        <div className="event-right-col">
          {bookingStatus === 'booked' ? (
            <div className="digital-ticket-wrapper animate-fade-in">
              <div className="success-banner">
                <CheckCircle size={24} />
                <span>Booking Confirmed!</span>
              </div>
              
              <div className="digital-ticket">
                <div className="ticket-header">
                  <TicketIcon size={24} className="ticket-logo" />
                  <span className="ticket-id">{bookingSummary.bookingId}</span>
                </div>
                
                <div className="ticket-body">
                  <div className="ticket-row">
                    <div className="ticket-label">Event</div>
                    <div className="ticket-value-main">{bookingSummary.eventName}</div>
                  </div>
                  
                  <div className="ticket-row-split">
                    <div className="ticket-column">
                      <div className="ticket-label">Name</div>
                      <div className="ticket-value">{bookingSummary.name}</div>
                    </div>
                    <div className="ticket-column text-right">
                      <div className="ticket-label">Department</div>
                      <div className="ticket-value">{bookingSummary.department}</div>
                    </div>
                  </div>

                  <div className="ticket-row-split">
                    <div className="ticket-column">
                      <div className="ticket-label">Date & Time</div>
                      <div className="ticket-value">{bookingSummary.eventDate}</div>
                    </div>
                    <div className="ticket-column text-right">
                      <div className="ticket-label">Venue</div>
                      <div className="ticket-value">{bookingSummary.eventVenue}</div>
                    </div>
                  </div>
                </div>

                <div className="ticket-footer">
                  <div className="ticket-column">
                    <div className="ticket-label highlight-label">Seats</div>
                    <div className="ticket-value highlight-val">{bookingSummary.selectedSeats?.join(', ') || bookingSummary.tickets}</div>
                  </div>
                  <div className="ticket-column text-right">
                    <div className="ticket-label highlight-label">Total Amount</div>
                    <div className="ticket-value highlight-val">₹{bookingSummary.totalAmount}</div>
                  </div>
                </div>
                <div className="ticket-rip"></div>
              </div>

              <div className="post-booking-actions">
                <Link to="/my-tickets" className="full-width">
                  <Button variant="outline" className="full-width">View All My Tickets</Button>
                </Link>
                {event.availableTickets > 0 && (
                  <Button variant="primary" onClick={handleBookAgain}>Book More Tickets</Button>
                )}
              </div>
            </div>
          ) : (
            <BookingForm event={event} onBook={handleBookTickets} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
