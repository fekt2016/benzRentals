// src/pages/LoginPage.jsx
import React from "react";
import styled from "styled-components";
import { useNavigate} from "react-router-dom";
import OtpModal from "../components/Modal/OtpModal";
import { useLogin, useRegister, useForgotPassword } from "../hooks/useAuth";

// Import UI Components
import { PrimaryButton, GhostButton } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import {slideUp,fadeIn, } from '../styles/animations';

// Import Form Components
import { 
  Input, 
  PhoneInput, 
  PasswordInput,
  FormField 
} from "../components/forms/Form";

// Custom hook for form state management
const useAuthForm = () => {
  const [formData, setFormData] = React.useState({
    phone: "",
    email: "",
    password: "",
    passwordConfirm: "",
    fullName: "",
    dateOfBirth: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone// Add dateOfBirth to form state
  });
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [isForgotPassword, setIsForgotPassword] = React.useState(false);
  const [localErrors, setLocalErrors] = React.useState([]);
  const [isOtpOpen, setOtpOpen] = React.useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = React.useState(false);

  const navigate = useNavigate();

  // Use the auth hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const forgotPasswordMutation = useForgotPassword();

  // Get loading state from the appropriate mutation
  const isLoading = isForgotPassword 
    ? forgotPasswordMutation.isPending 
    : isRegistering 
      ? registerMutation.isLoading 
      : loginMutation.isPending;

  // Get error from the appropriate mutation
  const hookError = isForgotPassword 
    ? forgotPasswordMutation.error 
    : isRegistering 
      ? registerMutation.error 
      : loginMutation.error;

  // Enhanced error extraction utility
  const extractAuthErrorMessage = (error) => {
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

    if (message.includes("network") || message.includes("internet")) {
      return "Please check your internet connection and try again.";
    }

    if (message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }

    if (
      message.includes("invalid credential") ||
      message.includes("wrong password")
    ) {
      return "Invalid phone number or password. Please try again.";
    }

    if (
      message.includes("user not found") ||
      message.includes("user not exist")
    ) {
      return "No account found with this phone number. Please sign up.";
    }

    if (message.includes("already exist") || message.includes("duplicate")) {
      return "An account with this phone number already exists. Please sign in.";
    }

    if (message.includes("incorrect otp") || message.includes("invalid otp")) {
      return "The verification code you entered is incorrect. Please try again.";
    }

    if (message.includes("expired otp")) {
      return "The verification code has expired. Please request a new one.";
    }

    if (message.includes("too many attempt")) {
      return "Too many failed attempts. Please wait a few minutes before trying again.";
    }

    // Forgot password specific errors
    if (message.includes("email not found") || message.includes("no user with this email")) {
      return "No account found with this email address. Please check your email or sign up.";
    }

    if (message.includes("email required") || message.includes("email is required")) {
      return "Email address is required to reset your password.";
    }

    // Date of birth validation errors
    if (message.includes("date of birth") || message.includes("age") || message.includes("18")) {
      return "You must be at least 18 years old to create an account.";
    }

    return message.charAt(0).toUpperCase() + message.slice(1);
  };

  // Extract field-specific errors
  const extractFieldErrors = (error) => {
    if (!error) return {};

    const fieldErrors = {};
    const responseError = error.response?.data || error;

    if (Array.isArray(responseError.errors)) {
      responseError.errors.forEach((err) => {
        if (err.path && err.message) {
          fieldErrors[err.path] = err.message;
        }
      });
    }

    if (responseError.errors && typeof responseError.errors === "object") {
      Object.entries(responseError.errors).forEach(([field, message]) => {
        fieldErrors[field] = message;
      });
    }

    return fieldErrors;
  };

  const generalError = extractAuthErrorMessage(hookError);
  const fieldErrors = extractFieldErrors(hookError);

  // Calculate minimum and maximum dates for date of birth
  const getDateConstraints = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100); // 100 years ago
    
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18); // 18 years ago
    
    return {
      min: minDate.toISOString().split('T')[0],
      max: maxDate.toISOString().split('T')[0]
    };
  };

  // Client-side validation
  const validateForm = () => {
    const { phone, email, password, passwordConfirm, fullName, dateOfBirth } = formData;
    const errors = [];

    if (isForgotPassword) {
      if (!email.trim()) {
        errors.push("Email address is required to reset your password");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Please enter a valid email address");
      }
      return errors;
    }

    if (!phone.trim()) {
      errors.push("Phone number is required");
    }

    if (!password.trim()) {
      errors.push("Password is required");
    } else if (isRegistering) {
      if (password.length < 6) {
        errors.push("Password must be at least 6 characters");
      } else if (!/(?=.*[A-Z])/.test(password)) {
        errors.push("Password must contain at least one capital letter");
      }
    }

    if (isRegistering) {
      if (!email.trim()) {
        errors.push("Email is required");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push("Please enter a valid email address");
      }

      if (!fullName.trim()) {
        errors.push("Full name is required");
      } else if (fullName.trim().length < 2) {
        errors.push("Full name must be at least 2 characters");
      }

      if (!dateOfBirth) {
        errors.push("Date of birth is required");
      } else {
        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        
        if (age < 18) {
          errors.push("You must be at least 18 years old to create an account");
        }
      }

      if (password !== passwordConfirm) {
        errors.push("Passwords do not match");
      }
    }

    return errors;
  };

  // Combine local validation errors with hook errors
  const displayError = localErrors[0] || generalError;

  const resetErrors = () => {
    setLocalErrors([]);
    loginMutation.reset();
    registerMutation.reset();
    forgotPasswordMutation.reset();
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear errors when user starts typing
    if (localErrors.length > 0 || generalError) {
      resetErrors();
    }
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    setIsForgotPassword(false);
    setForgotPasswordSuccess(false);
    resetErrors();
    setFormData({
      phone: "",
      email: "",
      password: "",
      passwordConfirm: "",
      fullName: "",
      dateOfBirth: "", // Reset dateOfBirth when toggling mode
    });
  };

  const showForgotPassword = () => {
    setIsForgotPassword(true);
    setIsRegistering(false);
    setForgotPasswordSuccess(false);
    resetErrors();
    setFormData(prev => ({
      ...prev,
      password: "",
      passwordConfirm: "",
    }));
  };

  const showLogin = () => {
    setIsForgotPassword(false);
    setIsRegistering(false);
    setForgotPasswordSuccess(false);
    resetErrors();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();
    setForgotPasswordSuccess(false);

    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setLocalErrors(validationErrors);
      return;
    }

    try {
      if (isForgotPassword) {
        const payload = {
          email: formData.email.trim(),
        };

        forgotPasswordMutation.mutate(payload, {
          onSuccess: (data) => {
            console.log("✅ Forgot password request sent:", data);
            setForgotPasswordSuccess(true);
          },
          onError: (error) => {
            console.error("❌ Forgot password error:", error);
          }
        });
      } else if (isRegistering) {
        const payload = {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
          dateOfBirth: formData.dateOfBirth, // Include dateOfBirth in payload
        };

        registerMutation.mutate(payload, {
          onSuccess: async (data) => {
            console.log("✅ Registered:", data);
            setOtpOpen(true);
          },
        });
      } else {
        const payload = {
          phone: formData.phone.trim(),
          password: formData.password,
        };
        loginMutation.mutate(payload, {
          onSuccess: async () => {
            setOtpOpen(true);
          },
        });
      }
    } catch (error) {
      console.error("❌ Form submission error:", error);
      // Errors are handled by the mutation error state
    }
  };

  const handleOtpSuccess = () => {
    setOtpOpen(false);
    navigate(isRegistering ? "/profile" : "/");
  };

  return {
    formData,
    isRegistering,
    isForgotPassword,
    forgotPasswordSuccess,
    displayError,
    fieldErrors,
    localErrors,
    isOtpOpen,
    isLoading,
    updateFormData,
    toggleMode,
    showForgotPassword,
    showLogin,
    handleSubmit,
    setOtpOpen,
    handleOtpSuccess,
    getDateConstraints, // Export date constraints
  };
};

