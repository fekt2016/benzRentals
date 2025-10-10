// components/MobileCard.js
import React from "react";
import styled from "styled-components";
import { PrimaryButton, SecondaryButton, SuccessButton } from "./ui/Button";

// Icons
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaFileAlt,
  FaCheckCircle,
  FaStar,
  FaEye,
  FaCloudUploadAlt,
  FaBan,
} from "react-icons/fa";

const MobileCard = ({
  booking,
  statusConfig,
  canCancel,
  showCheckInButton,
  checkInStatus,
  isCheckedIn,
  canReview,
  hasReview,
  fuelLevelLabels,
  formatDate,
  onViewDetails,
  onUpdateDocuments,
  onCheckIn,
  onCancel,
  onReview,
}) => {
  const StatusIcon = statusConfig?.icon;

  return (
    <MobileCardStyled>
      <CardHeader>
        <VehicleInfo>
          <CarImage
            src={booking.car?.images?.[0] || "/default-car.jpg"}
            alt={booking.car?.model || "Car"}
            onError={(e) => {
              e.target.src = "/default-car.jpg";
            }}
          />
          <div>
            <CarModel>{booking.car?.model || "Unknown Model"}</CarModel>
            <CarType>Premium Sedan • Automatic</CarType>
          </div>
        </VehicleInfo>
        <StatusBadge $color={statusConfig?.color}>
          <StatusIcon size={12} />
          {booking.status || "unknown"}
        </StatusBadge>
      </CardHeader>

      <CardContent>
        <InfoGrid>
          <InfoItem>
            <FaCalendarAlt />
            <div>
              <InfoLabel>Pickup Date</InfoLabel>
              <InfoValue>{formatDate(booking.pickupDate)}</InfoValue>
            </div>
          </InfoItem>

          <InfoItem>
            <FaCalendarAlt />
            <div>
              <InfoLabel>Return Date</InfoLabel>
              <InfoValue>{formatDate(booking.returnDate)}</InfoValue>
            </div>
          </InfoItem>

          <InfoItem>
            <FaMapMarkerAlt />
            <div>
              <InfoLabel>Location</InfoLabel>
              <InfoValue>{booking.pickupLocation || "Not specified"}</InfoValue>
            </div>
          </InfoItem>

          <InfoItem>
            <FaDollarSign />
            <div>
              <InfoLabel>Total Amount</InfoLabel>
              <InfoValue>${booking.totalPrice || "0"}</InfoValue>
            </div>
          </InfoItem>
        </InfoGrid>

        <DocumentsSection>
          <SectionTitle>Document Status</SectionTitle>
          <DocumentStatusGroup>
            <MobileDocStatus $verified={booking.driver?.verified}>
              <FaFileAlt />
              {booking.driver
                ? booking.driver?.verified
                  ? "Verified"
                  : "Pending verification"
                : "Provide License"}
              <StatusIndicator $verified={booking.driver?.verified} />
            </MobileDocStatus>
          </DocumentStatusGroup>
        </DocumentsSection>

        {/* Check-in Section for Mobile */}
        <CheckInSection>
          <SectionTitle>Check-in Status</SectionTitle>
          {isCheckedIn ? (
            <CheckedInBadgeMobile>
              <FaCheckCircle />
              Checked In
              {booking.checkIn?.mileage && (
                <CheckInDetailsMobile>
                  Mileage: {booking.checkIn.mileage.toLocaleString()} • Fuel:{" "}
                  {fuelLevelLabels[booking.checkIn.fuelLevel] ||
                    booking.checkIn.fuelLevel}
                </CheckInDetailsMobile>
              )}
            </CheckedInBadgeMobile>
          ) : showCheckInButton ? (
            <MobileCheckInButton
              onClick={onCheckIn}
              disabled={checkInStatus?.disabled}
              $variant={
                checkInStatus?.type === "ready" ? "success" : "secondary"
              }
              $size="sm"
            >
              <FaCheckCircle />
              {checkInStatus?.message}
            </MobileCheckInButton>
          ) : (
            <CheckInHintMobile>{checkInStatus?.message}</CheckInHintMobile>
          )}
        </CheckInSection>

        {/* Review Section for Mobile */}
        <ReviewSection>
          <SectionTitle>Review Status</SectionTitle>
          {hasReview ? (
            <ReviewedBadge>
              <FaCheckCircle />
              Reviewed
            </ReviewedBadge>
          ) : canReview ? (
            <MobileReviewButton onClick={onReview} $size="sm">
              <FaStar />
              Review
            </MobileReviewButton>
          ) : (
            <ReviewHintMobile>
              Complete your trip to leave a review
            </ReviewHintMobile>
          )}
        </ReviewSection>
      </CardContent>

      <CardActions>
        <MobileButton onClick={onViewDetails} $variant="primary" $size="sm">
          <FaEye />
          View Details
        </MobileButton>
        <MobileButton
          onClick={onUpdateDocuments}
          $variant="secondary"
          $size="sm"
        >
          <FaCloudUploadAlt />
          Update Documents
        </MobileButton>
        {showCheckInButton && (
          <MobileButton
            onClick={onCheckIn}
            disabled={checkInStatus?.disabled}
            $variant={checkInStatus?.type === "ready" ? "success" : "secondary"}
            $size="sm"
          >
            <FaCheckCircle />
            {checkInStatus?.message}
          </MobileButton>
        )}
        {canCancel && (
          <MobileButton onClick={onCancel} $variant="danger" $size="sm">
            <FaBan />
            Cancel
          </MobileButton>
        )}
      </CardActions>
    </MobileCardStyled>
  );
};

