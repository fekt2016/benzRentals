import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { FiMessageCircle, FiClock, FiUser, FiSearch, FiAlertCircle, FiUsers } from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../services/apiClient";
import { Card } from "../../components/Cards/Card";
import { PrimaryButton } from "../../components/ui/Button";
import { LoadingSpinner, ErrorState } from "../../components/ui/LoadingSpinner";
import { SearchInput, FormField } from "../../components/forms/Form";
import { devices } from "../../styles/GlobalStyles";
import { useSocket } from "../../app/providers/SocketProvider";

const AdminChatDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showWaitingChats, setShowWaitingChats] = useState(false);

  const {
    data: sessionsData,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["chatSessions"],
    queryFn: async () => {
      const response = await api.get("/chat/admin/sessions");
      return response.data.data;
    },
    // Remove polling - use Socket.io for real-time updates
  });

  const {
    data: waitingChatsData,
    isPending: isWaitingPending,
    refetch: refetchWaiting,
  } = useQuery({
    queryKey: ["waitingChats"],
    queryFn: async () => {
      const response = await api.get("/chat/admin/waiting");
      return response.data.data;
    },
  });

  const sessions = useMemo(() => sessionsData || [], [sessionsData]);
  const waitingChats = useMemo(() => waitingChatsData || [], [waitingChatsData]);

  // Socket.io: Listen for real-time session updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join admin room to receive all chat updates
    socket.emit("joinAdminRoom");

    // Listen for new user chat started (only add if assigned to this admin)
    const handleUserChatStarted = (data) => {
      if (data.sessionId && data.session) {
        // Only add if this session is assigned to the current admin
        // Note: New chats won't be assigned yet, so they won't appear until admin joins
        queryClient.setQueryData(["chatSessions"], (oldData) => {
          if (!oldData) return [];
          // Only update if session is assigned to current admin
          const sessionBelongsToAdmin = data.session.assignedAdmin && 
            (typeof data.session.assignedAdmin === 'string' || data.session.assignedAdmin._id);
          
          if (!sessionBelongsToAdmin) {
            return oldData; // Don't add sessions not assigned to this admin
          }

          const updatedSessions = oldData.map((session) =>
            session._id === data.sessionId ? data.session : session
          );
          // Check if session is new
          const exists = oldData.some((s) => s._id === data.sessionId);
          if (!exists) {
            updatedSessions.unshift(data.session);
          }
          // Sort: waiting first, then by lastMessageAt descending
          return updatedSessions.sort((a, b) => {
            if (a.status === "waiting" && b.status !== "waiting") return -1;
            if (a.status !== "waiting" && b.status === "waiting") return 1;
            return new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0);
          });
        });
      }
    };

    // Listen for new support requests (when user escalates)
    const handleNewSupportRequest = (data) => {
      if (data.sessionId && data.session) {
        // Show notification and refresh waiting chats list
        toast.info(`New support request from ${data.session.userId?.fullName || "User"}`, {
          duration: 5000,
          icon: "🚨",
        });
        // Refetch waiting chats to show the new request
        queryClient.invalidateQueries({ queryKey: ["waitingChats"] });
      }
    };

    // Listen for chat updates from admin room
    const handleChatUpdate = (data) => {
      if (data.sessionId && data.session) {
        // Only update if session is assigned to current admin
        queryClient.setQueryData(["chatSessions"], (oldData) => {
          if (!oldData) return [];
          // Check if this session belongs to current admin
          const sessionBelongsToAdmin = data.session.assignedAdmin && 
            (typeof data.session.assignedAdmin === 'string' || data.session.assignedAdmin._id);
          
          if (!sessionBelongsToAdmin) {
            // Don't add sessions not assigned to this admin
            return oldData;
          }

          const updatedSessions = oldData.map((session) =>
            session._id === data.sessionId ? data.session : session
          );
          // Check if session is new
          const exists = oldData.some((s) => s._id === data.sessionId);
          if (!exists) {
            updatedSessions.unshift(data.session);
          }
          // Sort: waiting first, then by lastMessageAt descending
          return updatedSessions.sort((a, b) => {
            if (a.status === "waiting" && b.status !== "waiting") return -1;
            if (a.status !== "waiting" && b.status === "waiting") return 1;
            return new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0);
          });
        });
      }
    };

    // Listen for new messages (backward compatibility)
    const handleNewMessage = (data) => {
      if (data.sessionId && data.session) {
        handleChatUpdate(data);
      }
    };

    // Listen for session updates (backward compatibility)
    const handleSessionUpdate = (data) => {
      if (data.sessionId && data.session) {
        handleChatUpdate(data);
      }
    };

    // Listen for session created (backward compatibility)
    const handleSessionCreated = (data) => {
      if (data.sessionId && data.session) {
        handleChatUpdate(data);
      }
    };

    socket.on("userChatStarted", handleUserChatStarted);
    socket.on("newSupportRequest", handleNewSupportRequest);
    socket.on("chatUpdate", handleChatUpdate);
    socket.on("new_message", handleNewMessage);
    socket.on("session_updated", handleSessionUpdate);
    socket.on("session_created", handleSessionCreated);

    return () => {
      socket.off("userChatStarted", handleUserChatStarted);
      socket.off("newSupportRequest", handleNewSupportRequest);
      socket.off("chatUpdate", handleChatUpdate);
      socket.off("new_message", handleNewMessage);
      socket.off("session_updated", handleSessionUpdate);
      socket.off("session_created", handleSessionCreated);
    };
  }, [socket, isConnected, queryClient]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const userName = session.userId?.fullName || "";
      const matchesSearch =
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchTerm, statusFilter]);

  const sessionStats = useMemo(
    () => ({
      total: sessions.length, // Only chats assigned to this admin
      bot: sessions.filter((s) => s.status === "bot").length,
      waiting: sessions.filter((s) => s.status === "waiting").length,
      active: sessions.filter((s) => s.status === "active").length,
      closed: sessions.filter((s) => s.status === "closed").length,
    }),
    [sessions]
  );

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

  const handleViewChat = (sessionId) => {
    navigate(`/admin/chats/${sessionId}`);
  };

  const handleJoinChat = async (sessionId) => {
    try {
      const response = await api.post(`/chat/admin/join/${sessionId}`);
      if (response.data.status === "success") {
        toast.success("Successfully joined chat session");
        // Refetch sessions to update the list
        refetch();
        refetchWaiting();
        setShowWaitingChats(false);
        navigate(`/admin/chats/${sessionId}`);
      }
    } catch (error) {
      console.error("Error joining chat:", error);
      toast.error(error?.response?.data?.message || "Failed to join chat session");
    }
  };

  if (isPending) {
    return (
      <Container>
        <LoadingSpinner message="Loading chat sessions..." />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorState
          title="Error Loading Chat Sessions"
          message={error?.message || "Failed to load chat sessions."}
          action={
            <PrimaryButton onClick={() => refetch()}>Retry</PrimaryButton>
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
          <HeaderTitle>My Chat Sessions</HeaderTitle>
          <HeaderSubtitle>Chats assigned to you</HeaderSubtitle>
        </HeaderContent>
        <HeaderActions>
          <ViewUsersButton onClick={() => navigate("/admin/chat-users")}>
            <FiUsers />
            My Users
          </ViewUsersButton>
          {waitingChats.length > 0 && (
            <WaitingChatsButton onClick={() => setShowWaitingChats(!showWaitingChats)}>
              <FiAlertCircle />
              Waiting Chats ({waitingChats.length})
            </WaitingChatsButton>
          )}
        </HeaderActions>
      </HeaderSection>

      {/* Stats */}
      <StatsGrid>
        <StatCard>
          <StatIcon $color="var(--primary)">
            <FiMessageCircle />
          </StatIcon>
          <StatContent>
            <StatValue>{sessionStats.total}</StatValue>
            <StatLabel>Total Sessions</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="var(--primary)">
            <FiMessageCircle />
          </StatIcon>
          <StatContent>
            <StatValue>{sessionStats.bot}</StatValue>
            <StatLabel>Bot Chats (Monitoring)</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="var(--warning)">
            <FiAlertCircle />
          </StatIcon>
          <StatContent>
            <StatValue>{sessionStats.waiting}</StatValue>
            <StatLabel>Waiting for Agent</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="var(--success)">
            <FiClock />
          </StatIcon>
          <StatContent>
            <StatValue>{sessionStats.active}</StatValue>
            <StatLabel>Active Sessions</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="var(--gray-500)">
            <FiUser />
          </StatIcon>
          <StatContent>
            <StatValue>{sessionStats.closed}</StatValue>
            <StatLabel>Closed Sessions</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      {/* Controls */}
      <ControlsCard>
        <ControlsGrid>
          <FormField>
            <SearchInput
              placeholder="Search by user name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormField>
          <FormField>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All User Chats</option>
              <option value="bot">Bot Chat (Monitoring)</option>
              <option value="waiting">Waiting for Agent</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </Select>
          </FormField>
        </ControlsGrid>
      </ControlsCard>

      {/* Waiting Chats Section */}
      {showWaitingChats && waitingChats.length > 0 && (
        <WaitingSection>
          <WaitingHeader>
            <WaitingTitle>Waiting Chats - Join to Assign to You</WaitingTitle>
            <CloseWaitingButton onClick={() => setShowWaitingChats(false)}>×</CloseWaitingButton>
          </WaitingHeader>
          <WaitingList>
            {waitingChats.map((session) => (
              <SessionCard key={session._id}>
                <SessionHeader>
                  <UserInfo>
                    <UserAvatar>
                      {session.userId?.fullName?.[0] || "U"}
                    </UserAvatar>
                    <UserDetails>
                      <UserName>
                        {session.userId?.fullName || "Unknown User"}
                      </UserName>
                      <UserEmail>{session.userId?.email || ""}</UserEmail>
                    </UserDetails>
                  </UserInfo>
                  <StatusBadge $status="waiting">
                    ⏳ Waiting for Agent
                  </StatusBadge>
                </SessionHeader>
                <SessionBody>
                  <LastMessage>
                    <MessageLabel>Last Message:</MessageLabel>
                    <MessageText>
                      {truncateMessage(session.lastMessage)}
                    </MessageText>
                  </LastMessage>
                  <TimeInfo>
                    <FiClock />
                    <TimeText>{formatTime(session.escalatedAt || session.lastMessageAt)}</TimeText>
                  </TimeInfo>
                </SessionBody>
                <SessionFooter>
                  <JoinButton onClick={() => handleJoinChat(session._id)}>
                    Join Chat
                  </JoinButton>
                </SessionFooter>
              </SessionCard>
            ))}
          </WaitingList>
        </WaitingSection>
      )}

      {/* Sessions List */}
      <SessionsSection>
        {filteredSessions.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>No chat sessions assigned to you</EmptyText>
            <EmptySubtext>Join a chat or wait for a user to request support</EmptySubtext>
          </EmptyState>
        ) : (
          <SessionsList>
            {filteredSessions.map((session) => (
              <SessionCard key={session._id}>
                <SessionHeader>
                  <UserInfo>
                    <UserAvatar>
                      {session.userId?.fullName?.[0] || "U"}
                    </UserAvatar>
                    <UserDetails>
                      <UserName>
                        {session.userId?.fullName || "Unknown User"}
                      </UserName>
                      <UserEmail>{session.userId?.email || ""}</UserEmail>
                    </UserDetails>
                  </UserInfo>
                  <StatusBadge $status={session.status}>
                    {session.status === "bot" && "🤖 Bot Chat"}
                    {session.status === "waiting" && "⏳ Waiting for Agent"}
                    {session.status === "active" && "✅ Active"}
                    {session.status === "closed" && "🔒 Closed"}
                  </StatusBadge>
                </SessionHeader>

                <SessionBody>
                  <LastMessage>
                    <MessageLabel>Last Message:</MessageLabel>
                    <MessageText>
                      {truncateMessage(session.lastMessage)}
                    </MessageText>
                  </LastMessage>
                  <TimeInfo>
                    <FiClock />
                    <TimeText>{formatTime(session.lastMessageAt)}</TimeText>
                  </TimeInfo>
                </SessionBody>

                <SessionFooter>
                  {session.status === "waiting" ? (
                    <JoinButton onClick={() => handleJoinChat(session._id)}>
                      Join Chat
                    </JoinButton>
                  ) : session.status === "bot" ? (
                    <ViewButton onClick={() => handleViewChat(session._id)}>
                      Monitor Chat
                    </ViewButton>
                  ) : (
                    <ViewButton onClick={() => handleViewChat(session._id)}>
                      View Chat
                    </ViewButton>
                  )}
                </SessionFooter>
              </SessionCard>
            ))}
          </SessionsList>
        )}
      </SessionsSection>
    </Container>
  );
};

