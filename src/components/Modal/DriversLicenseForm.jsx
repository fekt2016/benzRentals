// src/pages/DriversLicenseForm.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PATHS } from "../../routes/routePaths";

const DriversLicenseForm = ({ setShowModal }) => {
  //   const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  //   const carId = searchParams.get("carId");
  //   const pickupDate = searchParams.get("pickupDate");
  //   const returnDate = searchParams.get("returnDate");
  //   const location = searchParams.get("location");

  const handleModalSubmit = (e) => {
    e.preventDefault();
    alert("Driver's license submitted! Booking complete.");
    navigate(`${PATHS.CHECKOUT}`); // Redirect to homepage or bookings page
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Driver's License Verification</h2>
        <Form onSubmit={handleModalSubmit}>
          <label>
            Driver's License Number
            <input type="text" required />
          </label>
          <label>
            Upload License
            <input type="file" accept="image/*,.pdf" required />
          </label>
          <label>
            Upload Insurance
            <input type="file" accept="image/*,.pdf" required />
          </label>
          <button type="submit">Submit</button>
        </Form>
        <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DriversLicenseForm;

// ---------------- Styled Components ---------------- //

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  width: 100%;
  max-width: 500px;
  box-shadow: ${({ theme }) => theme.shadows.card};

  h2 {
    margin-bottom: 1.5rem;
    text-align: center;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  label {
    display: flex;
    flex-direction: column;
    font-weight: 500;

    input {
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

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #555;
  cursor: pointer;
`;
