// src/pages/admin/NotificationsPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { FaBell, FaCheck, FaArrowRight } from "react-icons/fa";

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.h1`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.gray};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
`;

const NotificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const NotificationCard = styled.div`
  background-color: ${({ read }) => (read ? "#f3f4f6" : "#0ea5e9")};
  color: ${({ read }) => (read ? "#000" : "#fff")};
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-3px);
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotificationType = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;

const Badge = styled.span`
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  background-color: ${({ type }) => {
    if (type === "warning") return "#fbbf24";
    if (type === "danger") return "#ef4444";
    if (type === "info") return "#0ea5e9";
    return "#6b7280";
  }};
  color: #fff;
`;

const NotificationMessage = styled.p`
  font-size: 1rem;
  line-height: 1.4;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: auto;
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: ${({ bg }) => bg || "#fff"};
  color: ${({ color }) => color || "#000"};
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  &:hover {
    opacity: 0.85;
  }
`;

const dummyNotifications = [
  {
    id: 1,
    message: "Booking B001 is pending approval",
    type: "warning",
    read: false,
  },
  {
    id: 2,
    message: "Car C003 maintenance overdue",
    type: "danger",
    read: false,
  },
  { id: 3, message: "User John Doe registered", type: "info", read: true },
  { id: 4, message: "Booking B002 completed", type: "info", read: true },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [filter, setFilter] = useState("all");

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <Container>
      <Header>Notifications</Header>

      <FilterBar>
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All
        </FilterButton>
        <FilterButton
          active={filter === "warning"}
          onClick={() => setFilter("warning")}
        >
          Warning
        </FilterButton>
        <FilterButton
          active={filter === "danger"}
          onClick={() => setFilter("danger")}
        >
          Danger
        </FilterButton>
        <FilterButton
          active={filter === "info"}
          onClick={() => setFilter("info")}
        >
          Info
        </FilterButton>
      </FilterBar>

      <NotificationsGrid>
        {filteredNotifications.map((n) => (
          <NotificationCard key={n.id} read={n.read}>
            <NotificationHeader>
              <NotificationType>
                <FaBell style={{ marginRight: "0.4rem" }} />
                {n.type.toUpperCase()}
              </NotificationType>
              <Badge type={n.type}>{n.read ? "Read" : "Unread"}</Badge>
            </NotificationHeader>
            <NotificationMessage>{n.message}</NotificationMessage>
            <ActionBar>
              {!n.read && (
                <ActionButton
                  bg="#10b981"
                  color="#fff"
                  onClick={() => markAsRead(n.id)}
                >
                  <FaCheck /> Mark as Read
                </ActionButton>
              )}
              <ActionButton bg="#0ea5e9" color="#fff">
                <FaArrowRight /> View
              </ActionButton>
            </ActionBar>
          </NotificationCard>
        ))}
      </NotificationsGrid>
    </Container>
  );
};

export default NotificationsPage;
