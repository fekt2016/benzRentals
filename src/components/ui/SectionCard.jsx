import styled from "styled-components";
import { devices } from "../../styles/GlobalStyles";

export const SectionCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  overflow: hidden;
  margin-bottom: var(--space-lg);

  &:last-child {
    margin-bottom: 0;
  }

  @media ${devices.sm} {
    border-radius: var(--radius-xl);
    margin-bottom: var(--space-md);
  }
`;


export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--gray-200);

  @media ${devices.sm} {
    flex-direction: column;
    gap: var(--space-md);
    align-items: stretch;
    padding: var(--space-lg);
  }
`;
export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-xl);
    gap: var(--space-sm);
  }
`;
export const SectionContent = styled.div`
  padding: var(--space-xl);

  @media ${devices.sm} {
    padding: var(--space-lg);
  }
`;