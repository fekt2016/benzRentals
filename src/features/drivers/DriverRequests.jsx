/* eslint-disable react/react-in-jsx-scope */
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useSocket } from "../../app/providers/SocketProvider";
import { useAcceptBooking } from "../bookings/hooks/useAcceptBooking";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import bookingApi from "../bookings/bookingService";
import {
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiRefreshCw,
  FiCar,
} from "react-icons/fi";
import { formatDate } from "../../utils/helper";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import { Card } from "../cars/Card";
import { toast } from "react-hot-toast";

const DriverRequests = () => {
  const { socket, isConnected } = useSocket();
  const { mutate: acceptBooking, isPending: isAccepting } = useAcceptBooking();
  const queryClient = useQueryClient();
  const [requests, setRequests] = useState([]);
  const [expiredRequests, setExpiredRequests] = useState(new Set());

  // Fetch pending driver requests (if backend provides this endpoint)
  // For now, we'll rely on socket events
  const { data: pendingRequests, refetch } = useQuery({
    queryKey: ["driverRequests"],
    queryFn: async () => {
      // This would be a new endpoint: GET /api/v1/bookings/driver-requests
      // For now, return empty array
      return { data: [] };
    },
    enabled: false, // Disabled until backend endpoint is ready
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Listen to socket events
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleDriverRequest = (data) => {
      console.log("[DriverRequests] New driver request:", data);
      setRequests((prev) => {
        // Avoid duplicates
        if (prev.some((r) => r.bookingId === data.bookingId)) {
          return prev;
        }
        return [...prev, { ...data, receivedAt: new Date() }];
      });
      toast.info(`New driver request: ${data.car?.model || "Car rental"}`);
    };

    const handleDriverDeclined = (data) => {
      console.log("[DriverRequests] Request declined/taken:", data);
      setRequests((prev) =>
        prev.filter((r) => r.bookingId !== data.bookingId)
      );
      if (data.reason === "accepted_by_another") {
        toast.info("This request was accepted by another driver");
      }
    };

    socket.on("driver_request", handleDriverRequest);
    socket.on("driver_declined", handleDriverDeclined);

    return () => {
      socket.off("driver_request", handleDriverRequest);
      socket.off("driver_declined", handleDriverDeclined);
    };
  }, [socket, isConnected]);

  // Check for expired requests
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRequests((prev) => {
        return prev.filter((request) => {
          if (!request.requestedAt) return true;
          const requestAge = now - new Date(request.requestedAt).getTime();
          const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
          
          if (requestAge > EXPIRY_TIME) {
            setExpiredRequests((prev) => new Set([...prev, request.bookingId]));
            return false;
          }
          return true;
        });
      });
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  const handleAccept = (bookingId) => {
    acceptBooking(bookingId, {
      onSuccess: () => {
        setRequests((prev) => prev.filter((r) => r.bookingId !== bookingId));
        queryClient.invalidateQueries(["bookings"]);
      },
    });
  };

  const getTimeRemaining = (requestedAt) => {
    if (!requestedAt) return null;
    const now = Date.now();
    const requestTime = new Date(requestedAt).getTime();
    const elapsed = now - requestTime;
    const EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
    const remaining = EXPIRY_TIME - elapsed;

    if (remaining <= 0) return { expired: true, minutes: 0, seconds: 0 };

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return { expired: false, minutes, seconds };
  };

  if (!isConnected) {
    return (
      <Container>
        <Header>
          <Title>Driver Requests</Title>
        </Header>
        <EmptyState>
          <FiAlertCircle />
          <EmptyStateTitle>Not Connected</EmptyStateTitle>
          <EmptyStateText>
            Please wait while we connect to the server...
          </EmptyStateText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Driver Requests</Title>
        <RefreshButton onClick={() => refetch()} $size="sm">
          <FiRefreshCw />
          Refresh
        </RefreshButton>
      </Header>

      {requests.length === 0 ? (
        <EmptyState>
          <FiCar />
          <EmptyStateTitle>No Active Requests</EmptyStateTitle>
          <EmptyStateText>
            New driver requests will appear here in real-time. Make sure you&apos;re
            logged in as a driver.
          </EmptyStateText>
        </EmptyState>
      ) : (
        <RequestsGrid>
          {requests.map((request) => {
            const timeRemaining = getTimeRemaining(request.requestedAt);
            const isExpired = timeRemaining?.expired || false;

            return (
              <RequestCard key={request.bookingId} $expired={isExpired}>
                <CardHeader>
                  <CarInfo>
                    {request.car?.images && (
                      <CarImage
                        src={request.car.images}
                        alt={request.car.model}
                        onError={(e) => {
                          e.target.src = "/default-car.jpg";
                        }}
                      />
                    )}
                    <CarDetails>
                      <CarModel>{request.car?.model || "Car Rental"}</CarModel>
                      <CarSeries>{request.car?.series || ""}</CarSeries>
                    </CarDetails>
                  </CarInfo>
                  {!isExpired && timeRemaining && (
                    <TimeRemaining $urgent={timeRemaining.minutes < 2}>
                      <FiClock />
                      {timeRemaining.minutes}m {timeRemaining.seconds}s
                    </TimeRemaining>
                  )}
                  {isExpired && (
                    <ExpiredBadge>
                      <FiX />
                      Expired
                    </ExpiredBadge>
                  )}
                </CardHeader>

                <RequestDetails>
                  <DetailItem>
                    <FiMapPin />
                    <span>{request.pickupLocation || "Location TBD"}</span>
                  </DetailItem>
                  <DetailItem>
                    <FiClock />
                    <span>
                      {request.pickupDate
                        ? formatDate(request.pickupDate)
                        : "Date TBD"}
                      {" - "}
                      {request.returnDate
                        ? formatDate(request.returnDate)
                        : "Date TBD"}
                    </span>
                  </DetailItem>
                  <DetailItem>
                    <FiDollarSign />
                    <span>${request.totalPrice?.toFixed(2) || "0.00"}</span>
                  </DetailItem>
                </RequestDetails>

                <CardActions>
                  {isExpired ? (
                    <ExpiredMessage>
                      This request has expired. It may have been accepted by
                      another driver.
                    </ExpiredMessage>
                  ) : (
                    <AcceptButton
                      onClick={() => handleAccept(request.bookingId)}
                      disabled={isAccepting}
                      $loading={isAccepting}
                    >
                      {isAccepting ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <FiCheck />
                          Accept Request
                        </>
                      )}
                    </AcceptButton>
                  )}
                </CardActions>
              </RequestCard>
            );
          })}
        </RequestsGrid>
      )}
    </Container>
  );
};

