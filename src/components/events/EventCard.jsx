import { Calendar, MapPin, Tag } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import './EventCard.css';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Card className="event-card">
      <div className="event-image-container">
        <img src={event.image || 'https://via.placeholder.com/400x200'} alt={event.title} className="event-image" />
        <div className="event-category-badge">{event.category}</div>
      </div>
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>{event.date}</span>
          </div>
          <div className="detail-item">
            <MapPin size={16} />
            <span>{event.venue}</span>
          </div>
          <div className="detail-item">
            <Tag size={16} />
            <span>{event.price === 0 ? 'Free' : `$${event.price}`}</span>
          </div>
        </div>
        <div className="event-actions">
          <Link to={`/events/${event.id}`}>
            <Button variant="outline" className="full-width">View Details</Button>
          </Link>
          <Link to={`/events/${event.id}`}>
            <Button variant="primary" className="full-width">Book Now</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
