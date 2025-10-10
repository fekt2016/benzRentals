// src/pages/LoginPage.jsx
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import OtpModal from "../components/Modal/OtpModal";
import { useLogin, useRegister } from "../hooks/useAuth";
import { sendOtpEmail } from "../utils/Emailservice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Import UI Components
import { PrimaryButton, GhostButton } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

// Optimized Animations
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

// USA Phone Number Validation Utility
const validateUSAPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  const patterns = [
    /^1?[2-9]\d{9}$/,
    /^\([2-9]\d{2}\)\s?\d{3}-\d{4}$/,
    /^[2-9]\d{2}-\d{3}-\d{4}$/,
    /^[2-9]\d{2}\.\d{3}\.\d{4}$/,
    /^[2-9]\d{2}\s\d{3}\s\d{4}$/,
  ];

  return (
    patterns.some((pattern) => pattern.test(phone)) ||
    cleaned.length === 10 ||
    (cleaned.length === 11 && cleaned.startsWith("1"))
  );
};

const formatUSAPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  const limited = cleaned.slice(0, 11);

  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  } else if (limited.length <= 10) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(
      6
    )}`;
  } else {
    return `+1 (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(
      7
    )}`;
  }
};

// Enhanced error extraction utility that works with React Query error structure
const extractAuthErrorMessage = (error) => {
  if (!error) return null;

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle React Query/axios error structure
  const responseError = error.response?.data || error;

  // Extract message from different common structures
  let message =
    responseError.message ||
    responseError.error ||
    responseError.detail ||
    error.message;

  if (!message) return "An unexpected error occurred. Please try again.";

  // Clean and enhance common error messages
  message = message.toLowerCase();

  // Network and connection issues
  if (message.includes("network") || message.includes("internet")) {
    return "Please check your internet connection and try again.";
  }

  if (message.includes("timeout")) {
    return "Request timed out. Please try again.";
  }

  // Authentication specific errors
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

  // Validation errors with field context
  if (message.includes("password") && message.includes("required")) {
    return "Password is required.";
  }

  if (message.includes("phone") && message.includes("required")) {
    return "Phone number is required.";
  }

  if (message.includes("email") && message.includes("required")) {
    return "Email is required.";
  }

  if (message.includes("fullname") && message.includes("required")) {
    return "Full name is required.";
  }

  if (message.includes("password") && message.includes("length")) {
    return "Password must be at least 6 characters long.";
  }

  if (message.includes("capital") || message.includes("uppercase")) {
    return "Password must contain at least one capital letter.";
  }

  if (message.includes("phone") && message.includes("valid")) {
    return "Please enter a valid USA phone number.";
  }

  // Return the original message with proper capitalization
  return message.charAt(0).toUpperCase() + message.slice(1);
};

// Extract field-specific errors from hook errors
const extractFieldErrors = (error) => {
  if (!error) return {};

  const fieldErrors = {};
  const responseError = error.response?.data || error;

  // Handle array of field errors (common in validation responses)
  if (Array.isArray(responseError.errors)) {
    responseError.errors.forEach((err) => {
      if (err.path && err.message) {
        fieldErrors[err.path] = err.message;
      }
    });
  }

  // Handle object with field keys
  if (responseError.errors && typeof responseError.errors === "object") {
    Object.entries(responseError.errors).forEach(([field, message]) => {
      fieldErrors[field] = message;
    });
  }

  return fieldErrors;
};

// Enhanced validation utility
const validateForm = (isRegistering, formData) => {
  const { phone, email, password, passwordConfirm, fullName } = formData;
  const errors = [];

  if (!phone.trim()) {
    errors.push("Phone number is required");
  } else if (!validateUSAPhoneNumber(phone)) {
    errors.push("Please enter a valid USA phone number");
  }

  if (!password.trim()) {
    errors.push("Password is required");
  } else if (isRegistering) {
    if (password.length < 8) {
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

    if (password !== passwordConfirm) {
      errors.push("Passwords do not match");
    }
  }

  return errors;
};

// Custom hook for form state management
const useAuthForm = () => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
    passwordConfirm: "",
    fullName: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [localErrors, setLocalErrors] = useState([]);
  const [isOtpOpen, setOtpOpen] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const navigate = useNavigate();

  // Use the auth hooks
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  // Extract errors from mutations
  const hookError = isRegistering
    ? registerMutation.error
    : loginMutation.error;
  const generalError = extractAuthErrorMessage(hookError, isRegistering);
  const fieldErrors = extractFieldErrors(hookError);

  // Combine local validation errors with hook errors
  const displayError = localErrors[0] || generalError;

  const resetErrors = () => {
    setLocalErrors([]);
    loginMutation.reset();
    registerMutation.reset();
  };

  const updateFormData = (field, value) => {
    let processedValue = value;

    if (field === "phone") {
      processedValue = formatUSAPhoneNumber(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    // Clear errors when user starts typing
    if (localErrors.length > 0 || generalError) {
      resetErrors();
    }
  };

  const toggleMode = () => {
    setIsRegistering((prev) => !prev);
    resetErrors();
    setFormData({
      phone: "",
      email: "",
      password: "",
      passwordConfirm: "",
      fullName: "",
    });
    setShowPassword(false);
    setShowPasswordConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetErrors();

    // Client-side validation
    const validationErrors = validateForm(isRegistering, formData);
    if (validationErrors.length > 0) {
      setLocalErrors(validationErrors);
      return;
    }

    try {
      if (isRegistering) {
        const payload = {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
        };

        registerMutation.mutate(payload, {
          onSuccess: async (data) => {
            console.log("✅ Registered:", data);

            if (data?.data?.user?.email && data?.data?.otp) {
              try {
                await sendOtpEmail(
                  data.data.user.email,
                  data.data.user.name || formData.fullName,
                  data.data.otp
                );
                setOtpOpen(true);
              } catch (emailError) {
                console.error("❌ Failed to send OTP email:", emailError);
                // Continue to OTP modal even if email fails
                setOtpOpen(true);
              }
            } else {
              console.warn("OTP data missing in response");
              setOtpOpen(true);
            }
          },
        });
      } else {
        const payload = {
          phone: formData.phone.trim(),
          password: formData.password,
        };

        loginMutation.mutate(payload, {
          onSuccess: async (data) => {
            console.log("✅ Login OTP sent:", data);

            if (data?.email && data?.otp) {
              try {
                await sendOtpEmail(data.email, data.name, data.otp);
                setOtpOpen(true);
              } catch (emailError) {
                console.error("❌ Failed to send OTP email:", emailError);
                setOtpOpen(true);
              }
            } else {
              console.warn("OTP data missing in login response");
              setOtpOpen(true);
            }
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
    navigate(isRegistering ? "/profile" : "/bookings");
  };

  return {
    formData,
    isRegistering,
    displayError,
    fieldErrors,
    localErrors,
    isOtpOpen,
    activeInput,
    showPassword,
    showPasswordConfirm,
    isLoading,
    updateFormData,
    toggleMode,
    handleSubmit,
    setActiveInput,
    setShowPassword,
    setShowPasswordConfirm,
    setOtpOpen,
    handleOtpSuccess,
  };
};

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null;

  const hasMinLength = password.length >= 6;
  const hasCapitalLetter = /(?=.*[A-Z])/.test(password);

  const getStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (hasMinLength) strength += 1;
    if (hasCapitalLetter) strength += 1;
    return strength;
  };

  const strength = getStrength();
  const strengthText =
    strength === 0
      ? "Very Weak"
      : strength === 1
      ? "Weak"
      : strength === 2
      ? "Good"
      : "Strong";

  const strengthColor =
    strength === 0
      ? "var(--error)"
      : strength === 1
      ? "var(--warning)"
      : strength === 2
      ? "var(--success)"
      : "var(--success)";

  return (
    <StrengthIndicator>
      <StrengthBar>
        <StrengthFill $strength={strength} $color={strengthColor} />
      </StrengthBar>
      <StrengthText $color={strengthColor}>
        Password Strength: {strengthText}
        {!hasMinLength && " • Min 6 characters"}
        {!hasCapitalLetter && " • Capital letter"}
      </StrengthText>
    </StrengthIndicator>
  );
};

// Phone format helper text
const PhoneFormatHelper = ({ phone }) => {
  if (!phone) {
    return <PhoneHelperText>Enter your USA phone number</PhoneHelperText>;
  }

  if (!validateUSAPhoneNumber(phone)) {
    return (
      <PhoneErrorText>Please enter a valid USA phone number</PhoneErrorText>
    );
  }

  return <PhoneSuccessText>✓ Valid USA phone number</PhoneSuccessText>;
};

const LoginPage = () => {
  const {
    formData,
    isRegistering,
    displayError,
    fieldErrors,
    isOtpOpen,
    activeInput,
    showPassword,
    showPasswordConfirm,
    isLoading,
    updateFormData,
    toggleMode,
    handleSubmit,
    setActiveInput,
    setShowPassword,
    setShowPasswordConfirm,
    setOtpOpen,
    handleOtpSuccess,
  } = useAuthForm();

  const handleInputFocus = (inputName) => {
    setActiveInput(inputName);
  };

  const handleInputBlur = () => {
    setActiveInput(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordConfirmVisibility = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  // Helper to get field error from hook errors
  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName] || "";
  };

  const hasFieldError = (fieldName) => {
    return !!fieldErrors[fieldName];
  };

  return (
    <PageWrapper>
      <BackgroundOverlay />

      {/* Loading Overlay */}
      {isLoading && (
        <LoadingOverlay>
          <LoadingContent>
            <LoadingSpinner size="lg" />
            <LoadingText>
              {isRegistering ? "Creating your account..." : "Signing you in..."}
            </LoadingText>
          </LoadingContent>
        </LoadingOverlay>
      )}

      <Container $isLoading={isLoading}>
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
              <Feature> Easy Booking Process</Feature>
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
                {isRegistering ? "Create Account" : "Welcome Back"}
              </FormTitle>
              <FormSubtitle>
                {isRegistering
                  ? "Join our community today"
                  : "Sign in to your account"}
              </FormSubtitle>
            </FormHeader>

            {displayError && (
              <ErrorMessage>
                <ErrorIcon>⚠️</ErrorIcon>
                {displayError}
              </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
              {isRegistering && (
                <>
                  <InputGroup>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        updateFormData("fullName", e.target.value)
                      }
                      onFocus={() => handleInputFocus("fullName")}
                      onBlur={handleInputBlur}
                      placeholder="Full Name"
                      required
                      $active={activeInput === "fullName"}
                      $error={hasFieldError("fullName")}
                      disabled={isLoading}
                    />

                    {hasFieldError("fullName") && (
                      <FieldError>{getFieldError("fullName")}</FieldError>
                    )}
                  </InputGroup>

                  <InputGroup>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      onFocus={() => handleInputFocus("email")}
                      onBlur={handleInputBlur}
                      placeholder="Email Address"
                      required
                      $active={activeInput === "email"}
                      $error={hasFieldError("email")}
                      disabled={isLoading}
                    />

                    {hasFieldError("email") && (
                      <FieldError>{getFieldError("email")}</FieldError>
                    )}
                  </InputGroup>
                </>
              )}

              <InputGroup>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  onFocus={() => handleInputFocus("phone")}
                  onBlur={handleInputBlur}
                  placeholder="(555) 555-5555"
                  required
                  $active={activeInput === "phone"}
                  $error={
                    hasFieldError("phone") ||
                    (formData.phone && !validateUSAPhoneNumber(formData.phone))
                  }
                  disabled={isLoading}
                  maxLength="17"
                />
                {hasFieldError("phone") && (
                  <FieldError>{getFieldError("phone")}</FieldError>
                )}
                <PhoneFormatHelper
                  phone={formData.phone}
                  isRegistering={isRegistering}
                />
              </InputGroup>

              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  onFocus={() => handleInputFocus("password")}
                  onBlur={handleInputBlur}
                  placeholder={
                    isRegistering
                      ? "Create Password (min 6 chars, 1 capital)"
                      : "Enter Password"
                  }
                  required
                  $active={activeInput === "password"}
                  $error={hasFieldError("password")}
                  disabled={isLoading}
                />
                <PasswordToggle
                  type="button"
                  onClick={togglePasswordVisibility}
                  $visible={showPassword}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordToggle>
                {hasFieldError("password") && (
                  <FieldError>{getFieldError("password")}</FieldError>
                )}
                {isRegistering && formData.password && (
                  <PasswordStrengthIndicator password={formData.password} />
                )}
              </InputGroup>

              {isRegistering && (
                <InputGroup>
                  <Input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={formData.passwordConfirm}
                    onChange={(e) =>
                      updateFormData("passwordConfirm", e.target.value)
                    }
                    onFocus={() => handleInputFocus("passwordConfirm")}
                    onBlur={handleInputBlur}
                    placeholder="Confirm Password"
                    required
                    $active={activeInput === "passwordConfirm"}
                    $error={hasFieldError("passwordConfirm")}
                    disabled={isLoading}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={togglePasswordConfirmVisibility}
                    $visible={showPasswordConfirm}
                    disabled={isLoading}
                  >
                    {showPasswordConfirm ? <FaEyeSlash /> : <FaEye />}
                  </PasswordToggle>
                  {hasFieldError("passwordConfirm") && (
                    <FieldError>{getFieldError("passwordConfirm")}</FieldError>
                  )}
                </InputGroup>
              )}

              {!isRegistering && (
                <ForgotPasswordLink to="/forgot-password">
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
              <ToggleButton
                onClick={toggleMode}
                type="button"
                disabled={isLoading}
              >
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
        phone={formData.phone}
        onSuccess={handleOtpSuccess}
      />
    </PageWrapper>
  );
};

export default LoginPage;

// Styled Components using Global CSS Variables
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

// Loading Overlay Components
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: ${fadeIn} var(--transition-fast) ease-out;
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  background: var(--white);
  padding: var(--space-2xl);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  min-width: 200px;
`;

