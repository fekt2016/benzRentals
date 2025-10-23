/* eslint-disable react/prop-types */
// src/components/OtpModal.jsx
import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useVerifyOtp, useResendOtp } from "../../hooks/useAuth";
import { PrimaryButton, SecondaryButton } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";

// Extract best error message utility (similar to LoginPage)
const extractBestErrorMessage = (error) => {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    const message = error.message.toLowerCase();

    // OTP specific errors
    if (message.includes("invalid otp") || message.includes("wrong otp")) {
      return "Invalid verification code. Please try again.";
    }
    if (message.includes("expired")) {
      return "Verification code has expired. Please request a new one.";
    }
    if (message.includes("too many attempts")) {
      return "Too many failed attempts. Please wait before trying again.";
    }

    // Network errors
    if (message.includes("network") || message.includes("internet")) {
      return "Please check your internet connection and try again.";
    }
    if (message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }

    return error.message;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (Array.isArray(error.errors)) {
    return error.errors[0]?.message || "Please check your input and try again.";
  }

  if (error.statusCode) {
    switch (error.statusCode) {
      case 400:
        return "Invalid request. Please check the code and try again.";
      case 401:
        return "Invalid verification code.";
      case 429:
        return "Too many attempts. Please wait a moment.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  return "An unexpected error occurred. Please try again.";
};

const OtpModal = ({ isOpen, onClose, phone, onSuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(180); // 3 minutes
  const [activeInput, setActiveInput] = useState(0);
  const [clear, setClear] = useState(false);
  const inputRefs = useRef([]);

  // Use hooks with error handling
  const {
    mutate: verifyOtp,
    isLoading: isVerifying,
    error: verifyError,
    reset: resetVerify,
  } = useVerifyOtp();

  const {
    mutate: resendOtp,
    isLoading: isResending,
    error: resendError,
    reset: resetResend,
  } = useResendOtp();

  // Get the current error
  const currentError = verifyError || resendError;
  const errorMessage = extractBestErrorMessage(currentError);

  // Reset timer and state when modal opens
  useEffect(() => {
    if (isOpen || clear) {
      setCountdown(180);
      setOtp(["", "", "", "", "", ""]);
      setActiveInput(0);
      resetVerify();
      resetResend();

      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 300);
    }
  }, [isOpen, clear, resetVerify, resetResend]);

  // Countdown effect
  useEffect(() => {
    if (!isOpen) return;

    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, countdown]);

  const handleResend = () => {
    resetResend();
    resendOtp({ phone });
    setCountdown(180);
    setClear(true);
    setTimeout(() => setClear(false), 100);
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join("");
    resetVerify();

    verifyOtp(
      { phone, otp: otpString },
      {
        onSuccess: (data) => {
          console.log("✅ OTP verified successfully:", data);
          onSuccess();
        },
      }
    );
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear errors when user starts typing
    if (currentError) {
      resetVerify();
      resetResend();
    }

    // Move to next input
    if (value && index < 5) {
      setActiveInput(index + 1);
      setTimeout(() => {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }, 10);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setActiveInput(index - 1);
        setTimeout(() => {
          if (inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
          }
        }, 10);
      }
      setOtp(newOtp);
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1);
      setTimeout(() => {
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      }, 10);
    } else if (e.key === "ArrowRight" && index < 5) {
      setActiveInput(index + 1);
      setTimeout(() => {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }, 10);
    } else if (e.key === "Delete") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);

    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split("").forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      setActiveInput(Math.min(pasteData.length, 5));
    }
  };

  const handleInputFocus = (index) => {
    setActiveInput(index);
    // Clear errors when user focuses on input
    if (currentError) {
      resetVerify();
      resetResend();
    }
  };

  if (!isOpen) return null;

  const isOtpComplete = otp.every((digit) => digit !== "");
  const isLoading = isVerifying || isResending;

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <LogoBox>
            <Logo src="/images/benzflex3.png" alt="benzflex logo" />
          </LogoBox>

          <Title>Verify Your Phone</Title>
          <Subtitle>
            Enter the 6-digit code sent to <PhoneNumber>{phone}</PhoneNumber>
          </Subtitle>

          {errorMessage && (
            <ErrorMessage>
              <ErrorIcon>⚠️</ErrorIcon>
              {errorMessage}
            </ErrorMessage>
          )}

          <OtpContainer>
            {otp.map((digit, index) => (
              <OtpInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => handleInputFocus(index)}
                onPaste={index === 0 ? handlePaste : undefined}
                $active={activeInput === index}
                $filled={digit !== ""}
                $error={!!currentError}
                disabled={isLoading}
                autoComplete="one-time-code"
              />
            ))}
          </OtpContainer>

          <TimerContainer>
            <Timer $expired={countdown === 0}>
              <ClockIcon>⏱️</ClockIcon>
              {countdown > 0 ? (
                <>Code expires in {formatTime(countdown)}</>
              ) : (
                "Code expired"
              )}
            </Timer>
          </TimerContainer>

          <ResendButton
            onClick={handleResend}
            disabled={countdown > 0 || isLoading}
            $disabled={countdown > 0 || isLoading}
          >
            {isResending ? (
              <>
                <LoadingSpinner size="sm" />
                Resending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${formatTime(countdown)}`
            ) : (
              "Resend Code"
            )}
          </ResendButton>

          <Actions>
            <SecondaryButton onClick={onClose} disabled={isLoading} $size="md">
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={handleVerifyOtp}
              disabled={!isOtpComplete || isLoading}
              $size="md"
            >
              {isVerifying ? (
                <>
                  <LoadingSpinner size="sm" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )}
            </PrimaryButton>
          </Actions>
        </ModalContent>
      </ModalContainer>
    </Overlay>
  );
};

export default OtpModal;

// Animations using global variables
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components using Global CSS Variables
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: var(--space-md);
  animation: ${fadeIn} var(--transition-normal) ease-out;
`;

const ModalContainer = styled.div`
  background: var(--white);
  padding: 0;
  border-radius: var(--radius-3xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 440px;
  animation: ${slideUp} var(--transition-normal) ease-out;
  overflow: hidden;
  border: 1px solid var(--gray-200);
`;

const ModalContent = styled.div`
  padding: var(--space-2xl) var(--space-xl) var(--space-xl);
  text-align: center;
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-xl);
`;

const Logo = styled.img`
  height: 80px;
  width: auto;
`;

const Title = styled.h2`
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  font-family: var(--font-heading);
`;

const Subtitle = styled.p`
  margin-bottom: var(--space-xl);
  color: var(--text-secondary);
  font-size: var(--text-base);
  line-height: 1.6;
  font-family: var(--font-body);
`;

const PhoneNumber = styled.span`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  background: var(--gray-100);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
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
  justify-content: center;
  gap: var(--space-sm);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  animation: ${slideUp} var(--transition-fast) ease-out;
  font-family: var(--font-body);
`;

const ErrorIcon = styled.span`
  font-size: 1rem;
`;

const OtpContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
`;

const OtpInput = styled.input`
  width: 50px;
  height: 60px;
  border: 2px solid;
  border-color: ${(props) => {
    if (props.$error) return "var(--error)";
    if (props.$active) return "var(--primary)";
    if (props.$filled) return "var(--success)";
    return "var(--gray-300)";
  }};
  border-radius: var(--radius-lg);
  text-align: center;
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  background: ${(props) =>
    props.$filled ? "var(--success-light)" : "var(--white)"};
  transition: all var(--transition-normal);
  outline: none;
  font-family: var(--font-body);

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
    transform: translateY(-2px);
  }

  ${(props) =>
    props.$active &&
    `
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
    transform: translateY(-2px);
  `}

  &:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::selection {
    background: transparent;
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 55px;
    font-size: var(--text-lg);
  }
`;

const TimerContainer = styled.div`
  margin-bottom: var(--space-lg);
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: ${(props) => (props.$expired ? "var(--error)" : "var(--primary)")};
  transition: color var(--transition-normal);
  font-family: var(--font-body);
`;

const ClockIcon = styled.span`
  font-size: 1rem;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  font-weight: var(--font-semibold);
  color: ${(props) =>
    props.$disabled ? "var(--text-light)" : "var(--primary)"};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  font-size: var(--text-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin: 0 auto;
  font-family: var(--font-body);

  &:not(:disabled):hover {
    background: var(--gray-100);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--gray-200);
`;