export default DriverRequests;

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-2xl);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
`;

const RefreshButton = styled(SecondaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-4xl);
  text-align: center;
  color: var(--text-muted);

  svg {
    font-size: 4rem;
    margin-bottom: var(--space-lg);
    opacity: 0.5;
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
`;

const EmptyStateText = styled.p`
  font-size: var(--text-base);
  color: var(--text-muted);
  margin: 0;
  max-width: 500px;
`;

const RequestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RequestCard = styled(Card)`
  padding: var(--space-xl);
  border: 2px solid
    ${(props) => (props.$expired ? "var(--gray-300)" : "var(--primary)")};
  opacity: ${(props) => (props.$expired ? 0.6 : 1)};
  transition: all var(--transition-normal);

  &:hover {
    transform: ${(props) => (props.$expired ? "none" : "translateY(-4px)")};
    box-shadow: ${(props) =>
      props.$expired ? "none" : "var(--shadow-lg)"};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
`;

const CarInfo = styled.div`
  display: flex;
  gap: var(--space-md);
  align-items: center;
  flex: 1;
`;

const CarImage = styled.img`
  width: 80px;
  height: 60px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  box-shadow: var(--shadow-sm);
`;

const CarDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const CarModel = styled.div`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const CarSeries = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
`;

const TimeRemaining = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: ${(props) =>
    props.$urgent ? "var(--error-light)" : "var(--warning-light)"};
  color: ${(props) =>
    props.$urgent ? "var(--error-dark)" : "var(--warning-dark)"};
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  white-space: nowrap;
`;

const ExpiredBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--gray-200);
  color: var(--text-muted);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
`;

const RequestDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding: var(--space-md);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-base);
  color: var(--text-secondary);

  svg {
    color: var(--primary);
    flex-shrink: 0;
  }
`;

const CardActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const AcceptButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ExpiredMessage = styled.div`
  padding: var(--space-md);
  background: var(--gray-100);
  border-radius: var(--radius-lg);
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-align: center;
`;

