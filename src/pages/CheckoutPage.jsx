// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PATHS } from "../routes/routePaths";

// Dummy payment methods
const paymentMethods = ["Credit Card", "PayPal", "Stripe"];

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [licenseFile, setLicenseFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);

  if (!booking) return <p>No booking details found.</p>;

  const handleCheckout = (e) => {
    e.preventDefault();

    if (!licenseFile || !insuranceFile) {
      alert("Please upload both Driver's License and Insurance.");
      return;
    }

    // Here you can handle file upload & payment processing
    console.log("Booking:", booking);
    console.log("License File:", licenseFile);
    console.log("Insurance File:", insuranceFile);
    console.log("Payment Method:", paymentMethod);

    alert("Checkout successful! Booking confirmed.");
    navigate(`${PATHS.CONFIRMATION}`, { state: { booking } });
  };

  return (
    <PageWrapper>
      <Title>Checkout</Title>

      <BookingSummary>
        <h2>Booking Summary</h2>
        <Detail>
          <strong>Car:</strong> {booking.car}
        </Detail>
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
      </BookingSummary>

      <FormWrapper onSubmit={handleCheckout}>
        <h2>Upload Documents & Payment</h2>

        {/* Document Uploads */}
        <label>
          Upload Driver's License
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setLicenseFile(e.target.files[0])}
            required
          />
        </label>

        <label>
          Upload Insurance
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setInsuranceFile(e.target.files[0])}
            required
          />
        </label>

        {/* Payment Section */}
        <PaymentSection>
          <label>
            Payment Method
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </label>

          {paymentMethod === "Credit Card" && (
            <>
              <label>
                Card Number
                <input type="text" placeholder="1234 5678 9012 3456" required />
              </label>
              <label>
                Expiry Date
                <input type="month" required />
              </label>
              <label>
                CVV
                <input type="text" maxLength={4} required />
              </label>
            </>
          )}
        </PaymentSection>

        <button type="submit">Confirm Booking</button>
      </FormWrapper>
    </PageWrapper>
  );
};

export default CheckoutPage;

// ---------------- Styled Components ---------------- //

const PageWrapper = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const BookingSummary = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: 2rem;

  h2 {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Detail = styled.p`
  margin: 0.5rem 0;

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormWrapper = styled.form`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2 {
    margin-bottom: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    font-weight: 500;

    input,
    select {
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: ${({ theme }) => theme.radius.small};
      border: 1px solid #ccc;
    }
  }

  button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    padding: 0.8rem;
    border: none;
    border-radius: ${({ theme }) => theme.radius.small};
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
`;

const PaymentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ccc;
`;
