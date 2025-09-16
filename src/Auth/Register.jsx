// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PATHS } from "../routes/routePaths";

const LoginPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = login form, 2 = otp verification
  const [error, setError] = useState("");

  const validateUSPhone = (number) => {
    const digits = number.replace(/\D/g, "");
    return digits.length === 10;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setError("Please enter phone number and password");
      return;
    }
    if (!validateUSPhone(phone)) {
      setError("Please enter a valid US phone number (10 digits)");
      return;
    }

    // TODO: Replace with actual authentication API
    if (phone === "5551234567" && password === "password123") {
      setError("");
      // Simulate sending OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(newOtp);
      alert(`OTP sent: ${newOtp}`); // in real app, send via SMS
      setStep(2);
    } else {
      setError("Invalid phone number or password");
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      alert("Login successful!");
      navigate("/"); // redirect to homepage
    } else {
      setError("Invalid OTP, please try again");
    }
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {step === 1 && (
          <Form onSubmit={handleLogin}>
            <label>
              Phone Number
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., 5551234567"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>
            <CheckboxWrapper>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </CheckboxWrapper>
            <Button type="submit">Login</Button>
          </Form>
        )}

        {step === 2 && (
          <Form onSubmit={handleVerifyOtp}>
            <label>
              Enter OTP
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your phone"
                required
              />
            </label>
            <Button type="submit">Verify OTP</Button>
          </Form>
        )}

        <RegisterLink>
          Don't have an account?{" "}
          <span onClick={() => navigate(`${PATHS.LOGIN}`)}>Register</span>
        </RegisterLink>
      </FormWrapper>
    </PageWrapper>
  );
};

export default LoginPage;

// ---------------- Styled Components ---------------- //

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
`;

const FormWrapper = styled.div`
  background: ${({ theme }) => theme.colors.white || "#fff"};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.radius.medium || "12px"};
  box-shadow: ${({ theme }) =>
    theme.shadows.card || "0 4px 12px rgba(0,0,0,0.1)"};
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.primary || "#0077ff"};
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: 500;
  margin-bottom: 1rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  label {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    font-size: 1rem;

    input {
      padding: 0.5rem 1rem;
      margin-top: 0.5rem;
      border-radius: ${({ theme }) => theme.radius.small || "6px"};
      border: 1px solid #ccc;
    }
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary || "#0077ff"};
  color: ${({ theme }) => theme.colors.white || "#fff"};
  padding: 0.8rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.small || "6px"};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark || "#005fcc"};
  }
`;

const RegisterLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.95rem;

  span {
    color: ${({ theme }) => theme.colors.primary || "#0077ff"};
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }
`;
