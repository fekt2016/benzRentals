/* eslint-disable react/prop-types */
// components/BookingSummarySection.jsx
import React from 'react';
import styled from 'styled-components';
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiUpload,
  FiLoader,
  FiCheck,
  FiShield,
  FiCreditCard,
  FiAlertCircle,
  FiRefreshCw,
  FiXCircle,
} from "react-icons/fi";
import { formatDate } from "../../utils/helper";
import { Card } from "../../features/cars/Card";
import { PrimaryButton, GhostButton, SecondaryButton } from "../../components/ui/Button";

const BookingSummarySection = ({
  booking,
  totalDays,
  subtotal,
  depositAmount,
  driverServiceFee = 0,
  discountAmount = 0,
  appliedCoupon = null,
  totalPrice,
  allVerified,
  hasProfessionalDriver = false,
  isDocumentsProcessing,
  isFetchingBooking,
  uploadError,
  handleOpenModal,
  clearError,
  onEditDetails,
//   isLoadingDrivers,
//   driversError
}) => {
  return (
    <SummarySection>
      <SectionCard $loading={isFetchingBooking}>
        {isFetchingBooking && <ProcessingOverlay />}
        <SectionHeader>
          <SectionTitle>Booking Summary</SectionTitle>
          <EditLink 
            disabled={isDocumentsProcessing}
            onClick={onEditDetails}
          >
            Edit Details
          </EditLink>
        </SectionHeader>

        <CarCard>
          <CarImage
            src={booking?.car?.images?.[0] || "/default-car.jpg"}
            alt={booking?.car?.model}
            onError={(e) => {
              e.target.src = "/default-car.jpg";
            }}
          />
          <CarDetails>
            <CarName>{booking?.car?.name || "Car"}</CarName>
            <CarSpecs>
              {booking?.car?.specifications ||
                "Automatic • 5 Seats • Premium"}
            </CarSpecs>
            <CarPrice>${booking?.car?.pricePerDay || 0}/day</CarPrice>
          </CarDetails>
        </CarCard>
      </SectionCard>

      <SectionCard $loading={isFetchingBooking}>
        {isFetchingBooking && <ProcessingOverlay />}
        <SectionTitle>Rental Details</SectionTitle>
        <DetailsGrid>
          <DetailItem>
            <DetailIcon>
              <FiCalendar />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Pickup Date</DetailLabel>
              <DetailValue>
                {booking?.pickupDate
                  ? formatDate(booking.pickupDate)
                  : "Not set"}
              </DetailValue>
            </DetailContent>
          </DetailItem>

          <DetailItem>
            <DetailIcon>
              <FiCalendar />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Return Date</DetailLabel>
              <DetailValue>
                {booking?.returnDate
                  ? formatDate(booking.returnDate)
                  : "Not set"}
              </DetailValue>
            </DetailContent>
          </DetailItem>

          <DetailItem>
            <DetailIcon>
              <FiClock />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Duration</DetailLabel>
              <DetailValue>{totalDays} days</DetailValue>
            </DetailContent>
          </DetailItem>

          <DetailItem>
            <DetailIcon>
              <FiMapPin />
            </DetailIcon>
            <DetailContent>
              <DetailLabel>Pickup Location</DetailLabel>
              <DetailValue>
                {booking?.pickupLocation || "Not specified"}
              </DetailValue>
            </DetailContent>
          </DetailItem>
        </DetailsGrid>
      </SectionCard>

      <SectionCard $loading={isFetchingBooking}>
        {isFetchingBooking && <ProcessingOverlay />}
        <SectionTitle>Price Breakdown</SectionTitle>
        <PriceList>
          <PriceItem>
            <span>
              ${booking?.car?.pricePerDay || 0} × {totalDays} days
            </span>
            <span>${subtotal.toFixed(2)}</span>
          </PriceItem>
          {driverServiceFee > 0 && (
            <PriceItem>
              <span>Professional Driver Service</span>
              <span>${driverServiceFee.toFixed(2)}</span>
            </PriceItem>
          )}
          <PriceItem>
            <span>Deposit Amount</span>
            <span>${depositAmount.toFixed(2)}</span>
          </PriceItem>
          {appliedCoupon && discountAmount > 0 && (
            <PriceItem $discount>
              <span>Discount ({appliedCoupon.code})</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </PriceItem>
          )}
          <PriceDivider />
          <TotalPrice>
            <span>Total Amount</span>
            <span>${totalPrice.toFixed(2)}</span>
          </TotalPrice>
        </PriceList>
      </SectionCard>

      {/* Driver Documents Section - Only show if no professional driver */}
      {!hasProfessionalDriver && (
      <DriverDocumentsSection
        booking={booking}
        allVerified={allVerified}
          hasProfessionalDriver={hasProfessionalDriver}
        isDocumentsProcessing={isDocumentsProcessing}
        isFetchingBooking={isFetchingBooking}
        uploadError={uploadError}
        handleOpenModal={handleOpenModal}
        clearError={clearError}
      />
      )}
      
      {/* Professional Driver Section */}
      {hasProfessionalDriver && booking?.professionalDriver && (
        <ProfessionalDriverSection>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Driver Information</SectionTitle>
              <StatusBadge $status="verified">
                <FiCheck />
                Verified & Ready
              </StatusBadge>
            </SectionHeader>
            
            <DriverInfo>
              <DriverHeader>
                <DriverName>{booking.professionalDriver.name || "Professional Driver"}</DriverName>
                {booking.professionalDriver.rating > 0 && (
                  <DriverRating>
                    <FiShield />
                    {booking.professionalDriver.rating.toFixed(1)}/5.0 Rating
                  </DriverRating>
                )}
              </DriverHeader>
              
              <DriverDetails>
                {booking.professionalDriver.experience && (
                  <DriverDetailItem>
                    <DetailLabel>Experience</DetailLabel>
                    <DetailValue>{booking.professionalDriver.experience} years</DetailValue>
                  </DriverDetailItem>
                )}
                {booking.professionalDriver.licenseNumber && (
                  <DriverDetailItem>
                    <DetailLabel>License Number</DetailLabel>
                    <DetailValue>{booking.professionalDriver.licenseNumber}</DetailValue>
                  </DriverDetailItem>
                )}
                {booking.professionalDriver.phone && (
                  <DriverDetailItem>
                    <DetailLabel>Contact</DetailLabel>
                    <DetailValue>{booking.professionalDriver.phone}</DetailValue>
                  </DriverDetailItem>
                )}
                {booking.professionalDriver.dailyRate && (
                  <DriverDetailItem>
                    <DetailLabel>Daily Rate</DetailLabel>
                    <DetailValue>${booking.professionalDriver.dailyRate}/day</DetailValue>
                  </DriverDetailItem>
                )}
              </DriverDetails>
              
              {driverServiceFee > 0 && (
                <DriverServiceInfo>
                  <DriverServiceLabel>Total Service Fee</DriverServiceLabel>
                  <DriverServiceAmount>
                    ${driverServiceFee.toFixed(2)} for {totalDays} {totalDays === 1 ? 'day' : 'days'}
                  </DriverServiceAmount>
                </DriverServiceInfo>
              )}
            </DriverInfo>
            
            <InfoMessage style={{ marginTop: '1rem', background: 'var(--success-light)', color: 'var(--success-dark)', border: '1px solid var(--success)' }}>
              <FiShield />
              <div>
                <strong>Professional driver service is included</strong>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: 'var(--text-xs)', opacity: 0.9 }}>
                  Your professional driver is verified and ready. They will be available for your entire rental period.
                </p>
              </div>
            </InfoMessage>
          </SectionCard>
        </ProfessionalDriverSection>
      )}
    </SummarySection>
  );
};

