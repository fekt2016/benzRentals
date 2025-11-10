import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../../../config/constants";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import DriverStatusToggle from "../components/DriverStatusToggle";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { useDriverEarnings } from "../hooks/useDriverEarnings";
import { useDriverBookings } from "../hooks/useDriverBookings";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import ErrorState from "../../../components/feedback/ErrorState";
import { PrimaryButton } from "../../../components/ui/Button";
import DriverRequests from "./DriverRequests";
import DriverTrips from "./DriverTrips";
import DriverEarnings from "./DriverEarnings";
import DriverDocumentUpload from "../components/DriverDocumentUpload";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { driver, updateStatus, isUpdatingStatus } = useDriverProfile();
  const { earnings } = useDriverEarnings();
  const { bookings } = useDriverBookings();

  // Determine active tab from URL
  const getActiveTabFromPath = () => {
    if (location.pathname === PATHS.DRIVER_REQUESTS) return "requests";
    if (location.pathname === PATHS.DRIVER_TRIPS) return "trips";
    if (location.pathname === PATHS.DRIVER_EARNINGS) return "earnings";
    return "requests"; // default
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  // Update tab when route changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const tabs = [
    { id: "requests", label: "Active Requests", icon: FiClock },
    { id: "trips", label: "My Trips", icon: FiActivity },
    { id: "earnings", label: "Earnings", icon: FiDollarSign },
  ];

  const handleStatusToggle = (newStatus) => {
    updateStatus(newStatus);
  };

  // Format last available time
  const formatLastAvailable = useMemo(() => {
    const isOnline = driver?.status === "available" || driver?.status === "active" || driver?.status === "busy";
    
    if (!driver?.lastAvailable) {
      return isOnline ? "Currently online" : "Never";
    }
    
    const lastAvailableDate = new Date(driver.lastAvailable);
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastAvailableDate) / 1000);
    
    // If driver is currently online and lastAvailable is recent, show "Currently online"
    if (isOnline && diffInSeconds < 300) { // Within 5 minutes
      return "Currently online";
    }
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      if (days === 1) {
        return "Yesterday";
      } else if (days < 7) {
        return `${days} days ago`;
      } else {
        return lastAvailableDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: lastAvailableDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
      }
    }
  }, [driver?.lastAvailable, driver?.status]);

  // Check if driver has uploaded license (supports both unified Driver model and legacy DriverProfile)
  const hasUploadedLicense = useMemo(() => {
    if (!driver) return false;
    return driver?.license?.fileUrl || driver?.licenseImage;
  }, [driver]);

  // Check if verification status is pending or waiting
  const isVerificationPending = useMemo(() => {
    if (!driver) return false;
    const verificationStatus = driver?.verificationStatus || driver?.status;
    return verificationStatus === "pending" || 
           verificationStatus === "waiting" || 
           verificationStatus === "waiting for verification";
  }, [driver]);

  // Check if driver is verified (check both top-level verified and license.verified)
  const isVerified = useMemo(() => {
    if (!driver) return false;
    return driver.verified === true || driver.license?.verified === true;
  }, [driver]);

  // Determine if document upload section should be shown
  // Show only when:
  // - Driver is not verified
  // - Driver has no uploaded license
  // - Verification status is not pending/waiting
  const shouldShowDocumentUpload = useMemo(() => {
    if (!driver) return false;
    return !isVerified && !hasUploadedLicense && !isVerificationPending;
  }, [driver, hasUploadedLicense, isVerificationPending, isVerified]);

  // Show verification pending status when documents are uploaded but not verified
  // This includes cases where status is explicitly pending or when documents exist but verification is false
  const shouldShowVerificationStatus = useMemo(() => {
    if (!driver) return false;
    // Show if: has uploaded license AND not verified (regardless of explicit pending status)
    // This covers both explicit pending status and implicit pending (documents uploaded but not verified)
    return !isVerified && hasUploadedLicense;
  }, [driver, hasUploadedLicense, isVerified]);

  if (!driver) {
    return (
      <DashboardContainer>
        <LoadingState>
          <LoadingSpinner size="xl" />
          <LoadingText>Loading driver profile...</LoadingText>
        </LoadingState>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <Title>Driver Dashboard</Title>
          <Subtitle>Manage your rides and earnings</Subtitle>
        </HeaderContent>
        <HeaderRight>
          <LastAvailableBadge>
            <FiCheckCircle style={{ marginRight: "4px" }} />
            Last available: {formatLastAvailable}
          </LastAvailableBadge>
          <DriverStatusToggle
            status={
              driver?.currentStatus === "available" 
                ? "available" 
                : driver?.currentStatus === "on-trip"
                ? "busy"
                : driver?.status === "available" || driver?.status === "active"
                ? "available"
                : "offline"
            }
            onToggle={handleStatusToggle}
            isLoading={isUpdatingStatus}
          />
        </HeaderRight>
      </Header>

      <StatsGrid>
        <StatCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon $color="var(--primary)">
            <FiActivity />
          </StatIcon>
          <StatContent>
            <StatValue>{bookings.length}</StatValue>
            <StatLabel>Active Trips</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon $color="var(--success)">
            <FiTrendingUp />
          </StatIcon>
          <StatContent>
            <StatValue>{earnings.totalTrips}</StatValue>
            <StatLabel>Total Trips</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon $color="var(--warning)">
            <FiDollarSign />
          </StatIcon>
          <StatContent>
            <StatValue>${earnings.totalEarnings.toFixed(2)}</StatValue>
            <StatLabel>Total Earnings</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatIcon $color="var(--info)">
            <FiClock />
          </StatIcon>
          <StatContent>
            <StatValue>{driver.rating?.toFixed(1) || "0.0"}</StatValue>
            <StatLabel>Rating</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <TabsContainer>
        <TabsList>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TabButton
                key={tab.id}
                $active={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Navigate to corresponding route
                  if (tab.id === "requests") navigate(PATHS.DRIVER_REQUESTS);
                  else if (tab.id === "trips") navigate(PATHS.DRIVER_TRIPS);
                  else if (tab.id === "earnings") navigate(PATHS.DRIVER_EARNINGS);
                }}
                as={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconComponent />
                {tab.label}
              </TabButton>
            );
          })}
        </TabsList>
      </TabsContainer>

      {/* Show verification pending status when documents are uploaded and waiting for verification */}
      {shouldShowVerificationStatus && (
        <VerificationStatusBanner>
          <StatusIcon>
            <FiShield />
          </StatusIcon>
          <StatusContent>
            <StatusTitle>Documents Under Review</StatusTitle>
            <StatusMessage>
              Your driver's license has been uploaded and is currently being reviewed by our admin team. 
              You will be notified once verification is complete.
            </StatusMessage>
          </StatusContent>
        </VerificationStatusBanner>
      )}

      {/* Show document upload only when driver has no uploaded license and is not pending verification */}
      {shouldShowDocumentUpload && (
        <DocumentUploadSection>
          <DriverDocumentUpload />
        </DocumentUploadSection>
      )}

      <TabContent>
        {activeTab === "requests" && <DriverRequests />}
        {activeTab === "trips" && <DriverTrips />}
        {activeTab === "earnings" && <DriverEarnings />}
      </TabContent>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-2xl);
  min-height: 100vh;
  background: var(--surface);

  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--gray-200);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-lg);
    align-items: stretch;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const Title = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  font-family: var(--font-heading);
