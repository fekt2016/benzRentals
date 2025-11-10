// src/pages/BookingConfirmationPage.jsx
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useGetBookingConfirmation } from "../payments/usePayment";
import usePageTitle from "../../app/hooks/usePageTitle";
import { formatDate } from "../../utils/helper";
import { ROUTE_CONFIG, PATHS } from "../../config/constants";

import { Card, LuxuryCard } from "../../features/cars/Card";
import { PrimaryButton, SecondaryButton, GhostButton } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { fadeInUp, scaleIn, pulse, slideInRight } from "../../styles/animations";
import { devices } from "../../styles/GlobalStyles";

/** ========= Deep-link + URL helpers ========= */
const APP_SCHEME = "benzflex";
const APP_SUCCESS_PATH = "confirmation"; // benzflex://confirmation
const APP_CANCEL_PATH = "checkout";

function getFirstParam(searchParams, keys) {
  for (const k of keys) {
    const v = searchParams.get(k);
    if (v) return v;
  }
  return null;
}

function buildAppDeepLink(bookingId, sessionId) {
  const qs = new URLSearchParams();
  if (sessionId) qs.set("session_id", sessionId);
  if (bookingId) qs.set("booking_id", bookingId);
  return `${APP_SCHEME}://${APP_SUCCESS_PATH}?${qs.toString()}`;
}

function tryOpenDeepLink(url) {
  if (typeof window === "undefined") return;

  const methods = [
    () => (window.location.replace(url)),
    () => (window.location.href = url),
    () => (window.location.assign(url)),
    () => {
      const a = document.createElement("a");
      a.href = url;
      a.style.display = "none";
      a.target = "_self";
      document.body?.appendChild(a);
      a.click();
    },
    () => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = url;
      document.body?.appendChild(iframe);
      setTimeout(() => iframe.remove(), 1500);
    },
  ];

  for (const fn of methods) {
    try {
      fn();
    } catch {}
  }
}

