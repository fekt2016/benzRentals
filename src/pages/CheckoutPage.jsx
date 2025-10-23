/* eslint-disable react/react-in-jsx-scope */
import { useMemo, useState, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";


const UpdateDocumentsModal = lazy(()=>import('../components/Modal/UpdateDocumentsModal'))
const BookingSummarySection = lazy(()=>import('../components/BookingSummarySection'))
import {
  FiArrowLeft,
  FiCreditCard,
  FiShield,
  FiAlertCircle,
  FiLoader,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { useMyDrivers } from "../hooks/useDriver";
import { useAddBookingDriver, useGetBookingById } from "../hooks/useBooking";
import { useStripePayment } from "../hooks/usePayment";
import usePageTitle from "../hooks/usePageTitle";
import ErrorState from "../components/ErrorState";

import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";

// Import your design system components
import {  LuxuryCard } from "../components/Cards/Card";
import {
  PrimaryButton,
  SecondaryButton,
  
} from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const paymentMethods = [{ id: "stripe", name: "Stripe", icon: FiCreditCard }];

export default function CheckoutPage() {
  const seoConfig = ROUTE_CONFIG[PATHS.CHECKOUT];
  usePageTitle(seoConfig.title, seoConfig.description);

  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = location?.state || {};

  // Query hooks with loading and error states
  const { 
    data: bookingResponse, 
    isLoading: isLoadingBooking, 
    error: bookingError,
    refetch: refetchBooking,
    isFetching: isFetchingBooking
  } = useGetBookingById(bookingId, {
    enabled: !!bookingId, // Only run if bookingId exists
  });
    const booking = useMemo(
    () => bookingResponse?.data?.data || {},
    [bookingResponse]
  );

  const { 
    data: myDrivers, 
    isLoading: isLoadingDrivers, 
    error: driversError,
    refetch: refetchDrivers
  } = useMyDrivers();

  // Mutation hooks with loading and error states
  const { 
    mutate: processStripePayment, 
    isPending: isStripeProcessing,
    error: stripeError,
    reset: resetStripeError
  } = useStripePayment();

  const { 
    mutate: addBookingDriver, 
    isPending: isUploadingDocuments,
    error: uploadError,
    reset: resetUploadError 
  } = useAddBookingDriver(booking?._id);

  const drivers = useMemo(() => myDrivers?.data || [], [myDrivers]);

  const [showModal, setShowModal] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Clear errors when modal opens/closes
  const handleOpenModal = () => {
    setLocalError(null);
    resetUploadError?.();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setLocalError(null);
    resetUploadError?.();
    setShowModal(false);
  };

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

  // Handle stripe payment with error handling
  const handleStripePayment = async () => {
    if (!allVerified) {
      setLocalError("Documents are pending verification. Cannot proceed to payment.");
      return;
    }

    if (!booking?._id) {
      setLocalError("Booking information is incomplete. Please try refreshing the page.");
      return;
    }

    const paymentData = {
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking?.car?.name || "Car Rental",
              description: `Rental for ${totalDays} days - ${booking?.car?.model || 'Vehicle'}`,
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

    processStripePayment(paymentData, {
      onSuccess: async (data) => {
        console.log("Stripe payment successful",data);
        setLocalError(null);
        resetStripeError?.();
        
      },
      onError: (error) => {
        console.error("Stripe payment failed:", error);
        setLocalError(error.message || "Payment processing failed. Please try again.");
      }
    });
  };

  const handleUpdateDocuments = (formData) => {
    try {
      if (formData instanceof FormData) {
        addBookingDriver(formData, {
          onSuccess: () => {
            setLocalError(null);
            handleCloseModal();
            // Refetch booking to get updated driver status
            refetchBooking();
          },
          onError: (error) => {
            console.error("Update failed:", error);
            setLocalError(error.message || "Failed to upload documents. Please try again.");
          },
        });
      }
    } catch (err) {
      console.error("Update failed:", err);
      setLocalError("An unexpected error occurred. Please try again.");
    }
  };

  // Handle retry for failed queries
  const handleRetry = () => {
    setLocalError(null);
    resetStripeError?.();
    resetUploadError?.();
    
    if (bookingError) {
      refetchBooking();
    }
    if (driversError) {
      refetchDrivers();
    }
  };

  // Clear specific errors
  const clearError = (errorType) => {
    switch (errorType) {
      case 'local':
        setLocalError(null);
        break;
      case 'stripe':
        resetStripeError?.();
        break;
      case 'upload':
        resetUploadError?.();
        break;
      default:
        setLocalError(null);
        resetStripeError?.();
        resetUploadError?.();
    }
  };

  // Show loading state for initial booking load
  if (isLoadingBooking) {
    return (
      <PageWrapper>
        <LoadingState>
          <LoadingSpinner size="xl" />
          <LoadingText>Loading your booking details...</LoadingText>
          <LoadingSubtext>Please wait while we prepare your checkout</LoadingSubtext>
        </LoadingState>
      </PageWrapper>
    );
  }

  // Show error state for booking
  if (bookingError && !isFetchingBooking) {
    return (
       <PageWrapper>
      <ErrorState
        icon={FiXCircle}
        title="Failed to Load Booking"
        message={bookingError.message || "We couldn't load your booking details. This might be due to a network issue or the booking may no longer exist."}
        actions={[
          {
            text: "Try Again",
            onClick: handleRetry,
            icon: FiRefreshCw,
            variant: 'primary'
          },
          {
            text: "Go Back",
            onClick: () => navigate(-1),
            icon: FiArrowLeft,
            variant: 'ghost'
          }
        ]}
        size="lg"
        centered={true}
      />
    </PageWrapper>
    );
  }

  // Show error if no booking ID
  if (!bookingId) {
    return (
       <PageWrapper>
      <ErrorState
        icon={FiAlertCircle}
        title="Booking Not Found"
        message="We couldn't find your booking details. Please start the booking process again from the beginning."
        actions={[
          {
            text: "Start New Booking",
            onClick: () => navigate(PATHS.HOME),
            variant: 'primary'
          },
          {
            text: "Go Back",
            onClick: () => navigate(-1),
            icon: FiArrowLeft,
            variant: 'ghost'
          }
        ]}
        size="lg"
        centered={true}
      />
    </PageWrapper>
    );
  }

  // Show error if booking data is empty but no error
  if (!booking?._id && !isLoadingBooking && !bookingError) {
    return (
      <PageWrapper>
      <ErrorState
        icon={FiAlertCircle}
        title="Invalid Booking"
        message="The booking information appears to be invalid or incomplete. Please try starting over."
        actions={[
          {
            text: "Try Again",
            onClick: handleRetry,
            icon: FiRefreshCw,
            variant: 'primary'
          },
          {
            text: "Start New Booking",
            onClick: () => navigate(PATHS.HOME),
            variant: 'primary'
          }
        ]}
        size="lg"
        centered={true}
      />
    </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header>
        <BackButton
          onClick={() => navigate(-1)}
          as={motion.div}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          disabled={isDocumentsProcessing || isStripeProcessing}
        >
          <FiArrowLeft />
          Back to Booking
        </BackButton>
        
        <TitleContainer>
          <Title>Complete Your Booking</Title>
          {isFetchingBooking && (
            <RefetchIndicator>
              <FiLoader className="spinner" />
              Updating...
            </RefetchIndicator>
          )}
        </TitleContainer>
        
        <SecurityBadge>
          <FiShield />
          Secure Checkout
        </SecurityBadge>
      </Header>

      {/* Global Error Display */}
      {(localError || stripeError) && (
        <GlobalError>
          <ErrorIconSmall>
            <FiAlertCircle />
          </ErrorIconSmall>
          <ErrorContent>
            <ErrorTitleSmall>
              {stripeError ? "Payment Error" : "Error"}
            </ErrorTitleSmall>
            <ErrorMessageSmall>
              {localError || stripeError?.message}
            </ErrorMessageSmall>
          </ErrorContent>
          <ActionButtonsHorizontal>
            <RetryButton onClick={handleRetry} $size="sm">
              <FiRefreshCw />
            </RetryButton>
            <CloseButton onClick={() => clearError(stripeError ? 'stripe' : 'local')}>
              <FiXCircle />
            </CloseButton>
          </ActionButtonsHorizontal>
        </GlobalError>
      )}

      <ContentGrid>
        {/* Left Column - Booking Summary */}
        <BookingSummarySection
  booking={booking}
  totalDays={totalDays}
  subtotal={subtotal}
  tax={tax}
  totalPrice={totalPrice}
  allVerified={allVerified}
  isDocumentsProcessing={isDocumentsProcessing}
  isFetchingBooking={isFetchingBooking}
  uploadError={uploadError}
  handleOpenModal={handleOpenModal}
  clearError={clearError}
  onEditDetails={() => navigate(-1)}
  isLoadingDrivers={isLoadingDrivers}
  driversError={driversError}
/>
        {/* Right Column - Payment Section */}
        <PaymentSection>
          <PaymentCard 
            $disabled={isDocumentsProcessing || isFetchingBooking}
            $loading={isFetchingBooking}
          >
            {(isDocumentsProcessing || isFetchingBooking) && <ProcessingOverlay />}
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
                      $disabled={isDocumentsProcessing || isFetchingBooking}
                    >
                      <PaymentIcon $disabled={isDocumentsProcessing || isFetchingBooking}>
                        <IconComponent />
                      </PaymentIcon>
                      <PaymentName>{method.name}</PaymentName>
                      <RadioIndicator
                        $selected={true}
                        $disabled={isDocumentsProcessing || isFetchingBooking}
                      />
                    </PaymentOption>
                  );
                })}
              </PaymentOptions>
            </PaymentMethodSection>

            <PaymentMessage $disabled={isDocumentsProcessing || isFetchingBooking}>
              <p>
                {isDocumentsProcessing || isFetchingBooking
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
                  !allVerified || 
                  isStripeProcessing || 
                  isDocumentsProcessing || 
                  isFetchingBooking
                }
                $processing={isStripeProcessing}
                $disabled={isDocumentsProcessing || isFetchingBooking}
                as={motion.button}
                whileHover={
                  !allVerified || 
                  isStripeProcessing || 
                  isDocumentsProcessing || 
                  isFetchingBooking
                    ? {}
                    : { scale: 1.02 }
                }
                whileTap={
                  !allVerified || 
                  isStripeProcessing || 
                  isDocumentsProcessing || 
                  isFetchingBooking
                    ? {}
                    : { scale: 0.98 }
                }
              >
                {isStripeProcessing ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Processing Payment...
                  </>
                ) : isDocumentsProcessing || isFetchingBooking ? (
                  <>
                    <FiLoader className="spinner" />
                    {isFetchingBooking ? "Updating..." : "Documents Processing..."}
                  </>
                ) : (
                  <>
                    <FiCreditCard />
                    Pay Securely
                  </>
                )}
                <Amount>${totalPrice.toFixed(2)}</Amount>
              </PaymentButton>

              {!allVerified && !isDocumentsProcessing && !isFetchingBooking && (
                <WarningMessage>
                  <FiAlertCircle />
                  Complete driver verification to proceed with payment
                </WarningMessage>
              )}

              {(isDocumentsProcessing || isFetchingBooking) && (
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
          <Suspense fallback={<div>Loading...</div>}>
          <UpdateDocumentsModal
            show={showModal}
            onClose={handleCloseModal}
            drivers={drivers}
            onSubmit={handleUpdateDocuments}
            isLoading={isUploadingDocuments}
            error={uploadError}
            loadingDrivers={isLoadingDrivers}
            driversError={driversError}
            onRetryDrivers={refetchDrivers}
          />
          </Suspense>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}

// Styled Components
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

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
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

const RefetchIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);

  .spinner {
    animation: spin 1s linear infinite;
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

// const SectionHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: var(--space-lg);
// `;

const SectionTitle = styled.h2`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
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

  ${(props) =>
    props.$loading &&
    `
    border-color: var(--primary);
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

// New styled components for error and loading states
const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--space-lg);
  text-align: center;
`;

const LoadingText = styled.p`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
`;

const LoadingSubtext = styled.p`
  font-size: var(--text-base);
  color: var(--text-muted);
  margin: 0;
`;




const GlobalError = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--error-light);
  border: 1px solid var(--error);
  border-radius: var(--radius-lg);
  color: var(--error-dark);
  margin-bottom: var(--space-xl);
  position: relative;
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

const ErrorTitleSmall = styled.div`
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  color: var(--error-dark);
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


