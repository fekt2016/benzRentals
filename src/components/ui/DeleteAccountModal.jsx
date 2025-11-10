import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FiAlertTriangle, FiX, FiTrash2 } from "react-icons/fi";
import ModalWrapper from "./Modal";
import { PrimaryButton, SecondaryButton } from "./Button";
import { LoadingSpinner } from "./LoadingSpinner";
import { devices } from "../../styles/GlobalStyles";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, isDeleting = false }) => {
  const [confirmText, setConfirmText] = useState("");
  const inputRef = useRef(null);
  const isConfirmed = confirmText === "DELETE";

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setConfirmText("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (isConfirmed && !isDeleting) {
      onConfirm();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isConfirmed && !isDeleting) {
      handleConfirm();
    }
  };

  return (
    <ModalWrapper show={isOpen} onClose={onClose} animation="fade">
      <ModalContainer>
        <ModalHeader>
          <IconContainer>
            <FiAlertTriangle />
          </IconContainer>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Title>Delete Account</Title>
          <WarningMessage>
            This action cannot be undone. This will permanently delete your account
            and remove all associated data including:
          </WarningMessage>
          <WarningList>
            <li>All booking history</li>
            <li>Payment methods</li>
            <li>Profile information</li>
            <li>Reviews and ratings</li>
            <li>Notification preferences</li>
          </WarningList>

          <ConfirmationSection>
            <ConfirmationLabel>
              To confirm, type <strong>DELETE</strong> in the box below:
            </ConfirmationLabel>
            <ConfirmationInput
              ref={inputRef}
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type DELETE to confirm"
              disabled={isDeleting}
              aria-label="Type DELETE to confirm account deletion"
              aria-invalid={confirmText && !isConfirmed}
            />
            {confirmText && !isConfirmed && (
              <ErrorText>Text must match "DELETE" exactly</ErrorText>
            )}
          </ConfirmationSection>
        </ModalBody>

        <ModalFooter>
          <SecondaryButton onClick={onClose} disabled={isDeleting} aria-label="Cancel deletion">
            Cancel
          </SecondaryButton>
          <DangerButton
            onClick={handleConfirm}
            disabled={!isConfirmed || isDeleting}
            aria-label="Confirm account deletion"
          >
            {isDeleting ? (
              <>
                <LoadingSpinner size="sm" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 />
                Delete Account
              </>
            )}
          </DangerButton>
        </ModalFooter>
      </ModalContainer>
    </ModalWrapper>
  );
};

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.errorLight || "#fef2f2"};
  color: ${({ theme }) => theme.colors.error || "#ef4444"};
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundLight || "#f9fafb"};
    color: ${({ theme }) => theme.colors.text || "#1f2937"};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary || "#3b82f6"};
    outline-offset: 2px;
  }
`;

const ModalBody = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text || "#1f2937"};
  margin: 0 0 1rem 0;
`;

const WarningMessage = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text || "#1f2937"};
  margin: 0 0 1rem 0;
  line-height: 1.6;
`;

const WarningList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  background: ${({ theme }) => theme.colors.backgroundLight || "#f9fafb"};
  border-radius: 8px;
  padding: 1rem;

  li {
    padding: 0.5rem 0;
    color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
    font-size: 0.875rem;
    position: relative;
    padding-left: 1.5rem;

    &:before {
      content: "•";
      position: absolute;
      left: 0;
      color: ${({ theme }) => theme.colors.error || "#ef4444"};
      font-weight: bold;
    }
  }
`;

const ConfirmationSection = styled.div`
  margin-top: 2rem;
`;

const ConfirmationLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text || "#1f2937"};
  margin-bottom: 0.75rem;

  strong {
    color: ${({ theme }) => theme.colors.error || "#ef4444"};
  }
`;

const ConfirmationInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid
    ${({ theme, "aria-invalid": invalid }) =>
      invalid ? theme.colors.error || "#ef4444" : theme.colors.border || "#e5e7eb"};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary || "#3b82f6"};
    box-shadow: 0 0 0 3px
      ${({ theme }) => theme.colors.primaryLight || "rgba(59, 130, 246, 0.1)"};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.backgroundLight || "#f9fafb"};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted || "#9ca3af"};
  }
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.error || "#ef4444"};
  margin: 0.5rem 0 0 0;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border || "#e5e7eb"};

  @media ${devices.sm} {
    flex-direction: column-reverse;
  }
`;

const DangerButton = styled(PrimaryButton)`
  background: ${({ theme }) => theme.colors.error || "#ef4444"};
  border-color: ${({ theme }) => theme.colors.error || "#ef4444"};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.errorDark || "#dc2626"};
    border-color: ${({ theme }) => theme.colors.errorDark || "#dc2626"};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default DeleteAccountModal;

