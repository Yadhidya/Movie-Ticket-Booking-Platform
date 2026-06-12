import { useState, useMemo } from 'react';
import './SeatSelector.css';

const SeatSelector = ({ event, selectedSeats, onSeatSelect }) => {
  // Derive seat map directly from props using useMemo for better performance
  const seatMap = useMemo(() => {
    const booked = event?.bookedSeats || [];
    const capacity = (event?.availableTickets || 0) + booked.length;
    const cols = 10;
    const numRows = Math.ceil(capacity / cols);
    const rowsArr = [];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let r = 0; r < numRows; r++) {
      const rowLabel = alphabet[r];
      const rowSeats = [];
      for (let c = 1; c <= cols; c++) {
        if (r * cols + c > capacity) break;
        const seatId = `${rowLabel}${c}`;
        rowSeats.push({
          id: seatId,
          label: `${rowLabel} ${c}`,
          isBooked: booked.includes(seatId)
        });
      }
      rowsArr.push({ label: rowLabel, seats: rowSeats });
    }
    return rowsArr;
  }, [event]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    if (selectedSeats.includes(seat.id)) {
      onSeatSelect(selectedSeats.filter((s) => s !== seat.id));
    } else {
      if (selectedSeats.length >= 10) {
        alert('Maximum 10 tickets per booking!');
        return;
      }
      onSeatSelect([...selectedSeats, seat.id]);
    }
  };

  // Keyboard navigation for accessible seat picking
  const handleKeyDown = (e, seat, rowIndex, colIndex) => {
    let nextSeatId = null;
    const currentRow = seatMap[rowIndex].seats;

    switch (e.key) {
      case 'ArrowUp':
        if (rowIndex > 0) nextSeatId = seatMap[rowIndex - 1].seats[colIndex]?.id;
        break;
      case 'ArrowDown':
        if (rowIndex < seatMap.length - 1) nextSeatId = seatMap[rowIndex + 1].seats[colIndex]?.id;
        break;
      case 'ArrowLeft':
        if (colIndex > 0) nextSeatId = currentRow[colIndex - 1].id;
        break;
      case 'ArrowRight':
        if (colIndex < currentRow.length - 1) nextSeatId = currentRow[colIndex + 1].id;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSeatClick(seat);
        break;
      default:
        return;
    }

    if (nextSeatId) {
      document.getElementById(`seat-${nextSeatId}`)?.focus();
    }
  };

  return (
    <div className="seat-selector-container">
      <div className="stage-area" aria-hidden="true">
        <div className="stage-screen">STAGE</div>
      </div>

      <div className="seat-grid" role="grid" aria-label="Seating Chart">
        {seatMap.map((row, rowIndex) => (
          <div key={row.label} className="seat-row" role="row">
            <span className="row-label" id={`row-${row.label}`} aria-hidden="true">
              {row.label}
            </span>
            <div className="row-seats" role="rowgroup">
              {row.seats.map((seat, colIndex) => {
                const isSelected = selectedSeats.includes(seat.id);
                let seatClass = 'seat';
                if (seat.isBooked) seatClass += ' booked';
                else if (isSelected) seatClass += ' selected';
                else seatClass += ' available';

                return (
                  <button
                    key={seat.id}
                    id={`seat-${seat.id}`}
                    type="button"
                    role="gridcell"
                    className={seatClass}
                    onClick={() => handleSeatClick(seat)}
                    onKeyDown={(e) => handleKeyDown(e, seat, rowIndex, colIndex)}
                    disabled={seat.isBooked}
                    aria-label={`Row ${row.label}, Seat ${seat.id.substring(1)}. ${
                      seat.isBooked ? 'Sold out' : isSelected ? 'Selected' : 'Available'
                    }`}
                    aria-pressed={isSelected}
                    title={seat.id}
                    tabIndex={seat.isBooked ? -1 : 0}
                  >
                    {seat.id.substring(1)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="seat-legend" role="group" aria-label="Seating Legend">
        <div className="legend-item">
          <div className="seat available legend-seat" aria-hidden="true"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat selected legend-seat" aria-hidden="true"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat booked legend-seat" aria-hidden="true"></div>
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
