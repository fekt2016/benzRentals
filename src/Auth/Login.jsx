// src/pages/LoginPage.jsx
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import OtpModal from "../components/Modal/OtpModal";
import { PrimaryButton } from "../components/ui/Button";
import { useSendOtp, useRegister } from "../hooks/useAuth";

// Optimized Animations - Only essential ones remain
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [isOtpOpen, setOtpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  const sendOtp = useSendOtp();
  const register = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (isRegistering) {
      if (password !== passwordConfirm) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      const payload = { fullName, phone, email, password, passwordConfirm };
      register.mutate(payload, {
        onSuccess: (data) => {
          console.log("Registered", data);
          setOtpOpen(true);
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err.message || "Registration failed");
          setIsLoading(false);
        },
      });
    } else {
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }

      const payload = { phone, password };
      sendOtp.mutate(payload, {
        onSuccess: (data) => {
          console.log("OTP sent", data);
          setOtpOpen(true);
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err.message || "Login failed");
          setIsLoading(false);
        },
      });
    }
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setError("");
    setPhone("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setFullName("");
  };

  const handleInputFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  return (
    <PageWrapper>
      {/* Simplified Background */}
      <BackgroundOverlay />

      <Container>
        <LeftSection>
          <HeroContent>
            <Title>
              Drive Your <GradientText>Dream Car</GradientText> Today
            </Title>

            <Subtitle>
              Join thousands of satisfied customers who trust us for their car
              rental needs. Experience luxury, reliability, and exceptional
              service.
            </Subtitle>

            <FeaturesList>
              <Feature>🚗 1000+ Luxury Vehicles</Feature>
              <Feature>⭐ 4.8/5 Customer Rating</Feature>
              <Feature>🔐 Secure & Insured</Feature>
              <Feature>📱 Easy Booking Process</Feature>
            </FeaturesList>
          </HeroContent>
        </LeftSection>

        <RightSection>
          <FormCard>
            <FormHeader>
              <Icon>{isRegistering ? "👋" : "🔑"}</Icon>
              <FormTitle>
                {isRegistering ? "Create Account" : "Welcome Back"}
              </FormTitle>
              <FormSubtitle>
                {isRegistering
                  ? "Join our community today"
                  : "Sign in to your account"}
              </FormSubtitle>
            </FormHeader>

            {error && (
              <ErrorMessage>
                <ErrorIcon>⚠️</ErrorIcon>
                {error}
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
              {isRegistering && (
                <>
                  <InputGroup>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => handleInputFocus("fullName")}
                      onBlur={handleInputBlur}
                      placeholder="Full Name"
                      required
                      $active={activeInput === "fullName"}
                    />
                    <InputIcon>👤</InputIcon>
                  </InputGroup>

                  <InputGroup>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => handleInputFocus("email")}
                      onBlur={handleInputBlur}
                      placeholder="Email Address"
                      required
                      $active={activeInput === "email"}
                    />
                    <InputIcon>📧</InputIcon>
                  </InputGroup>
                </>
              )}

              <InputGroup>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => handleInputFocus("phone")}
                  onBlur={handleInputBlur}
                  placeholder="Phone Number"
                  required
                  $active={activeInput === "phone"}
                />
                <InputIcon>📱</InputIcon>
              </InputGroup>

              <InputGroup>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleInputFocus("password")}
                  onBlur={handleInputBlur}
                  placeholder={
                    isRegistering ? "Create Password" : "Enter Password"
                  }
                  required
                  $active={activeInput === "password"}
                />
                <InputIcon>🔒</InputIcon>
              </InputGroup>

              {isRegistering && (
                <InputGroup>
                  <Input
                    type="password"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    onFocus={() => handleInputFocus("passwordConfirm")}
                    onBlur={handleInputBlur}
                    placeholder="Confirm Password"
                    required
                    $active={activeInput === "passwordConfirm"}
                  />
                  <InputIcon>✅</InputIcon>
                </InputGroup>
              )}

              <SubmitButton
                type="submit"
                disabled={isLoading}
                $isLoading={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    {isRegistering ? "Creating Account..." : "Signing In..."}
                  </>
                ) : (
                  <>{isRegistering ? "Create Account" : "Sign In"}</>
                )}
              </SubmitButton>
            </Form>

            <ToggleSection>
              <ToggleText>
                {isRegistering
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </ToggleText>
              <ToggleButton onClick={toggleMode} type="button">
                {isRegistering ? "Sign In" : "Sign Up"}
              </ToggleButton>
            </ToggleSection>

            <PrivacyNote>
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </PrivacyNote>
          </FormCard>
        </RightSection>
      </Container>

      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setOtpOpen(false)}
        phone={phone}
      />
    </PageWrapper>
  );
};

export default LoginPage;

// Optimized Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
`;

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const LeftSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    display: none;
  }
`;

const HeroContent = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const GradientText = styled.span`
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const FeaturesList = styled.div`
  display: grid;
  gap: 0.75rem;
  text-align: left;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const RightSection = styled.div`
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 350px;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Icon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  animation: ${slideUp} 0.3s ease-out;
`;

const ErrorIcon = styled.span`
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 0.875rem 0.875rem 2.5rem;
  border: 2px solid ${(props) => (props.$active ? "#4f46e5" : "#e5e7eb")};
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: white;
  color: #1f2937;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: #6b7280;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem 2rem;
  background: ${(props) =>
    props.$isLoading
      ? "#9ca3af"
      : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${(props) => (props.$isLoading ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
  }

  &:disabled {
    opacity: 0.7;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const ToggleSection = styled.div`
  text-align: center;
  margin: 1.5rem 0 1rem;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
`;

const ToggleText = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.5rem;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: #3730a3;
  }
`;

const PrivacyNote = styled.p`
  text-align: center;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 1rem;
  line-height: 1.4;
`;