// Driver Documents Sub-component
const DriverDocumentsSection = ({
  booking,
  allVerified,
  hasProfessionalDriver = false,
  isDocumentsProcessing,
  isFetchingBooking,
  uploadError,
  handleOpenModal,
  clearError
}) => (
  <SectionCard 
    $disabled={isDocumentsProcessing || isFetchingBooking}
    $loading={isFetchingBooking}
  >
    {(isDocumentsProcessing || isFetchingBooking) && <ProcessingOverlay />}
    <SectionHeader>
      <SectionTitle>Driver Information</SectionTitle>
      {!booking?.driver && !isFetchingBooking && (
        <StatusBadge $status="required">Required</StatusBadge>
      )}
      {isDocumentsProcessing && (
        <StatusBadge $status="processing">
          <FiLoader className="spinner" />
          Processing...
        </StatusBadge>
      )}
      {isFetchingBooking && (
        <StatusBadge $status="processing">
          <FiLoader className="spinner" />
          Updating...
        </StatusBadge>
      )}
    </SectionHeader>

    {/* Show upload error in the driver section */}
    {uploadError && !isFetchingBooking && (
      <UploadError>
        <ErrorIconSmall>
          <FiAlertCircle />
        </ErrorIconSmall>
        <ErrorContent>
          <ErrorMessageSmall>
            {uploadError.message || "Failed to upload documents"}
          </ErrorMessageSmall>
        </ErrorContent>
        <ActionButtonsHorizontal>
          <RetryButton onClick={handleOpenModal} $size="sm">
            <FiRefreshCw />
          </RetryButton>
          <CloseButton onClick={() => clearError('upload')}>
            <FiXCircle />
          </CloseButton>
        </ActionButtonsHorizontal>
      </UploadError>
    )}

    {!booking?.driver && !isFetchingBooking ? (
      <EmptyDriverState>
        <EmptyStateIcon>
          <FiUser />
        </EmptyStateIcon>
        <EmptyStateContent>
          <h4>Driver Required</h4>
          <p>Add driver information to complete your booking</p>
        </EmptyStateContent>
        <PrimaryButton
          onClick={handleOpenModal}
          $size="md"
          disabled={isDocumentsProcessing || isFetchingBooking}
        >
          <FiUpload />
          {isDocumentsProcessing ? "Uploading..." : "Add Driver"}
        </PrimaryButton>
      </EmptyDriverState>
    ) : (
      <DriverStatusSection>
        <DocumentStatus
          verified={allVerified}
          $processing={isDocumentsProcessing || isFetchingBooking}
        >
          <StatusIcon
            verified={allVerified}
            $processing={isDocumentsProcessing || isFetchingBooking}
          >
            {isDocumentsProcessing || isFetchingBooking ? (
              <FiLoader className="spinner" />
            ) : allVerified ? (
              <FiCheck />
            ) : (
              <FiClock />
            )}
          </StatusIcon>
          <StatusContent>
            <StatusTitle>
              {isDocumentsProcessing || isFetchingBooking
                ? "Processing Documents..."
                : allVerified
                ? "All Documents Verified"
                : "Pending Verification"}
            </StatusTitle>
            <StatusDescription>
              {isDocumentsProcessing || isFetchingBooking
                ? "Please wait while we process your documents..."
                : allVerified
                ? "Your driver information has been verified and approved"
                : "Waiting for admin approval of your documents"}
            </StatusDescription>
          </StatusContent>
        </DocumentStatus>

        <DocumentsGrid>
          <DocumentItem
            verified={booking?.driver?.insurance?.verified}
            $processing={isDocumentsProcessing || isFetchingBooking}
          >
            <DocumentIcon $processing={isDocumentsProcessing || isFetchingBooking}>
              <FiShield />
            </DocumentIcon>
            <DocumentInfo>
              <DocumentName>Insurance Document</DocumentName>
              <DocumentStatusText
                verified={booking?.driver?.insurance?.verified}
                $processing={isDocumentsProcessing || isFetchingBooking}
              >
                {isDocumentsProcessing || isFetchingBooking
                  ? "Processing..."
                  : booking?.driver?.insurance?.verified
                  ? "Verified"
                  : "Pending"}
              </DocumentStatusText>
            </DocumentInfo>
          </DocumentItem>

          <DocumentItem
            verified={booking?.driver?.license?.verified}
            $processing={isDocumentsProcessing || isFetchingBooking}
          >
            <DocumentIcon $processing={isDocumentsProcessing || isFetchingBooking}>
              <FiCreditCard />
            </DocumentIcon>
            <DocumentInfo>
              <DocumentName>Driver License</DocumentName>
              <DocumentStatusText
                verified={booking?.driver?.license?.verified}
                $processing={isDocumentsProcessing || isFetchingBooking}
              >
                {isDocumentsProcessing || isFetchingBooking
                  ? "Processing..."
                  : booking?.driver?.license?.verified
                  ? "Verified"
                  : "Pending"}
              </DocumentStatusText>
            </DocumentInfo>
          </DocumentItem>
        </DocumentsGrid>

        {!allVerified && !isDocumentsProcessing && !isFetchingBooking && !hasProfessionalDriver && (
          <UpdateDocumentsPrompt>
            <FiAlertCircle />
            <span>Documents pending verification</span>
            <GhostButton 
              onClick={handleOpenModal} 
              $size="sm"
              disabled={isDocumentsProcessing}
            >
              Update Documents
            </GhostButton>
          </UpdateDocumentsPrompt>
        )}

        {(isDocumentsProcessing || isFetchingBooking) && (
          <ProcessingMessage>
            <FiLoader className="spinner" />
            <div>
              <strong>
                {isFetchingBooking ? "Updating information..." : "Documents are being processed"}
              </strong>
              <p>
                This may take a few moments. Please don&apos;t refresh the page.
              </p>
            </div>
          </ProcessingMessage>
        )}
      </DriverStatusSection>
    )}
  </SectionCard>
);

