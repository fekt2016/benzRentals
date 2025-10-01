// src/components/OtpModal.jsx
import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useVerifyOtp } from "../../hooks/useAuth";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";

const OtpModal = ({ isOpen, onClose, phone }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef([]);
  const verifyOtpMutation = useVerifyOtp();

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Reset timer every time modal is opened
  useEffect(() => {
    if (isOpen) {
      setCountdown(30);
      setOtp(["", "", "", "", "", ""]);
      setActiveInput(0);
      // Focus first input when modal opens
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 300);
    }
  }, [isOpen]);

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
    // TODO: hook up to resendOtp API
    setCountdown(30);
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join("");
    const payLoad = {
      phone,
      otp: otpString,
    };
    verifyOtpMutation.mutate(payLoad);
  };

  const handleChange = (index, value) => {
    // Allow only numbers
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
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
        // If current input has value, clear it
        newOtp[index] = "";
      } else if (index > 0) {
        // If current input is empty, move to previous and clear it
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

  if (!isOpen) return null;

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <Overlay onClick={onClose}>
      <ModalContainer
        onClick={(e) => e.stopPropagation()}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <ModalContent>
          <AnimatedIcon>🔐</AnimatedIcon>

          <Title>Verify Your Phone</Title>
          <Subtitle>
            Enter the 6-digit code sent to <PhoneNumber>{phone}</PhoneNumber>
          </Subtitle>

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
                onFocus={() => setActiveInput(index)}
                onPaste={index === 0 ? handlePaste : undefined}
                $active={activeInput === index}
                $filled={digit !== ""}
                autoComplete="one-time-code"
              />
            ))}
          </OtpContainer>

          <TimerContainer>
            <Timer $expired={countdown === 0}>
              {countdown > 0 ? (
                <>
                  <ClockIcon>⏱️</ClockIcon>
                  Code expires in {countdown}s
                </>
              ) : (
                "Code expired"
              )}
            </Timer>
          </TimerContainer>

          <ResendButton
            onClick={handleResend}
            disabled={countdown > 0}
            $disabled={countdown > 0}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
          </ResendButton>

          <Actions>
            <SecondaryButton
              $size="sm"
              onClick={onClose}
              style={{ minWidth: "100px" }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              $size="sm"
              disabled={!isOtpComplete || verifyOtpMutation.isPending}
              onClick={handleVerifyOtp}
              style={{ minWidth: "100px" }}
              $pulse={isOtpComplete && !verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? <LoadingSpinner /> : "Verify"}
            </PrimaryButton>
          </Actions>
        </ModalContent>
      </ModalContainer>
    </Overlay>
  );
};

export default OtpModal;

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
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

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-10px);
  }
  70% {
    transform: translateY(-5px);
  }
  90% {
    transform: translateY(-2px);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContainer = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 0;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1);
  width: 100%;
  max-width: 440px;
  animation: ${slideUp} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
`;

const ModalContent = styled.div`
  padding: 3rem 2rem 2rem;
  text-align: center;
`;

const AnimatedIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  animation: ${bounce} 1s ease infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const Title = styled.h2`
  margin-bottom: 0.75rem;
  color: #1e293b;
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  margin-bottom: 2rem;
  color: #64748b;
  font-size: 1rem;
  line-height: 1.5;
`;

const PhoneNumber = styled.span`
  font-weight: 600;
  color: #1e293b;
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-family: "Courier New", monospace;
`;

const OtpContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const OtpInput = styled.input`
  width: 50px;
  height: 60px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  ${(props) =>
    props.$active &&
    `
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  `}

  ${(props) =>
    props.$filled &&
    `
    border-color: #10b981;
    background: #f0fdf4;
  `}

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }

  &::selection {
    background: transparent;
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 55px;
    font-size: 1.25rem;
  }
`;

const TimerContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) => (props.$expired ? "#ef4444" : "#3b82f6")};
  transition: color 0.3s ease;
`;

const ClockIcon = styled.span`
  font-size: 1rem;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  font-weight: 600;
  color: ${(props) => (props.$disabled ? "#94a3b8" : "#3b82f6")};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:not(:disabled):hover {
    background: #f1f5f9;
    transform: translateY(-1px);
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f1f5f9;
`;

// Enhanced PrimaryButton with pulse animation
const PulsePrimaryButton = styled(PrimaryButton)`
  ${(props) =>
    props.$pulse &&
    `
    animation: ${pulse} 2s infinite;
  `}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;
  margin: 0 auto;
`;
