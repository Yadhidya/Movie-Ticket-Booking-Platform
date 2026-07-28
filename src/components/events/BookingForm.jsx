import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SeatSelector from './SeatSelector';

const BookingForm = ({ event, onBook }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Invalid email format';
    } else {
      const existingBookings = JSON.parse(localStorage.getItem('smart_bookings') || '[]');
      const alreadyBooked = existingBookings.some(
        (b) => b.email.toLowerCase() === trimmedEmail.toLowerCase() && b.eventName === event.title
      );
      if (alreadyBooked) {
        newErrors.email = 'This email has already booked tickets for this event.';
      }
    }

    // Seat selection validation
    if (selectedSeats.length === 0) {
      newErrors.tickets = 'Must select at least 1 seat from the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
    if (errors.tickets && seats.length > 0) {
      setErrors((prev) => ({ ...prev, tickets: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onBook({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        tickets: selectedSeats.length,
        selectedSeats,
      });
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', department: '' });
    setSelectedSeats([]);
    setErrors({});
  };

  // Simplified Sold Out logic
  const isSoldOut = event.availableTickets <= 0;
  const fewTicketsLeft = event.availableTickets > 0 && event.availableTickets < 10;

  const validTickets = selectedSeats.length;
  const totalPrice = validTickets * (event.price || 0);

  if (isSoldOut) {
    return (
      <Card className="booking-panel sold-out-panel">
        <div className="sold-out-message">
          <h3>❌ Tickets Sold Out</h3>
          <p>Sorry, there are no more tickets available for this event.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="booking-panel">
      <h3>Book Tickets</h3>
      {fewTicketsLeft && (
        <div className="few-tickets-warning" role="alert">
          ⚠️ Only {event.availableTickets} ticket{event.availableTickets > 1 ? 's' : ''} left! Hurry up!
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form" noValidate>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error-border' : ''}`}
            placeholder="John Doe"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <span id="name-error" className="error-msg">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error-border' : ''}`}
            placeholder="john@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="error-msg">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="department">Department (Optional)</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="form-input"
            placeholder="Engineering, Marketing, etc."
          />
        </div>

        <div className="form-group" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          <label id="seat-selection-label">Select Seats</label>
        </div>

        <SeatSelector
          event={event}
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
        />
        {errors.tickets && (
          <span className="error-msg" style={{ textAlign: 'center', marginBottom: '1rem', display: 'block' }}>
            {errors.tickets}
          </span>
        )}

        {event.price > 0 && validTickets > 0 && (
          <div className="dynamic-price-calculation" style={{ marginTop: '1rem' }}>
            <span className="calc-details">
              {validTickets} ticket{validTickets > 1 ? 's' : ''} × ₹{event.price} ={' '}
            </span>
            <span className="calc-total">₹{totalPrice}</span>
          </div>
        )}

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" variant="primary">
            Book Now
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default BookingForm;
