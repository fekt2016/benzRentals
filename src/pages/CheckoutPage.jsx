import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "../utils/helper";
import UpdateDocumentsModal from "../components/Modal/UpdateDocumentsModal";
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiShield,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiAlertCircle,
  FiUpload,
  FiLoader,
} from "react-icons/fi";
import { useMyDrivers } from "../hooks/useDriver";
import { useAddBookingDriver, useGetBookingById } from "../hooks/useBooking";
import { useStripePayment } from "../hooks/usePayment";
import usePageTitle from "../hooks/usePageTitle";

import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";

// Import your design system components
import { Card, LuxuryCard } from "../components/Cards/Card";
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
} from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const paymentMethods = [{ id: "stripe", name: "Stripe", icon: FiCreditCard }];

export default function CheckoutPage() {
  const seoConfig = ROUTE_CONFIG[PATHS.CHECKOUT];
  usePageTitle(seoConfig.title, seoConfig.description);

  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = location?.state || {};

  const { data: bookingResponse } = useGetBookingById(bookingId);
  const { data: myDrivers } = useMyDrivers();
  const { mutate: processStripePayment, isPending: isStripeProcessing } =
    useStripePayment();

  const drivers = useMemo(() => myDrivers?.data || [], [myDrivers]);
  const booking = useMemo(
    () => bookingResponse?.data?.data || {},
    [bookingResponse]
  );

  // Add loading state for document upload
  const { mutate: addBookingDriver, isPending: isUploadingDocuments } =
    useAddBookingDriver(booking?._id);

  const [showModal, setShowModal] = useState(false);

  // Calculate total price
  const totalDays = useMemo(() => {
    if (!booking?.pickupDate || !booking?.returnDate) return 1;
    const pickup = new Date(booking.pickupDate);
    const ret = new Date(booking.returnDate);
    return Math.max(1, Math.ceil((ret - pickup) / (1000 * 60 * 60 * 24)));
  }, [booking?.pickupDate, booking?.returnDate]);

  const subtotal = totalDays * (booking?.car?.pricePerDay || 0);
  const tax = subtotal * 0.08;
  const totalPrice = subtotal + tax;

  // Determine if documents are verified
  const allVerified =
    booking?.driver?.insurance?.verified && booking?.driver?.license?.verified;

  // Check if documents are currently being processed
  const isDocumentsProcessing = isUploadingDocuments;

  const handleStripePayment = async () => {
    if (!allVerified) {
      alert("Documents are pending verification. Cannot proceed to payment.");
      return;
    }

    const paymentData = {
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking?.car?.name || "Car Rental",
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${window.location.origin}${PATHS.CONFIRMATION}?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking?._id}`,
      cancel_url: `${window.location.origin}${PATHS.CHECKOUT}`,
      metadata: {
        booking_id: booking?._id,
        car_id: booking?.car?._id,
        total_days: totalDays,
        total_amount: totalPrice,
      },
    };

    processStripePayment(paymentData);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleUpdateDocuments = (formData) => {
    try {
      if (formData instanceof FormData) {
        addBookingDriver(formData, {
          onSuccess: () => {
            handleCloseModal();
          },
        });
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <PageWrapper>
      <Header>
        <BackButton
          onClick={() => navigate(-1)}
          as={motion.div}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          disabled={isDocumentsProcessing}
        >
          <FiArrowLeft />
          Back to Booking
        </BackButton>
        <Title>Complete Your Booking</Title>
        <SecurityBadge>
          <FiShield />
          Secure Checkout
        </SecurityBadge>
      </Header>

      <ContentGrid>
        {/* Left Column - Booking Summary */}
        <SummarySection>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Booking Summary</SectionTitle>
              <EditLink disabled={isDocumentsProcessing}>Edit Details</EditLink>
            </SectionHeader>

            <CarCard>
              <CarImage
                src={booking?.car?.images?.[0] || "/default-car.jpg"}
                alt={booking?.car?.model}
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

          <SectionCard>
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

          <SectionCard>
            <SectionTitle>Price Breakdown</SectionTitle>
            <PriceList>
              <PriceItem>
                <span>
                  ${booking?.car?.pricePerDay || 0} × {totalDays} days
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </PriceItem>
              <PriceItem>
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </PriceItem>
              <PriceDivider />
              <TotalPrice>
                <span>Total Amount</span>
                <span>${totalPrice.toFixed(2)}</span>
              </TotalPrice>
            </PriceList>
          </SectionCard>

          {/* Driver Documents Section */}
          <SectionCard $disabled={isDocumentsProcessing}>
            {isDocumentsProcessing && <ProcessingOverlay />}
            <SectionHeader>
              <SectionTitle>Driver Information</SectionTitle>
              {!booking?.driver && (
                <StatusBadge $status="required">Required</StatusBadge>
              )}
              {isDocumentsProcessing && (
                <StatusBadge $status="processing">
                  <FiLoader className="spinner" />
                  Processing...
                </StatusBadge>
              )}
            </SectionHeader>

            {!booking?.driver ? (
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
                  disabled={isDocumentsProcessing}
                >
                  <FiUpload />
                  {isDocumentsProcessing ? "Uploading..." : "Add Driver"}
                </PrimaryButton>
              </EmptyDriverState>
            ) : (
              <DriverStatusSection>
                <DocumentStatus
                  verified={allVerified}
                  $processing={isDocumentsProcessing}
                >
                  <StatusIcon
                    verified={allVerified}
                    $processing={isDocumentsProcessing}
                  >
                    {isDocumentsProcessing ? (
                      <FiLoader className="spinner" />
                    ) : allVerified ? (
                      <FiCheck />
                    ) : (
                      <FiClock />
                    )}
                  </StatusIcon>
                  <StatusContent>
                    <StatusTitle>
                      {isDocumentsProcessing
                        ? "Processing Documents..."
                        : allVerified
                        ? "All Documents Verified"
                        : "Pending Verification"}
                    </StatusTitle>
                    <StatusDescription>
                      {isDocumentsProcessing
                        ? "Please wait while we process your documents..."
                        : allVerified
                        ? "Your driver information has been verified and approved"
                        : "Waiting for admin approval of your documents"}
                    </StatusDescription>
                  </StatusContent>
                </DocumentStatus>

                <DocumentsGrid>
                  <DocumentItem
                    verified={booking?.driver.insurance?.verified}
                    $processing={isDocumentsProcessing}
                  >
                    <DocumentIcon $processing={isDocumentsProcessing}>
                      <FiShield />
                    </DocumentIcon>
                    <DocumentInfo>
                      <DocumentName>Insurance Document</DocumentName>
                      <DocumentStatusText
                        verified={booking?.driver.insurance?.verified}
                        $processing={isDocumentsProcessing}
                      >
                        {isDocumentsProcessing
                          ? "Processing..."
                          : booking?.driver.insurance?.verified
                          ? "Verified"
                          : "Pending"}
                      </DocumentStatusText>
                    </DocumentInfo>
                  </DocumentItem>

                  <DocumentItem
                    verified={booking?.driver.license?.verified}
                    $processing={isDocumentsProcessing}
                  >
                    <DocumentIcon $processing={isDocumentsProcessing}>
                      <FiCreditCard />
                    </DocumentIcon>
                    <DocumentInfo>
                      <DocumentName>Driver License</DocumentName>
                      <DocumentStatusText
                        verified={booking?.driver.license?.verified}
                        $processing={isDocumentsProcessing}
                      >
                        {isDocumentsProcessing
                          ? "Processing..."
                          : booking?.driver.license?.verified
                          ? "Verified"
                          : "Pending"}
                      </DocumentStatusText>
                    </DocumentInfo>
                  </DocumentItem>
                </DocumentsGrid>

                {!allVerified && !isDocumentsProcessing && (
                  <UpdateDocumentsPrompt>
                    <FiAlertCircle />
                    <span>Documents pending verification</span>
                    <GhostButton onClick={handleOpenModal} $size="sm">
                      Update Documents
                    </GhostButton>
                  </UpdateDocumentsPrompt>
                )}

                {isDocumentsProcessing && (
                  <ProcessingMessage>
                    <FiLoader className="spinner" />
                    <div>
                      <strong>Documents are being processed</strong>
                      <p>
                        This may take a few moments. Please don't refresh the
                        page.
                      </p>
                    </div>
                  </ProcessingMessage>
                )}
              </DriverStatusSection>
            )}
          </SectionCard>
        </SummarySection>

        {/* Right Column - Payment Section */}
        <PaymentSection>
          <PaymentCard $disabled={isDocumentsProcessing}>
            {isDocumentsProcessing && <ProcessingOverlay />}
            <PaymentHeader>
              <SectionTitle>Payment Details</SectionTitle>
              <SecureBadge>
                <FiShield />
                256-bit SSL Secure
              </SecureBadge>
            </PaymentHeader>

            <PaymentMethodSection>
              <SectionSubtitle>Payment Method</SectionSubtitle>
              <PaymentOptions>
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <PaymentOption
                      key={method.id}
                      $selected={true}
                      $disabled={isDocumentsProcessing}
                    >
                      <PaymentIcon $disabled={isDocumentsProcessing}>
                        <IconComponent />
                      </PaymentIcon>
                      <PaymentName>{method.name}</PaymentName>
                      <RadioIndicator
                        $selected={true}
                        $disabled={isDocumentsProcessing}
                      />
                    </PaymentOption>
                  );
                })}
              </PaymentOptions>
            </PaymentMethodSection>

            <PaymentMessage $disabled={isDocumentsProcessing}>
              <p>
                {isDocumentsProcessing
                  ? "Document processing in progress. Payment will be available once complete."
                  : "You will be redirected to Stripe to complete your payment securely. All transactions are encrypted and protected."}
              </p>
            </PaymentMessage>

            <PaymentSummarySection>
              <SectionSubtitle>Payment Summary</SectionSubtitle>
              <PaymentBreakdown>
                <SummaryItem>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </SummaryItem>
                <SummaryItem>
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </SummaryItem>
                <SummaryDivider />
                <SummaryTotal>
                  <span>Total Amount</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </SummaryTotal>
              </PaymentBreakdown>
            </PaymentSummarySection>

            <ActionSection>
              <PaymentButton
                onClick={handleStripePayment}
                disabled={
                  !allVerified || isStripeProcessing || isDocumentsProcessing
                }
                $processing={isStripeProcessing}
                $disabled={isDocumentsProcessing}
                as={motion.button}
                whileHover={
                  !allVerified || isStripeProcessing || isDocumentsProcessing
                    ? {}
                    : { scale: 1.02 }
                }
                whileTap={
                  !allVerified || isStripeProcessing || isDocumentsProcessing
                    ? {}
                    : { scale: 0.98 }
                }
              >
                {isStripeProcessing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Processing Payment...
                  </>
                ) : isDocumentsProcessing ? (
                  <>
                    <FiLoader className="spinner" />
                    Documents Processing...
                  </>
                ) : (
                  <>
                    <FiCreditCard />
                    Pay Securely
                  </>
                )}
                <Amount>${totalPrice.toFixed(2)}</Amount>
              </PaymentButton>

              {!allVerified && !isDocumentsProcessing && (
                <WarningMessage>
                  <FiAlertCircle />
                  Complete driver verification to proceed with payment
                </WarningMessage>
              )}

              {isDocumentsProcessing && (
                <InfoMessage>
                  <FiLoader className="spinner" />
                  Please wait for document processing to complete
                </InfoMessage>
              )}

              <SecurityNote>
                <FiShield />
                Your payment information is secure and encrypted
              </SecurityNote>
            </ActionSection>
          </PaymentCard>
        </PaymentSection>
      </ContentGrid>

      {/* Update Documents Modal */}
      <AnimatePresence>
        {showModal && (
          <UpdateDocumentsModal
            show={showModal}
            onClose={handleCloseModal}
            drivers={drivers}
            onSubmit={handleUpdateDocuments}
            isLoading={isUploadingDocuments}
          />
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

//
// 💅 Styled Components
//
const PageWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-2xl);
  min-height: 100vh;
  background: var(--surface);

  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--gray-200);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-md);
    align-items: stretch;
  }
`;

const BackButton = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: var(--font-medium);

  ${(props) =>
    props.disabled &&
    `
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
  `}
`;

const Title = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin: 0;
  font-family: var(--font-heading);

  @media (max-width: 768px) {
    font-size: var(--text-3xl);
    order: -1;
  }
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--success);
  color: var(--white);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-2xl);
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
`;

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
  color: var(--text-secondary);
  font-size: var(--text-base);
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

const PaymentSection = styled.div`
  position: sticky;
  top: var(--space-2xl);

  @media (max-width: 1024px) {
    position: static;
  }
`;

const PaymentCard = styled(LuxuryCard)`
  padding: var(--space-2xl);
  background: var(--white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-100);
  position: relative;
  transition: all var(--transition-normal);

  ${(props) =>
    props.$disabled &&
    `
    opacity: 0.7;
    pointer-events: none;
  `}
`;

const PaymentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
`;

const SecureBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--success);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
`;

const PaymentMethodSection = styled.div`
  margin-bottom: var(--space-xl);
`;

const SectionSubtitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  font-family: var(--font-heading);
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  border: 2px solid
    ${(props) => {
      if (props.$disabled) return "var(--gray-300)";
      return props.$selected ? "var(--primary)" : "var(--gray-200)";
    }};
  border-radius: var(--radius-lg);
  background: ${(props) => {
    if (props.$disabled) return "var(--gray-100)";
    return props.$selected ? "var(--primary-light)" : "var(--white)";
  }};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-normal);

  &:hover {
    border-color: ${(props) =>
      props.$disabled ? "var(--gray-300)" : "var(--primary)"};
  }
`;

const PaymentIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: ${(props) =>
    props.$disabled ? "var(--gray-200)" : "var(--gray-100)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.$disabled ? "var(--gray-400)" : "var(--primary)")};
  font-size: var(--text-lg);
`;

const PaymentName = styled.span`
  flex: 1;
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const RadioIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid
    ${(props) => {
      if (props.$disabled) return "var(--gray-400)";
      return props.$selected ? "var(--primary)" : "var(--gray-400)";
    }};
  background: ${(props) => {
    if (props.$disabled) return "var(--gray-300)";
    return props.$selected ? "var(--primary)" : "transparent";
  }};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--white);
    display: ${(props) => (props.$selected ? "block" : "none")};
  }
`;

const PaymentMessage = styled.div`
  background: ${(props) =>
    props.$disabled ? "var(--gray-100)" : "var(--primary-light)"};
  border: 1px solid
    ${(props) => (props.$disabled ? "var(--gray-300)" : "var(--primary)")};
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);

  p {
    margin: 0;
    color: ${(props) =>
      props.$disabled ? "var(--gray-600)" : "var(--primary-dark)"};
    font-weight: var(--font-medium);
    text-align: center;
    font-size: var(--text-sm);
  }
`;

const PaymentSummarySection = styled.div`
  margin-bottom: var(--space-xl);
`;

const PaymentBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: var(--text-base);
`;

const SummaryDivider = styled.div`
  height: 1px;
  background: var(--gray-300);
  margin: var(--space-sm) 0;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
`;

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const PaymentButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
  border-radius: var(--radius-xl);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  background: ${(props) => {
    if (props.$disabled) return "var(--gray-400)";
    if (props.$processing) return "var(--primary)";
    return "var(--gradient-primary)";
  }};
  color: var(--white);
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border: none;
  transition: all var(--transition-normal);

  &:hover:not(:disabled) {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) => (props.disabled ? "none" : "var(--shadow-lg)")};
  }

  &:disabled {
    opacity: 0.7;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }
`;

const Amount = styled.span`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
`;

const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background: var(--warning);
  color: var(--white);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  text-align: center;
`;

const InfoMessage = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background: var(--primary-light);
  color: var(--primary-dark);
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  text-align: center;

  .spinner {
    animation: spin 1s linear infinite;
  }
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  justify-content: center;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-align: center;
`;
