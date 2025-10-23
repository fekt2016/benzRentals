import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPassword } from "../hooks/useAuth";
import {  fadeIn, slideUp } from "../styles/animations";

// Import UI Components
import { PrimaryButton } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

// Import Form Components
import { 
  PasswordInput,
  FormField,
  ErrorMessage as ErrorMessageBase,
  SuccessMessage as SuccessMessageBase
} from "../components/forms/Form";

function ResetPasswordPage() {

const location = useLocation();

const token = location.pathname.split('/').pop(); // Extract token from URL path
console.log('Extracted token:', token);
  
  const navigate = useNavigate();
 
  
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirm: "",
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [localError, setLocalError] = useState("");

  const { mutate: resetPassword, isPending:isLoading, error, isSuccess } = useResetPassword();
console.log('Reset password hook state:', { resetPassword, isLoading, error, isSuccess });
  // Check if token is present
  useEffect(() => {
    if (!token) {
      setLocalError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (formErrors[field] || localError) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
      setLocalError("");
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      errors.password = "Password must contain at least one capital letter";
    }

    if (!formData.passwordConfirm) {
      errors.passwordConfirm = "Please confirm your password";
    } else if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Extract error message from hook error
  const getErrorMessage = () => {
    if (localError) return localError;
    
    if (!error) return null;

    if (typeof error === "string") {
      return error;
    }

    const responseError = error.response?.data || error;
    let message =
      responseError.message ||
      responseError.error ||
      responseError.detail ||
      error.message;

    if (!message) return "An unexpected error occurred. Please try again.";

    message = message.toLowerCase();

    if (message.includes("token") && message.includes("invalid")) {
      return "This password reset link is invalid or has expired. Please request a new one.";
    }

    if (message.includes("token") && message.includes("expired")) {
      return "This password reset link has expired. Please request a new one.";
    }

    if (message.includes("network") || message.includes("internet")) {
      return "Please check your internet connection and try again.";
    }

    return message.charAt(0).toUpperCase() + message.slice(1);
  };

  const errorMessage = getErrorMessage();

  // Handle form submission
  const handleSubmit = (e) => {
    console.log('Form submitted with data:', formData, token);
    e.preventDefault();
    
    if (!token) {
      setLocalError("Invalid reset token");
      return;
    }

    if (!validateForm()) {
      return;
    }

    resetPassword({
      token,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm
    });
  };

  // Handle success redirect
  useEffect(() => {
    if (isSuccess) {
      // Redirect to login after 3 seconds with success message
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: "Password reset successfully! Please log in with your new password.",
            type: "success"
          }
        });
      }, 3000);
    }
  }, [isSuccess, navigate]);

  if (!token) {
    return (
      <PageWrapper>
        <Container>
          <FormCard>
            <FormHeader>
              <Logo src="/images/benzflex3.png" alt="benzflex logo" />
              <FormTitle>Invalid Reset Link</FormTitle>
              <FormSubtitle>
                The password reset link is invalid or has expired.
              </FormSubtitle>
            </FormHeader>

            <ErrorMessage>
              <ErrorIcon>⚠️</ErrorIcon>
              {localError}
            </ErrorMessage>

            <ActionButtons>
              <PrimaryButton 
                onClick={() => navigate('/login')}
                $size="lg"
              >
                Back to Login
              </PrimaryButton>
              <SecondaryButton 
                onClick={() => navigate('/forgot-password')}
                $size="lg"
              >
                Request New Link
              </SecondaryButton>
            </ActionButtons>
          </FormCard>
        </Container>
      </PageWrapper>
    );
  }

  if (isSuccess) {
    return (
      <PageWrapper>
        <Container>
          <FormCard>
            <FormHeader>
              <SuccessIcon>✅</SuccessIcon>
              <FormTitle>Password Reset Successful!</FormTitle>
              <FormSubtitle>
                Your password has been reset successfully. Redirecting you to login...
              </FormSubtitle>
            </FormHeader>

            <SuccessMessage>
              <strong>All done!</strong> You can now log in with your new password.
              You will be redirected to the login page in a few seconds.
            </SuccessMessage>

            <ActionButtons>
              <PrimaryButton 
                onClick={() => navigate('/login')}
                $size="lg"
              >
                Go to Login Now
              </PrimaryButton>
            </ActionButtons>
          </FormCard>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <LeftSection>
          <HeroContent>
            <Logo src="/images/benzflex2.png" alt="benzflex logo" />
            <Title>
              Reset Your <GradientText>Password</GradientText>
            </Title>
            <Subtitle>
              Create a new secure password to protect your account and continue enjoying luxury car rentals.
            </Subtitle>
            <FeaturesList>
              <Feature>✓ Minimum 6 characters</Feature>
              <Feature>✓ At least one capital letter</Feature>
              <Feature>✓ Secure & encrypted</Feature>
            </FeaturesList>
          </HeroContent>
        </LeftSection>

        <RightSection>
          <FormCard>
            <FormHeader>
              <LogoBox>
                <Logo src="/images/benzflex3.png" alt="benzflex logo" />
              </LogoBox>
              <FormTitle>Create New Password</FormTitle>
              <FormSubtitle>
                Enter your new password below
              </FormSubtitle>
            </FormHeader>

            {errorMessage && (
              <ErrorMessage>
                <ErrorIcon>⚠️</ErrorIcon>
                {errorMessage}
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
              <FormField 
                label="New Password" 
                error={formErrors.password}
                htmlFor="password"
              >
                <PasswordInput
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Enter your new password"
                  required
                  disabled={isLoading}
                  error={!!formErrors.password}
                  showToggle={true}
                />
                {formData.password && (
                  <PasswordStrengthIndicator password={formData.password} />
                )}
              </FormField>

              <FormField 
                label="Confirm New Password" 
                error={formErrors.passwordConfirm}
                htmlFor="passwordConfirm"
              >
                <PasswordInput
                  id="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={(e) => handleChange('passwordConfirm', e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  disabled={isLoading}
                  error={!!formErrors.passwordConfirm}
                  showToggle={true}
                />
              </FormField>

              <SubmitButton
                type="submit"
                disabled={isLoading || !token}
                $isLoading={isLoading}
                $size="lg"
              >
                {isLoading ? (
                  <>
                    <ButtonSpinner size="sm" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </SubmitButton>
            </Form>

            <HelpSection>
              <HelpText>Remember your password?</HelpText>
              <HelpLink onClick={() => navigate('/login')}>
                Back to Login
              </HelpLink>
            </HelpSection>

            <SecurityNote>
              <LockIcon>🔒</LockIcon>
              Your password is encrypted and securely stored. All existing sessions will be terminated for security.
            </SecurityNote>
          </FormCard>
        </RightSection>
      </Container>
    </PageWrapper>
  );
}

export default ResetPasswordPage;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  position: relative;
  animation: ${fadeIn} var(--transition-normal) ease-out;
  
`;

const Container = styled.div`
  display: flex;
 justify-content: center;
 align-items: center;
  max-width: 1000px;
  width: 100%;
  padding: var(--space-lg);
 background: var(--white);
  border-radius: var(--radius-3xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(10px);
  animation: ${slideUp} var(--transition-normal) ease-out;
  

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
`;

const LeftSection = styled.div`
  background: var(--gradient-primary);
  padding: var(--space-2xl) var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  background-color: red;

  @media (max-width: 768px) {
    padding: var(--space-xl) var(--space-lg);
    display: none;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-md);
  line-height: 1.3;
  font-family: var(--font-heading);

  @media (max-width: 768px) {
    font-size: var(--text-2xl);
  }
`;

const GradientText = styled.span`
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: var(--font-heading);
`;

const Subtitle = styled.p`
  font-size: var(--text-base);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
  opacity: 0.9;
  font-family: var(--font-body);
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  text-align: left;
  width: 100%;
  max-width: 250px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  color: var(--white);
  opacity: 0.9;
`;

const RightSection = styled.div`
  padding: var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 400px;

`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--space-lg);
  text-align: center;
`;

const LogoBox = styled.div`
  height: 80px;
  width: 80px;
  margin-bottom: var(--space-md);
`;

const Logo = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

const FormTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
`;

const FormSubtitle = styled.p`
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  line-height: 1.5;
`;

const ErrorMessage = styled(ErrorMessageBase)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  background: var(--error-light);
  border: 1px solid var(--error);
  color: var(--error);
  font-weight: var(--font-medium);
  animation: ${slideUp} var(--transition-fast) ease-out;
`;

const ErrorIcon = styled.span`
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-md);
  animation: ${fadeIn} var(--transition-normal) ease-out;
`;

const SuccessMessage = styled(SuccessMessageBase)`
  text-align: center;
  padding: var(--space-md);
  background: var(--success-light);
  border: 1px solid var(--success);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
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
    position: relative;
    min-height: 52px;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
    }
  }
`;

const ButtonSpinner = styled(LoadingSpinner)`
  border-top-color: currentColor;
  border-right-color: currentColor;
  border-bottom-color: transparent;
  border-left-color: transparent;
`;

const HelpSection = styled.div`
  text-align: center;
  margin: var(--space-lg) 0 var(--space-md);
  padding: var(--space-md) 0;
  border-top: 1px solid var(--gray-200);
`;

const HelpText = styled.span`
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const HelpLink = styled.button`
  color: var(--primary);
  font-weight: var(--font-semibold);
  margin-left: var(--space-sm);
  font-size: var(--text-sm);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  font-family: var(--font-body);

  &:hover {
    color: var(--primary-dark);
  }
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  margin-top: var(--space-md);
  font-size: var(--text-xs);
  color: var(--text-muted);
  line-height: 1.4;
  font-family: var(--font-body);
`;

const LockIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 1px;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-top: var(--space-lg);
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: ${({ $size }) => {
    switch ($size) {
      case "sm": return "var(--space-sm) var(--space-lg)";
      case "lg": return "var(--space-lg) var(--space-2xl)";
      default: return "var(--space-md) var(--space-xl)";
    }
  }};
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  font-size: ${({ $size }) => {
    switch ($size) {
      case "sm": return "var(--text-sm)";
      case "lg": return "var(--text-lg)";
      default: return "var(--text-base)";
    }
  }};
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;

  &:hover:not(:disabled) {
    background: var(--primary);
    color: var(--white);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;