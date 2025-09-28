// src/components/NotificationBell.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetUserNotification,
  useUnreadCountData,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "../hooks/useNotification";
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiExternalLink,
  FiClock,
} from "react-icons/fi";

const NotificationBell = ({ mobileView = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Queries
  const {
    data: notificationData,
    isLoading,
    error,
  } = useGetUserNotification({ page: 1, limit: 8, sort: "-createdAt" });
  const notifications = useMemo(() => {
    return notificationData?.data;
  }, [notificationData]);
  console.log("notifications", notifications);
  const { data: unreadCountData } = useUnreadCountData();
  const unreadCount = useMemo(() => {
    return unreadCountData?.data?.count;
  }, [unreadCountData]);

  // Mutations
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id || notification._id);
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }

    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    console.log("Mark all as read");
    markAllAsRead();
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_confirmed":
        return <FiCheck style={{ color: "#10b981" }} />;
      case "payment_success":
        return <FiCheck style={{ color: "#10b981" }} />;
      case "booking_created":
        return <FiClock style={{ color: "#f59e0b" }} />;
      case "booking_cancelled":
        return <FiClock style={{ color: "#ef4444" }} />;
      default:
        return <FiBell style={{ color: "#3b82f6" }} />;
    }
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
    return date.toLocaleDateString();
  };

  // Extract notifications from data

  const displayCount = unreadCount > 99 ? "99+" : unreadCount;
  const hasNotifications = notifications && notifications.length > 0;

  return (
    <BellContainer ref={dropdownRef} $mobileView={mobileView}>
      <BellButton
        onClick={toggleDropdown}
        $hasUnread={unreadCount > 0}
        $mobileView={mobileView}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBell size={mobileView ? 20 : 18} />
        {unreadCount > 0 && (
          <NotificationBadge $mobileView={mobileView}>
            {displayCount}
          </NotificationBadge>
        )}
      </BellButton>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            $mobileView={mobileView}
          >
            <DropdownHeader>
              <DropdownTitle>Notifications</DropdownTitle>
              <HeaderActions>
                {unreadCount > 0 && (
                  <MarkAllReadButton onClick={handleMarkAllAsRead}>
                    Mark all read
                  </MarkAllReadButton>
                )}
                <ViewAllLink to="/notifications">View all</ViewAllLink>
              </HeaderActions>
            </DropdownHeader>

            <NotificationList>
              {isLoading ? (
                <LoadingState>
                  <LoadingSpinner />
                  Loading notifications...
                </LoadingState>
              ) : error ? (
                <ErrorState>Failed to load notifications</ErrorState>
              ) : !hasNotifications ? (
                <EmptyState>
                  <FiBell size={32} />
                  <span>No notifications yet</span>
                  <p>We'll notify you when something arrives</p>
                </EmptyState>
              ) : (
                notifications.slice(0, 8).map((notification) => (
                  <NotificationItem
                    key={notification.id || notification._id}
                    $unread={!notification.read}
                    onClick={() => handleNotificationClick(notification)}
                    whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                  >
                    <NotificationIcon>
                      {getNotificationIcon(notification.type)}
                    </NotificationIcon>

                    <NotificationContent>
                      <NotificationTitle $unread={!notification.read}>
                        {notification.title}
                      </NotificationTitle>
                      <NotificationMessage>
                        {notification.message}
                      </NotificationMessage>
                      <NotificationTime>
                        {formatTime(notification.createdAt)}
                      </NotificationTime>
                    </NotificationContent>

                    <NotificationActions>
                      {notification.actionUrl && (
                        <ActionButton
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(notification.actionUrl);
                          }}
                        >
                          <FiExternalLink size={12} />
                        </ActionButton>
                      )}
                      <ActionButton
                        onClick={(e) =>
                          handleDeleteNotification(
                            e,
                            notification.id || notification._id
                          )
                        }
                      >
                        <FiTrash2 size={12} />
                      </ActionButton>
                    </NotificationActions>

                    {!notification.read && <UnreadIndicator />}
                  </NotificationItem>
                ))
              )}
            </NotificationList>
          </DropdownMenu>
        )}
      </AnimatePresence>
    </BellContainer>
  );
};

export default NotificationBell;

// Styled Components
const BellContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: ${(props) => (props.$mobileView ? "0" : "0.5rem")};
`;

const BellButton = styled(motion.button)`
  position: relative;
  background: ${(props) =>
    props.$hasUnread ? "rgba(239, 68, 68, 0.1)" : "transparent"};
  border: ${(props) =>
    props.$hasUnread
      ? "1px solid rgba(239, 68, 68, 0.2)"
      : "1px solid transparent"};
  border-radius: ${(props) => (props.$mobileView ? "8px" : "50%")};
  padding: ${(props) => (props.$mobileView ? "0.75rem" : "0.5rem")};
  cursor: pointer;
  color: ${(props) => (props.$hasUnread ? "#ef4444" : "#64748b")};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.$hasUnread ? "rgba(239, 68, 68, 0.15)" : "rgba(59, 130, 246, 0.1)"};
    color: ${(props) => (props.$hasUnread ? "#ef4444" : "#3b82f6")};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: ${(props) => (props.$mobileView ? "8px" : "4px")};
  right: ${(props) => (props.$mobileView ? "8px" : "4px")};
  background: #ef4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: ${(props) => (props.$mobileView ? "11px" : "10px")};
  font-weight: 700;
  min-width: 18px;
  text-align: center;
  line-height: 1;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: ${(props) => (props.$mobileView ? "0" : "0")};
  margin-top: 0.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  width: ${(props) => (props.$mobileView ? "calc(100vw - 2rem)" : "380px")};
  max-height: 500px;
  display: flex;
  flex-direction: column;
  z-index: 1001;

  @media (max-width: 480px) {
    width: ${(props) => (props.$mobileView ? "calc(100vw - 1rem)" : "320px")};
    right: ${(props) => (props.$mobileView ? "0" : "-1rem")};
  }
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const DropdownTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const MarkAllReadButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }
`;

const ViewAllLink = styled(Link)`
  color: #64748b;
  font-size: 0.875rem;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(100, 116, 139, 0.1);
    color: #475569;
  }
`;

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #64748b;
  justify-content: center;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

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
  padding: 2rem;
  text-align: center;
  color: #ef4444;
`;

const EmptyState = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: #64748b;

  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  span {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
`;

const NotificationItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
  background: ${(props) =>
    props.$unread ? "rgba(59, 130, 246, 0.02)" : "transparent"};
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(59, 130, 246, 0.05);
  }
`;

const NotificationIcon = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.div`
  font-weight: ${(props) => (props.$unread ? "600" : "500")};
  color: ${(props) => (props.$unread ? "#1e293b" : "#475569")};
  margin-bottom: 0.25rem;
  line-height: 1.4;
`;

const NotificationMessage = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const NotificationTime = styled.div`
  color: #94a3b8;
  font-size: 0.75rem;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${NotificationItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: rgba(100, 116, 139, 0.1);
  border: none;
  border-radius: 4px;
  padding: 0.375rem;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    background: rgba(100, 116, 139, 0.2);
    color: #475569;
  }
`;

const UnreadIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: #3b82f6;
  border-radius: 0 2px 2px 0;
`;
