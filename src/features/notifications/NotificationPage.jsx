// src/pages/NotificationsPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  useGetUserNotification,
  useUnreadCountData,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "../notifications/useNotification";
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiExternalLink,
  FiFilter,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiStar,
  FiCalendar,
} from "react-icons/fi";

const NotificationsPage = () => {
  const [filter, setFilter] = useState("all");
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  // Queries
  const {
    data: notificationData,
    isLoading,
    error,
    refetch,
  } = useGetUserNotification({ page: 1, limit: 50, sort: "-createdAt" });

  const { data: unreadCountData } = useUnreadCountData();

  // Mutations
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications = notificationData?.data || [];

  const unreadCount = unreadCountData?.data?.count || 0;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "booking") {
      return notification.type.includes("booking");
    }
    if (filter === "payment") {
      return notification.type.includes("payment");
    }
    if (filter === "promotion") {
      return (
        notification.type.includes("promotion") ||
        notification.type.includes("offer") ||
        notification.type.includes("special")
      );
    }
    return notification.type === filter;
  });

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });
  };

  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach((id) => markAsRead(id));
    setSelectedNotifications(new Set());
  };

  const handleBulkDelete = () => {
    selectedNotifications.forEach((id) => deleteNotification(id));
    setSelectedNotifications(new Set());
  };

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      const allIds = new Set(filteredNotifications.map((n) => n.id || n._id));
      setSelectedNotifications(allIds);
    }
  };

  const toggleNotificationSelection = (notificationId) => {
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_confirmed":
      case "payment_success":
        return <FiCheckCircle style={{ color: "#10b981" }} />;
      case "booking_created":
      case "upcoming_rental":
        return <FiCalendar style={{ color: "#3b82f6" }} />;
      case "booking_cancelled":
      case "payment_failed":
        return <FiAlertCircle style={{ color: "#ef4444" }} />;
      case "promotion":
      case "special_offer":
        return <FiStar style={{ color: "#f59e0b" }} />;
      case "vehicle_maintenance":
        return <FiCar style={{ color: "#8b5cf6" }} />;
      default:
        return <FiInfo style={{ color: "#6b7280" }} />;
    }
  };

  const getNotificationTypeLabel = (type) => {
    const types = {
      booking_confirmed: "Booking",
      booking_created: "Booking",
      booking_cancelled: "Booking",
      payment_success: "Payment",
      payment_failed: "Payment",
      promotion: "Promotion",
      special_offer: "Promotion",
      vehicle_maintenance: "Maintenance",
      upcoming_rental: "Reminder",
    };
    return types[type] || "General";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: diffDays >= 365 ? "numeric" : undefined,
    });
  };

  const filterOptions = [
    { key: "all", label: "All", count: notifications.length },
    { key: "unread", label: "Unread", count: unreadCount },
    {
      key: "booking",
      label: "Bookings",
      count: notifications.filter((n) => n.type.includes("booking")).length,
    },
    {
      key: "payment",
      label: "Payments",
      count: notifications.filter((n) => n.type.includes("payment")).length,
    },
    {
      key: "promotion",
      label: "Offers",
      count: notifications.filter(
        (n) => n.type.includes("promotion") || n.type.includes("offer")
      ).length,
    },
  ];

  if (isLoading) {
    return (
      <Wrapper>
        <Container>
          <PageHeader>
            <TitleSection>
              <PageTitle>Notifications</PageTitle>
              <PageSubtitle>Manage your alerts and updates</PageSubtitle>
            </TitleSection>
          </PageHeader>
          <LoadingState>
            <LoadingSpinner />
            Loading your notifications...
          </LoadingState>
        </Container>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <Container>
          <PageHeader>
            <TitleSection>
              <PageTitle>Notifications</PageTitle>
              <PageSubtitle>Manage your alerts and updates</PageSubtitle>
            </TitleSection>
          </PageHeader>
          <ErrorState>
            <FiAlertCircle size={48} />
            <h3>Failed to load notifications</h3>
            <p>Please try refreshing the page</p>
            <RetryButton onClick={() => refetch()}>Try Again</RetryButton>
          </ErrorState>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        {/* Page Header */}
        <PageHeader>
          <TitleSection>
            <PageTitle>Notifications</PageTitle>
            <PageSubtitle>
              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount !== 1 ? "s" : ""
                  }`
                : "All caught up!"}
            </PageSubtitle>
          </TitleSection>

          <HeaderActions>
            {selectedNotifications.size > 0 ? (
              <BulkActions>
                <BulkActionText>
                  {selectedNotifications.size} selected
                </BulkActionText>
                <BulkActionButton onClick={handleBulkMarkAsRead}>
                  <FiCheck size={16} />
                  Mark as read
                </BulkActionButton>
                <BulkActionButton $delete onClick={handleBulkDelete}>
                  <FiTrash2 size={16} />
                  Delete
                </BulkActionButton>
              </BulkActions>
            ) : (
              <ActionButtons>
                {unreadCount > 0 && (
                  <ActionButton onClick={() => markAllAsRead()}>
                    <FiCheck size={16} />
                    Mark all as read
                  </ActionButton>
                )}
                <FilterDropdown>
                  <FiFilter size={16} />
                  Filter
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    {filterOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label} ({option.count})
                      </option>
                    ))}
                  </select>
                </FilterDropdown>
              </ActionButtons>
            )}
          </HeaderActions>
        </PageHeader>

        {/* Filter Tabs */}
        <FilterTabs>
          {filterOptions.map((option) => {
            return (
              <FilterTab
                key={option.key}
                $active={filter === option.key}
                onClick={() => setFilter(option.key)}
              >
                {option.label}
                {option.count > 0 && <TabCount>{option.count}</TabCount>}
              </FilterTab>
            );
          })}
        </FilterTabs>

        {/* Notifications List */}
        <NotificationsContainer>
          {filteredNotifications.length === 0 ? (
            <EmptyState>
              <FiBell size={64} />
              <EmptyTitle>
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </EmptyTitle>
              <EmptyMessage>
                {filter === "unread"
                  ? "You're all caught up with your notifications!"
                  : "You'll see important updates about your bookings and offers here."}
              </EmptyMessage>
              {filter !== "all" && (
                <ClearFilterButton onClick={() => setFilter("all")}>
                  View all notifications
                </ClearFilterButton>
              )}
            </EmptyState>
          ) : (
            <NotificationsList>
              {filteredNotifications.map((notification) => {
                return (
                  <NotificationCard
                    key={notification.id || notification._id}
                    $unread={!notification.read}
                    $selected={selectedNotifications.has(
                      notification.id || notification._id
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SelectionCheckbox>
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(
                          notification.id || notification._id
                        )}
                        onChange={() =>
                          toggleNotificationSelection(
                            notification.id || notification._id
                          )
                        }
                      />
                    </SelectionCheckbox>

                    <NotificationIcon>
                      {getNotificationIcon(notification.type)}
                    </NotificationIcon>

                    <NotificationContent>
                      <NotificationHeader>
                        <NotificationTitle $unread={!notification.read}>
                          {notification.title}
                        </NotificationTitle>
                        <NotificationTime>
                          {formatTime(notification.createdAt)}
                        </NotificationTime>
                      </NotificationHeader>

                      <NotificationMessage>
                        {notification.message}
                      </NotificationMessage>

                      <NotificationMeta>
                        <NotificationType>
                          {getNotificationTypeLabel(notification.type)}
                        </NotificationType>
                        {notification.actionUrl && (
                          <ActionLink
                            to={notification.actionUrl}
                            onClick={() =>
                              !notification.read &&
                              handleMarkAsRead(
                                notification.id || notification._id
                              )
                            }
                          >
                            <FiExternalLink size={14} />
                            View details
                          </ActionLink>
                        )}
                      </NotificationMeta>
                    </NotificationContent>

                    <NotificationActions>
                      {!notification.read && (
                        <MarkAsReadButton
                          onClick={() =>
                            handleMarkAsRead(
                              notification.id || notification._id
                            )
                          }
                          title="Mark as read"
                        >
                          <FiCheck size={14} />
                        </MarkAsReadButton>
                      )}
                      <DeleteButton
                        onClick={() =>
                          deleteNotification(
                            notification.id || notification._id
                          )
                        }
                        title="Delete notification"
                      >
                        <FiTrash2 size={14} />
                      </DeleteButton>
                    </NotificationActions>

                    {!notification.read && <UnreadIndicator />}
                  </NotificationCard>
                );
              })}
            </NotificationsList>
          )}
        </NotificationsContainer>

        {/* Select All Footer */}
        {filteredNotifications.length > 0 && (
          <SelectAllFooter>
            <SelectAllCheckbox>
              <input
                type="checkbox"
                checked={
                  selectedNotifications.size === filteredNotifications.length
                }
                onChange={handleSelectAll}
              />
              <span>
                {selectedNotifications.size === filteredNotifications.length
                  ? "Deselect all"
                  : "Select all"}
              </span>
            </SelectAllCheckbox>
          </SelectAllFooter>
        )}
      </Container>
    </Wrapper>
  );
};

export default NotificationsPage;

// Styled Components
const Wrapper = styled.div`
  flex: 1;
  background: #f8fafc;
  min-height: calc(100vh - 4rem);
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PageSubtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const FilterDropdown = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-weight: 500;
  position: relative;

  select {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    color: #374151;
    cursor: pointer;
    appearance: none;
    min-width: 120px;

    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
  }
`;

const BulkActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
  }
`;

const BulkActionText = styled.span`
  font-weight: 600;
  color: #1e293b;
`;

const BulkActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) => (props.$delete ? "#ef4444" : "#10b981")};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$delete ? "#dc2626" : "#059669")};
    transform: translateY(-1px);
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;

  @media (max-width: 640px) {
    gap: 0.25rem;
  }
