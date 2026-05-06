import { Building, Calendar, Clock, MapPin, Tag, Ticket as TicketIcon } from 'lucide-react';
import Card from '../ui/Card';

const EventDetails = ({ event }) => {
  return (
    <Card className="event-info-panel">
      <h2 className="event-title text-gradient">{event.title}</h2>

      <div className="event-stats-grid">
        <div className="stat-item">
          <Building className="stat-icon" />
          <div className="stat-text">
            <span className="stat-label">Production House</span>
            <span className="stat-value">{event.organizer}</span>
          </div>
        </div>

        <div className="stat-item">
          <Calendar className="stat-icon" />
          <div className="stat-text">
            <span className="stat-label">Date</span>
            <span className="stat-value">{event.date}</span>
          </div>
        </div>

        <div className="stat-item">
          <Clock className="stat-icon" />
          <div className="stat-text">
            <span className="stat-label">Time</span>
            <span className="stat-value">10:00 AM - 4:00 PM</span>
          </div>
        </div>

        <div className="stat-item">
          <MapPin className="stat-icon" />
          <div className="stat-text">
            <span className="stat-label">Venue</span>
            <span className="stat-value">{event.venue}</span>
          </div>
        </div>

        <div className="stat-item">
          <Tag className="stat-icon" />
          <div className="stat-text">
            <span className="stat-label">Price</span>
            <span className="stat-value">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
          </div>
        </div>

        <div className="stat-item">
          <TicketIcon className="stat-icon" />
          <div className="stat-text">
            <span className="stat-label">Available Tickets</span>
            <span className={`stat-value ${event.availableTickets === 0 ? 'sold-out-text' : ''}`}>
              {event.availableTickets === 0 ? 'Sold Out' : event.availableTickets}
            </span>
          </div>
        </div>
      </div>

      <div className="event-about">
        <h3>About the Event</h3>
        <p>{event.description}</p>
      </div>
    </Card>
  );
};

export default EventDetails;