`;

const Subtitle = styled.p`
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

const LastAvailableBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--success-light);
  color: var(--success-dark);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  white-space: nowrap;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
`;

const StatCard = styled.div`
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

const StatIcon = styled.div`
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

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
`;

const StatLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
`;

const TabsContainer = styled.div`
  margin-bottom: var(--space-xl);
`;

const TabsList = styled.div`
  display: flex;
  gap: var(--space-sm);
  border-bottom: 2px solid var(--gray-200);
  overflow-x: auto;

  @media (max-width: 768px) {
    gap: var(--space-xs);
  }
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border: none;
  background: transparent;
  color: ${(props) =>
    props.$active ? "var(--primary)" : "var(--text-secondary)"};
  font-weight: ${(props) =>
    props.$active ? "var(--font-semibold)" : "var(--font-medium)"};
  font-size: var(--text-base);
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) => (props.$active ? "var(--primary)" : "transparent")};
  transition: all var(--transition-normal);
  white-space: nowrap;

  &:hover {
    color: var(--primary);
  }

  svg {
    font-size: var(--text-lg);
  }
`;

const TabContent = styled.div`
  margin-top: var(--space-xl);
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--space-lg);
`;

const LoadingText = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  margin: 0;
`;

const DocumentUploadSection = styled.div`
  margin-bottom: var(--space-2xl);
`;

const VerificationStatusBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background: var(--info-light);
  border: 2px solid var(--info);
  border-radius: var(--radius-xl);
  margin-bottom: var(--space-2xl);
  box-shadow: var(--shadow-sm);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-md);
  }
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--info);
  color: var(--white);
  font-size: var(--text-2xl);
  flex-shrink: 0;
`;

const StatusContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const StatusTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const StatusMessage = styled.p`
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
  font-family: var(--font-body);
`;

export default DriverDashboard;