/** ========= Page Component ========= */
const BookingConfirmationPage = () => {
  const seoConfig = ROUTE_CONFIG[PATHS.BOOKING_CONFIRMATION];
  usePageTitle(seoConfig.title, seoConfig.description);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract params robustly
  const bookingId = useMemo(
    () =>
      getFirstParam(searchParams, [
        "booking_id",      // normal
        "amp;booking_id",  // encoded
        "booking-id",      // hyphen
        "bookingId",       // camel
        "booking",         // short
      ]),
    [searchParams]
  );
  const sessionId = useMemo(
    () => getFirstParam(searchParams, ["session_id", "sessionId"]),
    [searchParams]
  );
  const isMobileHandoff = useMemo(() => searchParams.get("mobile") === "true", [searchParams]);

  // Deep-link gate (runs before paint)
  const [showMobileFallback, setShowMobileFallback] = useState(false);
  const deepLinkRef = useRef(null);

  useLayoutEffect(() => {
    // If this page is opened by Stripe after mobile checkout,
    // immediately bounce into the app via deep link.
    if (isMobileHandoff && bookingId) {
      const deepLink = buildAppDeepLink(bookingId, sessionId || "");
      deepLinkRef.current = deepLink;

      // Fire deep link ASAP
      tryOpenDeepLink(deepLink);

      // If we’re still here after ~1.5s, show a fallback button
      const t = setTimeout(() => {
        if (window.location.href.includes("/confirmation") && window.location.search.includes("mobile=true")) {
          setShowMobileFallback(true);
        }
      }, 1500);

      return () => clearTimeout(t);
    }
  }, [isMobileHandoff, bookingId, sessionId]);

  // While doing a mobile handoff, render a tiny shell with fallback
  if (isMobileHandoff && bookingId) {
    const deepLink = buildAppDeepLink(bookingId, sessionId || "");
    
    return (
      <PageWrapper>
        <LoadingContainer>
          <LoadingSpinner size="lg" />
          <LoadingTitle>Opening the BenzFlex app…</LoadingTitle>
          <LoadingText>If nothing happens, tap the button below.</LoadingText>
          
          {/* Fallback button - opens app directly */}
          <PrimaryButton
            onClick={() => {
              console.log('[ConfirmationPage] Fallback button clicked, opening:', deepLink);
              // Try multiple methods
              try {
                window.location.href = deepLink;
              } catch(e) {
                console.error('[ConfirmationPage] Error opening deep link:', e);
              }
            }}
            style={{ marginTop: '20px', padding: '12px 24px' }}
          >
            Open in BenzFlex App
          </PrimaryButton>
          
          {/* Direct link as last resort */}
          <a 
            href={deepLink}
            style={{ 
              display: 'inline-block', 
              marginTop: '10px', 
              color: '#007AFF',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            Or tap here to open
          </a>

          {showMobileFallback && (
            <PrimaryButton
              $size="lg"
              onClick={() => deepLinkRef.current && tryOpenDeepLink(deepLinkRef.current)}
            >
              Open in BenzFlex
            </PrimaryButton>
          )}
        </LoadingContainer>
      </PageWrapper>
    );
  }

  /** ===== Normal web confirmation flow ===== */
  const {
    data: response,
    isLoading,
    error,
  } = useGetBookingConfirmation(bookingId);

  const booking = response?.data?.booking;
  const session = response?.data?.session;

  const rentalDays = useMemo(() => {
    if (!booking?.pickupDate || !booking?.returnDate) return 0;
    const pickup = new Date(booking.pickupDate);
    const ret = new Date(booking.returnDate);
    return Math.ceil((ret - pickup) / (1000 * 60 * 60 * 24));
  }, [booking]);

  if (isLoading) {
    return (
      <PageWrapper>
        <LoadingContainer>
          <LoadingSpinner size="xl" />
          <LoadingTitle>Finalizing Your Booking</LoadingTitle>
          <LoadingText>We&apos;re preparing your confirmation details…</LoadingText>
        </LoadingContainer>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <ErrorContainer>
          <ErrorTitle>
            {error?.response?.status === 404 
              ? "Booking Not Found" 
              : error?.response?.status === 401
              ? "Authentication Required"
              : error?.response?.status === 403
              ? "Access Denied"
              : "Error Loading Booking"}
          </ErrorTitle>
          <ErrorText>
            {error?.message ||
              "We couldn't find your booking details. Please contact support if this issue persists."}
          </ErrorText>
          <ActionButtons>
            <PrimaryButton onClick={() => navigate(PATHS.HOME)}>Return Home</PrimaryButton>
            <SecondaryButton onClick={() => navigate(PATHS.BOOKINGS)}>View My Bookings</SecondaryButton>
          </ActionButtons>
        </ErrorContainer>
      </PageWrapper>
    );
  }

  if (!booking) {
    // If we're not loading and no booking, show error
    if (!isLoading) {
      return (
        <PageWrapper>
          <ErrorContainer>
            <ErrorTitle>Booking Not Found</ErrorTitle>
            <ErrorText>
              We couldn't find your booking details. Please contact support if this issue persists.
            </ErrorText>
            <ActionButtons>
              <PrimaryButton onClick={() => navigate(PATHS.HOME)}>Return Home</PrimaryButton>
              <SecondaryButton onClick={() => navigate(PATHS.BOOKINGS)}>View My Bookings</SecondaryButton>
            </ActionButtons>
          </ErrorContainer>
        </PageWrapper>
      );
    }
    // Still loading, but show loading state
    return null;
  }

  return (
    <PageWrapper>
      {/* Success Header */}
      <SuccessHeader>
        <SuccessContent>
          <SuccessIcon
            as={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            ✅
          </SuccessIcon>
          <HeaderText>
            <Title>Booking Confirmed!</Title>
            <Subtitle>Your luxury experience is ready</Subtitle>
          </HeaderText>
        </SuccessContent>

        <ConfirmationBadge>{booking.status}</ConfirmationBadge>
      </SuccessHeader>

      <ContentGrid>
        {/* Left Column */}
        <LeftColumn>
          {/* Booking Overview */}
          <OverviewCard>
            <CardHeader>
              <CardTitle>Booking Overview</CardTitle>
              <BookingId>#{booking._id.slice(-8).toUpperCase()}</BookingId>
            </CardHeader>

            <OverviewGrid>
              <OverviewItem>
                <OverviewContent>
                  <OverviewLabel>Rental Period</OverviewLabel>
                  <OverviewValue>{rentalDays} days</OverviewValue>
                </OverviewContent>
              </OverviewItem>

              <OverviewItem>
                <OverviewContent>
                  <OverviewLabel>Total Amount</OverviewLabel>
                  <OverviewValue>${booking.totalPrice.toFixed(2)}</OverviewValue>
                </OverviewContent>
              </OverviewItem>

              <OverviewItem>
                <OverviewContent>
                  <OverviewLabel>Pickup Location</OverviewLabel>
                  <OverviewValue>{booking.pickupLocation}</OverviewValue>
                </OverviewContent>
              </OverviewItem>

              <OverviewItem>
                <OverviewContent>
                  <OverviewLabel>Vehicle</OverviewLabel>
                  <OverviewValue>{booking.car?.series}</OverviewValue>
                </OverviewContent>
              </OverviewItem>
            </OverviewGrid>
          </OverviewCard>

          {/* Customer Info */}
          <InfoCard>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardIcon>👤</CardIcon>
            </CardHeader>

            {booking.user ? (
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Full Name</InfoLabel>
                  <InfoValue>{booking.user.fullName}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Email Address</InfoLabel>
                  <InfoValue>{booking.user.email}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Phone Number</InfoLabel>
                  <InfoValue>{booking.user.phone || "Not provided"}</InfoValue>
                </InfoItem>
              </InfoGrid>
            ) : (
              <EmptyState>No customer info available</EmptyState>
            )}
          </InfoCard>

          {/* Vehicle Info */}
          <InfoCard>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
            </CardHeader>

            {booking.car ? (
              <>
                <CarHeader>
                  <CarImage
                    src={booking?.car?.images[0] || "/default-car.jpg"}
                    alt={booking?.car?.model}
                  />
                  <CarInfo>
                    <CarModel>
                      {booking.car.model} {booking.car.series}
                    </CarModel>
                    <CarYear>{booking.car.year}</CarYear>
                    <CarSpecs>
                      {booking.car.transmission} • {booking.car.fuelType} • {booking.car.seats} seats
                    </CarSpecs>
                  </CarInfo>
                </CarHeader>
              </>
            ) : (
              <EmptyState>No car info available</EmptyState>
            )}
          </InfoCard>
        </LeftColumn>

        {/* Right Column */}
        <RightColumn>
          {/* Rental Timeline */}
          <TimelineCard>
            <CardHeader>
              <CardTitle>Rental Timeline</CardTitle>
            </CardHeader>

            <Timeline>
              <TimelineItem $completed={true}>
                <TimelineDot $completed />
                <TimelineContent>
                  <TimelineEvent>Booking Confirmed</TimelineEvent>
                  <TimelineTime>Just now</TimelineTime>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineDot />
                <TimelineContent>
                  <TimelineEvent>Pickup Vehicle</TimelineEvent>
                  <TimelineTime>{formatDate(booking.pickupDate)}</TimelineTime>
                  <TimelineDescription>Pickup at {booking.pickupLocation}</TimelineDescription>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineDot />
                <TimelineContent>
                  <TimelineEvent>Return Vehicle</TimelineEvent>
                  <TimelineTime>{formatDate(booking.returnDate)}</TimelineTime>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </TimelineCard>

          {/* Booking Information */}
          <BookingInfoCard>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
              <StatusBadges>
                <BookingStatus $status={booking.status}>{booking.status}</BookingStatus>
                <PaymentStatusBadge $status={booking.paymentStatus}>
                  {booking.paymentStatus}
                </PaymentStatusBadge>
              </StatusBadges>
            </CardHeader>

            <InfoList>
              <InfoRow>
                <InfoLabel>Pickup Date</InfoLabel>
                <InfoValue>{formatDate(booking.pickupDate)}</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Return Date</InfoLabel>
                <InfoValue>{formatDate(booking.returnDate)}</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Duration</InfoLabel>
                <InfoValue>{rentalDays} days</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Total Rental</InfoLabel>
                <InfoValue>${booking.basePrice?.toFixed(2)}</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Extra Charges</InfoLabel>
                <InfoValue>${booking.extraCharges?.toFixed(2) || "0.00"}</InfoValue>
              </InfoRow>

              {booking.depositAmount > 0 && (
                <InfoRow>
                  <InfoLabel>Deposit</InfoLabel>
                  <InfoValue>${booking.depositAmount?.toFixed(2)}</InfoValue>
                </InfoRow>
              )}

              <TotalRow>
                <TotalLabel>Total</TotalLabel>
                <TotalValue>${booking.totalPrice?.toFixed(2)}</TotalValue>
              </TotalRow>
            </InfoList>
          </BookingInfoCard>

          {/* Payment Info */}
          {session && (
            <PaymentCard>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <PaymentStatusBadge $status={session.payment_status}>
                  {session.payment_status}
                </PaymentStatusBadge>
              </CardHeader>

              <PaymentDetails>
                <PaymentItem>
                  <PaymentLabel>Amount Paid</PaymentLabel>
                  <PaymentValue>${(session.amount_total / 100).toFixed(2)}</PaymentValue>
                </PaymentItem>
                <PaymentItem>
                  <PaymentLabel>Method</PaymentLabel>
                  <PaymentValue>Credit Card (Stripe)</PaymentValue>
                </PaymentItem>
                <PaymentItem>
                  <PaymentLabel>Transaction ID</PaymentLabel>
                  <PaymentValue>{session.id.slice(-10)}</PaymentValue>
                </PaymentItem>
              </PaymentDetails>
            </PaymentCard>
          )}

          {/* Actions */}
          <ActionCard>
            <ActionTitle>Next Steps</ActionTitle>
            <ActionButtons>
              <PrimaryButton onClick={() => navigate(PATHS.BOOKINGS)} $size="lg">
                View My Bookings
              </PrimaryButton>
              <SecondaryButton onClick={() => navigate(PATHS.HOME)} $size="lg">
                Continue Browsing
              </SecondaryButton>
              <GhostButton onClick={() => window.print()} $size="lg">
                Print Confirmation
              </GhostButton>
            </ActionButtons>
            <SupportNote>Need help? Contact us at support@luxuryrentals.com</SupportNote>
          </ActionCard>
        </RightColumn>
      </ContentGrid>

      <ConfirmationBanner>
        <BannerContent>
          <BannerIcon>🎉</BannerIcon>
          <BannerText>
            <strong>Your luxury experience is {booking.status}!</strong>
          </BannerText>
        </BannerContent>
      </ConfirmationBanner>
    </PageWrapper>
  );
};

export default BookingConfirmationPage;

/* ===================== Styles (unchanged where possible) ===================== */

const PageWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-2xl);
  min-height: 100vh;
  background: var(--surface);
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--space-xl);
  text-align: center;
`;

const LoadingTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-lg);
  margin: 0;
  font-family: var(--font-body);
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--space-xl);
  text-align: center;
  padding: var(--space-2xl);
`;

const ErrorTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--error);
  margin: 0;
  font-family: var(--font-heading);
