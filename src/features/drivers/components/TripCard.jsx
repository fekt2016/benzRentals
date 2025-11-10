import React from "react";
import styled from "styled-components";
import { FiMapPin, FiCalendar, FiClock, FiDollarSign, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { formatDate } from "../../../utils/helper";

const TripCard = ({ trip }) => {
  const getStatusConfig = () => {
    switch (trip.status) {
      case "completed":
        return {
          icon: FiCheckCircle,
          color: "var(--success)",
          bg: "var(--success-light)",
          label: "Completed",
        };
      case "cancelled":
        return {
          icon: FiXCircle,
          color: "var(--error)",
          bg: "var(--error-light)",
          label: "Cancelled",
        };
      case "in_progress":
        return {
          icon: FiClock,
          color: "var(--primary)",
          bg: "var(--primary-light)",
          label: "In Progress",
        };
      default:
        return {
          icon: FiClock,
          color: "var(--warning)",
          bg: "var(--warning-light)",
          label: trip.status || "Pending",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Card>
      <CardHeader>
        <TripInfo>
          <CarName>{trip.car?.name || trip.car?.model || "Car Rental"}</CarName>
          <CustomerName>{trip.user?.fullName || "Customer"}</CustomerName>
        </TripInfo>
        <StatusBadge $color={statusConfig.color} $bg={statusConfig.bg}>
          <StatusIcon />
          {statusConfig.label}
        </StatusBadge>
      </CardHeader>

      <DetailsList>
        <DetailItem>
          <DetailIcon>
            <FiMapPin />
          </DetailIcon>
          <DetailText>{trip.pickupLocation || "Location not specified"}</DetailText>
        </DetailItem>

        <DetailItem>
          <DetailIcon>
            <FiCalendar />
          </DetailIcon>
          <DetailText>
            {trip.pickupDate
              ? formatDate(trip.pickupDate)
              : "Date not specified"}
          </DetailText>
        </DetailItem>

        {trip.pickupTime && (
          <DetailItem>
            <DetailIcon>
              <FiClock />
            </DetailIcon>
            <DetailText>{trip.pickupTime}</DetailText>
          </DetailItem>
        )}
      </DetailsList>

      <EarningsSection>
        <EarningsLabel>Earnings</EarningsLabel>
        <EarningsAmount>
          <FiDollarSign />
          ${trip.driverServiceFee?.toFixed(2) || trip.totalPrice?.toFixed(2) || "0.00"}
        </EarningsAmount>
      </EarningsSection>
    </Card>
  );
};

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
  padding: var(--space-lg);
  transition: all var(--transition-normal);

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
  gap: var(--space-md);
`;

const TripInfo = styled.div`
  flex: 1;
`;

const CarName = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
`;

const CustomerName = styled.p`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-full);
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  white-space: nowrap;
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--gray-200);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const DetailIcon = styled.div`
  color: var(--primary);
  font-size: var(--text-base);
  flex-shrink: 0;
`;

const DetailText = styled.span`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const EarningsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-md);
`;

const EarningsLabel = styled.span`
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
`;

const EarningsAmount = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--success);
`;

export default TripCard;

