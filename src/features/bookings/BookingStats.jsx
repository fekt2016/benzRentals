/* eslint-disable react/prop-types */
// src/components/bookings/BookingStats.jsx
import React from "react";
import styled from "styled-components";
import { devices } from "../../styles/GlobalStyles";

const BookingStats = ({ stats = {} }) => {
  const statItems = [
    { label: "Total", value: stats.total ?? 0 },
    { label: "Confirmed", value: stats.confirmed ?? 0 },
    { label: "Pending", value: stats.pending ?? 0 },
    { label: "Cancelled", value: stats.cancelled ?? 0 },
  ];

  return (
    <StatsWrapper>
      {statItems.map((item) => (
        <StatCard key={item.label} className="luxury-card">
          <StatValue>{item.value}</StatValue>
          <StatLabel>{item.label}</StatLabel>
        </StatCard>
      ))}
    </StatsWrapper>
  );
};

export default BookingStats;

/* ---------- Styled (using GlobalStyles tokens) ---------- */

const StatsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
  width: 100%;

  @media ${devices.lg} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media ${devices.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media ${devices.xs1} {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
    margin-bottom: var(--space-xl);
  }
`;

const StatCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-xl);
  text-align: center;
  border: 1px solid var(--gray-200);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  will-change: transform;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const StatValue = styled.h3`
  margin: 0;
  font-family: var(--font-heading);
  font-weight: var(--font-bold);
  font-size: var(--text-3xl);
  color: var(--primary);
  line-height: 1;

  @media ${devices.xs1} {
    font-size: var(--text-2xl);
  }
`;

const StatLabel = styled.p`
  margin: var(--space-xs) 0 0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  letter-spacing: 0.2px;
`;