const LoadingText = styled.p`
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  text-align: center;
  font-family: var(--font-body);
  margin: 0;
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
  opacity: ${(props) => (props.$isLoading ? 0.6 : 1)};
  transition: opacity var(--transition-fast);

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: var(--space-md) var(--space-2xl) var(--space-md) var(--space-2xl);
  border: 2px solid
    ${(props) => {
      if (props.$error) return "var(--error)";
      return props.$active ? "var(--primary)" : "var(--gray-300)";
    }};
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  transition: all var(--transition-fast);
  background: var(--white);
  color: var(--text-primary);
  font-family: var(--font-body);

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$error ? "var(--error)" : "var(--primary)"};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$error ? "var(--error-light)" : "var(--primary-light)"};
  }

  &::placeholder {
    color: var(--text-muted);
  }

  &:disabled {
    background: var(--gray-100);
    color: var(--text-muted);
    cursor: not-allowed;
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: var(--text-muted);
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-muted);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  /* Completely disable all hover, focus, and active states */
  &:hover,
  &:focus,
  &:active {
    transform: translateY(-50%) !important;
    color: var(--text-muted) !important;
    background: none !important;
    outline: none !important;
    box-shadow: none !important;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

const FieldError = styled.span`
  color: var(--error);
  font-size: var(--text-xs);
  margin-top: var(--space-xs);
  display: block;
  font-weight: var(--font-medium);
  animation: ${fadeIn} var(--transition-fast) ease-out;