`;

const ErrorText = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-lg);
  margin: 0;
  max-width: 500px;
  line-height: 1.6;
  font-family: var(--font-body);
`;

const SuccessHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--white);
  border-radius: var(--radius-2xl);
  padding: var(--space-sm);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-100);
  animation: ${scaleIn} 0.6s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-lg);
    text-align: center;
    padding: var(--space-xl);
  }
`;

const SuccessContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  @media ${devices.md} {
    flex-direction: column;
    gap: var(--space-lg);
  }
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  box-shadow: var(--shadow-lg);

  @media ${devices.md} {
    width: 80px;
    height: 80px;
    font-size: 3rem;
  }
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const Title = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--font-heading);

  @media (max-width: 768px) {
    font-size: var(--text-3xl);
  }
`;

const Subtitle = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin: 0;
  font-family: var(--font-body);

  @media (max-width: 768px) {
    font-size: var(--text-md);
  }
`;

const ConfirmationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--success);
  color: var(--white);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  font-size: var(--text-lg);
  text-transform: capitalize;

  @media (max-width: 768px) {
    font-size: var(--text-md);
    padding: var(--space-sm) var(--space-md);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-2xl);
  margin-bottom: var(--space-2xl);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  position: sticky;
  top: var(--space-xl);

  @media (max-width: 1024px) {
    position: static;
  }
`;

