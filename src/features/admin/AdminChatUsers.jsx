import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { FiUser, FiMessageCircle, FiClock, FiChevronRight } from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../services/apiClient";
import { Card } from "../../components/Cards/Card";
import { LoadingSpinner, ErrorState } from "../../components/ui/LoadingSpinner";
import { devices } from "../../styles/GlobalStyles";
import AdminUserChatHistory from "./AdminUserChatHistory";

const AdminChatUsers = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const {
    data: usersData,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminChatUsers"],
    queryFn: async () => {
      const response = await api.get("/chat/admin/users");
      return response.data.data;
    },
  });

  const users = usersData || [];

  const formatTime = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return "No messages";
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleBack = () => {
    setSelectedUserId(null);
  };

  if (selectedUserId) {
    return <AdminUserChatHistory userId={selectedUserId} onBack={handleBack} />;
  }

  if (isPending) {
    return (
      <Container>
        <LoadingSpinner message="Loading your chat users..." />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorState
          title="Error Loading Chat Users"
          message={error?.message || "Failed to load chat users."}
          action={
            <button onClick={() => refetch()}>Retry</button>
          }
        />
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <HeaderSection>
        <HeaderContent>
          <HeaderTitle>My Chat Users</HeaderTitle>
          <HeaderSubtitle>Users you have chatted with</HeaderSubtitle>
        </HeaderContent>
      </HeaderSection>

      {/* Users List */}
      <UsersSection>
        {users.length === 0 ? (
          <EmptyState>
            <EmptyIcon>👥</EmptyIcon>
            <EmptyText>You haven't chatted with any users yet</EmptyText>
            <EmptySubtext>Start chatting with users to see them here</EmptySubtext>
          </EmptyState>
        ) : (
          <UsersList>
            {users.map((userData) => (
              <UserCard key={userData.userId._id} onClick={() => handleUserClick(userData.userId._id)}>
                <UserHeader>
                  <UserAvatar>
                    {userData.userId.fullName?.[0] || "U"}
                  </UserAvatar>
                  <UserDetails>
                    <UserName>{userData.userId.fullName || "Unknown User"}</UserName>
                    <UserEmail>{userData.userId.email || ""}</UserEmail>
                  </UserDetails>
                  <ChevronIcon>
                    <FiChevronRight />
                  </ChevronIcon>
                </UserHeader>
                <UserBody>
                  <LastMessage>
                    <MessageLabel>Last Message:</MessageLabel>
                    <MessageText>{truncateMessage(userData.lastMessage)}</MessageText>
                  </LastMessage>
                  <UserStats>
                    <StatItem>
                      <FiMessageCircle />
                      <StatText>{userData.chatCount} chat{userData.chatCount !== 1 ? "s" : ""}</StatText>
                    </StatItem>
                    <StatItem>
                      <FiClock />
                      <StatText>{formatTime(userData.lastMessageAt)}</StatText>
                    </StatItem>
                  </UserStats>
                  <StatusBadge $status={userData.status}>
                    {userData.status === "waiting" && "⏳ Waiting"}
                    {userData.status === "active" && "✅ Active"}
                    {userData.status === "closed" && "🔒 Closed"}
                  </StatusBadge>
                </UserBody>
              </UserCard>
            ))}
          </UsersList>
        )}
      </UsersSection>
    </Container>
  );
};

export default AdminChatUsers;

// Styled Components
const Container = styled.div`
  padding: var(--space-xl);
  max-width: 1400px;
  margin: 0 auto;

  @media ${devices.tablet} {
    padding: var(--space-lg);
  }

  @media ${devices.mobile} {
    padding: var(--space-md);
  }
`;

const HeaderSection = styled.div`
  margin-bottom: var(--space-xl);
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

const UsersSection = styled.div`
  margin-top: var(--space-xl);
`;

const UsersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-lg);

  @media ${devices.tablet} {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled(Card)`
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid var(--gray-200);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary);
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--gray-200);
`;

const UserAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-semibold);
  font-size: var(--text-xl);
  font-family: var(--font-heading);
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-heading);
  margin-bottom: 4px;
`;

const UserEmail = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const ChevronIcon = styled.div`
  color: var(--text-muted);
  font-size: var(--text-xl);
`;

const UserBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const LastMessage = styled.div`
  margin-bottom: var(--space-sm);
`;

const MessageLabel = styled.div`
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  font-family: var(--font-body);
`;

const MessageText = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  line-height: 1.5;
`;

const UserStats = styled.div`
  display: flex;
  gap: var(--space-md);
  align-items: center;
  margin-top: var(--space-xs);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const StatText = styled.span``;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-body);
  background: ${({ $status }) =>
    $status === "active"
      ? "var(--success)15"
      : $status === "waiting"
      ? "var(--warning)15"
      : $status === "closed"
      ? "var(--gray-200)"
      : "var(--primary)15"};
  color: ${({ $status }) =>
    $status === "active"
      ? "var(--success)"
      : $status === "waiting"
      ? "var(--warning)"
      : $status === "closed"
      ? "var(--text-muted)"
      : "var(--primary)"};
  align-self: flex-start;
  margin-top: var(--space-xs);
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
  margin-bottom: var(--space-xs);
  font-family: var(--font-heading);
`;

const EmptySubtext = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

