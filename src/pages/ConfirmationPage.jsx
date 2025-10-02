// src/pages/BookingConfirmationPage.jsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { useGetBookingConfirmation } from "../hooks/usePayment";
import usePageTitle from "../hooks/usePageTitle";

import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";

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

  // Debug effect
  useEffect(() => {
    if (response) {
      console.log("🎯 Frontend - Final data received:", {
        bookingExists: !!booking,
        userExists: !!booking?.user,
        carExists: !!booking?.car,
        user: booking?.user,
        car: booking?.car,
        isUserObject:
          typeof booking?.user === "object" && booking?.user !== null,
        isCarObject: typeof booking?.car === "object" && booking?.car !== null,
      });
    }
  }, [response, booking]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !booking) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error?.message || "Booking not found"}</p>
      </div>
    );
  }

  // Now you can safely access the populated data!
  return (
    <PageWrapper>
      <HeaderSection>
        <Title>Booking Confirmed!</Title>
        <StatusBadge color="#28a745">Confirmed</StatusBadge>
      </HeaderSection>

      {/* User Information - Now populated! */}
      {booking.user && (
        <Section>
          <h2>Customer Information</h2>
          <Detail>
            <strong>Name:</strong> {booking.user.fullName}
          </Detail>
          <Detail>
            <strong>Email:</strong> {booking.user.email}
          </Detail>
          <Detail>
            <strong>Phone:</strong> {booking.user.phone}
          </Detail>
        </Section>
      )}

      {/* Car Information - Now populated! */}
      {booking.car && (
        <Section>
          <h2>Car Details</h2>
          <Detail>
            <strong>Car:</strong> {booking.car.model} {booking.car.series}
          </Detail>
          <Detail>
            <strong>Year:</strong> {booking.car.year}
          </Detail>
          <Detail>
            <strong>Daily Rate:</strong> ${booking.car.pricePerDay}
          </Detail>
          {booking.car.images && booking.car.images.length > 0 && (
            <CarImage src={booking.car.images[0]} alt={booking.car.model} />
          )}
        </Section>
      )}

      {/* Booking Information */}
      <Section>
        <h2>Booking Details</h2>
        <Detail>
          <strong>Booking ID:</strong> {booking._id}
        </Detail>
        <Detail>
          <strong>Pickup Date:</strong>{" "}
          {new Date(booking.pickupDate).toLocaleDateString()}
        </Detail>
        <Detail>
          <strong>Return Date:</strong>{" "}
          {new Date(booking.returnDate).toLocaleDateString()}
        </Detail>
        <Detail>
          <strong>Pickup Location:</strong> {booking.pickupLocation}
        </Detail>
        <Detail>
          <strong>Total Price:</strong> ${booking.totalPrice}
        </Detail>
      </Section>

      {/* Payment Information */}
      {session && (
        <Section>
          <h2>Payment Information</h2>
          <Detail>
            <strong>Status:</strong> {session.payment_status}
          </Detail>
          <Detail>
            <strong>Amount Paid:</strong> $
            {(session.amount_total / 100).toFixed(2)}
          </Detail>
        </Section>
      )}

      <ButtonWrapper>
        <Button onClick={() => navigate(PATHS.HOME)}>Home</Button>
        <Button onClick={() => navigate(PATHS.BOOKINGS)}>My Bookings</Button>
      </ButtonWrapper>
    </PageWrapper>
  );
};

export default BookingConfirmationPage;

// Styled Components
const PageWrapper = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span`
  background: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
`;

const Section = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;

  h2 {
    color: #333;
    margin-bottom: 1rem;
  }
`;

const Detail = styled.p`
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-between;

  strong {
    color: #555;
  }
`;

const CarImage = styled.img`
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
  margin-top: 1rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;