const OverviewCard = styled(LuxuryCard)`
  padding: var(--space-xl);
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;
`;

const InfoCard = styled(Card)`
  padding: var(--space-xl);
  animation: ${fadeInUp} 0.6s ease-out 0.2s both;
`;

const TimelineCard = styled(Card)`
  padding: var(--space-xl);
  animation: ${slideInRight} 0.6s ease-out 0.1s both;
`;

const PaymentCard = styled(Card)`
  padding: var(--space-xl);
  animation: ${slideInRight} 0.6s ease-out 0.3s both;
`;

const ActionCard = styled(Card)`
  padding: var(--space-xl);
  animation: ${slideInRight} 0.6s ease-out 0.4s both;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
`;

const CardTitle = styled.h2`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const CardIcon = styled.span`
  font-size: var(--text-xl);
  color: var(--primary);
`;

const BookingId = styled.span`
  background: var(--gray-100);
  color: var(--text-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OverviewItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);

  &:hover {
    background: var(--gray-100);
    transform: translateY(-2px);
  }
`;

const OverviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const OverviewLabel = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const OverviewValue = styled.span`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--gray-200);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const InfoValue = styled.span`
  font-size: var(--text-md);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-muted);
  font-style: italic;
  font-family: var(--font-body);
`;

const CarHeader = styled.div`
  display: flex;
  gap: var(--space-lg);
  align-items: center;
  margin-bottom: var(--space-lg);

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;

const CarImage = styled.img`
  width: 120px;
  height: 80px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