// Styled Components
const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
`;

const SectionCard = styled(Card)`
  padding: var(--space-xl);
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  position: relative;
  transition: all var(--transition-normal);

  ${(props) =>
    props.$disabled &&
    `
    opacity: 0.7;
    pointer-events: none;
  `}

  ${(props) =>
    props.$loading &&
    `
    border-color: var(--primary);
  `}
`;

const ProcessingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
  border-radius: inherit;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const EditLink = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.disabled ? "var(--gray-400)" : "var(--primary)")};
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  text-decoration: underline;
  transition: color var(--transition-fast);

  &:hover {
    color: ${(props) =>
      props.disabled ? "var(--gray-400)" : "var(--primary-dark)"};
  }
`;

const CarCard = styled.div`
  display: flex;
  gap: var(--space-lg);
  align-items: center;
`;

const CarImage = styled.img`
  width: 120px;
  height: 90px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  box-shadow: var(--shadow-sm);
`;

const CarDetails = styled.div`
  flex: 1;
`;

const CarName = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  font-family: var(--font-heading);
`;

const CarSpecs = styled.p`
  color: var(--text-muted);
  margin: 0 0 var(--space-sm) 0;
  font-size: var(--text-sm);
`;

const CarPrice = styled.div`
  color: var(--primary);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
`;

const DetailsGrid = styled.div`
  display: grid;
  gap: var(--space-md);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-md) 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-200);
  }
