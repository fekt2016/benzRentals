import React from "react";
import styled from "styled-components";
import { FiRadio, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const DriverStatusToggle = ({ status, onToggle, isLoading = false }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "available":
        return {
          label: "Available",
          icon: FiCheckCircle,
          color: "var(--success)",
          bg: "var(--success-light)",
        };
      case "busy":
        return {
          label: "Busy",
          icon: FiRadio,
          color: "var(--warning)",
          bg: "var(--warning-light)",
        };
      case "offline":
      case "pending":
      default:
        return {
          label: "Unavailable",
          icon: FiXCircle,
          color: "var(--gray-500)",
          bg: "var(--gray-100)",
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <StatusToggleContainer>
      <StatusLabel>Driver Status</StatusLabel>
      <StatusButton
        $status={status}
        onClick={() => {
          if (isLoading) return;
          // Simple toggle: available <-> offline (unavailable)
          // If currently available or busy, switch to offline
          // If currently offline, switch to available
          const nextStatus = 
            status === "available" || status === "busy" || status === "active"
              ? "offline"
              : "available";
          onToggle(nextStatus);
        }}
        disabled={isLoading}
        as={motion.button}
        whileHover={!isLoading ? { scale: 1.05 } : {}}
        whileTap={!isLoading ? { scale: 0.95 } : {}}
      >
        <StatusIcon $color={config.color}>
          <IconComponent />
        </StatusIcon>
        <StatusText>{config.label}</StatusText>
        {isLoading && <LoadingSpinner />}
      </StatusButton>
    </StatusToggleContainer>
  );
};

const StatusToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const StatusLabel = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
`;

const StatusButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  border: 2px solid
    ${(props) => {
      switch (props.$status) {
        case "available":
          return "var(--success)";
        case "busy":
          return "var(--warning)";
        default:
          return "var(--gray-300)";
      }
    }};
  background: ${(props) => {
    switch (props.$status) {
      case "available":
        return "var(--success-light)";
      case "busy":
        return "var(--warning-light)";
      default:
        return "var(--white)";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "available":
        return "var(--success-dark)";
      case "busy":
        return "var(--warning-dark)";
      default:
        return "var(--text-secondary)";
    }
  }};
  font-weight: var(--font-semibold);
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-normal);
  position: relative;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const StatusIcon = styled.div`
  font-size: var(--text-xl);
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
`;

const StatusText = styled.span`
  font-size: var(--text-base);
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-left: auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default DriverStatusToggle;

