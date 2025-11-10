import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiX, FiMinimize2, FiMessageCircle, FiUser } from "react-icons/fi";
import chatApi from "../chatService";
import { toast } from "react-hot-toast";
import { useChatSocket } from "../../../hooks/useChatSocket";

const ChatWindow = ({ isOpen, onClose, onMinimize }) => {
  const [sessionId, setSessionId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState("bot"); // bot, waiting, active, closed
  const [isEscalated, setIsEscalated] = useState(false);
  const [assignedAdmin, setAssignedAdmin] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Use chat socket hook for real-time messaging
  const {
    messages,
    setMessages,
    sendMessage: sendSocketMessage,
    sendTyping,
    isConnected: socketConnected,
    typingUsers,
    socket,
  } = useChatSocket(sessionId, "user");

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start chat session when window opens
  useEffect(() => {
    if (isOpen && !sessionId) {
      startChatSession();
    }
  }, [isOpen]);

  // Load existing messages if session exists
  useEffect(() => {
    if (sessionId) {
      loadSessionMessages();
    }
  }, [sessionId]);

  // Listen for escalation and admin joining events
  useEffect(() => {
    if (!socket || !socketConnected || !sessionId) return;

    const handleChatEscalated = (data) => {
      if (data.sessionId === sessionId) {
        setChatStatus("waiting");
        setIsEscalated(true);
        if (data.session) {
          setMessages(data.session.messages || []);
        }
      }
    };

    const handleAdminJoined = (data) => {
      if (data.sessionId === sessionId) {
        setChatStatus("active");
        setIsEscalated(true);
        setAssignedAdmin(data.admin);
        if (data.session) {
          setMessages(data.session.messages || []);
        }
        toast.success(`Support agent ${data.admin?.fullName || "joined"} has joined the conversation!`);
      }
    };

    socket.on("chatEscalated", handleChatEscalated);
    socket.on("adminJoined", handleAdminJoined);

    return () => {
      socket.off("chatEscalated", handleChatEscalated);
      socket.off("adminJoined", handleAdminJoined);
    };
  }, [socket, socketConnected, sessionId, setMessages]);

  const startChatSession = async () => {
    try {
      setIsLoading(true);
      const response = await chatApi.startChat();
      if (response.status === "success" && response.data?.session) {
        const session = response.data.session;
        setSessionId(session._id);
        setMessages(session.messages || []);
      }
    } catch (error) {
      console.error("Error starting chat session:", error);
      toast.error("Failed to start chat session");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionMessages = async () => {
    try {
      const response = await chatApi.getActiveSession();
      if (response.status === "success" && response.data?.session) {
        const session = response.data.session;
        // Initialize messages in the socket hook
        setMessages(session.messages || []);
        // Update chat status
        setChatStatus(session.status || "bot");
        setIsEscalated(session.isEscalated || false);
        if (session.assignedAdmin) {
          setAssignedAdmin(session.assignedAdmin);
        }
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const handleEscalate = async () => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const response = await chatApi.escalateChat(sessionId);
      if (response.status === "success") {
        setChatStatus("waiting");
        setIsEscalated(true);
        if (response.data?.session) {
          setMessages(response.data.session.messages || []);
        }
        // Emit socket event to notify admins
        if (socket && socketConnected) {
          socket.emit("escalateChat", sessionId);
        }
        toast.success("Connecting you with a support agent...");
      }
    } catch (error) {
      console.error("Error escalating chat:", error);
      toast.error("Failed to connect to support agent");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // Add user message to UI immediately (optimistic update)
    const tempUserMessage = {
      senderRole: "user",
      message: userMessage,
      isBot: false,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    // Try to send via socket first (real-time)
    if (socketConnected && sendSocketMessage(userMessage)) {
      // Message sent via socket, bot response will come via socket
      // Also trigger bot response via REST API as fallback
      try {
        await chatApi.sendMessage(userMessage, sessionId);
      } catch (error) {
        console.error("Error sending message via REST (fallback):", error);
      }
    } else {
      // Fallback to REST API if socket is not connected
      setIsLoading(true);
      try {
        const response = await chatApi.sendMessage(userMessage, sessionId);
        if (response.status === "success" && response.data?.session) {
          const session = response.data.session;
          setSessionId(session._id);
          setMessages(session.messages || []);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
        // Remove the temp message on error
        setMessages((prev) => prev.filter((msg) => msg !== tempUserMessage));
      } finally {
        setIsLoading(false);
      }
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

  if (!isOpen) return null;

  return (
    <WindowContainer
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <WindowHeader>
        <HeaderLeft>
          <HeaderIcon>
            <FiMessageCircle />
          </HeaderIcon>
          <HeaderText>
            <HeaderTitle>
              {chatStatus === "waiting"
                ? "Waiting for Agent..."
                : chatStatus === "active"
                ? `Chatting with ${assignedAdmin?.fullName || "Support"}`
                : "BenzFlex Support"}
            </HeaderTitle>
            <HeaderSubtitle>
              {chatStatus === "bot"
                ? "Chatting with BenzBot 🤖"
                : chatStatus === "waiting"
                ? "An agent will join shortly"
                : "Live support agent"}
            </HeaderSubtitle>
          </HeaderText>
        </HeaderLeft>
        <HeaderActions>
          <IconButton onClick={onMinimize} title="Minimize">
            <FiMinimize2 />
          </IconButton>
          <IconButton onClick={onClose} title="Close">
            <FiX />
          </IconButton>
        </HeaderActions>
      </WindowHeader>

      <MessagesContainer>
        {messages.length === 0 && !isLoading ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>Start a conversation with our support team</EmptyText>
          </EmptyState>
        ) : (
          <MessagesList>
            {messages.map((message, index) => {
              const isAdmin = message.senderRole === "admin";
              const isBot = message.isBot || message.senderRole === "bot";
              return (
                <MessageWrapper
                  key={index}
                  $isBot={isBot || isAdmin}
                  $isAdmin={isAdmin}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <MessageBubble $isBot={isBot || isAdmin} $isAdmin={isAdmin}>
                    {isAdmin && <MessageSender>Admin</MessageSender>}
                    <MessageText>{message.message}</MessageText>
                    <MessageTime>{formatTime(message.createdAt)}</MessageTime>
                  </MessageBubble>
                </MessageWrapper>
              );
            })}
            {(isLoading || typingUsers.length > 0) && (
              <MessageWrapper $isBot={true}>
                <MessageBubble $isBot={true}>
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
        {isLoading && messages.length === 0 && (
          <LoadingState>
            <LoadingSpinner />
            <LoadingText>Connecting to support...</LoadingText>
          </LoadingState>
        )}
      </MessagesContainer>

      <InputContainer onSubmit={handleSendMessage}>
        {chatStatus === "bot" && !isEscalated && messages.length > 0 && (
          <EscalateButtonContainer>
            <EscalateButton type="button" onClick={handleEscalate} disabled={isLoading}>
              <FiUser />
              💬 Start Conversation with a Person
            </EscalateButton>
          </EscalateButtonContainer>
        )}
        {chatStatus === "waiting" && (
          <WaitingIndicator>
            <WaitingDot />
            <WaitingText>Waiting for an agent to join...</WaitingText>
          </WaitingIndicator>
        )}
        <InputWrapper>
          <Input
            ref={inputRef}
            type="text"
            placeholder={
              chatStatus === "waiting"
                ? "An agent will join shortly..."
                : chatStatus === "active"
                ? "Type your message..."
                : "Type your message or ask for support..."
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading || chatStatus === "waiting"}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <SendButton
            type="submit"
            disabled={!inputMessage.trim() || isLoading || chatStatus === "waiting"}
            $disabled={!inputMessage.trim() || isLoading || chatStatus === "waiting"}
          >
            <FiSend />
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </WindowContainer>
  );
};

export default ChatWindow;

// Styled Components
const WindowContainer = styled(motion.div)`
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 380px;
  height: 600px;
  max-height: 80vh;
  background: var(--white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
  border: 1px solid var(--gray-200);

  @media (max-width: 480px) {
    width: calc(100vw - 20px);
    height: calc(100vh - 100px);
    max-height: calc(100vh - 100px);
    bottom: 10px;
    right: 10px;
    border-radius: var(--radius-xl);
  }
`;

const WindowHeader = styled.div`
  background: var(--gradient-primary);
  padding: var(--space-md) var(--space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--white);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const HeaderIcon = styled.div`
  font-size: var(--text-xl);
  display: flex;
  align-items: center;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.div`
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

const HeaderSubtitle = styled.div`
  font-size: var(--text-xs);
  opacity: 0.9;
  font-family: var(--font-body);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--space-xs);
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: var(--radius-md);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--text-base);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
  background: var(--surface);
  display: flex;
  flex-direction: column;

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

const MessageWrapper = styled(motion.div)`
  display: flex;
  justify-content: ${({ $isBot }) => ($isBot ? "flex-start" : "flex-end")};
  width: 100%;
`;

const MessageBubble = styled.div`
  max-width: 75%;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  background: ${({ $isBot, $isAdmin }) =>
    $isAdmin
      ? "var(--accent)"
      : $isBot
      ? "var(--white)"
      : "var(--gradient-primary)"};
  color: ${({ $isBot, $isAdmin }) =>
    $isAdmin || !$isBot ? "var(--white)" : "var(--text-primary)"};
  box-shadow: var(--shadow-sm);
  border: ${({ $isBot, $isAdmin }) =>
    $isAdmin
      ? "none"
      : $isBot
      ? "1px solid var(--gray-200)"
      : "none"};
  word-wrap: break-word;
`;

const MessageSender = styled.div`
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  margin-bottom: 4px;
  opacity: 0.9;
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

const InputContainer = styled.form`
  padding: var(--space-md);
  background: var(--white);
  border-top: 1px solid var(--gray-200);
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
  width: 40px;
  height: 40px;
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
  font-size: var(--text-base);

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: var(--space-xl);
  color: var(--text-muted);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-md);
`;

const EmptyText = styled.div`
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--space-md);
  color: var(--text-muted);
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const EscalateButtonContainer = styled.div`
  margin-bottom: var(--space-sm);
`;

const EscalateButton = styled.button`
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  background: var(--accent);
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    background: var(--accent-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    font-size: var(--text-base);
  }
`;

const WaitingIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  margin-bottom: var(--space-sm);
  background: var(--warning)15;
  border-radius: var(--radius-lg);
  color: var(--warning);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const WaitingDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--warning);
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

const WaitingText = styled.span`
  font-weight: var(--font-medium);
`;

