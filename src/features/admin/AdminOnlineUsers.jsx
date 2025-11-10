import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiUser, FiMessageCircle, FiClock, FiUsers } from "react-icons/fi";
import { useSocket } from "../../app/providers/SocketProvider";
import api from "../../services/apiClient";
import { Card } from "../../components/Cards/Card";
import { PrimaryButton } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { devices } from "../../styles/GlobalStyles";
import { toast } from "react-hot-toast";

const AdminOnlineUsers = () => {
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join admin room to receive updates
    socket.emit("joinAdminRoom");

    // Request current online users
    socket.emit("getOnlineUsers");

    // Listen for online users list
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users || []);
      setIsLoading(false);
    };

    // Listen for user coming online
    const handleUserOnline = (user) => {
      setOnlineUsers((prev) => {
        // Check if user already exists
        const exists = prev.some((u) => u.userId === user.userId);
        if (exists) {
          return prev.map((u) =>
            u.userId === user.userId ? { ...u, ...user } : u
          );
        }
        return [...prev, user];
      });
    };

    // Listen for user going offline
    const handleUserOffline = (data) => {
      setOnlineUsers((prev) =>
        prev.filter((u) => u.userId !== data.userId)
      );
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [socket, isConnected]);

  const handleStartChat = async (userId) => {
    try {
      // Get or create session for this user
      const response = await api.get(`/chat/admin/session/user/${userId}`);
      if (response.data.status === "success" && response.data.data) {
        const session = response.data.data;
        // Navigate to chat detail page
        navigate(`/admin/chats/${session._id}`);
      }
    } catch (error) {
      console.error("Error getting/creating session:", error);
      toast.error("Failed to start chat session");
    }
  };

  const formatTime = (date) => {
    if (!date) return "Just now";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner message="Loading online users..." />
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <HeaderSection>
        <HeaderContent>
          <HeaderTitle>Online Users</HeaderTitle>
          <HeaderSubtitle>
            Monitor and chat with users currently online
          </HeaderSubtitle>
        </HeaderContent>
        <StatsCard>
          <StatIcon>
            <FiUsers />
          </StatIcon>
          <StatValue>{onlineUsers.length}</StatValue>
          <StatLabel>Online Now</StatLabel>
        </StatsCard>
      </HeaderSection>

      {/* Online Users List */}
      {onlineUsers.length === 0 ? (
        <EmptyState>
          <EmptyIcon>👥</EmptyIcon>
          <EmptyText>No users online at the moment</EmptyText>
          <EmptySubtext>
            Users will appear here when they connect to the chat system
          </EmptySubtext>
        </EmptyState>
      ) : (
        <UsersGrid>
          {onlineUsers.map((user) => (
            <UserCard key={user.userId}>
              <UserHeader>
                <UserAvatar>
                  {user.fullName?.[0]?.toUpperCase() || "U"}
                </UserAvatar>
                <UserInfo>
                  <UserName>{user.fullName || "Unknown User"}</UserName>
                  <UserEmail>{user.email || ""}</UserEmail>
                </UserInfo>
                <OnlineBadge>
                  <OnlineDot />
                  Online
                </OnlineBadge>
              </UserHeader>

              <UserDetails>
                <DetailRow>
                  <DetailLabel>Role:</DetailLabel>
                  <RoleBadge $role={user.role}>{user.role}</RoleBadge>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Connected:</DetailLabel>
                  <DetailValue>
                    <FiClock /> {formatTime(user.connectedAt)}
                  </DetailValue>
                </DetailRow>
              </UserDetails>

              <UserActions>
                <ChatButton onClick={() => handleStartChat(user.userId)}>
                  <FiMessageCircle />
                  Start Chat
                </ChatButton>
              </UserActions>
            </UserCard>
          ))}
        </UsersGrid>
      )}
    </Container>
  );
};

export default AdminOnlineUsers;

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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xl);
  gap: var(--space-lg);

  @media ${devices.mobile} {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

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

const StatsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-lg);
  min-width: 150px;
`;

const StatIcon = styled.div`
  font-size: var(--text-2xl);
  color: var(--primary);
  margin-bottom: var(--space-sm);
`;

const StatValue = styled.div`
  font-size: var(--text-3xl);
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

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);

  @media ${devices.mobile} {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled(Card)`
  padding: var(--space-lg);
  transition: all var(--transition-normal);
  border: 1px solid var(--gray-200);

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
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

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-heading);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OnlineBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: var(--success)15;
  color: var(--success);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
  flex-shrink: 0;
`;

const OnlineDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const UserDetails = styled.div`
  margin-bottom: var(--space-md);
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const DetailLabel = styled.span`
  color: var(--text-muted);
`;

const DetailValue = styled.span`
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: var(--font-medium);
`;

const RoleBadge = styled.span`
  padding: 4px 8px;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  font-family: var(--font-body);
  background: ${({ $role }) =>
    $role === "admin"
      ? "var(--accent)15"
      : $role === "driver"
      ? "var(--primary)15"
      : "var(--gray-200)"};
  color: ${({ $role }) =>
    $role === "admin"
      ? "var(--accent)"
      : $role === "driver"
      ? "var(--primary)"
      : "var(--text-muted)"};
`;

const UserActions = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const ChatButton = styled(PrimaryButton)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  font-size: var(--text-sm);
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
  font-family: var(--font-heading);
  margin-bottom: var(--space-xs);
  color: var(--text-primary);
`;

const EmptySubtext = styled.div`
  font-size: var(--text-sm);
  font-family: var(--font-body);
  color: var(--text-muted);
`;

