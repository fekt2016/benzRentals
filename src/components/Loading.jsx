// src/components/ui/States.jsx
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

export const LoadingSpinner = styled.div`
  display: inline-block;
  width: ${({ size = "20px" }) => size};
  height: ${({ size = "20px" }) => size};
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gray[200]} 25%,
    ${({ theme }) => theme.colors.gray[300]} 50%,
    ${({ theme }) => theme.colors.gray[200]} 75%
  );
  background-size: 200% 100%;
  animation: ${pulse} 2s infinite;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  ${({ width = "100%" }) => `width: ${width};`}
  ${({ height = "1rem" }) => `height: ${height};`}
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  color: ${({ theme }) => theme.colors.text.muted};

  svg {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.5;
  }

  h3 {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const ErrorState = styled(EmptyState)`
  color: ${({ theme }) => theme.colors.status.error};

  svg {
    color: ${({ theme }) => theme.colors.status.error};
  }
`;
