import React from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { FiArrowLeft, FiUser, FiMessageCircle, FiClock } from "react-icons/fi";
import api from "../../services/apiClient";
import { Card } from "../../components/Cards/Card";
import { PrimaryButton } from "../../components/ui/Button";
import { LoadingSpinner, ErrorState } from "../../components/ui/LoadingSpinner";
import { devices } from "../../styles/GlobalStyles";
import { useNavigate } from "react-router-dom";

const AdminUserChatHistory = ({ userId, onBack }) => {
  const navigate = useNavigate();

  const {
    data: sessionsData,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminUserChatHistory", userId],
    queryFn: async () => {
      const response = await api.get(`/chat/admin/user/${userId}/history`);
      return response.data.data;
    },
    enabled: !!userId,
  });

  const sessions = sessionsData || [];
  const user = sessions[0]?.userId || null;

  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewChat = (sessionId) => {
    navigate(`/admin/chats/${sessionId}`);
  };

  if (isPending) {
    return (
      <Container>
        <LoadingSpinner message="Loading chat history..." />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorState
          title="Error Loading Chat History"
          message={error?.message || "Failed to load chat history."}
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
      <HeaderCard>
        <HeaderLeft>
          <BackButton onClick={onBack}>
            <FiArrowLeft />
          </BackButton>
          <UserInfo>
            <UserAvatar>
              {user?.fullName?.[0] || "U"}
            </UserAvatar>
            <UserDetails>
              <UserName>{user?.fullName || "Unknown User"}</UserName>
              <UserEmail>{user?.email || ""}</UserEmail>
            </UserDetails>
          </UserInfo>
        </HeaderLeft>
        <HeaderRight>
          <ChatCount>
            <FiMessageCircle />
            {sessions.length} Chat{sessions.length !== 1 ? "s" : ""}
          </ChatCount>
        </HeaderRight>
      </HeaderCard>

      {/* Chat History */}
      <HistorySection>
        {sessions.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>No chat history found</EmptyText>
          </EmptyState>
        ) : (
          <SessionsList>
            {sessions.map((session, index) => {
              const showDate =
                index === 0 ||
                formatDate(session.createdAt) !== formatDate(sessions[index - 1]?.createdAt);

              return (
                <React.Fragment key={session._id}>
                  {showDate && (
                    <DateDivider>
                      {formatDate(session.createdAt)}
                    </DateDivider>
                  )}
                  <SessionCard>
                    <SessionHeader>
                      <SessionInfo>
                        <SessionStatus $status={session.status}>
                          {session.status === "active" && "✅ Active"}
                          {session.status === "waiting" && "⏳ Waiting"}
                          {session.status === "closed" && "🔒 Closed"}
                          {session.status === "bot" && "🤖 Bot Chat"}
                        </SessionStatus>
                        <SessionTime>
                          <FiClock />
                          {formatTime(session.lastMessageAt || session.createdAt)}
                        </SessionTime>
                      </SessionInfo>
                      <ViewButton onClick={() => handleViewChat(session._id)}>
                        View Chat
                      </ViewButton>
                    </SessionHeader>
                    <SessionBody>
                      <MessagePreview>
                        <MessageCount>
                          {session.messages?.length || 0} message{(session.messages?.length || 0) !== 1 ? "s" : ""}
                        </MessageCount>
                        {session.lastMessage && (
                          <LastMessageText>
                            {session.lastMessage.length > 100
                              ? session.lastMessage.substring(0, 100) + "..."
                              : session.lastMessage}
                          </LastMessageText>
                        )}
                      </MessagePreview>
                    </SessionBody>
                  </SessionCard>
                </React.Fragment>
              );
            })}
          </SessionsList>
        )}
      </HistorySection>
    </Container>
  );
};

export default AdminUserChatHistory;

// Styled Components
const Container = styled.div`
  padding: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;

  @media ${devices.tablet} {
    padding: var(--space-lg);
  }

  @media ${devices.mobile} {
    padding: var(--space-md);
  }
`;

const HeaderCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--gray-300);
  background: var(--white);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--text-lg);

  &:hover {
    background: var(--gray-100);
    border-color: var(--primary);
    color: var(--primary);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
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
`;

const UserDetails = styled.div``;

const UserName = styled.div`
  font-size: var(--text-xl);
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

const HeaderRight = styled.div``;

const ChatCount = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const HistorySection = styled.div`
  margin-top: var(--space-xl);
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const DateDivider = styled.div`
  text-align: center;
  padding: var(--space-md) 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: var(--gray-200);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const SessionCard = styled(Card)`
  padding: var(--space-lg);
  transition: all var(--transition-fast);

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const SessionStatus = styled.span`
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
`;

const SessionTime = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const ViewButton = styled(PrimaryButton)`
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--text-sm);
`;

const SessionBody = styled.div`
  margin-top: var(--space-md);
`;

const MessagePreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const MessageCount = styled.div`
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-body);
`;

const LastMessageText = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
  line-height: 1.5;
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

