/* eslint-disable react/prop-types */
// components/BookingCardContent.js
import React from "react";
import styled from "styled-components";
import { PrimaryButton } from "../../components/ui/Button";
import BookingForm from "./BookingForm";
import { pulse, fadeInUp, slideUp } from "../../styles/animations";
import { devices } from "../../styles/GlobalStyles";


const MobileBookingForm = ({ 
  car, 
  mileageInfo, 
  drivers, 
  isMobile, 
  isMobileExpanded, 
  toggleMobileExpand 
}) => {
  return (
    <BookingCardContentWrapper>
      <BookingHeader
        $isMobile={isMobile}
        $isMobileExpanded={isMobileExpanded}
        className="booking-header"
      >
        <div>
          <BookingTitle> Book This Car</BookingTitle>
          <PriceHighlight>${car.pricePerDay}/day</PriceHighlight>
        </div>
        {isMobile && (
          <MobileExpandButton
            onClick={toggleMobileExpand}
            $expanded={isMobileExpanded}
            aria-label={
              isMobileExpanded ? "Collapse booking form" : "Expand booking form"
            }
          >
            <span>{isMobileExpanded ? "Hide Form" : "Booking Form"}</span>
            <span>{isMobileExpanded ? "▼" : "▲"}</span>
          </MobileExpandButton>
        )}
      </BookingHeader>

      <BookingCardBody
        $isMobile={isMobile}
        $isMobileExpanded={isMobileExpanded}
        onClick={(e) => e.stopPropagation()}
      >
        {car.status === "available" ? (
          <>
            <AvailabilityBadge $available={true}>
              Available for booking
            </AvailabilityBadge>

            {mileageInfo && (
              <MileagePolicyCard>
                <MileagePolicyTitle> Mileage Policy</MileagePolicyTitle>
                <MileagePolicyDetails>
                  {mileageInfo.unlimitedMileage ? (
                    <UnlimitedMileage>
                      <span>🚀 Unlimited Mileage</span>
                      <small>
                        Drive as much as you want with no extra charges
                      </small>
                    </UnlimitedMileage>
                  ) : (
                    <Mil>
                      <MileageAllowance>
                        <strong>{mileageInfo.dailyAllowance} miles</strong> Per day
                      </MileageAllowance>
                      <MileageRate>
                        <strong>${mileageInfo.extraMileRate}/mile</strong> Extra milages
                      </MileageRate>
                    </Mil>
                  )}
                </MileagePolicyDetails>
              </MileagePolicyCard>
            )}

            <FormContainer className="booking-form">
              <BookingForm
                car={car}
                drivers={drivers}
                mileageInfo={mileageInfo}
              />
            </FormContainer>
            <BookingNote>
              💡 Free cancellation up to 24 hours before pickup
            </BookingNote>
          </>
        ) : (
          <NotAvailable>
            <NotAvailableIcon>⏸️</NotAvailableIcon>
            <NotAvailableTitle>Currently Unavailable</NotAvailableTitle>
            <NotAvailableText>
              This car is <strong>{car.status}</strong>. Check back later!
            </NotAvailableText>
            {car.status === "maintenance" && mileageInfo?.needsService && (
              <MaintenanceNote>
                🔧 This vehicle is undergoing scheduled maintenance
              </MaintenanceNote>
            )}
            <NotifyButton>🔔 Notify me when available</NotifyButton>
          </NotAvailable>
        )}
      </BookingCardBody>
    </BookingCardContentWrapper>
  );
};

export default MobileBookingForm;
const BookingCardContentWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) =>
    props.$isMobile && !props.$isMobileExpanded ? "0" : "var(--space-lg)"};
  width: 100%;
  padding: ${(props) => (props.$isMobile ? "var(--space-sm) 0" : "0")};

  @media ${devices.sm} {
    margin-bottom: ${(props) =>
      props.$isMobile && !props.$isMobileExpanded ? "0" : "var(--space-sm)"};
  }

  div {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    flex: 1;

    @media ${devices.sm} {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-sm);
    }
  }
`;

const MobileExpandButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-xl) var(--space-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  min-width: 160px;
  margin-left: auto;

  &:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0);
  }

  @media ${devices.sm} {
    min-width: 140px;
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
  }
  
  span {
    font-size: var(--text-xl);
  }
`;

const BookingCardBody = styled.div`
  display: ${(props) =>
    props.$isMobile && !props.$isMobileExpanded ? "none" : "block"};
  animation: ${(props) =>
      props.$isMobile && props.$isMobileExpanded ? slideUp : "none"}
    0.3s ease-out;
  pointer-events: auto;
`;

