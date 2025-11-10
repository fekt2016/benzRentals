import React from "react";
import styled from "styled-components";
import { FiInbox, FiSearch, FiCalendar, FiTruck, FiBookmark } from "react-icons/fi";
import { PrimaryButton, SecondaryButton } from "../ui/Button";
import { devices } from "../../styles/GlobalStyles";

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  min-height: 400px;

  @media ${devices.sm} {
    padding: 2rem 1rem;
    min-height: 300px;
  }
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.textMuted || "#9ca3af"};
  margin-bottom: 1.5rem;
  opacity: 0.6;

  @media ${devices.sm} {
    font-size: 3rem;
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text || "#1f2937"};
  margin: 0 0 0.75rem 0;

  @media ${devices.sm} {
    font-size: 1.25rem;
  }
`;

const EmptyStateMessage = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
  margin: 0 0 2rem 0;
  max-width: 500px;
  line-height: 1.6;
`;

const EmptyStateActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media ${devices.sm} {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

const iconMap = {
  default: FiInbox,
  search: FiSearch,
  booking: FiCalendar,
  car: FiTruck,
  favorite: FiBookmark,
};

const EmptyState = ({
  icon = "default",
  title = "Nothing here yet",
  message = "There's nothing to display at the moment.",
  primaryAction,
  secondaryAction,
  iconComponent,
}) => {
  const IconComponent = iconComponent || iconMap[icon] || iconMap.default;

  return (
    <EmptyStateContainer>
      <EmptyStateIcon>
        <IconComponent />
      </EmptyStateIcon>
      <EmptyStateTitle>{title}</EmptyStateTitle>
      <EmptyStateMessage>{message}</EmptyStateMessage>
      {(primaryAction || secondaryAction) && (
        <EmptyStateActions>
          {primaryAction && (
            <PrimaryButton
              onClick={primaryAction.onClick}
              aria-label={primaryAction.label || "Primary action"}
            >
              {primaryAction.label}
            </PrimaryButton>
          )}
          {secondaryAction && (
            <SecondaryButton
              onClick={secondaryAction.onClick}
              aria-label={secondaryAction.label || "Secondary action"}
            >
              {secondaryAction.label}
            </SecondaryButton>
          )}
        </EmptyStateActions>
      )}
    </EmptyStateContainer>
  );
};

export default EmptyState;

