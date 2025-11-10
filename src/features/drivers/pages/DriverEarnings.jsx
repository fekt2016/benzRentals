import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiDollarSign, FiTrendingUp, FiCheckCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { useDriverEarnings } from "../hooks/useDriverEarnings";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import ErrorState from "../../../components/feedback/ErrorState";
import { SecondaryButton } from "../../../components/ui/Button";
import { formatDate } from "../../../utils/helper";

const DriverEarnings = () => {
  const { earnings, isLoading, error, refetch } = useDriverEarnings();

  if (isLoading) {
    return (
      <LoadingState>
        <LoadingSpinner size="xl" />
        <LoadingText>Loading earnings...</LoadingText>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        icon={FiAlertCircle}
        title="Failed to Load Earnings"
        message={error.message || "Unable to fetch earnings data"}
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
    <EarningsContainer>
      <SectionHeader>
        <SectionTitle>Earnings Overview</SectionTitle>
        <RefreshButton onClick={refetch} $size="sm">
          <FiRefreshCw />
          Refresh
        </RefreshButton>
      </SectionHeader>

      <EarningsGrid>
        <EarningsCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EarningsIcon $color="var(--success)">
            <FiDollarSign />
          </EarningsIcon>
          <EarningsContent>
            <EarningsValue>${earnings.totalEarnings.toFixed(2)}</EarningsValue>
            <EarningsLabel>Total Earnings</EarningsLabel>
          </EarningsContent>
        </EarningsCard>

        <EarningsCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EarningsIcon $color="var(--primary)">
            <FiCheckCircle />
          </EarningsIcon>
          <EarningsContent>
            <EarningsValue>{earnings.totalTrips}</EarningsValue>
            <EarningsLabel>Total Trips</EarningsLabel>
          </EarningsContent>
        </EarningsCard>

        <EarningsCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EarningsIcon $color="var(--warning)">
            <FiTrendingUp />
          </EarningsIcon>
          <EarningsContent>
            <EarningsValue>
              {earnings.totalTrips > 0
                ? `$${(earnings.totalEarnings / earnings.totalTrips).toFixed(2)}`
                : "$0.00"}
            </EarningsValue>
            <EarningsLabel>Average per Trip</EarningsLabel>
          </EarningsContent>
        </EarningsCard>
      </EarningsGrid>

      {earnings.monthlyEarnings && earnings.monthlyEarnings.length > 0 && (
        <MonthlyEarningsSection>
          <SectionSubtitle>Monthly Earnings</SectionSubtitle>
          <MonthlyList>
            {earnings.monthlyEarnings.map((month, index) => (
              <MonthlyItem
                key={month.month}
                as={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <MonthLabel>{month.month}</MonthLabel>
                <MonthAmount>${month.amount.toFixed(2)}</MonthAmount>
              </MonthlyItem>
            ))}
          </MonthlyList>
        </MonthlyEarningsSection>
      )}

      {earnings.recentEarnings && earnings.recentEarnings.length > 0 && (
        <RecentEarningsSection>
          <SectionSubtitle>Recent Earnings</SectionSubtitle>
          <RecentList>
            {earnings.recentEarnings.map((earning, index) => (
              <RecentItem
                key={earning._id || index}
                as={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
              >
                <RecentInfo>
                  <RecentDate>
                    {earning.completedAt
                      ? formatDate(earning.completedAt)
                      : earning.createdAt
                      ? formatDate(earning.createdAt)
                      : "N/A"}
                  </RecentDate>
                  <RecentAmount>${(earning.driverServiceFee || earning.totalPrice || 0).toFixed(2)}</RecentAmount>
                </RecentInfo>
              </RecentItem>
            ))}
          </RecentList>
        </RecentEarningsSection>
      )}
    </EarningsContainer>
  );
};

const EarningsContainer = styled.div`
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

const EarningsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
`;

const EarningsCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  transition: all var(--transition-normal);

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
`;

const EarningsIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  flex-shrink: 0;
`;

const EarningsContent = styled.div`
  flex: 1;
`;

const EarningsValue = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
`;

const EarningsLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
`;

const MonthlyEarningsSection = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  margin-bottom: var(--space-xl);
`;

const SectionSubtitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-lg) 0;
`;

const MonthlyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const MonthlyItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
`;

const MonthLabel = styled.span`
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
`;

const MonthAmount = styled.span`
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--success);
`;

const RecentEarningsSection = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
`;

const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const RecentItem = styled.div`
  padding: var(--space-md);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);

  &:hover {
    background: var(--gray-100);
  }
`;

const RecentInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecentDate = styled.span`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const RecentAmount = styled.span`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--success);
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

export default DriverEarnings;

