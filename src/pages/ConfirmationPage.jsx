// src/pages/BookingConfirmationPage.jsx
import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

import { useGetBookingConfirmation } from "../hooks/usePayment";
import usePageTitle from "../hooks/usePageTitle";

import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";

// Import your design system components
import { Card, LuxuryCard, StatsCard } from "../components/Cards/Card";
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
} from "../components/ui/Button";
import { LoadingSpinner, SuccessState } from "../components/ui/LoadingSpinner";

// Modern animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const BookingConfirmationPage = () => {
  const seoConfig = ROUTE_CONFIG[PATHS.CONFIRMATION];
  usePageTitle(seoConfig.title, seoConfig.description);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("booking_id");

  const {
    data: response,
    isLoading,
    error,
  } = useGetBookingConfirmation(bookingId);

  const booking = response?.data?.booking;
  const session = response?.data?.session;

  // Calculate rental duration
  const rentalDays = useMemo(() => {
    if (!booking?.pickupDate || !booking?.returnDate) return 0;
    const pickup = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);
    return Math.ceil((returnDate - pickup) / (1000 * 60 * 60 * 24));
  }, [booking]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  // const formatTime = (dateString) => {
  //   return new Date(dateString).toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  if (isLoading) {
    return (
      <PageWrapper>
        <LoadingContainer>
          <LoadingSpinner size="xl" />
          <LoadingTitle>Finalizing Your Booking</LoadingTitle>
          <LoadingText>
            We're preparing your confirmation details...
          </LoadingText>
        </LoadingContainer>
      </PageWrapper>
    );
  }

  if (error || !booking) {
    return (
      <PageWrapper>
        <ErrorContainer>
          <ErrorIcon>❌</ErrorIcon>
          <ErrorTitle>Booking Not Found</ErrorTitle>
          <ErrorText>
            {error?.message ||
              "We couldn't find your booking details. Please contact support if this issue persists."}
          </ErrorText>
          <ActionButtons>
            <PrimaryButton onClick={() => navigate(PATHS.HOME)}>
              Return Home
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate(PATHS.BOOKINGS)}>
              View My Bookings
            </SecondaryButton>
          </ActionButtons>
        </ErrorContainer>
      </PageWrapper>
    );
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
        <ConfirmationBadge>
          <BadgeIcon>🎯</BadgeIcon>
          <BadgeText>{booking.status}</BadgeText>
        </ConfirmationBadge>
      </SuccessHeader>

      <ContentGrid>
        {/* Left Column - Booking Summary */}
        <LeftColumn>
          {/* Quick Overview Card */}
          <OverviewCard>
            <CardHeader>
              <CardTitle>Booking Overview</CardTitle>
              <BookingId>#{booking._id.slice(-8).toUpperCase()}</BookingId>
            </CardHeader>

            <OverviewGrid>
              <OverviewItem>
                <OverviewIcon>📅</OverviewIcon>
                <OverviewContent>
                  <OverviewLabel>Rental Period</OverviewLabel>
                  <OverviewValue>{rentalDays} days</OverviewValue>
                </OverviewContent>
              </OverviewItem>

              <OverviewItem>
                <OverviewIcon>💰</OverviewIcon>
                <OverviewContent>
                  <OverviewLabel>Total Amount</OverviewLabel>
                  <OverviewValue>${booking.totalPrice}</OverviewValue>
                </OverviewContent>
              </OverviewItem>

              <OverviewItem>
                <OverviewIcon>📍</OverviewIcon>
                <OverviewContent>
                  <OverviewLabel>Pickup Location</OverviewLabel>
                  <OverviewValue>{booking.pickupLocation}</OverviewValue>
                </OverviewContent>
              </OverviewItem>

              <OverviewItem>
                <OverviewIcon>🚗</OverviewIcon>
                <OverviewContent>
                  <OverviewLabel>Vehicle</OverviewLabel>
                  <OverviewValue>{booking.car?.series}</OverviewValue>
                </OverviewContent>
              </OverviewItem>
            </OverviewGrid>
          </OverviewCard>

          {/* Customer Information */}
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

                <InfoItem>
                  <InfoLabel>Customer Since</InfoLabel>
                  <InfoValue>
                    {booking.user.createdAt
                      ? new Date(booking.user.createdAt).toLocaleDateString()
                      : "Recent customer"}
                  </InfoValue>
                </InfoItem>
              </InfoGrid>
            ) : (
              <EmptyState>Customer information not available</EmptyState>
            )}
          </InfoCard>

          {/* Car Details */}
          <InfoCard>
            <CardHeader>
              <CardTitle>Vehicle Details</CardTitle>
              <CardIcon>🚘</CardIcon>
            </CardHeader>

            {booking.car ? (
              <>
                <CarHeader>
                  <CarImage
                    src={booking.car.images?.[0] || "/default-car.jpg"}
                    alt={booking.car.model}
                  />
                  <CarInfo>
                    <CarModel>
                      {booking.car.model} {booking.car.series}
                    </CarModel>
                    <CarYear>{booking.car.year}</CarYear>
                    <CarSpecs>
                      {booking.car.transmission} • {booking.car.fuelType} •{" "}
                      {booking.car.seats} seats
                    </CarSpecs>
                  </CarInfo>
                </CarHeader>

                <FeaturesGrid>
                  {booking.car.features?.slice(0, 6).map((feature, index) => (
                    <FeatureTag key={index}>{feature}</FeatureTag>
                  ))}
                </FeaturesGrid>
              </>
            ) : (
              <EmptyState>Car details not available</EmptyState>
            )}
          </InfoCard>
        </LeftColumn>

        {/* Right Column - Timeline & Actions */}
        <RightColumn>
          {/* Rental Timeline */}
          <TimelineCard>
            <CardHeader>
              <CardTitle>Rental Timeline</CardTitle>
              <CardIcon>🕒</CardIcon>
            </CardHeader>

            <Timeline>
              <TimelineItem $completed={true}>
                <TimelineDot $completed={true} />
                <TimelineContent>
                  <TimelineEvent>Booking Confirmed</TimelineEvent>
                  <TimelineTime>Just now</TimelineTime>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem $completed={false}>
                <TimelineDot $completed={false} />
                <TimelineContent>
                  <TimelineEvent>Pickup Vehicle</TimelineEvent>
                  <TimelineTime>{formatDate(booking.pickupDate)}</TimelineTime>
                  <TimelineDescription>
                    Present your ID and confirmation at {booking.pickupLocation}
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem $completed={false}>
                <TimelineDot $completed={false} />
                <TimelineContent>
                  <TimelineEvent>Return Vehicle</TimelineEvent>
                  <TimelineTime>{formatDate(booking.returnDate)}</TimelineTime>
                  <TimelineDescription>
                    Return to same location with full tank
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </TimelineCard>

          {/* Booking Details */}
          <DetailsCard>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardIcon>📋</CardIcon>
            </CardHeader>

            <DetailsGrid>
              <DetailItem>
                <DetailLabel>Pickup Date & Time</DetailLabel>
                <DetailValue>
                  {formatDate(booking.pickupDate)} at{" "}
                  {booking.pickupTime || "To be assigned"}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Return Date & Time</DetailLabel>
                <DetailValue>
                  {formatDate(booking.returnDate)} at 12:00 PM
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Rental Duration</DetailLabel>
                <DetailValue>{rentalDays} days</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Daily Rate</DetailLabel>
                <DetailValue>${booking.car?.pricePerDay}/day</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Subtotal</DetailLabel>
                <DetailValue>
                  ${(booking.car?.pricePerDay * rentalDays).toFixed(2)}
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Tax & Fees</DetailLabel>
                <DetailValue>
                  $
                  {(
                    booking.totalPrice -
                    booking.car?.pricePerDay * rentalDays
                  ).toFixed(2)}
                </DetailValue>
              </DetailItem>

              <TotalItem>
                <TotalLabel>Total Amount</TotalLabel>
                <TotalValue>${booking.totalPrice}</TotalValue>
              </TotalItem>
            </DetailsGrid>
          </DetailsCard>

          {/* Payment Information */}
          {session && (
            <PaymentCard>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <PaymentStatus $status={session.payment_status}>
                  {session.payment_status === "paid" ? "✅ Paid" : "⏳ Pending"}
                </PaymentStatus>
              </CardHeader>

              <PaymentDetails>
                <PaymentItem>
                  <PaymentLabel>Amount Paid</PaymentLabel>
                  <PaymentValue>
                    ${(session.amount_total / 100).toFixed(2)}
                  </PaymentValue>
                </PaymentItem>

                <PaymentItem>
                  <PaymentLabel>Payment Method</PaymentLabel>
                  <PaymentValue>Credit Card (Stripe)</PaymentValue>
                </PaymentItem>

                <PaymentItem>
                  <PaymentLabel>Transaction ID</PaymentLabel>
                  <PaymentValue>{session.id.slice(-12)}</PaymentValue>
                </PaymentItem>
              </PaymentDetails>
            </PaymentCard>
          )}

          {/* Action Buttons */}
          <ActionCard>
            <ActionTitle>Next Steps</ActionTitle>
            <ActionButtons>
              <PrimaryButton
                onClick={() => navigate(PATHS.BOOKINGS)}
                $size="lg"
              >
                📋 View My Bookings
              </PrimaryButton>

              <SecondaryButton onClick={() => navigate(PATHS.HOME)} $size="lg">
                🏠 Continue Browsing
              </SecondaryButton>

              <GhostButton onClick={() => window.print()} $size="lg">
                🖨️ Print Confirmation
              </GhostButton>
            </ActionButtons>

            <SupportNote>
              💬 Need help? Contact our support team at
              support@luxuryrentals.com
            </SupportNote>
          </ActionCard>
        </RightColumn>
      </ContentGrid>

      {/* Confirmation Banner */}
      <ConfirmationBanner>
        <BannerContent>
          <BannerIcon>🎉</BannerIcon>
          <BannerText>
            <strong>Your luxury experience is {booking.status}!</strong> Check
            your email for detailed instructions and pickup information.
          </BannerText>
        </BannerContent>
      </ConfirmationBanner>
    </PageWrapper>
  );
};

