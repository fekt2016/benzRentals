/* eslint-disable react/prop-types */
import React, { useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { useCarAvailability } from "../hooks/useCarAvailability";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { Label, FormGroup } from "../../../components/forms/Form";
import { FiCalendar, FiDollarSign, FiAlertCircle } from "react-icons/fi";

const CarAvailabilityCalendar = ({ carId, startDate, endDate, onDateChange, carBookings = [] }) => {
  // Fetch availability data
  const { data: availabilityData, isLoading, error } = useCarAvailability(
    carId,
    startDate,
    endDate,
    !!carId
  );

  const availability = availabilityData?.data || {};
  const unavailableDates = availability?.unavailableDates || [];
  const pricingTiers = availability?.pricingTiers || {};
  const basePrice = availability?.basePrice || 0;

  // Get all booked dates to disable
  const disabledDates = useMemo(() => {
    const dates = [];
    
    // Add dates from API unavailable dates
    unavailableDates.forEach((range) => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date));
      }
    });

    // Add dates from carBookings prop (for backward compatibility)
    carBookings.forEach((booking) => {
      if (["cancelled", "rejected"].includes(booking.status)) return;
      const start = new Date(booking.pickupDate);
      const end = new Date(booking.returnDate);
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date));
      }
    });

    return dates;
  }, [unavailableDates, carBookings]);

  // Check if a date should be disabled
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (date < today) return true;

    // Disable dates beyond 90 days from today
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 90);
    if (date > maxDate) return true;

    // Disable booked dates
    return disabledDates.some(
      (disabledDate) => disabledDate.toDateString() === date.toDateString()
    );
  };

  // Get pricing tier for a date
  const getPricingTier = (date) => {
    if (!pricingTiers.peak || !pricingTiers.offPeak) return null;
    
    const dayOfWeek = date.getDay();
    if (pricingTiers.peak.days.includes(dayOfWeek)) {
      return {
        type: "peak",
        multiplier: pricingTiers.peak.multiplier,
        price: basePrice * pricingTiers.peak.multiplier,
      };
    }
    if (pricingTiers.offPeak.days.includes(dayOfWeek)) {
      return {
        type: "off-peak",
        multiplier: pricingTiers.offPeak.multiplier,
        price: basePrice * pricingTiers.offPeak.multiplier,
      };
    }
    return {
      type: "standard",
      multiplier: 1,
      price: basePrice,
    };
  };

  // Custom day component to show pricing
  const renderDayContents = (day, date) => {
    if (!date) return day;
    
    const tier = getPricingTier(date);
    const isDisabled = isDateDisabled(date);
    
    if (isDisabled) {
      return (
        <DayContent $disabled>
          {day}
        </DayContent>
      );
    }

    if (tier?.type === "peak") {
      return (
        <DayContent $peak>
          {day}
          <PriceBadge $peak>${tier.price.toFixed(0)}</PriceBadge>
        </DayContent>
      );
    }

    if (tier?.type === "off-peak") {
      return (
        <DayContent $offPeak>
          {day}
          <PriceBadge $offPeak>${tier.price.toFixed(0)}</PriceBadge>
        </DayContent>
      );
    }

    return (
      <DayContent>
        {day}
        {basePrice > 0 && <PriceBadge>${basePrice.toFixed(0)}</PriceBadge>}
      </DayContent>
    );
  };

  const handleStartDateChange = (date) => {
    if (date) {
      onDateChange("pickupDate", date.toISOString().split("T")[0]);
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      onDateChange("returnDate", date.toISOString().split("T")[0]);
    }
  };

  if (isLoading) {
    return (
      <CalendarContainer>
        <LoadingState>
          <LoadingSpinner size="md" />
          <LoadingText>Loading availability...</LoadingText>
        </LoadingState>
      </CalendarContainer>
    );
  }

  if (error) {
    return (
      <CalendarContainer>
        <ErrorState>
          <FiAlertCircle />
          <span>Unable to load availability. Using basic calendar.</span>
        </ErrorState>
      </CalendarContainer>
    );
  }

  return (
    <CalendarContainer>
      <DateGroup>
        <FormGroup>
          <Label>
            <FiCalendar />
            Pick-up Date
          </Label>
          <StyledDatePicker
            selected={startDate ? new Date(startDate) : null}
            onChange={handleStartDateChange}
            selectsStart
            startDate={startDate ? new Date(startDate) : null}
            endDate={endDate ? new Date(endDate) : null}
            filterDate={isDateDisabled}
            minDate={new Date()}
            maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
            placeholderText="Select start date"
            dateFormat="MMMM d, yyyy"
            showDisabledMonthNavigation
            disabledKeyboardNavigation
            calendarClassName="availability-calendar"
            renderDayContents={renderDayContents}
          />
        </FormGroup>

        <FormGroup>
          <Label>
            <FiCalendar />
            Return Date
          </Label>
          <StyledDatePicker
            selected={endDate ? new Date(endDate) : null}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={startDate ? new Date(startDate) : null}
            endDate={endDate ? new Date(endDate) : null}
            minDate={startDate ? new Date(startDate) : new Date()}
            filterDate={isDateDisabled}
            placeholderText="Select end date"
            dateFormat="MMMM d, yyyy"
            disabled={!startDate}
            calendarClassName="availability-calendar"
            renderDayContents={renderDayContents}
          />
        </FormGroup>
      </DateGroup>

      {/* Pricing Info */}
      {pricingTiers && basePrice > 0 && (
        <PricingInfo>
          <PricingTitle>
            <FiDollarSign />
            Pricing Information
          </PricingTitle>
          <PricingGrid>
            {pricingTiers.peak && (
              <PricingItem>
                <PricingColor $peak />
                <PricingDetails>
                  <PricingLabel>Peak Days</PricingLabel>
                  <PricingValue>
                    ${(basePrice * pricingTiers.peak.multiplier).toFixed(2)}/day
                  </PricingValue>
                </PricingDetails>
              </PricingItem>
            )}
            {pricingTiers.offPeak && (
              <PricingItem>
                <PricingColor $offPeak />
                <PricingDetails>
                  <PricingLabel>Off-Peak Days</PricingLabel>
                  <PricingValue>
                    ${(basePrice * pricingTiers.offPeak.multiplier).toFixed(2)}/day
                  </PricingValue>
                </PricingDetails>
              </PricingItem>
            )}
            <PricingItem>
              <PricingColor />
              <PricingDetails>
                <PricingLabel>Base Price</PricingLabel>
                <PricingValue>${basePrice.toFixed(2)}/day</PricingValue>
              </PricingDetails>
            </PricingItem>
          </PricingGrid>
        </PricingInfo>
      )}

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
        {pricingTiers?.peak && (
          <LegendItem>
            <LegendColor $peak />
            <span>Peak Pricing</span>
          </LegendItem>
        )}
        {pricingTiers?.offPeak && (
          <LegendItem>
            <LegendColor $offPeak />
            <span>Off-Peak Pricing</span>
          </LegendItem>
        )}
      </CalendarLegend>
    </CalendarContainer>
  );
};

