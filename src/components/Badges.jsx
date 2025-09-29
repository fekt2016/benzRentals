// src/components/ui/Badges.jsx
import styled from "styled-components";

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-family: ${({ theme }) => theme.typography.fonts.body};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) =>
    theme.typography.fontWeights["Plus Jakarta Sans"].semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const StatusBadge = styled(Badge)`
  background: ${({ status, theme }) => {
    const colors = {
      available: theme.colors.status.success,
      rented: theme.colors.status.error,
      maintenance: theme.colors.status.warning,
      reserved: theme.colors.status.info,
    };
    return `${colors[status]}20`;
  }};
  color: ${({ status, theme }) => {
    const colors = {
      available: theme.colors.status.success,
      rented: theme.colors.status.error,
      maintenance: theme.colors.status.warning,
      reserved: theme.colors.status.info,
    };
    return colors[status];
  }};
  border: 1px solid
    ${({ status, theme }) => {
      const colors = {
        available: theme.colors.status.success,
        rented: theme.colors.status.error,
        maintenance: theme.colors.status.warning,
        reserved: theme.colors.status.info,
      };
      return `${colors[status]}40`;
    }};
`;

export const FeatureTag = styled(Badge)`
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  text-transform: none;
  letter-spacing: normal;
`;

export const PriceBadge = styled(Badge)`
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  text-transform: none;
  letter-spacing: normal;
`;