`;

const CarInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const CarModel = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const CarYear = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const CarSpecs = styled.span`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-family: var(--font-body);
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 16px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--gray-300);
    z-index: 1;
  }
`;

const TimelineItem = styled.div`
  display: flex;
  gap: var(--space-lg);
  align-items: flex-start;
  position: relative;
  z-index: 2;

  opacity: ${(props) => (props.$completed ? 1 : 0.7)};
`;

const TimelineDot = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => (props.$completed ? "var(--success)" : "var(--gray-300)")};
  border: 3px solid var(--white);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
  position: relative;
  z-index: 2;
`;

const TimelineContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding-bottom: var(--space-lg);
`;

const TimelineEvent = styled.span`
  font-size: var(--text-md);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const TimelineTime = styled.span`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-family: var(--font-body);
`;

const TimelineDescription = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
  line-height: 1.5;
`;

const PaymentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const PaymentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--gray-200);

  &:last-child {
    border-bottom: none;
  }
`;

const PaymentLabel = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const PaymentValue = styled.span`
  font-size: var(--text-md);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const ActionTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-lg) 0;
  text-align: center;
  font-family: var(--font-heading);
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const SupportNote = styled.div`
  text-align: center;
  padding: var(--space-lg);
  background: var(--info-light);
  border-radius: var(--radius-lg);
  color: var(--info-dark);
  font-size: var(--text-sm);
  margin-top: var(--space-lg);
  font-family: var(--font-body);
`;

const ConfirmationBanner = styled.div`
  background: var(--gradient-primary);
  color: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  text-align: center;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-md);
  }
`;

const BannerIcon = styled.div`
  font-size: 2rem;
`;

const BannerText = styled.p`
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  font-family: var(--font-body);

  @media (max-width: 768px) {
    font-size: var(--text-md);
  }
`;

const BookingInfoCard = styled(LuxuryCard)`
  padding: var(--space-xl);
  animation: ${slideInRight} 0.6s ease-out 0.2s both;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--gray-200);

  &:last-child {
    border-bottom: none;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-md);
`;

const TotalLabel = styled.span`
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
`;

const TotalValue = styled.span`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary);
`;

const StatusBadges = styled.div`
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
`;

const BookingStatus = styled.span`
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  background: ${({ $status }) =>
    $status === "completed" ? "#E0F2FE" : $status === "active" ? "#DCFCE7" : "#FEF9C3"};
  color: ${({ $status }) =>
    $status === "completed" ? "#1E40AF" : $status === "active" ? "#166534" : "#92400E"};
`;

const PaymentStatusBadge = styled(BookingStatus)`
  background: ${({ $status }) =>
    $status === "paid" ? "#E0F2FE" : $status === "pending" ? "#FEF9C3" : "#F3F4F6"};
  color: ${({ $status }) =>
    $status === "paid" ? "#1E40AF" : $status === "pending" ? "#92400E" : "#374151"};
`;
