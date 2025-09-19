// src/pages/LoginPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import OtpModal from "../components/Modal/OtpModal";
import Button from "../components/Button";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [isOtpOpen, setOtpOpen] = useState(false);

  const { sendOtp } = useAuth();
  const isLoading = false;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { phone, password };
    sendOtp.mutate(payload, {
      onSuccess: (data) => {
        console.log("OTP sent", data);
        setOtpOpen(true);
      },
      onError: (err) => {
        setError(err.message || "Something went wrong");
      },
    });
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setError("");
    setPhone("");
    setPassword("");
    setPasswordConfirm("");
    setUsername("");
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>{isRegistering ? "Create Account" : "Welcome Back"}</Title>
        <Subtitle>
          {isRegistering ? "Sign up to get started" : "Sign in to your account"}
        </Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          {isRegistering && (
            <InputGroup>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </InputGroup>
          )}

          <InputGroup>
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 5551234567"
              required
            />
          </InputGroup>

          <InputGroup>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                isRegistering ? "Create a password" : "Enter your password"
              }
              required
            />
          </InputGroup>

          {isRegistering && (
            <InputGroup>
              <label htmlFor="passwordConfirm">Confirm Password</label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </InputGroup>
          )}

          <Button type="submit" disabled={isLoading} variant="primary">
            {isLoading
              ? "Loading..."
              : isRegistering
              ? "Create Account"
              : "Sign In"}
          </Button>
        </Form>

        <ToggleWrapper>
          {isRegistering
            ? "Already have an account? "
            : "Don't have an account? "}
          <ToggleLink onClick={toggleMode}>
            {isRegistering ? "Sign In" : "Sign Up"}
          </ToggleLink>
        </ToggleWrapper>
      </FormWrapper>

      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setOtpOpen(false)}
        phone={phone}
      />
    </PageWrapper>
  );
};

export default LoginPage;

// ---- Styled Components ---- //
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
`;

const FormWrapper = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 450px;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.8rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.errorBg};
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.95rem;
  }

  input {
    padding: 0.875rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: var(--radius-md);
    font-size: 1rem;
    background: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ToggleWrapper = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ToggleLink = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