`;

const FilterTab = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) => (props.$active ? "#3b82f6" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#64748b")};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.$active ? "#2563eb" : "#f1f5f9")};
  }

  @media (max-width: 640px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
`;

const TabCount = styled.span`
  background: ${(props) =>
    props.$active ? "rgba(255,255,255,0.2)" : "#e2e8f0"};
  color: ${(props) => (props.$active ? "white" : "#64748b")};
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const NotificationsContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const NotificationsList = styled.div`
  max-height: 60vh;
  overflow-y: auto;
`;

const NotificationCard = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: ${(props) =>
    props.$selected ? "rgba(59, 130, 246, 0.05)" : "transparent"};
  position: relative;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(59, 130, 246, 0.02);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const SelectionCheckbox = styled.div`
  flex-shrink: 0;
  margin-top: 0.25rem;

  input {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 2px solid #d1d5db;
    cursor: pointer;

    &:checked {
      background: #3b82f6;
      border-color: #3b82f6;
    }
  }
`;

const NotificationIcon = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const NotificationTitle = styled.div`
  font-weight: ${(props) => (props.$unread ? "600" : "500")};
  color: #1e293b;
  font-size: 1.1rem;
  line-height: 1.4;
`;

const NotificationTime = styled.div`
  color: #94a3b8;
  font-size: 0.875rem;
  white-space: nowrap;
`;

const NotificationMessage = styled.div`
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 0.75rem;
`;

const NotificationMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NotificationType = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const IconButton = styled.button`
  background: rgba(100, 116, 139, 0.1);
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(100, 116, 139, 0.2);
    color: #475569;
  }
`;

const MarkAsReadButton = styled(IconButton)`
  &:hover {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }
`;

const DeleteButton = styled(IconButton)`
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
`;

const UnreadIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: #3b82f6;
  border-radius: 0 2px 2px 0;
`;

const SelectAllFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 1rem 0;
  margin-top: 1rem;
`;

const SelectAllCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #64748b;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }

  input {
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 2px solid #d1d5db;
    cursor: pointer;

    &:checked {
      background: #3b82f6;
      border-color: #3b82f6;
    }
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;

  h3 {
    color: #ef4444;
    margin: 1rem 0 0.5rem 0;
  }
`;

const RetryButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #64748b;

  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;

const EmptyTitle = styled.h3`
  color: #374151;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
`;

const EmptyMessage = styled.p`
  margin: 0 0 1.5rem 0;
  max-width: 400px;
  line-height: 1.5;
`;

const ClearFilterButton = styled.button`
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #3b82f6;
    color: white;
  }
`;