export default MobileCard;

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const MobileCardStyled = styled.div`
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
`;

const VehicleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex: 1;
`;

const CarImage = styled.img`
  width: 60px;
  height: 50px;
  border-radius: var(--radius-md);
  object-fit: cover;
`;

const CarModel = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-base);
`;

const CarType = styled.div`
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-family: var(--font-body);
  margin-top: var(--space-xs);
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  text-transform: capitalize;
  font-family: var(--font-body);
`;

const CardContent = styled.div`
  margin-bottom: var(--space-md);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
`;

const InfoLabel = styled.div`
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);
`;

const InfoValue = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const DocumentsSection = styled.div`
  background: var(--surface);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
`;

const SectionTitle = styled.h3`
  font-size: var(--text-sm);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

const DocumentStatusGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const MobileDocStatus = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  font-size: var(--text-sm);
  color: ${(props) => (props.$verified ? "#065f46" : "#92400e")};
  background: ${(props) => (props.$verified ? "#d1fae5" : "#fef3c7")};
  border-radius: var(--radius-md);
  font-family: var(--font-body);
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.$verified ? "var(--success)" : "var(--warning)"};
  margin-left: auto;
`;

// Check-in Section Styles
const CheckInSection = styled.div`
  background: var(--surface);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
`;

const CheckedInBadgeMobile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: var(--success);
  color: var(--white);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-align: center;
  font-family: var(--font-body);
`;

const CheckInDetailsMobile = styled.span`
  font-size: var(--text-xs);
  opacity: 0.9;
  font-weight: var(--font-normal);
  margin-top: var(--space-xs);
`;

const MobileCheckInButton = styled(SuccessButton)`
  && {
    width: 100%;
    justify-content: center;
    font-size: var(--text-sm);

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--gray-300);
      color: var(--gray-600);
      border-color: var(--gray-300);

      &:hover {
        background: var(--gray-300);
        color: var(--gray-600);
        border-color: var(--gray-300);
      }
    }
  }
`;

const CheckInHintMobile = styled.div`
  text-align: center;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-style: italic;
  font-family: var(--font-body);
`;

// Review Section Styles
const ReviewSection = styled.div`
  background: var(--surface);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
`;

const MobileReviewButton = styled(PrimaryButton)`
  && {
    width: 100%;
    justify-content: center;
    font-size: var(--text-sm);
  }
`;

const ReviewedBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--success);
  color: var(--white);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

const ReviewHintMobile = styled.div`
  text-align: center;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-style: italic;
  font-family: var(--font-body);
`;

// Card Actions Styles
const CardActions = styled.div`
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
`;

const MobileButton = styled(SecondaryButton)`
  && {
    flex: 1;
    min-width: 120px;
    justify-content: center;
    font-size: var(--text-sm);

    ${(props) =>
      props.$variant === "danger" &&
      `
      color: var(--error);
      border-color: var(--error);
      
      &:hover:not(:disabled) {
        background: var(--error);
        color: var(--white);
      }
    `}

    ${(props) =>
      props.$variant === "success" &&
      `
      color: var(--success);
      border-color: var(--success);
      
      &:hover:not(:disabled) {
        background: var(--success);
        color: var(--white);
      }
    `}
    
    ${(props) =>
      props.$variant === "primary" &&
      `
      background: var(--primary);
      color: var(--white);
      border-color: var(--primary);
      
      &:hover:not(:disabled) {
        background: var(--primary-dark);
        border-color: var(--primary-dark);
      }
    `}
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--gray-300);
      color: var(--gray-600);
      border-color: var(--gray-300);

      &:hover {
        background: var(--gray-300);
        color: var(--gray-600);
        border-color: var(--gray-300);
      }
    }

    @media (max-width: 480px) {
      min-width: calc(50% - var(--space-sm));
      flex: 0 0 calc(50% - var(--space-sm));
    }

    @media (max-width: 360px) {
      min-width: 100%;
      flex: 1 0 100%;
    }
  }
`;
