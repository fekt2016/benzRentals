// src/components/Button.jsx
import React from "react";
import styled, { css } from "styled-components";

const Button = ({
  children,
  onClick,
  type = "button",
  disabled,
  variant = "primary",
  size = "auto", // width: "auto" | "full" | "small" | "medium"
  height = "medium", // height: "small" | "medium" | "large" | "auto"
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      $variant={variant}
      $size={size}
      $height={height}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button`
  padding: 0.875rem 1.25rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md || "8px"};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  /* ----- width / size variations ----- */
  ${({ $size }) =>
    $size === "full" &&
    css`
      width: 100%;
    `}
  ${({ $size }) =>
    $size === "small" &&
    css`
      width: 120px;
    `}
  ${({ $size }) =>
    $size === "medium" &&
    css`
      width: 200px;
    `}
  ${({ $size }) =>
    $size === "auto" &&
    css`
      width: auto;
    `}

  /* ----- height variations ----- */
  ${({ $height }) =>
    $height === "small" &&
    css`
      height: 36px;
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
    `}
  ${({ $height }) =>
    $height === "medium" &&
    css`
      height: 48px;
    `}
  ${({ $height }) =>
    $height === "large" &&
    css`
      height: 56px;
      font-size: 1.1rem;
      padding: 1rem 1.5rem;
    `}
  ${({ $height }) =>
    $height === "auto" &&
    css`
      height: auto;
    `}

  /* ----- variant styles ----- */
  ${({ $variant, theme }) =>
    $variant === "primary" &&
    css`
      background: ${theme.colors.primary};
      color: ${theme.colors.onPrimary};

      &:hover:not(:disabled) {
        background: ${theme.colors.primaryHover};
      }
    `}

  ${({ $variant, theme }) =>
    $variant === "secondary" &&
    css`
      background: ${theme.colors.surface};
      color: ${theme.colors.text};
      border: 1px solid ${theme.colors.border};

      &:hover:not(:disabled) {
        background: ${theme.colors.surfaceHover};
      }
    `}

  ${({ $variant, theme }) =>
    $variant === "link" &&
    css`
      background: none;
      border: none;
      padding: 0;
      height: auto;
      font-size: 0.9rem;
      color: ${theme.colors.primary};
      font-weight: 600;

      &:hover:not(:disabled) {
        text-decoration: underline;
      }

      &:disabled {
        color: ${theme.colors.textMuted || "#999"};
        cursor: not-allowed;
        text-decoration: none;
      }
    `}

  /* ----- disabled style fallback ----- */
  ${({ disabled, theme }) =>
    disabled &&
    css`
      background: ${theme.colors.disabledBg};
      color: ${theme.colors.textMuted};
      cursor: not-allowed;
    `}
`;
