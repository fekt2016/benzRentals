// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PATHS } from "../routes/routePaths";

const LoginPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = login/register form, 2 = otp verification
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const validateUSPhone = (number) => {
    const digits = number.replace(/\D/g, "");
    return digits.length === 10;
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const simulateSendOtp = (phoneNumber, otpCode) => {
    console.log(`OTP for ${phoneNumber}: ${otpCode}`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 1500));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (!phone || !password || !passwordConfirm || !username) {
          setError("Please fill all fields");
          return;
        }

        if (!validateUSPhone(phone)) {
          setError("Please enter a valid US phone number (10 digits)");
          return;
        }

        if (!validatePassword(password)) {
          setError(
            "Password must be at least 8 characters with uppercase, lowercase, and number"
          );
          return;
        }

        if (password !== passwordConfirm) {
          setError("Passwords do not match");
          return;
        }

        const newOtp = generateOtp();
        const otpSent = await simulateSendOtp(phone, newOtp);

        if (otpSent) {
          setGeneratedOtp(newOtp);
          setOtpCountdown(120);
          setStep(2);
        }
      } else {
        if (!phone || !password) {
          setError("Please enter phone number and password");
          return;
        }

        if (!validateUSPhone(phone)) {
          setError("Please enter a valid US phone number (10 digits)");
          return;
        }

        if (password === "Password123") {
          const newOtp = generateOtp();
          const otpSent = await simulateSendOtp(phone, newOtp);

          if (otpSent) {
            setGeneratedOtp(newOtp);
            setOtpCountdown(120);
            setStep(2);
          }
        } else {
          setError("Invalid phone number or password");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (otp === generatedOtp) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (isRegistering) {
          console.log("Registration data:", { username, phone, password });
          alert("Registration successful!");
        } else {
          alert("Login successful!");
        }

        navigate(PATHS.home || "/");
      } else {
        setError("Invalid OTP, please try again");
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (otpCountdown > 0) return;

    setIsLoading(true);
    setError("");

    try {
      const newOtp = generateOtp();
      const otpSent = await simulateSendOtp(phone, newOtp);

      if (otpSent) {
        setGeneratedOtp(newOtp);
        setOtpCountdown(120);
        setError("");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
    setPhone("");
    setPassword("");
    setPasswordConfirm("");
    setUsername("");
    setStep(1);
  };

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <PageWrapper>
      <FormWrapper>
        <Title>{isRegistering ? "Create Account" : "Welcome Back"}</Title>
        <Subtitle>
          {isRegistering ? "Sign up to get started" : "Sign in to your account"}
        </Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {step === 1 && (
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
              <label htmlFor="password">
                Password
                {isRegistering && (
                  <PasswordHint>
                    Must be at least 8 characters with uppercase, lowercase, and
                    number
                  </PasswordHint>
                )}
              </label>
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

            {!isRegistering && (
              <RememberForgot>
                <CheckboxWrapper>
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </CheckboxWrapper>
                <ForgotLink href="#">Forgot password?</ForgotLink>
              </RememberForgot>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoadingSpinner />
              ) : isRegistering ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>
        )}

        {step === 2 && (
          <OtpForm onSubmit={handleVerifyOtp}>
            <OtpTitle>Verify Your Phone</OtpTitle>
            <OtpInstructions>
              Enter the 6-digit code sent to {phone}
            </OtpInstructions>

            <OtpInputGroup>
              <label htmlFor="otp">Verification Code</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                required
              />
              <ResendButton
                type="button"
                onClick={resendOtp}
                disabled={otpCountdown > 0 || isLoading}
              >
                Resend Code{" "}
                {otpCountdown > 0 && `(${formatCountdown(otpCountdown)})`}
              </ResendButton>
            </OtpInputGroup>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : "Verify Code"}
            </Button>
          </OtpForm>
        )}

        <ToggleWrapper>
          {isRegistering
            ? "Already have an account? "
            : "Don't have an account? "}
          <ToggleLink onClick={toggleMode}>
            {isRegistering ? "Sign In" : "Sign Up"}
          </ToggleLink>
        </ToggleWrapper>
      </FormWrapper>

      <DemoNote>
        <strong>Demo Note:</strong> In the real application, OTP would be sent
        via SMS. For this demo, check the browser console to see the OTP code.
      </DemoNote>
    </PageWrapper>
  );
};

export default LoginPage;

// ---------------- Styled Components ---------------- //

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
  border-radius: ${({ theme }) => theme.radius.lg || "16px"};
  box-shadow: ${({ theme }) => theme.shadows.md};
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
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const OtpForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OtpTitle = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const OtpInstructions = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
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
    border-radius: ${({ theme }) => theme.radius.md};
    font-size: 1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }
`;

const OtpInputGroup = styled(InputGroup)`
  position: relative;

  input {
    letter-spacing: 8px;
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    padding-right: 120px;
  }
`;

const PasswordHint = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: normal;
`;

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }

  label {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
  }
`;

const ForgotLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  padding: 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabledBg};
    cursor: not-allowed;
  }
`;

const ResendButton = styled.button`
  position: absolute;
  right: 8px;
  top: 38px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid ${({ theme }) => theme.colors.onPrimary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
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

const DemoNote = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  max-width: 450px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  strong {
    color: ${({ theme }) => theme.colors.error};
  }
`;
