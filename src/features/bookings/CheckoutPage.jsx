/* eslint-disable react/react-in-jsx-scope */
import { useMemo, useState, lazy, Suspense,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";


const UpdateDocumentsModal = lazy(()=>import('../../components/ui/UpdateDocumentsModal'))
const BookingSummarySection = lazy(()=>import('./BookingSummarySection'))
import {
  FiArrowLeft,
  FiCreditCard,
  FiShield,
  FiAlertCircle,
  FiLoader,
  FiXCircle,
  FiRefreshCw,
  FiTag,
} from "react-icons/fi";
import { useMyDrivers } from "../drivers/useDriver";
import { useAddBookingDriver, useGetBookingById } from "../bookings/useBooking";
import { useStripePayment } from "../payments/usePayment";
import { useValidateCoupon } from "../coupons/useCoupon";
import usePageTitle from "../../app/hooks/usePageTitle";
import ErrorState from "../../components/feedback/ErrorState";
import { toast } from "react-hot-toast";

import { ROUTE_CONFIG, PATHS } from "../../config/constants";

// Import your design system components
import {  LuxuryCard } from "../../features/cars/Card";
import {
  PrimaryButton,
  SecondaryButton,
  
} from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

const paymentMethods = [{ id: "stripe", name: "Stripe", icon: FiCreditCard }];

export default function CheckoutPage() {
  const seoConfig = ROUTE_CONFIG[PATHS.CHECKOUT];
  
  usePageTitle(seoConfig.title, seoConfig.description);

  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, requestDriver: stateRequestDriver } = location?.state || {};
  
  // Debug logging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[CheckoutPage] Booking ID from location state:', bookingId);
      console.log('[CheckoutPage] RequestDriver from location state:', stateRequestDriver);
      console.log('[CheckoutPage] Full location state:', location?.state);
      if (!bookingId) {
        console.warn('[CheckoutPage] No booking ID found in location state. User may have navigated directly.');
      }
    }
  }, [bookingId, stateRequestDriver, location?.state]);

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error("==========================================");
      console.error("[CheckoutPage] ⚠️ UNHANDLED PROMISE REJECTION");
      console.error("==========================================");
      console.error("[CheckoutPage] Error:", event.reason);
      console.error("[CheckoutPage] Error type:", event.reason?.constructor?.name);
      console.error("[CheckoutPage] Error message:", event.reason?.message);
      console.error("[CheckoutPage] Full error:", JSON.stringify(event.reason, Object.getOwnPropertyNames(event.reason), 2));
      console.error("==========================================");
      
      // Prevent default browser error handling
      event.preventDefault();
      
      // Set error message
      const errorMessage = event.reason?.response?.data?.message || event.reason?.message || "An unexpected error occurred. Please try again.";
      setLocalError(errorMessage);
    };

    const handleError = (event) => {
      console.error("==========================================");
      console.error("[CheckoutPage] ⚠️ GLOBAL ERROR");
      console.error("==========================================");
      console.error("[CheckoutPage] Error:", event.error);
      console.error("[CheckoutPage] Message:", event.message);
      console.error("[CheckoutPage] Source:", event.filename, event.lineno);
      console.error("==========================================");
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

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

  const { 
    mutate: validateCoupon, 
    isPending: isValidatingCoupon 
  } = useValidateCoupon();

  const drivers = useMemo(() => myDrivers?.data || [], [myDrivers]);

  const [showModal, setShowModal] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Monitor stripeError changes and log them
  useEffect(() => {
    if (stripeError) {
      console.error("==========================================");
      console.error("[CheckoutPage] ⚠️ stripeError state changed");
      console.error("==========================================");
      console.error("[CheckoutPage] stripeError:", stripeError);
      console.error("[CheckoutPage] Error type:", stripeError?.constructor?.name);
      console.error("[CheckoutPage] Error message:", stripeError?.message);
      console.error("[CheckoutPage] Error code:", stripeError?.code);
      console.error("[CheckoutPage] Error response:", stripeError?.response);
      console.error("[CheckoutPage] Full error:", JSON.stringify(stripeError, Object.getOwnPropertyNames(stripeError), 2));
      console.error("==========================================");
      
      // Set local error if not already set
      if (!localError) {
        const errorMessage = stripeError?.response?.data?.message || stripeError?.message || "Payment processing failed. Please try again.";
        setLocalError(errorMessage);
      }
    }
  }, [stripeError, localError]);

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
  const depositAmount = booking?.depositAmount || 0;
  const driverServiceFee = booking?.driverServiceTotal || booking?.driverServiceFee || 0;
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const totalBeforeDiscount = subtotal + depositAmount + driverServiceFee;
  const totalPrice = Math.max(0, totalBeforeDiscount - discountAmount);

  // ✅ Request Professional Driver (Real-Time) Flow
  // Check if this is a real-time driver request
  const hasRequestDriver = useMemo(() => {
    return !!(
      booking?.requestDriver ||
      stateRequestDriver ||
      booking?.driverRequestStatus === "pending"
    );
  }, [booking?.requestDriver, stateRequestDriver, booking?.driverRequestStatus]);

  // Determine if documents are verified
  // Professional drivers are always verified, so allow payment if professional driver exists
  const hasProfessionalDriver = !!booking?.professionalDriver;
  const allVerified = hasProfessionalDriver 
    ? true // Professional drivers are always verified
    : (booking?.driver?.insurance?.verified && booking?.driver?.license?.verified);

  // ✅ Can proceed to payment: requestDriver OR allVerified OR hasProfessionalDriver
  const canProceedToPayment = useMemo(() => {
    return hasRequestDriver || allVerified || hasProfessionalDriver;
  }, [hasRequestDriver, allVerified, hasProfessionalDriver]);

  // Check if documents are currently being processed
  const isDocumentsProcessing = isUploadingDocuments;

  // Handle stripe payment with error handling
  const handleStripePayment = async () => {
    // ✅ Request Professional Driver (Real-Time) Flow
    // Skip document verification for requestDriver and professional drivers
    if (!hasRequestDriver && !hasProfessionalDriver && !allVerified) {
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
      // Web app - NO mobile=true parameter to ensure redirect stays on web
      success_url: `${window.location.origin}${PATHS.BOOKING_CONFIRMATION}?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking?._id}`,
      cancel_url: `${window.location.origin}${PATHS.CHECKOUT}`,
      metadata: {
        booking_id: booking?._id,
        car_id: booking?.car?._id,
        total_days: totalDays,
        total_amount: totalPrice,
        coupon_code: appliedCoupon?.code || "",
        discount_amount: discountAmount.toString(),
      },
    };

    processStripePayment(paymentData, {
      onSuccess: (data) => {
        console.log("[CheckoutPage] ✅ Payment mutation succeeded:", data);
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

  // Handle coupon validation
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    const bookingTotal = totalBeforeDiscount;
    validateCoupon(
      { code: couponCode.trim(), bookingTotal },
      {
        onSuccess: (response) => {
          const coupon = response?.data?.coupon;
          if (coupon) {
            setAppliedCoupon(coupon);
            toast.success(`Coupon "${coupon.code}" applied! Discount: $${coupon.discountAmount.toFixed(2)}`);
          }
        },
        onError: () => {
          // Error is already handled by the hook's onError
          setAppliedCoupon(null);
        },
      }
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
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
          depositAmount={depositAmount}
          driverServiceFee={driverServiceFee}
          discountAmount={discountAmount}
          appliedCoupon={appliedCoupon}
          totalPrice={totalPrice}
          allVerified={allVerified}
          hasProfessionalDriver={hasProfessionalDriver}
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

            {/* ✅ Request Professional Driver (Real-Time) Flow - Hide payment message for requestDriver */}
            {!hasRequestDriver && (
              <PaymentMessage $disabled={isDocumentsProcessing || isFetchingBooking}>
                <p>
                  {isDocumentsProcessing || isFetchingBooking
                    ? "Document processing in progress. Payment will be available once complete."
                    : "You will be redirected to Stripe to complete your payment securely. All transactions are encrypted and protected."}
                </p>
              </PaymentMessage>
            )}

            <CouponSection>
              <SectionSubtitle>Promo Code</SectionSubtitle>
              {appliedCoupon ? (
                <AppliedCoupon>
                  <CouponInfo>
                    <CouponCode>{appliedCoupon.code}</CouponCode>
                    <CouponDiscount>
                      -${appliedCoupon.discountAmount.toFixed(2)} discount
                    </CouponDiscount>
                  </CouponInfo>
                  <RemoveCouponButton onClick={handleRemoveCoupon}>
                    <FiXCircle />
                  </RemoveCouponButton>
                </AppliedCoupon>
              ) : (
                <CouponInputGroup>
                  <CouponInput
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={isValidatingCoupon || isDocumentsProcessing || isFetchingBooking}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleApplyCoupon();
                      }
                    }}
                  />
                  <ApplyCouponButton
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim() || isValidatingCoupon || isDocumentsProcessing || isFetchingBooking}
                    $loading={isValidatingCoupon}
                  >
                    {isValidatingCoupon ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Applying...
                      </>
                    ) : (
                      "Apply"
                    )}
                  </ApplyCouponButton>
                </CouponInputGroup>
              )}
            </CouponSection>

            <PaymentSummarySection>
              <SectionSubtitle>Payment Summary</SectionSubtitle>
              {/* ✅ Request Professional Driver (Real-Time) Flow - Payment Summary Message */}
              {hasRequestDriver && (
                <InfoMessage style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', marginBottom: 'var(--space-md)' }}>
                  <FiShield />
                  Professional driver will be assigned after payment.
                </InfoMessage>
              )}
              <PaymentBreakdown>
                <SummaryItem>
                  <span>Subtotal ({totalDays} {totalDays === 1 ? 'day' : 'days'})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </SummaryItem>
                {driverServiceFee > 0 && (
                  <SummaryItem>
                    <span>Professional Driver Service ({totalDays} {totalDays === 1 ? 'day' : 'days'})</span>
                    <span>${driverServiceFee.toFixed(2)}</span>
                  </SummaryItem>
                )}
                <SummaryItem>
                  <span>Deposit Amount</span>
                  <span>${depositAmount.toFixed(2)}</span>
                </SummaryItem>
                {appliedCoupon && discountAmount > 0 && (
                  <SummaryItem $discount>
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </SummaryItem>
                )}
                <SummaryDivider />
                <SummaryTotal>
                  <span>Total Amount</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </SummaryTotal>
              </PaymentBreakdown>
            </PaymentSummarySection>

            <ActionSection>
              {/* ✅ Request Professional Driver (Real-Time) Flow - Info Banner */}
              {hasRequestDriver && (
                <InfoMessage style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)' }}>
                  <FiShield />
                  Professional driver requested — you can proceed with payment. A driver will be assigned automatically after payment.
                </InfoMessage>
              )}

              <PaymentButton
                onClick={handleStripePayment}
                disabled={
                  !canProceedToPayment || 
                  isStripeProcessing || 
                  isDocumentsProcessing || 
                  isFetchingBooking
                }
                $processing={isStripeProcessing}
                $disabled={isDocumentsProcessing || isFetchingBooking}
                as={motion.button}
                whileHover={
                  !canProceedToPayment || 
                  isStripeProcessing || 
                  isDocumentsProcessing || 
                  isFetchingBooking
                    ? {}
                    : { scale: 1.02 }
                }
                whileTap={
                  !canProceedToPayment || 
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

              {/* ✅ Request Professional Driver (Real-Time) Flow - Hide verification messages for requestDriver */}
              {!hasRequestDriver && !allVerified && !isDocumentsProcessing && !isFetchingBooking && !hasProfessionalDriver && (
                <WarningMessage>
                  <FiAlertCircle />
                  Complete driver verification to proceed with payment
                </WarningMessage>
              )}
              
              {!hasRequestDriver && hasProfessionalDriver && (
                <InfoMessage style={{ background: 'var(--success-light)', color: 'var(--success-dark)' }}>
                  <FiShield />
                  Professional driver service is included. You can proceed with payment.
                </InfoMessage>
              )}

              {/* ✅ Request Professional Driver (Real-Time) Flow - Hide processing messages for requestDriver */}
              {!hasRequestDriver && (isDocumentsProcessing || isFetchingBooking) && (
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

      {/* ✅ Request Professional Driver (Real-Time) Flow - Hide modal for requestDriver */}
      {!hasRequestDriver && (
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
      )}
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
  color: ${(props) => (props.$discount ? "var(--success)" : "var(--text-secondary)")};
  font-size: var(--text-base);
  font-weight: ${(props) => (props.$discount ? "var(--font-semibold)" : "normal")};
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

const CouponSection = styled.div`
  margin-bottom: var(--space-xl);
`;

const CouponInputGroup = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const CouponInput = styled.input`
  flex: 1;
  padding: var(--space-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }

  &:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    text-transform: none;
    color: var(--text-muted);
  }
`;

const ApplyCouponButton = styled(SecondaryButton)`
  padding: var(--space-md) var(--space-lg);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AppliedCoupon = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  background: var(--success-light);
  border: 2px solid var(--success);
  border-radius: var(--radius-lg);
  gap: var(--space-md);
`;

const CouponInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const CouponCode = styled.div`
  font-weight: var(--font-bold);
  color: var(--success-dark);
  font-size: var(--text-base);
  text-transform: uppercase;
`;

const CouponDiscount = styled.div`
  font-size: var(--text-sm);
  color: var(--success-dark);
  opacity: 0.8;
`;

const RemoveCouponButton = styled.button`
  background: none;
  border: none;
  color: var(--success-dark);
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
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


