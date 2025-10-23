/* eslint-disable react/prop-types */
// src/components/bookings/BookingStats.jsx
import React from "react";
import styled from "styled-components";

const BookingStats = ({ stats }) => {
  const statItems = [
    { label: "Total", value: stats.total || 0 },
    { label: "Confirmed", value: stats.confirmed || 0 },
    { label: "Pending", value: stats.pending || 0 },
    { label: "Cancelled", value: stats.cancelled || 0 },
  ];

  return (
    <StatsWrapper>
      {statItems.map((item) => (
        <StatCard key={item.label}>
          <h3>{item.value}</h3>
          <p>{item.label}</p>
        </StatCard>
      ))}
    </StatsWrapper>
  );
};

export default BookingStats;

/* ---------- Styled ---------- */
const StatsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: ${({ theme }) => theme.shadows.card};
  text-align: center;

  h3 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.8rem;
    margin: 0;
  }

  p {
    margin: 0.3rem 0 0;
    font-weight: 500;
    color: #555;
  }
`;