export default AdminChatDashboard;

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

const ViewUsersButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--text-sm);
`;

const WaitingChatsButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--text-sm);
  background: var(--warning);
  color: var(--white);

  &:hover {
    background: var(--warning-dark);
  }
`;

const WaitingSection = styled.div`
  margin-bottom: var(--space-xl);
  padding: var(--space-lg);
  background: var(--warning)10;
  border-radius: var(--radius-lg);
  border: 2px solid var(--warning);
`;

const WaitingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
`;

const WaitingTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--warning);
  font-family: var(--font-heading);
`;

const CloseWaitingButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--gray-200);
  color: var(--text-primary);
  font-size: var(--text-xl);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--gray-300);
  }
`;

const WaitingList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-lg);

  @media ${devices.tablet} {
    grid-template-columns: 1fr;
  }
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
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  font-family: var(--font-heading);
`;

const StatLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
  margin-top: 4px;
`;

const ControlsCard = styled(Card)`
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-md);

  @media ${devices.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  outline: none;
  transition: all var(--transition-fast);
  background: var(--white);
  color: var(--text-primary);

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(92, 206, 251, 0.1);
  }
`;

const SessionsSection = styled.div`
  margin-top: var(--space-xl);
`;

const SessionsList = styled.div`
  display: grid;
  gap: var(--space-lg);