`;

// Phone helper text components
const PhoneHelperText = styled.span`
  color: var(--text-muted);
  font-size: var(--text-xs);
  margin-top: var(--space-xs);
  display: block;
  font-weight: var(--font-medium);
`;

const PhoneErrorText = styled.span`
  color: var(--error);
  font-size: var(--text-xs);
  margin-top: var(--space-xs);
  display: block;
  font-weight: var(--font-medium);
`;

const PhoneSuccessText = styled.span`
  color: var(--success);
  font-size: var(--text-xs);
  margin-top: var(--space-xs);
  display: block;
  font-weight: var(--font-medium);
`;

// Password Strength Indicator
const StrengthIndicator = styled.div`
  margin-top: var(--space-sm);
`;

const StrengthBar = styled.div`
  height: 4px;
  background: var(--gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-xs);
`;

const StrengthFill = styled.div`
  height: 100%;
  width: ${(props) => {
    switch (props.$strength) {
      case 0:
        return "25%";
      case 1:
        return "50%";
      case 2:
        return "100%";
      default:
        return "0%";
    }
  }};
  background: ${(props) => props.$color};
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
`;

const StrengthText = styled.div`
  font-size: var(--text-xs);
  color: ${(props) => props.$color};
  font-weight: var(--font-medium);
`;

// Forgot Password Link Component
const ForgotPasswordLink = styled(Link)`
  text-align: right;
  color: var(--primary);
  font-size: var(--text-sm);
  text-decoration: none;
  font-weight: var(--font-medium);
  margin-top: -var(--space-sm);
  margin-bottom: var(--space-sm);
  transition: color var(--transition-fast);
  font-family: var(--font-body);

  &:hover {
    color: var(--primary-dark);
    text-decoration: underline;
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
