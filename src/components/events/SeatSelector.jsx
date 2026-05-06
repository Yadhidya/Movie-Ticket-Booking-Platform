import { useState, useEffect } from 'react';
import './SeatSelector.css';

const SeatSelector = ({ event, selectedSeats, onSeatSelect }) => {
  const [seatMap, setSeatMap] = useState([]);

  useEffect(() => {
    // Generate a dynamic seat map based on total capacity implicitly
    const booked = event.bookedSeats || [];
    const capacity = event.availableTickets + booked.length;
    
    // We assume 10 seats per row
    const cols = 10;
    const numRows = Math.ceil(capacity / cols);
    const rowsArr = [];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let r = 0; r < numRows; r++) {
      const rowLabel = alphabet[r];
      const rowSeats = [];
      for (let c = 1; c <= cols; c++) {
        // Stop if we generated enough seats for capacity
        if ((r * cols) + c > capacity) break;
        
        const seatId = `${rowLabel}${c}`;
        rowSeats.push({
          id: seatId,
          isBooked: booked.includes(seatId)
        });
      }
      rowsArr.push({ label: rowLabel, seats: rowSeats });
    }
    setSeatMap(rowsArr);
  }, [event]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    if (selectedSeats.includes(seat.id)) {
      onSeatSelect(selectedSeats.filter(s => s !== seat.id));
    } else {
      if (selectedSeats.length >= 10) {
        alert("Maximum 10 tickets per booking!");
        return;
      }
      onSeatSelect([...selectedSeats, seat.id]);
    }
  };

  return (
    <div className="seat-selector-container">
      <div className="stage-area">
        <div className="stage-screen">STAGE</div>
      </div>
      
      <div className="seat-grid">
        {seatMap.map((row) => (
          <div key={row.label} className="seat-row">
            <span className="row-label">{row.label}</span>
            <div className="row-seats">
              {row.seats.map(seat => {
                const isSelected = selectedSeats.includes(seat.id);
                let seatClass = 'seat';
                if (seat.isBooked) seatClass += ' booked';
                else if (isSelected) seatClass += ' selected';
                else seatClass += ' available';

                return (
                  <button
                    key={seat.id}
                    type="button"
                    className={seatClass}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                    title={seat.id}
                  >
                    {seat.id.substring(1)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat available legend-seat"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat selected legend-seat"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat booked legend-seat"></div>
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