const LoginPage = () => {
  const {
    formData,
    isRegistering,
    isForgotPassword,
    forgotPasswordSuccess,
    displayError,
    fieldErrors,
    isOtpOpen,
    isLoading,
    updateFormData,
    toggleMode,
    showForgotPassword,
    showLogin,
    handleSubmit,
    setOtpOpen,
    handleOtpSuccess,
    getDateConstraints,
  } = useAuthForm();

  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName] || '';
  };

  const dateConstraints = getDateConstraints();

  return (
    <PageWrapper>
      <BackgroundOverlay />

      <Container>
        <LeftSection>
          <HeroContent>
            <Logo src="/images/benzflex2.png" alt="benzflex logo" />
            <Title>
              Drive Your <GradientText>Dream Car</GradientText> Today
            </Title>

            <Subtitle>
              Join thousands of satisfied customers who trust us for their car
              rental needs. Experience luxury, reliability, and exceptional
              service.
            </Subtitle>

            <FeaturesList>
              <Feature>1000+ Luxury Vehicles</Feature>
              <Feature>4.8/5 Customer Rating</Feature>
              <Feature>Secure & Insured</Feature>
              <Feature>Easy Booking Process</Feature>
            </FeaturesList>
          </HeroContent>
        </LeftSection>

        <RightSection>
          <FormCard>
            <FormHeader>
              <LogoBox>
                <Logo src="/images/benzflex3.png" alt="benzflex logo" />
              </LogoBox>

              <FormTitle>
                {isForgotPassword 
                  ? "Reset Password" 
                  : isRegistering 
                    ? "Create Account" 
                    : "Welcome Back"
                }
              </FormTitle>
              <FormSubtitle>
                {isForgotPassword
                  ? "Enter your email address to reset your password"
                  : isRegistering
                    ? "Join our community today"
                    : "Sign in to your account"
                }
              </FormSubtitle>
            </FormHeader>

            {forgotPasswordSuccess ? (
              <SuccessMessage>
                <SuccessIcon>✅</SuccessIcon>
                <SuccessText>
                  <strong>Reset instructions sent!</strong><br />
                  Please check your email for password reset instructions.
                </SuccessText>
                <BackToLoginButton onClick={showLogin}>
                  Back to Login
                </BackToLoginButton>
              </SuccessMessage>
            ) : (
              <>
                {displayError && (
                  <ErrorMessage>
                    <ErrorIcon>⚠️</ErrorIcon>
                    {displayError}
                  </ErrorMessage>
                )}

                <Form onSubmit={handleSubmit}>
                  {isRegistering && (
                    <>
                      <FormField error={getFieldError("fullName")}>
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => updateFormData("fullName", e.target.value)}
                          placeholder="Full Name"
                          required
                          disabled={isLoading}
                          error={!!getFieldError("fullName")}
                        />
                      </FormField>

                      {/* Date of Birth Field */}
                      <FormField 
                        label="Date of Birth" 
                        error={getFieldError("dateOfBirth")}
                        htmlFor="dateOfBirth"
                      >
                        <DateInput
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                          min={dateConstraints.min}
                          max={dateConstraints.max}
                          required
                          disabled={isLoading}
                          error={!!getFieldError("dateOfBirth")}
                        />
                        <DateHint>
                          You must be at least 18 years old to register
                        </DateHint>
                      </FormField>
                    </>
                  )}

                  {/* Show email field for forgot password OR register */}
                  {(isForgotPassword || isRegistering) && (
                    <FormField error={getFieldError("email")}>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        placeholder={
                          isForgotPassword 
                            ? "Enter your email address" 
                            : "Email Address"
                        }
                        required
                        disabled={isLoading}
                        error={!!getFieldError("email")}
                      />
                    </FormField>
                  )}

                  {/* Show phone field for login and register (not for forgot password) */}
                  {!isForgotPassword && (
                    <FormField error={getFieldError("phone")}>
                      <PhoneInput
                        value={formData.phone}
                        onChange={(value) => updateFormData("phone", value)}
                        error={!!getFieldError("phone")}
                        disabled={isLoading}
                        placeholder="Phone Number"
                      />
                    </FormField>
                  )}

                  {!isForgotPassword && (
                    <>
                      <FormField error={getFieldError("password")}>
                        <PasswordInput
                          value={formData.password}
                          onChange={(e) => updateFormData("password", e.target.value)}
                          placeholder={
                            isRegistering
                              ? "Create Password (min 6 chars, 1 capital)"
                              : "Enter Password"
                          }
                          required
                          error={!!getFieldError("password")}
                          disabled={isLoading}
                        />
                        {isRegistering && formData.password && (
                          <PasswordStrengthIndicator password={formData.password} />
                        )}
                      </FormField>

                      {isRegistering && (
                        <FormField error={getFieldError("passwordConfirm")}>
                          <PasswordInput
                            value={formData.passwordConfirm}
                            onChange={(e) => updateFormData("passwordConfirm", e.target.value)}
                            placeholder="Confirm Password"
                            required
                            error={!!getFieldError("passwordConfirm")}
                            disabled={isLoading}
                          />
                        </FormField>
                      )}
                    </>
                  )}

                  {!isRegistering && !isForgotPassword && (
                    <ForgotPasswordLink onClick={showForgotPassword}>
                      Forgot your password?
                    </ForgotPasswordLink>
                  )}

                  <SubmitButton
                    type="submit"
                    disabled={isLoading}
                    $isLoading={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <ButtonSpinner size="sm" />
                        {isForgotPassword 
                          ? "Sending Instructions..." 
                          : isRegistering 
                            ? "Creating Account..." 
                            : "Signing In..."
                        }
                      </>
                    ) : (
                      <>
                        {isForgotPassword 
                          ? "Send Reset Instructions" 
                          : isRegistering 
                            ? "Create Account" 
                            : "Sign In"
                        }
                      </>
                    )}
                  </SubmitButton>
                </Form>

                <ToggleSection>
                  <ToggleText>
                    {isForgotPassword 
                      ? "Remember your password?" 
                      : isRegistering
                        ? "Already have an account?"
                        : "Don't have an account?"
                    }
                  </ToggleText>
                  <ToggleButton
                    onClick={isForgotPassword ? showLogin : toggleMode}
                    type="button"
                    disabled={isLoading}
                  >
                    {isForgotPassword 
                      ? "Back to Login" 
                      : isRegistering 
                        ? "Sign In" 
                        : "Sign Up"
                    }
                  </ToggleButton>
                </ToggleSection>
              </>
            )}

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
        phone={formData.phone}
        onSuccess={handleOtpSuccess}
      />
    </PageWrapper>
  );
};

