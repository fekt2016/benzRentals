// src/components/OtpModal.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import OtpInput from "../OtpInput";
import Button from "../Button";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const OtpModal = ({ isOpen, onClose, phone }) => {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30);
  const { useVerifyOtp } = useAuth();
  const { mutate: verifyOtp } = useVerifyOtp();
  const navigate = useNavigate();
  // Reset timer every time modal is opened
  useEffect(() => {
    if (isOpen) {
      setCountdown(30);
      setOtp("");
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
    const payLoad = {
      phone,
      otp,
    };

    verifyOtp(payLoad, {
      onSuccess: (data) => {
        console.log("OTP verified successfully:", data);
        onClose();
        navigate("/");
      },
      onError: (error) => {
        console.error("Error verifying OTP:", error);
      },
    });
    // TODO: hook up to verifyOtp API
  };

  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        <Title>Verify Your Phone</Title>
        <Subtitle>Enter the 6-digit code sent to {phone}</Subtitle>

        <OtpInput value={otp} onChange={setOtp} length={6} />

        <TimerText>
          {countdown > 0
            ? `You can resend in ${countdown}s`
            : "Didn't get the code?"}
        </TimerText>

        <Button variant="link" onClick={handleResend} disabled={countdown > 0}>
          Resend Code
        </Button>

        <Actions>
          <Button onClick={onClose} variant="secondary" size="small">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="small"
            disabled={otp.length < 6}
            onClick={() => handleVerifyOtp()}
          >
            Verify
          </Button>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default OtpModal;

// ---- Styled Components ---- //
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary || theme.colors.text};
`;

const TimerText = styled.p`
  margin-top: 0.5rem;
  font-size: 1.4rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary || "#333"};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 1rem;
`;

const ResendButton = styled.button`
  margin-top: 0.75rem;
  background: none;
  border: none;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:disabled {
    color: ${({ theme }) => theme.colors.textMuted || "#999"};
    cursor: not-allowed;
  }
`;
