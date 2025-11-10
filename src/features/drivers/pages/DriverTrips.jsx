import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import TripCard from "../components/TripCard";
import { useDriverBookings } from "../hooks/useDriverBookings";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import ErrorState from "../../../components/feedback/ErrorState";
import { SecondaryButton } from "../../../components/ui/Button";

const DriverTrips = () => {
  const { bookings, isLoading, error, refetch } = useDriverBookings();

  if (isLoading) {
    return (
      <LoadingState>
        <LoadingSpinner size="xl" />
        <LoadingText>Loading your trips...</LoadingText>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        icon={FiAlertCircle}
        title="Failed to Load Trips"
        message={error.message || "Unable to fetch your trips"}
        actions={[
          {
            text: "Retry",
            onClick: refetch,
            icon: FiRefreshCw,
            variant: "primary",
          },
        ]}
      />
    );
  }

  return (
    <TripsContainer>
      <SectionHeader>
        <SectionTitle>My Trips</SectionTitle>
        <RefreshButton onClick={refetch} $size="sm">
          <FiRefreshCw />
          Refresh
        </RefreshButton>
      </SectionHeader>

      {bookings.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FiAlertCircle />
          </EmptyIcon>
          <EmptyTitle>No Trips Yet</EmptyTitle>
          <EmptyText>
            You haven't accepted any ride requests yet. Check the "Active Requests" tab to find available rides.
          </EmptyText>
        </EmptyState>
      ) : (
        <TripsGrid>
          {bookings.map((trip, index) => (
            <TripCard
              key={trip._id}
              trip={trip}
            />
          ))}
        </TripsGrid>
      )}
    </TripsContainer>
  );
};

const TripsContainer = styled.div`
  width: 100%;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const RefreshButton = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const TripsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-4xl);
  text-align: center;
  background: var(--white);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--gray-300);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: var(--gray-400);
  margin-bottom: var(--space-lg);
`;

const EmptyTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
`;

const EmptyText = styled.p`
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0;
  max-width: 400px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: var(--space-lg);
`;

const LoadingText = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin: 0;
`;

export default DriverTrips;