export default LoginPage;

// New Styled Components for Date Input
const DateInput = styled.input`
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  border: 1px solid ${props => props.error ? 'var(--error)' : 'var(--gray-300)'};
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: var(--font-body);
  background: var(--white);
  transition: all var(--transition-fast);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: ${props => props.error ? 'var(--error)' : 'var(--primary)'};
    box-shadow: 0 0 0 3px ${props => props.error ? 'var(--error-light)' : 'var(--primary-light)'};
  }

  &:disabled {
    background: var(--gray-100);
    color: var(--text-muted);
    cursor: not-allowed;
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    filter: ${props => props.disabled ? 'grayscale(1) opacity(0.5)' : 'none'};
  }

  /* For Firefox */
  &:invalid {
    box-shadow: none;
  }
`;

const DateHint = styled.span`
  display: block;
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: var(--space-xs);
  font-family: var(--font-body);
`;

// Existing Styled Components (keep all the existing ones below)
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

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--gradient-overlay);
`;

const ButtonSpinner = styled(LoadingSpinner)`
  // Additional styling if needed for button spinner
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
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

const LogoBox = styled.div`
  height: 150px;
  width: 150px;
`;

const Logo = styled.img`
  height: 20rem;
  width: 20rem;
`;

const FeaturesList = styled.div`
  display: grid;
  gap: var(--space-sm);
  text-align: left;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  font-family: var(--font-body);
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
  max-width: 350px;
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--space-lg);
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
`;

