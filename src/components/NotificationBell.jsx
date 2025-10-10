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

import { LoadingSpinner, EmptyState, ErrorState } from "./ui/LoadingSpinner";

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
        return <FiCheck style={{ color: "var(--success)" }} />;
      case "payment_success":
        return <FiCheck style={{ color: "var(--success)" }} />;
      case "booking_created":
        return <FiClock style={{ color: "var(--warning)" }} />;
      case "booking_cancelled":
        return <FiClock style={{ color: "var(--error)" }} />;
      default:
        return <FiBell style={{ color: "var(--primary)" }} />;
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
                  <LoadingSpinner size="sm" />
                  Loading notifications...
                </LoadingState>
              ) : error ? (
                <ErrorState>Failed to load notifications</ErrorState>
              ) : !hasNotifications ? (
                <EmptyState
                  icon={<FiBell size={32} />}
                  title="No notifications yet"
                  message="We'll notify you when something arrives"
                />
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

// Styled Components using Global Styles
const BellContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: ${(props) => (props.$mobileView ? "0" : "var(--space-sm)")};
  font-family: var(--font-body);
`;

const BellButton = styled(motion.button)`
  position: relative;
  background: ${(props) =>
    props.$hasUnread ? "rgba(239, 68, 68, 0.1)" : "transparent"};
  border: ${(props) =>
    props.$hasUnread
      ? "1px solid rgba(239, 68, 68, 0.2)"
      : "1px solid transparent"};
  border-radius: ${(props) =>
    props.$mobileView ? "var(--radius-md)" : "var(--radius-full)"};
  padding: ${(props) =>
    props.$mobileView ? "var(--space-md)" : "var(--space-sm)"};
  cursor: pointer;
  color: ${(props) =>
    props.$hasUnread ? "var(--error)" : "var(--text-muted)"};
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.$hasUnread ? "rgba(239, 68, 68, 0.15)" : "rgba(59, 130, 246, 0.1)"};
    color: ${(props) => (props.$hasUnread ? "var(--error)" : "var(--primary)")};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: ${(props) =>
    props.$mobileView ? "var(--space-sm)" : "var(--space-xs)"};
  right: ${(props) =>
    props.$mobileView ? "var(--space-sm)" : "var(--space-xs)"};
  background: var(--error);
  color: var(--white);
  border-radius: var(--radius-full);
  padding: var(--space-xs) var(--space-sm);
  font-size: ${(props) =>
    props.$mobileView ? "var(--text-xs)" : "var(--text-xs)"};
  font-weight: var(--font-bold);
  min-width: 18px;
  text-align: center;
  line-height: 1;
  font-family: var(--font-body);
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: ${(props) => (props.$mobileView ? "0" : "0")};
  margin-top: var(--space-sm);
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
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
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--gray-200);
`;

const DropdownTitle = styled.h3`
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--space-md);
  align-items: center;
`;

const MarkAllReadButton = styled.button`
  background: none;
  border: none;
  color: var(--primary);
  font-size: var(--text-sm);
  cursor: pointer;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    background: rgba(211, 47, 47, 0.1);
  }
`;

const ViewAllLink = styled(Link)`
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-decoration: none;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    background: var(--gray-100);
    color: var(--text-secondary);
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
  gap: var(--space-md);
  padding: var(--space-xl);
  color: var(--text-muted);
  justify-content: center;
  font-family: var(--font-body);
`;

// const ErrorState = styled.div`
//   padding: var(--space-xl);
//   text-align: center;
//   color: var(--error);
//   font-family: var(--font-body);
// `;

const NotificationItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-xl);
  cursor: pointer;
  border-bottom: 1px solid var(--gray-100);
  position: relative;
  background: ${(props) =>
    props.$unread ? "rgba(211, 47, 47, 0.02)" : "transparent"};
  transition: background-color var(--transition-normal);
  font-family: var(--font-body);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(211, 47, 47, 0.05);
  }
`;

const NotificationIcon = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--gray-100);
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
  font-weight: ${(props) =>
    props.$unread ? "var(--font-semibold)" : "var(--font-medium)"};
  color: ${(props) =>
    props.$unread ? "var(--text-primary)" : "var(--text-secondary)"};
  margin-bottom: var(--space-xs);
  line-height: 1.4;
  font-family: var(--font-body);
`;

const NotificationMessage = styled.div`
  color: var(--text-muted);
  font-size: var(--text-sm);
  line-height: 1.4;
  margin-bottom: var(--space-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-family: var(--font-body);
`;

const NotificationTime = styled.div`
  color: var(--text-light);
  font-size: var(--text-xs);
  font-family: var(--font-body);
`;

const NotificationActions = styled.div`
  display: flex;
  gap: var(--space-xs);
  opacity: 0;
  transition: opacity var(--transition-normal);

  ${NotificationItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: var(--gray-100);
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-sm);
  cursor: pointer;
  color: var(--text-muted);
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    background: var(--gray-200);
    color: var(--text-secondary);
  }
`;

const UnreadIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: var(--primary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
`;
