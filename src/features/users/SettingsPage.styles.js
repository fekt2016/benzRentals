import styled from "styled-components";
import { devices } from "../../styles/GlobalStyles";

export const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media ${devices.sm} {
    padding: 1rem 0.5rem;
  }
`;

export const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text || "#1f2937"};
    margin: 0;
  }
`;

export const SettingsSection = styled.section`
  background: ${({ theme }) => theme.colors.background || "#ffffff"};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border || "#e5e7eb"};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text || "#1f2937"};
    margin: 0;
  }
`;

export const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || "#e5e7eb"};

  &:last-child {
    border-bottom: none;
  }

  @media ${devices.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

export const SettingLabel = styled.div`
  flex: 1;

  h3 {
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text || "#1f2937"};
    margin: 0 0 0.25rem 0;
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textMuted || "#6b7280"};
    margin: 0;
  }
`;

export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + span {
      background-color: ${({ theme }) => theme.colors.primary || "#3b82f6"};
    }

    &:checked + span:before {
      transform: translateX(24px);
    }

    &:focus + span {
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight || "rgba(59, 130, 246, 0.1)"};
    }

    &:disabled + span {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.border || "#ccc"};
    transition: 0.3s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }
`;

export const DangerZone = styled(SettingsSection)`
  border: 2px solid ${({ theme }) => theme.colors.error || "#ef4444"};
  background: ${({ theme }) => theme.colors.errorLight || "#fef2f2"};
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;

  @media ${devices.sm} {
    flex-direction: column;
  }
`;

export const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.errorLight || "#fef2f2"};
  color: ${({ theme }) => theme.colors.error || "#ef4444"};
  border: 1px solid ${({ theme }) => theme.colors.error || "#ef4444"};
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;

  svg {
    flex-shrink: 0;
  }
`;

export const UnsavedBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.warningLight || "#fef3c7"};
  color: ${({ theme }) => theme.colors.warning || "#f59e0b"};
  border: 1px solid ${({ theme }) => theme.colors.warning || "#f59e0b"};
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;

  @media ${devices.sm} {
    flex-direction: column;
    align-items: stretch;
  }
`;

