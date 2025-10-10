// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { PrimaryButton, GhostButton } from "../components/ui/Button";
import { Input } from "../components/forms/Form";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useForgotPassword } from "../hooks/useAuth";

// Animations
const fadeIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { mutate: forgotPassword } = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic email validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      forgotPassword({ email });
      // For demo purposes, we'll assume it always succeeds
      setIsSubmitted(true);
    } catch (err) {
      console.log(err);
      setError("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <PageWrapper>
      <BackgroundPattern />

      <Container>
        <LeftSection>
          <HeroContent>
            <BackButton onClick={handleBackToLogin}>
              <BackIcon>←</BackIcon>
              Back to Login
            </BackButton>

            <Logo>🚗 DriveEase</Logo>

            <AnimatedIcon>🔐</AnimatedIcon>

            <Title>
              Reset Your <GradientText>Password</GradientText>
            </Title>

            <Subtitle>
              Don't worry! Just enter your email and we'll send you a link to
              reset your password.
            </Subtitle>

            <FeaturesList>
              <Feature>
                <FeatureIcon>✓</FeatureIcon>
                <FeatureText>Secure password reset</FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon>✓</FeatureIcon>
                <FeatureText>Link expires in 1 hour</FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon>✓</FeatureIcon>
                <FeatureText>Instant email delivery</FeatureText>
              </Feature>
            </FeaturesList>
          </HeroContent>
        </LeftSection>

        <RightSection>
          <FormContainer>
            <FormCard>
              <FormHeader>
                <FormIcon>{isSubmitted ? "📨" : "🔑"}</FormIcon>
                <FormTitle>
                  {isSubmitted ? "Check Your Email" : "Forgot Password"}
                </FormTitle>
                <FormSubtitle>
                  {isSubmitted
                    ? "We've sent you a password reset link"
                    : "Enter your email to reset your password"}
                </FormSubtitle>
              </FormHeader>

              {error && (
                <ErrorMessage>
                  <ErrorIcon>⚠️</ErrorIcon>
                  {error}
                </ErrorMessage>
              )}

              {!isSubmitted ? (
                <Form onSubmit={handleSubmit}>
                  <InputGroup>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      icon="📧"
                      required
                      disabled={isLoading}
                      autoFocus
                    />
                  </InputGroup>

                  <SubmitButton
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    $isLoading={isLoading}
                    $variant="primary"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </SubmitButton>
                </Form>
              ) : (
                <SuccessContent>
                  <SuccessIcon>✅</SuccessIcon>
                  <SuccessMessage>
                    We've sent a password reset link to <strong>{email}</strong>
                    . Please check your inbox and follow the instructions to
                    reset your password.
                  </SuccessMessage>

                  <HelpText>
                    Didn't receive the email? Check your spam folder or{" "}
                    <ResendLink onClick={() => setIsSubmitted(false)}>
                      try again with a different email
                    </ResendLink>
                  </HelpText>

                  <ActionButtons>
                    <PrimaryButton onClick={handleBackToLogin}>
                      Back to Login
                    </PrimaryButton>
                  </ActionButtons>
                </SuccessContent>
              )}

              {!isSubmitted && (
                <HelpSection>
                  <HelpText>
                    Remember your password?{" "}
                    <LoginLink to="/login">Back to login</LoginLink>
                  </HelpText>
                </HelpSection>
              )}

              <PrivacyNote>
                By continuing, you agree to our{" "}
                <Link href="#">Terms of Service</Link> and{" "}
                <Link href="#">Privacy Policy</Link>
              </PrivacyNote>
            </FormCard>
          </FormContainer>
        </RightSection>
      </Container>
    </PageWrapper>
  );
};

export default ForgotPassword;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  position: relative;
  font-family: var(--font-sans);
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 10% 20%,
      rgba(120, 119, 198, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 90% 80%,
      rgba(255, 119, 198, 0.3) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 30% 70%,
      rgba(120, 219, 255, 0.2) 0%,
      transparent 50%
    );
  animation: ${fadeIn} 1s ease-out;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  animation: ${slideIn} 0.6s ease-out;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    max-width: 450px;
  }
`;

const LeftSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--space-2xl) var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  @media (max-width: 968px) {
    padding: var(--space-xl) var(--space-lg);
    display: none;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;
  max-width: 400px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: var(--space-sm) var(--space-md);
  border-radius: 20px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  }
`;

const BackIcon = styled.span`
  font-size: var(--text-lg);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: var(--font-bold);
  margin-bottom: var(--space-2xl);
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: var(--space-sm) var(--space-md);
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const AnimatedIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-xl);
  animation: ${float} 3s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: var(--font-bold);
  margin-bottom: var(--space-md);
  line-height: 1.2;
  font-family: var(--font-heading);

  @media (max-width: 968px) {
    font-size: 2rem;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: var(--space-2xl);
  opacity: 0.9;
  font-weight: var(--font-medium);
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  text-align: left;
  margin-top: var(--space-2xl);
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FeatureIcon = styled.div`
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
`;

const FeatureText = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
`;

const RightSection = styled.div`
  padding: var(--space-2xl);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 968px) {
    padding: var(--space-xl);
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

const FormCard = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-2xl);
`;

const FormIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-lg);
`;

const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
`;

const FormSubtitle = styled.p`
  color: var(--text-muted);
  font-size: var(--text-base);
  line-height: 1.5;
`;

const ErrorMessage = styled.div`
  background: var(--error-light);
  border: 1px solid var(--error);
  color: var(--error);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  animation: ${fadeIn} var(--transition-fast) ease-out;
`;

const ErrorIcon = styled.span`
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const InputGroup = styled.div`
  position: relative;
`;

const SubmitButton = styled(PrimaryButton)`
  && {
    width: 100%;
    margin-top: var(--space-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-lg);
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
    }
  }
`;

const SuccessContent = styled.div`
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-lg);
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
`;

const SuccessMessage = styled.p`
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
  text-align: center;
`;

const HelpText = styled.p`
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-align: center;
  line-height: 1.5;
  margin-bottom: var(--space-lg);
`;

const ResendLink = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  font-weight: var(--font-semibold);
  cursor: pointer;
  text-decoration: underline;
  transition: color var(--transition-normal);

  &:hover {
    color: var(--primary-dark);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  margin-top: var(--space-xl);
`;

const HelpSection = styled.div`
  text-align: center;
  margin: var(--space-xl) 0 var(--space-md);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--gray-200);
`;

const LoginLink = styled(Link)`
  color: var(--primary);
  font-weight: var(--font-semibold);
  text-decoration: none;
  transition: color var(--transition-normal);

  &:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
`;

const PrivacyNote = styled.p`
  text-align: center;
  font-size: var(--text-xs);
  color: var(--text-light);
  margin-top: var(--space-xl);
  line-height: 1.5;

  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: var(--font-medium);

    &:hover {
      text-decoration: underline;
    }
  }
`;