export default BookingConfirmationPage;

// ============================================================================
// STYLED COMPONENTS USING GLOBAL DESIGN SYSTEM
// ============================================================================

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

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-lg);
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
  padding: var(--space-2xl);
  margin-bottom: var(--space-2xl);
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
  gap: var(--space-xl);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-lg);
  }
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  box-shadow: var(--shadow-lg);

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
    font-size: var(--text-md);
    padding: var(--space-sm) var(--space-md);
  }
`;

const BadgeIcon = styled.span`
  font-size: var(--text-xl);
`;

const BadgeText = styled.span``;

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

// Card Components
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

const DetailsCard = styled(Card)`
  padding: var(--space-xl);
  animation: ${slideInRight} 0.6s ease-out 0.2s both;
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

// Overview Grid
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

const OverviewIcon = styled.div`
  font-size: var(--text-2xl);
  width: 50px;
  height: 50px;
  border-radius: var(--radius-lg);
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
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

// Information Grids
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

// Car Details
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

const FeaturesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`;

const FeatureTag = styled.span`
  background: var(--primary-light);
  color: var(--primary-dark);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

// Timeline
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
  background: ${(props) =>
    props.$completed ? "var(--success)" : "var(--gray-300)"};
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

// Details Grid
const DetailsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--gray-200);
`;

const DetailLabel = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const DetailValue = styled.span`
  font-size: var(--text-md);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const TotalItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) 0;
  border-top: 2px solid var(--gray-300);
  margin-top: var(--space-sm);
`;

const TotalLabel = styled.span`
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

const TotalValue = styled.span`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  font-family: var(--font-heading);
`;

// Payment Components
const PaymentStatus = styled.span`
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  background: ${(props) =>
    props.$status === "paid" ? "var(--success-light)" : "var(--warning-light)"};
  color: ${(props) =>
    props.$status === "paid" ? "var(--success-dark)" : "var(--warning-dark)"};
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

// Action Components
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

// Confirmation Banner
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