`;

const SessionCard = styled(Card)`
  padding: var(--space-lg);
  transition: all var(--transition-normal);
  cursor: pointer;
  border: 1px solid var(--gray-200);

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const UserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-semibold);
  font-size: var(--text-lg);
  font-family: var(--font-heading);
`;

const UserDetails = styled.div``;

const UserName = styled.div`
  font-size: var(--text-base);
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

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  font-family: var(--font-body);
  background: ${({ $status }) =>
    $status === "active" ? "var(--success)" : "var(--gray-400)"}15;
  color: ${({ $status }) =>
    $status === "active" ? "var(--success)" : "var(--gray-600)"};
`;

const SessionBody = styled.div`
  margin-bottom: var(--space-md);
`;

const LastMessage = styled.div`
  margin-bottom: var(--space-sm);
`;

const MessageLabel = styled.div`
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-body);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MessageText = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  line-height: 1.5;
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-family: var(--font-body);
`;

const TimeText = styled.span``;

const SessionFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-md);
  border-top: 1px solid var(--gray-200);
`;

const JoinButton = styled(PrimaryButton)`
  background: var(--warning);
  color: var(--white);

  &:hover {
    background: var(--warning-dark);
  }
`;

const ViewButton = styled(PrimaryButton)`
  padding: var(--space-sm) var(--space-lg);
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
  color: var(--text-primary);
  font-family: var(--font-heading);
  margin-bottom: var(--space-xs);
`;

const EmptySubtext = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

