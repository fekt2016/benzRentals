// src/pages/BookingsPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Sample bookings data (in real app, fetch from backend)
const sampleBookings = [
  {
    id: 1,
    car: "Mercedes-Benz S-Class",
    pickupDate: "2025-09-20",
    returnDate: "2025-09-25",
    location: "New York",
    price: 250,
    paymentMethod: "Credit Card",
    status: "Processing",
    licenseFile: { name: "license1.jpg" },
    insuranceFile: { name: "insurance1.pdf" },
  },
  {
    id: 2,
    car: "Mercedes-Benz G-Wagon",
    pickupDate: "2025-10-01",
    returnDate: "2025-10-05",
    location: "Los Angeles",
    price: 400,
    paymentMethod: "PayPal",
    status: "Confirmed",
    licenseFile: { name: "license2.jpg" },
    insuranceFile: { name: "insurance2.pdf" },
  },
];

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with API call to fetch user bookings
    setBookings(sampleBookings);
  }, []);

  if (!bookings.length) return <p>No bookings found.</p>;

  return (
    <PageWrapper>
      <Title>My Bookings</Title>
      <BookingsList>
        {bookings.map((booking) => (
          <BookingCard key={booking.id}>
            <BookingHeader>
              <CarName>{booking.car}</CarName>
              <Status status={booking.status}>{booking.status}</Status>
            </BookingHeader>
            <BookingDetails>
              <Detail>
                <strong>Pickup:</strong> {booking.pickupDate}
              </Detail>
              <Detail>
                <strong>Return:</strong> {booking.returnDate}
              </Detail>
              <Detail>
                <strong>Location:</strong> {booking.location}
              </Detail>
              <Detail>
                <strong>Price:</strong> ${booking.price}/day
              </Detail>
              <Detail>
                <strong>Payment Method:</strong> {booking.paymentMethod}
              </Detail>
            </BookingDetails>
            <FilesSection>
              <Detail>
                <strong>Driver's License:</strong>{" "}
                {booking.licenseFile?.name || "Not uploaded"}
              </Detail>
              <Detail>
                <strong>Insurance:</strong>{" "}
                {booking.insuranceFile?.name || "Not uploaded"}
              </Detail>
            </FilesSection>
            <Button onClick={() => navigate(`/booking/${booking.id}`)}>
              View Details
            </Button>
          </BookingCard>
        ))}
      </BookingsList>
    </PageWrapper>
  );
};

export default BookingsPage;

// ---------------- Styled Components ---------------- //

const PageWrapper = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const BookingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BookingCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CarName = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const Status = styled.span`
  font-weight: bold;
  color: ${({ status }) => (status === "Confirmed" ? "green" : "orange")};
`;

const BookingDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Detail = styled.p`
  margin: 0.3rem 0;

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilesSection = styled.div`
  background: #f9f9f9;
  padding: 0.8rem;
  border-radius: ${({ theme }) => theme.radius.small};
`;

const Button = styled.button`
  align-self: flex-start;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.small};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