`;

const DetailIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  font-size: var(--text-lg);
  flex-shrink: 0;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
`;

const DetailValue = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-base);
`;

const PriceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${(props) => (props.$discount ? "var(--success)" : "var(--text-secondary)")};
  font-size: var(--text-base);
  font-weight: ${(props) => (props.$discount ? "var(--font-semibold)" : "normal")};
`;

const PriceDivider = styled.div`
  height: 1px;
  background: var(--gray-300);
  margin: var(--space-sm) 0;
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  padding-top: var(--space-sm);
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  background: ${(props) => {
    switch (props.$status) {
      case "required":
        return "var(--warning)";
      case "processing":
        return "var(--primary)";
      default:
        return "var(--gray-200)";
    }
  }};
  color: var(--white);

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyDriverState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-2xl);
  gap: var(--space-lg);
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: var(--primary);
  opacity: 0.7;
`;

const EmptyStateContent = styled.div`
  h4 {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0 0 var(--space-xs) 0;
  }

  p {
    color: var(--text-muted);
    margin: 0;
    font-size: var(--text-base);
  }
`;

const DriverStatusSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const DocumentStatus = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: ${(props) => {
    if (props.$processing) return "var(--gradient-primary)";
    return props.verified
      ? "linear-gradient(135deg, var(--success) 0%, #34d399 100%)"
      : "linear-gradient(135deg, var(--warning) 0%, #f59e0b 100%)";
  }};
  color: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  position: relative;
