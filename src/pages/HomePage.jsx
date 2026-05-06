import './HomePage.css';
import Button from '../components/ui/Button';
import EventCard from '../components/events/EventCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(JSON.parse(localStorage.getItem('smart_events') || '[]'));
  }, []);

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section glass-panel">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Movie Ticket Booking Platform</span>
          </div>

          <h1 className="hero-title">
            Discover & Book <br />
            <span className="text-gradient">Latest Movies</span>
          </h1>

          <p className="hero-description">
            Your one-stop destination for booking movie tickets. Explore the latest releases and enjoy a seamless cinema experience.
          </p>

          <div className="hero-actions">
            <Link to="/">
              <Button variant="primary">Browse Movies</Button>
            </Link>
            <Link to="/my-tickets">
              <Button variant="outline">View My Tickets</Button>
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="abstract-shape shape-1"></div>
          <div className="abstract-shape shape-2"></div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Now Showing</h2>
          <Button variant="ghost">
            View All <ArrowRight size={16} />
          </Button>
        </div>

        <div className="events-grid">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;