/* eslint-disable react/prop-types */
// src/components/booking/CalendarDatePicker.jsx
import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import{Label,FormGroup } from '../components/forms/Form';

const CalendarDatePicker = ({ carBookings, onDateChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Get all booked dates to disable
  const disabledDates = useMemo(() => {
    const dates = [];
    carBookings.forEach((booking) => {
      if (["cancelled", "rejected"].includes(booking.status)) return;

      const start = new Date(booking.pickupDate);
      const end = new Date(booking.returnDate);

      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        dates.push(new Date(date));
      }
    });
    return dates;
  }, [carBookings]);

  // Check if a date should be disabled
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) return true;

    // Disable dates beyond 30 days from today
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    if (date > maxDate) return true;

    // Disable booked dates
    return disabledDates.some(
      (disabledDate) => disabledDate.toDateString() === date.toDateString()
    );
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
    onDateChange("pickupDate", date.toISOString().split("T")[0]);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateChange("returnDate", date.toISOString().split("T")[0]);
  };

  return (
    <CalendarContainer>
      <DateGroup>
        <FormGroup>
          <Label>Pick-up Date</Label>
          <StyledDatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            filterDate={isDateDisabled}
            minDate={new Date()}
            maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            placeholderText="Select start date"
            dateFormat="MMMM d, yyyy"
            showDisabledMonthNavigation
            disabledKeyboardNavigation
            calendarClassName="booking-calendar"
          />
        </FormGroup>

        <FormGroup>
          <Label>Return Date</Label>
          <StyledDatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            filterDate={isDateDisabled}
            placeholderText="Select end date"
            dateFormat="MMMM d, yyyy"
            disabled={!startDate}
            calendarClassName="booking-calendar"
          />
        </FormGroup>
      </DateGroup>

      {/* Calendar Legend */}
      <CalendarLegend>
        <LegendItem>
          <LegendColor $available />
          <span>Available</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $booked />
          <span>Booked</span>
        </LegendItem>
        <LegendItem>
          <LegendColor $past />
          <span>Unavailable</span>
        </LegendItem>
      </CalendarLegend>
    </CalendarContainer>
  );
};

export default CalendarDatePicker;

// Styled Components
const CalendarContainer = styled.div`
  margin: var(--space-md) 0;
`;

const DateGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: var(--font-body);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }

  &:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
  }
`;

const CalendarLegend = styled.div`
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-md);
  padding: var(--space-sm);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--text-muted);
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
  background: ${(props) =>
    props.$available
      ? "var(--success)"
      : props.$booked
      ? "var(--error)"
      : "var(--gray-400)"};
`;

// Custom CSS for the calendar
const CalendarStyles = `
  .booking-calendar {
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    font-family: var(--font-body);
  }
  
  .react-datepicker__header {
    background: var(--primary);
    border-bottom: 1px solid var(--primary-dark);
  }
  
  .react-datepicker__current-month {
    color: var(--white);
    font-family: var(--font-heading);
  }
  
  .react-datepicker__day-name {
    color: var(--white);
  }
  
  .react-datepicker__day--disabled {
    color: var(--gray-400);
    text-decoration: line-through;
    cursor: not-allowed;
  }
  
  .react-datepicker__day--selected {
    background: var(--primary);
  }
  
  .react-datepicker__day--keyboard-selected {
    background: var(--primary-light);
  }
  
  .react-datepicker__day--in-range {
    background: var(--primary-light);
    color: var(--white);
  }
`;

// Add to your global styles
export { CalendarStyles };
