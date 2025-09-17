import React from "react";
import styled from "styled-components";
import { FaBell } from "react-icons/fa";

const Container = styled.div`
  padding: 2rem;
`;
const NotificationCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 1rem;
  background-color: ${({ theme }) => theme.colors.white};
`;

const NotificationsPage = () => {
  const notifications = [
    { id: 1, message: "New booking from John Doe", time: "2 mins ago" },
    {
      id: 2,
      message: "Car E-Class is due for maintenance",
      time: "1 hour ago",
    },
  ];

  return (
    <Container>
      <h1>Notifications</h1>
      {notifications.map((n) => (
        <NotificationCard key={n.id}>
          <FaBell color="#FF4D4F" />
          <div>
            <p>{n.message}</p>
            <small>{n.time}</small>
          </div>
        </NotificationCard>
      ))}
    </Container>
  );
};

export default NotificationsPage;
