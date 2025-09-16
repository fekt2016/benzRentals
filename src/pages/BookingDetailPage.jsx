// src/pages/BookingDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

// Sample bookings data (replace with API call in real app)
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

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Replace with API call to fetch booking by ID
    const found = sampleBookings.find((b) => b.id === parseInt(bookingId));
    setBooking(found);
  }, [bookingId]);

  if (!booking) return <p>Booking not found.</p>;

  return (
    <PageWrapper>
      <Title>Booking Details</Title>

      <BookingSummary>
        <Detail>
          <strong>Car:</strong> {booking.car}
        </Detail>
        <Detail>
          <strong>Pickup Date:</strong> {booking.pickupDate}
        </Detail>
        <Detail>
          <strong>Return Date:</strong> {booking.returnDate}
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
        <Detail>
          <strong>Status:</strong>{" "}
          <Status status={booking.status}>{booking.status}</Status>
        </Detail>
      </BookingSummary>

      <FilesSection>
        <h2>Uploaded Documents</h2>
        <FileItem>
          <strong>Driver's License:</strong>{" "}
          {booking.licenseFile?.name || "Not uploaded"}
        </FileItem>
        <FileItem>
          <strong>Insurance:</strong>{" "}
          {booking.insuranceFile?.name || "Not uploaded"}
        </FileItem>
      </FilesSection>

      <ButtonWrapper>
        <Button onClick={() => navigate("/check-bookings")}>
          Back to My Bookings
        </Button>
      </ButtonWrapper>
    </PageWrapper>
  );
};

export default BookingDetailPage;

// ---------------- Styled Components ---------------- //

const PageWrapper = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const BookingSummary = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: 2rem;
`;

const Detail = styled.p`
  margin: 0.5rem 0;

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Status = styled.span`
  font-weight: bold;
  color: ${({ status }) => (status === "Confirmed" ? "green" : "orange")};
`;

const FilesSection = styled.div`
  background: #f9f9f9;
  padding: 1.2rem;
  border-radius: ${({ theme }) => theme.radius.small};
  margin-bottom: 2rem;

  h2 {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileItem = styled.p`
  margin: 0.5rem 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.small};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
