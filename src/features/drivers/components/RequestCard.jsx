import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiCheck,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { formatDate } from "../../../utils/helper";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/Button";

const RequestCard = ({ request, onAccept, onDecline, isAccepting = false }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Check if request is expired (5 minutes)
  const isExpired = () => {
    if (!request.requestedAt) return false;
    const now = new Date();
    const requestAge = now - new Date(request.requestedAt);
    return requestAge >= 5 * 60 * 1000; // 5 minutes
  };

  const expired = isExpired();

  const handleAccept = () => {
    if (showConfirm) {
      onAccept(request.bookingId);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  const handleDecline = () => {
    setShowConfirm(false);
    if (onDecline) {
      const requestId = request.bookingId || request._id;
      console.log("[RequestCard] Declining request:", requestId);
      onDecline(requestId);
    }
  };

  if (expired) {
    return (
      <ExpiredCard>
        <ExpiredIcon>
          <FiAlertCircle />
        </ExpiredIcon>
        <ExpiredText>This request has expired</ExpiredText>
      </ExpiredCard>
    );
  }

  return (
    <Card
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      $expired={expired}
    >
      {request.car?.images?.[0] && (
        <CarImage src={request.car.images[0]} alt={request.car.model} />
      )}
      
      <CardContent>
        <CardHeader>
          <CarName>{request.car?.name || request.car?.model || "Car Rental"}</CarName>
          <Price>${request.totalPrice?.toFixed(2) || "0.00"}</Price>
        </CardHeader>

        <DetailsList>
          <DetailItem>
            <DetailIcon>
              <FiMapPin />
            </DetailIcon>
            <DetailText>{request.pickupLocation || "Location not specified"}</DetailText>
          </DetailItem>

          <DetailItem>
            <DetailIcon>
              <FiCalendar />
            </DetailIcon>
            <DetailText>
              {request.pickupDate
                ? formatDate(request.pickupDate)
                : "Date not specified"}
            </DetailText>
          </DetailItem>

          {request.pickupTime && (
            <DetailItem>
              <DetailIcon>
                <FiClock />
              </DetailIcon>
              <DetailText>{request.pickupTime}</DetailText>
            </DetailItem>
          )}

          <DetailItem>
            <DetailIcon>
              <FiDollarSign />
            </DetailIcon>
            <DetailText>
              Service Fee: ${request.driverServiceFee?.toFixed(2) || "0.00"}
            </DetailText>
          </DetailItem>
        </DetailsList>

        {showConfirm ? (
          <ConfirmActions>
            <ConfirmText>Accept this request?</ConfirmText>
            <ActionButtons>
              <ConfirmButton
                onClick={handleAccept}
                disabled={isAccepting}
                $variant="success"
              >
                <FiCheck />
                Yes, Accept
              </ConfirmButton>
              <CancelButton onClick={handleDecline} disabled={isAccepting}>
                <FiX />
                Cancel
              </CancelButton>
            </ActionButtons>
          </ConfirmActions>
        ) : (
          <ActionButtons>
            <AcceptButton
              onClick={handleAccept}
              disabled={isAccepting || expired}
              $loading={isAccepting}
            >
              {isAccepting ? (
                <>
                  <LoadingSpinner />
                  Accepting...
                </>
              ) : (
                <>
                  <FiCheck />
                  Accept Request
                </>
              )}
            </AcceptButton>
            {onDecline && (
              <DeclineButton onClick={handleDecline} disabled={isAccepting}>
                <FiX />
                Decline
              </DeclineButton>
            )}
          </ActionButtons>
        )}
      </CardContent>
    </Card>
  );
};

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 2px solid
    ${(props) => (props.$expired ? "var(--gray-300)" : "var(--primary)")};
  overflow: hidden;
  transition: all var(--transition-normal);
  opacity: ${(props) => (props.$expired ? 0.6 : 1)};

  &:hover {
    box-shadow: ${(props) => (props.$expired ? "var(--shadow-md)" : "var(--shadow-lg)")};
    transform: ${(props) => (props.$expired ? "none" : "translateY(-2px)")};
  }
`;

const CarImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: var(--gray-100);
`;

const CardContent = styled.div`
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
`;

const CarName = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
`;

const Price = styled.div`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary);
`;

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const DetailIcon = styled.div`
  color: var(--primary);
  font-size: var(--text-lg);
  flex-shrink: 0;
`;

const DetailText = styled.span`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-md);
`;

const AcceptButton = styled(PrimaryButton)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
`;

const DeclineButton = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const ConfirmActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: var(--primary-light);
  border-radius: var(--radius-lg);
`;

const ConfirmText = styled.p`
  font-weight: var(--font-semibold);
  color: var(--primary-dark);
  margin: 0;
  text-align: center;
`;

const ConfirmButton = styled(PrimaryButton)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  background: ${(props) =>
    props.$variant === "success" ? "var(--success)" : "var(--primary)"};
`;

const CancelButton = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const ExpiredCard = styled.div`
  background: var(--gray-100);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  text-align: center;
  opacity: 0.6;
`;

const ExpiredIcon = styled.div`
  font-size: 3rem;
  color: var(--gray-400);
  margin-bottom: var(--space-md);
`;

const ExpiredText = styled.p`
  color: var(--text-muted);
  font-weight: var(--font-medium);
  margin: 0;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default RequestCard;