`;

const StatusIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  flex-shrink: 0;

  .spinner {
    animation: spin 1s linear infinite;
  }
`;

const StatusContent = styled.div`
  flex: 1;
`;

const StatusTitle = styled.div`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-xs);
`;

const StatusDescription = styled.div`
  font-size: var(--text-sm);
  opacity: 0.9;
`;

const DocumentsGrid = styled.div`
  display: grid;
  gap: var(--space-md);
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border-left: 4px solid
    ${(props) => {
      if (props.$processing) return "var(--primary)";
      return props.verified ? "var(--success)" : "var(--warning)";
    }};
  transition: all var(--transition-normal);

  ${(props) =>
    props.$processing &&
    `
    background: var(--primary-light);
    border-left-color: var(--primary);
  `}
`;

const DocumentIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: ${(props) =>
    props.$processing ? "var(--primary)" : "var(--white)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => {
    if (props.$processing) return "var(--white)";
    return "var(--gray-600)";
  }};
  font-size: var(--text-lg);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
  transition: all var(--transition-normal);
`;

const DocumentInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DocumentName = styled.span`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-base);
`;

const DocumentStatusText = styled.span`
  color: ${(props) => {
    if (props.$processing) return "var(--primary)";
    return props.verified ? "var(--success)" : "var(--warning)";
  }};
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color var(--transition-normal);
`;

const UpdateDocumentsPrompt = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--gray-100);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-size: var(--text-sm);

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProcessingMessage = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--primary-light);
  border: 1px solid var(--primary);
  border-radius: var(--radius-lg);
  color: var(--primary-dark);

  strong {
    display: block;
    margin-bottom: var(--space-xs);
  }

  p {
    margin: 0;
    font-size: var(--text-sm);
    opacity: 0.8;
  }

  .spinner {
    animation: spin 1s linear infinite;
    font-size: var(--text-xl);
    flex-shrink: 0;
  }
`;

const UploadError = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--error-light);
  border: 1px solid var(--error);
  border-radius: var(--radius-lg);
  color: var(--error-dark);
  margin-bottom: var(--space-lg);

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: var(--space-sm);
  }
`;

const ErrorIconSmall = styled.div`
  font-size: var(--text-xl);
  color: var(--error);
  flex-shrink: 0;
`;

const ErrorContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const ErrorMessageSmall = styled.div`
  font-size: var(--text-sm);
  color: var(--error-dark);
  opacity: 0.9;
`;

const ActionButtonsHorizontal = styled.div`
  display: flex;
  gap: var(--space-sm);
  align-items: center;
`;

const RetryButton = styled(SecondaryButton)`
  padding: var(--space-sm);
  min-width: auto;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--error-dark);
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

// Professional Driver Section Styled Components
const ProfessionalDriverSection = styled.div`
  margin-top: var(--space-xl);
`;

const DriverInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--white) 100%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--primary);
`;

const DriverHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--gray-200);
`;

const DriverName = styled.h4`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const DriverRating = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--success);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  
  svg {
    font-size: var(--text-base);
  }
`;

const DriverDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-md);
`;

const DriverDetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const DriverServiceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: var(--white);
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-200);
  margin-top: var(--space-sm);
`;

const DriverServiceLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-weight: var(--font-medium);
`;

const DriverServiceAmount = styled.div`
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--primary);
`;

const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
`;

export default BookingSummarySection;