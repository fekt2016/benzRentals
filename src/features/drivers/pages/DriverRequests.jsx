import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiAlertCircle, FiShield, FiWifi } from "react-icons/fi";
import RequestCard from "../components/RequestCard";
import { useRideRequests } from "../hooks/useRideRequests";
import { useDriverRequests } from "../hooks/useDriverRequests";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import ErrorState from "../../../components/feedback/ErrorState";
import { SecondaryButton } from "../../../components/ui/Button";

const DriverRequests = () => {
  // Use new useRideRequests hook for real-time socket-based requests
  const {
    requests: socketRequests,
    acceptRequest,
    rejectRequest,
    isAccepting,
    isConnected,
    isDriverOnline,
    isLicenseVerified,
    declinedRequestIds,
  } = useRideRequests();
  
  // Get driver profile to check verification status
  const { driver } = useDriverProfile();

  // Also fetch initial requests via API for fallback
  const { requests: apiRequests, isLoading, error, refetch } = useDriverRequests();
  const [allRequests, setAllRequests] = useState([]);

  // Merge socket and API requests (socket takes priority)
  // Use a Map to ensure unique requests by bookingId
  // Also filter out declined requests
  // Only show requests if driver is verified and online
  useEffect(() => {
    // Don't show any requests if driver is not verified or not online
    if (!isLicenseVerified || !isDriverOnline) {
      setAllRequests([]);
      return;
    }
    
    const requestsMap = new Map();
    
    // Add socket requests first (they take priority)
    socketRequests.forEach((req) => {
      const reqId = String(req.bookingId || req._id);
      if (reqId && !requestsMap.has(reqId)) {
        requestsMap.set(reqId, { ...req, bookingId: req.bookingId || req._id });
      }
    });
    
    // Add API requests only if they don't already exist and haven't been declined
    apiRequests.forEach((apiReq) => {
      const apiId = String(apiReq._id || apiReq.bookingId);
      if (apiId && !requestsMap.has(apiId)) {
        // Don't add if it was declined
        const isDeclined = declinedRequestIds?.includes(apiId);
        if (!isDeclined) {
          requestsMap.set(apiId, { ...apiReq, bookingId: apiReq._id || apiReq.bookingId });
        }
      }
    });
    
    // Convert Map to array
    const merged = Array.from(requestsMap.values());
    setAllRequests(merged);
  }, [socketRequests, apiRequests, declinedRequestIds, isLicenseVerified, isDriverOnline]);

  const handleAccept = (bookingId) => {
    acceptRequest(bookingId);
  };

  const handleDecline = (bookingId) => {
    rejectRequest(bookingId);
  };

  if (isLoading) {
    return (
      <LoadingState>
        <LoadingSpinner size="xl" />
        <LoadingText>Loading requests...</LoadingText>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        icon={FiAlertCircle}
        title="Failed to Load Requests"
        message={error.message || "Unable to fetch driver requests"}
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
    <RequestsContainer>
      <SectionHeader>
        <SectionTitle>Available Ride Requests</SectionTitle>
        <RefreshButton onClick={refetch} $size="sm">
          <FiRefreshCw />
          Refresh
        </RefreshButton>
      </SectionHeader>

      {!isConnected && (
        <ConnectionWarning>
          <FiAlertCircle />
          <span>Not connected to server. Real-time updates unavailable.</span>
        </ConnectionWarning>
      )}

      {isConnected && !isLicenseVerified && (
        <VerificationWarning>
          <FiShield />
          <WarningContent>
            <WarningTitle>License Verification Required</WarningTitle>
            <WarningMessage>
              Your license must be verified before you can receive ride requests. Please complete document verification in your dashboard.
            </WarningMessage>
          </WarningContent>
        </VerificationWarning>
      )}

      {isConnected && isLicenseVerified && !isDriverOnline && (
        <ConnectionWarning>
          <FiWifi />
          <WarningContent>
            <WarningTitle>You are offline</WarningTitle>
            <WarningMessage>
              Go online to receive ride requests. Update your status to "Available" in your dashboard.
            </WarningMessage>
          </WarningContent>
        </ConnectionWarning>
      )}

      {/* Only show requests if driver is verified and online */}
      {isConnected && isLicenseVerified && isDriverOnline && allRequests.length === 0 && (
        <EmptyState>
          <EmptyIcon>
            <FiAlertCircle />
          </EmptyIcon>
          <EmptyTitle>No Ride Requests Available</EmptyTitle>
          <EmptyText>
            There are no active ride requests at the moment. New requests will appear here when customers request a driver.
          </EmptyText>
        </EmptyState>
      )}

      {isConnected && isLicenseVerified && isDriverOnline && allRequests.length > 0 && (
        <RequestsGrid>
          <AnimatePresence>
            {allRequests.map((request) => {
              const requestId = request.bookingId || request._id;
              return (
                <RequestCard
                  key={requestId}
                  request={request}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  isAccepting={isAccepting}
                />
              );
            })}
          </AnimatePresence>
        </RequestsGrid>
      )}
    </RequestsContainer>
  );
};

const RequestsContainer = styled.div`
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

const ConnectionWarning = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--warning-light);
  border: 1px solid var(--warning);
  border-radius: var(--radius-lg);
  color: var(--warning-dark);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-lg);
  
  svg {
    flex-shrink: 0;
    margin-top: 2px;
    font-size: 1.25rem;
  }
`;

const VerificationWarning = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--error-light);
  border: 1px solid var(--error);
  border-radius: var(--radius-lg);
  color: var(--error-dark);
  font-size: var(--text-sm);
  margin-bottom: var(--space-lg);
  
  svg {
    flex-shrink: 0;
    margin-top: 2px;
    font-size: 1.25rem;
  }
`;

const WarningContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  flex: 1;
`;

const WarningTitle = styled.strong`
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  display: block;
  margin-bottom: var(--space-xs);
`;

const WarningMessage = styled.p`
  margin: 0;
  font-size: var(--text-sm);
  opacity: 0.9;
  line-height: 1.5;
`;

const RequestsGrid = styled.div`
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

export default DriverRequests;