const FormContainer = styled.div`
  width: 100%;

  & > * {
    pointer-events: auto;
  }

  input,
  select,
  textarea,
  button,
  label {
    pointer-events: auto !important;
  }
`;

const BookingTitle = styled.h3`
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-md);
  }
`;

const PriceHighlight = styled.span`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  animation: ${pulse} 2s infinite;
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-xl);
  }
`;

const AvailabilityBadge = styled.div`
  background: ${(props) =>
    props.$available ? "var(--success-light)" : "var(--error-light)"};
  color: ${(props) =>
    props.$available ? "var(--success-dark)" : "var(--error-dark)"};
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  text-align: center;
  font-family: var(--font-body);
`;

const MileagePolicyCard = styled.div`
  background: var(--accent);
  border: 1px solid var(--primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
  animation: ${fadeInUp} 0.6s ease-out;

  @media ${devices.sm} {
    padding: var(--space-md);
    margin-bottom: var(--space-sm);
  }
`;

const MileagePolicyTitle = styled.h4`
  margin: 0 0 var(--space-md) 0;
  color: var(--primary-dark);
  font-size: var(--text-3xxl);
  font-weight: var(--font-bold);
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-sm);
    margin-bottom: var(--space-sm);
  }
`;

const MileagePolicyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const UnlimitedMileage = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);

  span {
    font-weight: var(--font-bold);
    color: var(--primary-dark);
    font-size: var(--text-md);
  }

  small {
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  @media ${devices.sm} {
    span {
      font-size: var(--text-sm);
    }

    small {
      font-size: var(--text-xs);
    }
  }
`;

const Mil = styled.div`
  display: flex;
  justify-content: space-around;
`;

const MileageAllowance = styled.div`
  color: var(--text-primary);
  font-size: var(--text-2xl);

  strong {
    color: var(--primary-dark);
  }

  @media ${devices.sm} {
    font-size: var(--text-lg);
  }
`;

const MileageRate = styled.div`
  color: var(--text-primary);
  font-size: var(--text-2xl);

  strong {
    color: var(--primary-dark);
  }

  @media ${devices.sm} {
    font-size: var(--text-lg);
  }
`;

const BookingNote = styled.div`
  margin-top: var(--space-lg);
  padding: var(--space-lg);
  background: var(--info-light);
  border-radius: var(--radius-lg);
  color: var(--info-dark);
  font-size: var(--text-sm);
  text-align: center;
  font-family: var(--font-body);

  @media ${devices.sm} {
    padding: var(--space-md);
    margin-top: var(--space-md);
    font-size: var(--text-xs);
  }
`;

const NotAvailable = styled.div`
  text-align: center;
  padding: var(--space-xl) var(--space-lg);
  color: var(--text-muted);
  font-family: var(--font-body);

  @media ${devices.sm} {
    padding: var(--space-lg) var(--space-md);
  }
`;

const NotAvailableIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--space-lg);

  @media ${devices.sm} {
    font-size: 2rem;
    margin-bottom: var(--space-md);
  }
`;

const NotAvailableTitle = styled.h3`
  margin: var(--space-lg) 0 var(--space-sm) 0;
  color: var(--error);
  font-family: var(--font-heading);
  font-size: var(--text-xl);

  @media ${devices.sm} {
    font-size: var(--text-lg);
    margin: var(--space-md) 0 var(--space-xs) 0;
  }
`;

const NotAvailableText = styled.p`
  margin: 0 0 var(--space-lg) 0;
  font-family: var(--font-body);
  font-size: var(--text-md);

  @media ${devices.sm} {
    font-size: var(--text-sm);
    margin-bottom: var(--space-md);
  }
`;

const MaintenanceNote = styled.div`
  padding: var(--space-md);
  background: var(--warning-light);
  border-radius: var(--radius-lg);
  color: var(--warning-dark);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-lg);
  font-size: var(--text-sm);

  @media ${devices.sm} {
    padding: var(--space-sm);
    margin-bottom: var(--space-md);
    font-size: var(--text-xs);
  }
`;

const NotifyButton = styled(PrimaryButton)`
  margin-top: var(--space-lg);
  padding: var(--space-md) var(--space-lg);
  font-size: var(--text-sm);

  @media ${devices.sm} {
    margin-top: var(--space-md);
    padding: var(--space-sm) var(--space-md);
    font-size: var(--text-xs);
    width: 100%;
  }
`;
