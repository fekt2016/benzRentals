// components/NotificationBell.jsx
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNotifications } from "../hooks/useNotifications";
import {
  Bell,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Car,
  CreditCard,
  Shield,
} from "react-icons/fa";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isMarkingAsRead,
  } = useNotifications();

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

  const getIcon = (type) => {
    const iconProps = { size: 16 };
    switch (type) {
      case "booking_created":
      case "booking_confirmed":
      case "booking_cancelled":
        return <Car {...iconProps} />;
      case "payment_success":
      case "payment_failed":
        return <CreditCard {...iconProps} />;
      case "success":
        return <CheckCircle {...iconProps} />;
      case "error":
        return <AlertCircle {...iconProps} />;
      case "system_alert":
        return <Shield {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case "success":
      case "payment_success":
      case "booking_confirmed":
        return "#10b981";
      case "error":
      case "payment_failed":
        return "#ef4444";
      case "warning":
      case "booking_cancelled":
        return "#f59e0b";
      case "system_alert":
        return "#8b5cf6";
      default:
        return "#3b82f6";
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    setIsOpen(false);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Container ref={dropdownRef}>
      <BellButton
        onClick={() => setIsOpen(!isOpen)}
        $hasUnread={unreadCount > 0}
        disabled={isMarkingAsRead}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge>{unreadCount > 99 ? "99+" : unreadCount}</Badge>
        )}
      </BellButton>

      {isOpen && (
        <Dropdown>
          <Header>
            <Title>Notifications {unreadCount > 0 && `(${unreadCount})`}</Title>
            <HeaderActions>
              {unreadCount > 0 && (
                <MarkAllRead onClick={markAllAsRead}>Mark all read</MarkAllRead>
              )}
              <CloseButton onClick={() => setIsOpen(false)}>
                <X size={16} />
              </CloseButton>
            </HeaderActions>
          </Header>

          <NotificationList>
            {notifications.length === 0 ? (
              <EmptyState>
                <Bell size={32} color="#6b7280" />
                <EmptyText>No notifications</EmptyText>
              </EmptyState>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  $unread={!notification.read}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <IconWrapper $color={getIconColor(notification.type)}>
                    {getIcon(notification.type)}
                  </IconWrapper>
                  <Content>
                    <Message>{notification.message}</Message>
                    <Time>{formatTimeAgo(notification.createdAt)}</Time>
                  </Content>
                  <ActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <X size={12} />
                  </ActionButton>
                </NotificationItem>
              ))
            )}
          </NotificationList>

          {notifications.length > 0 && (
            <Footer>
              <ViewAllLink href="/notifications">
                View all notifications
              </ViewAllLink>
            </Footer>
          )}
        </Dropdown>
      )}
    </Container>
  );
};

export default NotificationBell;

// Styled components
const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const BellButton = styled.button`
  position: relative;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  color: ${(props) => (props.$hasUnread ? "#3b82f6" : "#6b7280")};
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ef4444;
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 380px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 0.5rem;

  @media (max-width: 480px) {
    width: 320px;
    right: -50px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MarkAllRead = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;

  &:hover {
    background: #eff6ff;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;

  &:hover {
    background: #f3f4f6;
  }
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  background: ${(props) => (props.$unread ? "#f0f9ff" : "transparent")};
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const IconWrapper = styled.div`
  color: ${(props) => props.$color};
  margin-top: 0.125rem;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Message = styled.p`
  margin: 0 0 0.25rem 0;
  color: #374151;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
`;

const Time = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s;

  ${NotificationItem}:hover & {
    opacity: 1;
  }

  &:hover {
    color: #ef4444;
    background: #fef2f2;
  }
`;

const EmptyState = styled.div`
  padding: 3rem 2rem;
  text-align: center;
  color: #6b7280;
`;

const EmptyText = styled.p`
  margin: 1rem 0 0 0;
  font-size: 0.9rem;
`;

const Footer = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #f3f4f6;
  text-align: center;
`;

const ViewAllLink = styled.a`
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;
