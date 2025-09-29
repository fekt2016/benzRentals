// src/components/ui/Buttons.jsx
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const Button = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ $size }) => {
    switch ($size) {
      case "sm":
        return "0.75rem 1.5rem";
      case "lg":
        return "1.25rem 2.5rem";
      default:
        return "1rem 2rem";
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-family: ${({ theme }) => theme.typography.fonts.accent};
  font-weight: ${({ theme }) =>
    theme.typography.fontWeights["Plus Jakarta Sans"].semibold};
  font-size: ${({ $size }) => {
    switch ($size) {
      case "sm":
        return "0.875rem";
      case "lg":
        return "1.125rem";
      default:
        return "1rem";
    }
  }};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  text-decoration: none;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover:not(:disabled) {
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

export const AccentButton = styled(Button)`
  background: ${({ theme }) => theme.gradients.accent};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: ${({ theme }) =>
    theme.typography.fontWeights["Plus Jakarta Sans"].bold};

  &:hover:not(:disabled) {
    box-shadow: ${({ theme }) => theme.shadows.gold};
  }
`;

export const GhostButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

// Link variant of buttons
export const ButtonLink = styled(PrimaryButton).attrs({ as: Link })``;
export const SecondaryButtonLink = styled(SecondaryButton).attrs({
  as: Link,
})``;
