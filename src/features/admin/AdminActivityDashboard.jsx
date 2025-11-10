import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import {
  FiActivity,
  FiClock,
  FiUser,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../services/apiClient";
import { Card } from "../../components/Cards/Card";
import { PrimaryButton } from "../../components/ui/Button";
import { LoadingSpinner, ErrorState } from "../../components/ui/LoadingSpinner";
import { SearchInput, FormField, Select } from "../../components/forms/Form";
import { devices } from "../../styles/GlobalStyles";
import { useSocket } from "../../app/providers/SocketProvider";

const AdminActivityDashboard = () => {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [realtimeLogs, setRealtimeLogs] = useState([]);

  const {
    data: activitiesData,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["activityLogs", page, roleFilter, actionFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
      });
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (actionFilter !== "all") params.append("action", actionFilter);

      const response = await api.get(`/activity?${params.toString()}`);
      return response.data;
    },
  });

  const activities = useMemo(() => {
    // Merge real-time logs with fetched logs
    const fetched = activitiesData?.data || [];
    const combined = [...realtimeLogs, ...fetched];
    // Remove duplicates based on _id
    const unique = combined.filter(
      (log, index, self) => index === self.findIndex((l) => l._id === log._id)
    );
    return unique.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [activitiesData, realtimeLogs]);

  // Socket.io: Listen for real-time activity logs
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join admin activity room
    socket.emit("joinAdminRoom");

    // Listen for new activity logs
    const handleNewActivityLog = (data) => {
      if (data.activityLog) {
        setRealtimeLogs((prev) => [data.activityLog, ...prev]);
        // Show toast for important actions
        const importantActions = [
          "Login Failed",
          "Booking Created",
          "Booking Cancelled",
          "User Signed Up",
        ];
        if (importantActions.includes(data.activityLog.action)) {
          toast.success(`New activity: ${data.activityLog.action}`, {
            icon: "📋",
            duration: 3000,
          });
        }
      }
    };

    socket.on("newActivityLog", handleNewActivityLog);

    return () => {
      socket.off("newActivityLog", handleNewActivityLog);
    };
  }, [socket, isConnected]);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        activity.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.driverId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [activities, searchTerm]);

  const formatTime = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getActionIcon = (action) => {
    if (action?.includes("Failed") || action?.includes("Cancelled")) {
      return <FiXCircle style={{ color: "var(--error)" }} />;
    }
    if (action?.includes("Created") || action?.includes("Signed Up")) {
      return <FiCheckCircle style={{ color: "var(--success)" }} />;
    }
    if (action?.includes("Logged")) {
      return <FiAlertCircle style={{ color: "var(--warning)" }} />;
    }
    return <FiActivity style={{ color: "var(--primary)" }} />;
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "var(--accent)";
      case "executive":
        return "var(--primary)";
      case "driver":
        return "var(--warning)";
      case "user":
        return "var(--success)";
      default:
        return "var(--gray-500)";
    }
  };

  if (isPending && page === 1) {
    return (
      <Container>
        <LoadingSpinner message="Loading activity logs..." />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorState
          title="Error Loading Activity Logs"
          message={error?.message || "Failed to load activity logs."}
          action={<PrimaryButton onClick={() => refetch()}>Retry</PrimaryButton>}
        />
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <HeaderSection>
        <HeaderContent>
          <HeaderTitle>Activity Logs</HeaderTitle>
          <HeaderSubtitle>Monitor all system activities in real-time</HeaderSubtitle>
        </HeaderContent>
        <HeaderActions>
          <RefreshButton onClick={() => refetch()}>
            <FiRefreshCw />
            Refresh
          </RefreshButton>
        </HeaderActions>
      </HeaderSection>

      {/* Stats */}
      <StatsGrid>
        <StatCard>
          <StatIcon $color="var(--primary)">
            <FiActivity />
          </StatIcon>
          <StatContent>
            <StatValue>{activitiesData?.total || 0}</StatValue>
            <StatLabel>Total Activities</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="var(--success)">
            <FiUser />
          </StatIcon>
          <StatContent>
            <StatValue>
              {activities.filter((a) => a.role === "user").length}
            </StatValue>
            <StatLabel>User Actions</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="var(--warning)">
            <FiUser />
          </StatIcon>
          <StatContent>
            <StatValue>
              {activities.filter((a) => a.role === "driver").length}
            </StatValue>
            <StatLabel>Driver Actions</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="var(--accent)">
            <FiUser />
          </StatIcon>
          <StatContent>
            <StatValue>
              {activities.filter((a) => a.role === "admin").length}
            </StatValue>
            <StatLabel>Admin Actions</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      {/* Filters */}
      <ControlsCard>
        <ControlsGrid>
          <FormField>
            <SearchInput
              type="text"
              placeholder="Search by action, user name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormField>
          <FormField>
            <Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
              <option value="executive">Executive</option>
              <option value="system">System</option>
            </Select>
          </FormField>
          <FormField>
            <Select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Actions</option>
              <option value="Login">Login</option>
              <option value="Logout">Logout</option>
              <option value="Booking">Booking</option>
              <option value="Sign Up">Sign Up</option>
            </Select>
          </FormField>
        </ControlsGrid>
      </ControlsCard>

      {/* Activity Logs Table */}
      <TableCard>
        <Table>
          <thead>
            <TableRow>
              <TableHeader>Time</TableHeader>
              <TableHeader>User</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Action</TableHeader>
              <TableHeader>Details</TableHeader>
              <TableHeader>IP Address</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {filteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center", padding: "3rem" }}>
                  <EmptyState>
                    <EmptyIcon>📋</EmptyIcon>
                    <EmptyText>No activity logs found</EmptyText>
                  </EmptyState>
                </TableCell>
              </TableRow>
            ) : (
              filteredActivities.map((activity) => (
                <TableRow key={activity._id}>
                  <TableCell>
                    <TimeCell>
                      <FiClock />
                      {formatTime(activity.createdAt)}
                    </TimeCell>
                  </TableCell>
                  <TableCell>
                    <UserCell>
                      {activity.userId?.fullName || activity.driverId?.fullName || "System"}
                      {activity.userId?.email && (
                        <UserEmail>{activity.userId.email}</UserEmail>
                      )}
                    </UserCell>
                  </TableCell>
                  <TableCell>
                    <RoleBadge $color={getRoleBadgeColor(activity.role)}>
                      {activity.role}
                    </RoleBadge>
                  </TableCell>
                  <TableCell>
                    <ActionCell>
                      {getActionIcon(activity.action)}
                      {activity.action}
                    </ActionCell>
                  </TableCell>
                  <TableCell>
                    <DetailsCell>
                      {activity.details
                        ? JSON.stringify(activity.details).substring(0, 50) + "..."
                        : "-"}
                    </DetailsCell>
                  </TableCell>
                  <TableCell>
                    <IpCell>{activity.ipAddress || "N/A"}</IpCell>
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>

      {/* Pagination */}
      {activitiesData && activitiesData.totalPages > 1 && (
        <Pagination>
          <PaginationButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </PaginationButton>
          <PageInfo>
            Page {page} of {activitiesData.totalPages}
          </PageInfo>
          <PaginationButton
            onClick={() => setPage((p) => Math.min(activitiesData.totalPages, p + 1))}
            disabled={page === activitiesData.totalPages}
          >
            Next
          </PaginationButton>
        </Pagination>
      )}
    </Container>
  );
};

export default AdminActivityDashboard;

// Styled Components
const Container = styled.div`
  padding: var(--space-xl);
  max-width: 1600px;
  margin: 0 auto;

  @media ${devices.tablet} {
    padding: var(--space-lg);
  }

  @media ${devices.mobile} {
    padding: var(--space-md);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xl);

  @media ${devices.mobile} {
    flex-direction: column;
    gap: var(--space-md);
  }
`;

const HeaderContent = styled.div``;

const HeaderTitle = styled.h1`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  font-family: var(--font-heading);
`;

const HeaderSubtitle = styled.p`
  font-size: var(--text-base);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const RefreshButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--text-sm);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  flex-shrink: 0;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  font-family: var(--font-heading);
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const ControlsCard = styled(Card)`
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-md);

  @media ${devices.tablet} {
    grid-template-columns: 1fr;
  }
`;

const TableCard = styled(Card)`
  overflow-x: auto;
  padding: 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--gray-200);

  &:hover {
    background: var(--gray-50);
  }
`;

const TableHeader = styled.th`
  padding: var(--space-md) var(--space-lg);
  text-align: left;
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--gray-50);
`;

const TableCell = styled.td`
  padding: var(--space-md) var(--space-lg);
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const TimeCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--text-muted);
  white-space: nowrap;
`;

const UserCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserEmail = styled.div`
  font-size: var(--text-xs);
  color: var(--text-muted);
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ $color }) => $color}15;
  color: ${({ $color }) => $color};
`;

const ActionCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-weight: var(--font-medium);
`;

const DetailsCell = styled.div`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-muted);
  font-size: var(--text-xs);
`;

const IpCell = styled.div`
  font-family: monospace;
  font-size: var(--text-xs);
  color: var(--text-muted);
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
  margin-top: var(--space-xl);
`;

const PaginationButton = styled.button`
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--gray-300);
  background: var(--white);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: var(--font-body);
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    background: var(--primary);
    color: var(--white);
    border-color: var(--primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-3xl);
  text-align: center;
  color: var(--text-muted);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-md);
`;

const EmptyText = styled.div`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

