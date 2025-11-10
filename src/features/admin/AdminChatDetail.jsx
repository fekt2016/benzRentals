import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import { FiSend, FiArrowLeft, FiUser, FiMessageCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import api from "../../services/apiClient";
import { Card } from "../../components/Cards/Card";
import { PrimaryButton } from "../../components/ui/Button";
import { LoadingSpinner, ErrorState } from "../../components/ui/LoadingSpinner";
import { devices } from "../../styles/GlobalStyles";
import { useChatSocket } from "../../hooks/useChatSocket";

const AdminChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Use chat socket hook for real-time messaging
  const {
    messages: socketMessages,
    setMessages: setSocketMessages,
    sendMessage: sendSocketMessage,
    sendTyping,
    isConnected: socketConnected,
    typingUsers,
    socket,
  } = useChatSocket(id, "admin");

  const {
    data: sessionData,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["chatSession", id],
    queryFn: async () => {
      const response = await api.get(`/chat/admin/session/${id}`);
      return response.data.data;
    },
    // Remove polling - use Socket.io for real-time updates
    enabled: !!id,
  });

  const adminReplyMutation = useMutation({
    mutationFn: async ({ sessionId, message }) => {
      const response = await api.post("/chat/admin/reply", {
        sessionId,
        message,
      });
      return response.data;
    },
    onSuccess: () => {
      // Socket.io will handle real-time updates, but we invalidate as fallback
      queryClient.invalidateQueries({ queryKey: ["chatSession", id] });
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
      setInputMessage("");
      // Toast will be shown by socket event or here as fallback
      if (!isConnected) {
        toast.success("Message sent successfully");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send message");
    },
    onSettled: () => {
      setIsSending(false);
    },
  });

  // Sync socket messages with session data
  useEffect(() => {
    if (sessionData?.messages) {
      setSocketMessages(sessionData.messages);
    }
  }, [sessionData?.messages, setSocketMessages]);

  // Listen for admin joined event and update session
  useEffect(() => {
    if (!socket || !socketConnected) return;

    const handleAdminJoined = (data) => {
      if (data.sessionId === id) {
        // Refetch session data to get updated status
        refetch();
        toast.success("You have joined the chat session");
      }
    };

    const handleChatUpdate = (data) => {
      if (data.sessionId === id && data.session) {
        // Update session data
        queryClient.setQueryData(["chatSession", id], data.session);
        if (data.session.messages) {
          setSocketMessages(data.session.messages);
        }
      }
    };

    socket.on("adminJoined", handleAdminJoined);
    socket.on("chatUpdate", handleChatUpdate);

    return () => {
      socket.off("adminJoined", handleAdminJoined);
      socket.off("chatUpdate", handleChatUpdate);
    };
  }, [id, socketConnected, refetch, queryClient, setSocketMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [socketMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleJoinChat = async () => {
    try {
      const response = await api.post(`/chat/admin/join/${id}`);
      if (response.data.status === "success") {
        toast.success("Successfully joined chat session");
        refetch();
      }
    } catch (error) {
      console.error("Error joining chat:", error);
      toast.error(error?.response?.data?.message || "Failed to join chat session");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    // If chat is waiting and admin hasn't joined, join first
    if (sessionData?.status === "waiting" && !sessionData?.assignedAdmin) {
      await handleJoinChat();
    }

    const messageText = inputMessage.trim();
    setInputMessage("");

    // Try to send via socket first (real-time)
    if (socketConnected && sendSocketMessage(messageText)) {
      // Message sent via socket, also save via REST API
      setIsSending(true);
      adminReplyMutation.mutate({
        sessionId: id,
        message: messageText,
      });
    } else {
      // Fallback to REST API if socket is not connected
      setIsSending(true);
      adminReplyMutation.mutate({
        sessionId: id,
        message: messageText,
      });
    }
  };

  // Handle typing indicator
  useEffect(() => {
    if (inputMessage.trim()) {
      sendTyping(true);
    } else {
      sendTyping(false);
    }
  }, [inputMessage, sendTyping]);

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

  if (isPending) {
    return (
      <Container>
        <LoadingSpinner message="Loading chat session..." />
      </Container>
    );
  }

  if (isError || !sessionData) {
    return (
      <Container>
        <ErrorState
          title="Error Loading Chat Session"
          message={error?.message || "Failed to load chat session."}
          action={
            <PrimaryButton onClick={() => refetch()}>Retry</PrimaryButton>
          }
        />
      </Container>
    );
  }

  const session = sessionData;
  // Use socket messages if available, otherwise fallback to session messages
  const messages = socketMessages.length > 0 ? socketMessages : (session.messages || []);

  return (
    <Container>
      {/* Header */}
      <HeaderCard>
        <HeaderLeft>
          <BackButton onClick={() => navigate("/admin/chats")}>
            <FiArrowLeft />
          </BackButton>
          <UserInfo>
            <UserAvatar>
              {session.userId?.fullName?.[0] || "U"}
            </UserAvatar>
            <UserDetails>
              <UserName>{session.userId?.fullName || "Unknown User"}</UserName>
              <UserEmail>{session.userId?.email || ""}</UserEmail>
            </UserDetails>
          </UserInfo>
        </HeaderLeft>
        <HeaderRight>
          <StatusBadge $status={session.status}>
            {session.status === "waiting" && "⏳ Waiting for Agent"}
            {session.status === "active" && "✅ Active"}
            {session.status === "bot" && "🤖 Bot Chat"}
            {session.status === "closed" && "🔒 Closed"}
          </StatusBadge>
          {session.status === "waiting" && !session.assignedAdmin && (
            <JoinButton onClick={handleJoinChat}>
              Join Chat
            </JoinButton>
          )}
        </HeaderRight>
      </HeaderCard>

      {/* Messages Container */}
      <MessagesCard>
        <MessagesContainer ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <EmptyState>
              <EmptyIcon>💬</EmptyIcon>
              <EmptyText>No messages yet</EmptyText>
            </EmptyState>
          ) : (
            <MessagesList>
              {messages.map((message, index) => {
                // Handle both socket message format and session message format
                const msgText = message.message || message;
                const msgSenderRole = message.senderRole || "user";
                const msgIsBot = message.isBot || msgSenderRole === "bot";
                const msgIsAdmin = msgSenderRole === "admin";
                const msgCreatedAt = message.createdAt || new Date();
                const showDate =
                  index === 0 ||
                  formatDate(msgCreatedAt) !==
                    formatDate(messages[index - 1]?.createdAt || new Date());

                return (
                  <React.Fragment key={index}>
                    {showDate && (
                      <DateDivider>
                        {formatDate(msgCreatedAt)}
                      </DateDivider>
                    )}
                    <MessageWrapper $isAdmin={msgIsAdmin} $isBot={msgIsBot}>
                      <MessageBubble $isAdmin={msgIsAdmin} $isBot={msgIsBot}>
                        {msgIsAdmin && (
                          <MessageSender>Admin</MessageSender>
                        )}
                        {msgIsBot && (
                          <MessageSender>BenzFlex Bot</MessageSender>
                        )}
                        <MessageText>{msgText}</MessageText>
                        <MessageTime>{formatTime(msgCreatedAt)}</MessageTime>
                      </MessageBubble>
                    </MessageWrapper>
                  </React.Fragment>
                );
              })}
              {typingUsers.length > 0 && (
                <MessageWrapper $isBot={true}>
                  <MessageBubble $isBot={true}>
                    <MessageSender>User</MessageSender>
                    <TypingIndicator>
                      <TypingDot />
                      <TypingDot />
                      <TypingDot />
                    </TypingIndicator>
                  </MessageBubble>
                </MessageWrapper>
              )}
              <div ref={messagesEndRef} />
            </MessagesList>
          )}
        </MessagesContainer>
      </MessagesCard>

      {/* Input Container */}
      <InputCard>
        <InputForm onSubmit={handleSendMessage}>
          <InputWrapper>
            <Input
              type="text"
              placeholder="Type your message as admin..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isSending}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <SendButton
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              $disabled={!inputMessage.trim() || isSending}
            >
              <FiSend />
            </SendButton>
          </InputWrapper>
        </InputForm>
      </InputCard>
    </Container>
  );
};

export default AdminChatDetail;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-lg);

  @media ${devices.tablet} {
    padding: var(--space-md);
    height: calc(100vh - 60px);
  }

  @media ${devices.mobile} {
    padding: var(--space-sm);
    height: calc(100vh - 60px);
  }
`;

const HeaderCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  border-bottom: 2px solid var(--gray-200);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  background: var(--gray-100);
  border: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--text-lg);

  &:hover {
    background: var(--gray-200);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
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

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const JoinButton = styled(PrimaryButton)`
  background: var(--warning);
  color: var(--white);

  &:hover {
    background: var(--warning-dark);
  }
`;

const StatusBadge = styled.span`
  padding: 8px 16px;
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

const MessagesCard = styled(Card)`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
  margin-bottom: var(--space-lg);
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
  background: var(--surface);

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gray-100);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: var(--radius-full);

    &:hover {
      background: var(--gray-400);
    }
  }
`;

const MessagesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const DateDivider = styled.div`
  text-align: center;
  margin: var(--space-lg) 0;
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 40%;
    height: 1px;
    background: var(--gray-300);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${({ $isAdmin, $isBot }) =>
    $isAdmin ? "flex-end" : "flex-start"};
  width: 100%;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  background: ${({ $isAdmin, $isBot }) =>
    $isAdmin
      ? "var(--gradient-primary)"
      : $isBot
      ? "var(--white)"
      : "var(--gray-100)"};
  color: ${({ $isAdmin, $isBot }) =>
    $isAdmin ? "var(--white)" : "var(--text-primary)"};
  box-shadow: var(--shadow-sm);
  border: ${({ $isAdmin, $isBot }) =>
    $isAdmin
      ? "none"
      : $isBot
      ? "1px solid var(--gray-200)"
      : "1px solid var(--gray-200)"};
  word-wrap: break-word;
`;

const MessageSender = styled.div`
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  margin-bottom: 4px;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-body);
`;

const MessageText = styled.div`
  font-size: var(--text-sm);
  font-family: var(--font-body);
  line-height: 1.5;
  white-space: pre-wrap;
`;

const MessageTime = styled.div`
  font-size: var(--text-xs);
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
  font-family: var(--font-body);
`;

const InputCard = styled(Card)`
  padding: var(--space-lg);
  border-top: 2px solid var(--gray-200);
`;

const InputForm = styled.form`
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: var(--space-sm);
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  outline: none;
  transition: all var(--transition-fast);

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(92, 206, 251, 0.1);
  }

  &:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const SendButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: ${({ $disabled }) =>
    $disabled ? "var(--gray-300)" : "var(--gradient-primary)"};
  border: none;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-fast);
  font-size: var(--text-lg);

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px 0;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray-400);
  animation: typing 1.4s infinite;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%,
    60%,
    100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: var(--space-3xl);
  color: var(--text-muted);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-md);
`;

const EmptyText = styled.div`
  font-size: var(--text-lg);
  font-family: var(--font-body);
`;