export default CarAvailabilityCalendar;

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
    box-shadow: 0 0 0 3px var(--primary-light);
  }

  &:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
  }
`;

const DayContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px;
  color: ${(props) => {
    if (props.$disabled) return "var(--gray-400)";
    if (props.$peak) return "var(--error)";
    if (props.$offPeak) return "var(--success)";
    return "var(--text-primary)";
  }};
  font-weight: ${(props) => (props.$peak || props.$offPeak ? "var(--font-semibold)" : "normal")};
`;

const PriceBadge = styled.span`
  font-size: 8px;
  font-weight: var(--font-bold);
  color: ${(props) => {
    if (props.$peak) return "var(--error)";
    if (props.$offPeak) return "var(--success)";
    return "var(--primary)";
  }};
  background: ${(props) => {
    if (props.$peak) return "var(--error-light)";
    if (props.$offPeak) return "var(--success-light)";
    return "var(--primary-light)";
  }};
  padding: 1px 4px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  gap: var(--space-md);
`;

const LoadingText = styled.span`
  color: var(--text-muted);
  font-size: var(--text-sm);
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--warning-light);
  border: 1px solid var(--warning);
  border-radius: var(--radius-lg);
  color: var(--warning-dark);
  font-size: var(--text-sm);
`;

const PricingInfo = styled.div`
  margin-top: var(--space-lg);
  padding: var(--space-lg);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
`;

const PricingTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-md);
`;

const PricingItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--white);
  border-radius: var(--radius-md);
`;

const PricingColor = styled.div`
  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: ${(props) => {
    if (props.$peak) return "var(--error)";
    if (props.$offPeak) return "var(--success)";
    return "var(--primary)";
  }};
  flex-shrink: 0;
`;

const PricingDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PricingLabel = styled.span`
  font-size: var(--text-xs);
  color: var(--text-muted);
`;

const PricingValue = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const CalendarLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-top: var(--space-md);
  padding: var(--space-md);
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
  background: ${(props) => {
    if (props.$available) return "var(--success)";
    if (props.$booked) return "var(--error)";
    if (props.$peak) return "var(--error)";
    if (props.$offPeak) return "var(--success)";
    return "var(--gray-400)";
  }};
`;