const ErrorMessage = styled.div`
  background: var(--error-light);
  border: 1px solid var(--error);
  color: var(--error);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  animation: ${slideUp} var(--transition-fast) ease-out;
  font-family: var(--font-body);
`;

const ErrorIcon = styled.span`
  font-size: 1rem;
`;

const SuccessMessage = styled.div`
  background: var(--success-light);
  border: 1px solid var(--success);
  color: var(--success-dark);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
  text-align: center;
  animation: ${slideUp} var(--transition-fast) ease-out;
`;

const SuccessIcon = styled.div`
  font-size: 2rem;
  margin-bottom: var(--space-sm);
`;

const SuccessText = styled.p`
  margin: 0 0 var(--space-md) 0;
  line-height: 1.5;
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const BackToLoginButton = styled(PrimaryButton)`
  width: 100%;
  margin-top: var(--space-sm);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

// Forgot Password Link Component
const ForgotPasswordLink = styled.button`
  text-align: right;
  color: var(--primary);
  font-size: var(--text-sm);
  text-decoration: none;
  font-weight: var(--font-medium);
  margin-top: -var(--space-sm);
  margin-bottom: var(--space-sm);
  transition: color var(--transition-fast);
  font-family: var(--font-body);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: fit-content;
  align-self: flex-end;

  &:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
    min-height: 48px;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none !important;
    }
  }
`;

const ToggleSection = styled.div`
  text-align: center;
  margin: var(--space-lg) 0 var(--space-md);
  padding: var(--space-md) 0;
  border-top: 1px solid var(--gray-200);
`;

const ToggleText = styled.span`
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const ToggleButton = styled(GhostButton)`
  && {
    color: var(--primary);
    font-weight: var(--font-semibold);
    margin-left: var(--space-sm);
    font-size: var(--text-sm);
    min-width: auto;

    &:hover:not(:disabled) {
      color: var(--primary-dark);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const PrivacyNote = styled.p`
  text-align: center;
  font-size: var(--text-xs);
  color: var(--text-light);
  margin-top: var(--space-md);
  line-height: 1.4;
  font-family: var(--font-body);
`;