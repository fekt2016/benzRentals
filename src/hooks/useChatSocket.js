import { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "../app/providers/SocketProvider";
import { getAuthToken } from "../utils/tokenService";

/**
 * Custom hook for chat socket functionality
 * Handles real-time messaging, room joining, and message sending
 * 
 * @param {string} sessionId - The chat session ID
 * @param {string} role - User role: "user", "admin", or "driver"
 * @returns {Object} { messages, sendMessage, isConnected, isTyping, typingUsers }
 */
export function useChatSocket(sessionId, role = "user") {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesRef = useRef([]);
  const typingTimeoutRef = useRef(null);

  // Keep messages ref in sync
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Join room and set up listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join the chat room
    if (sessionId) {
      socket.emit("joinRoom", sessionId);
      console.log(`[useChatSocket] Joined room: ${sessionId}`);
    }

    // Join admin room if admin
    if (role === "admin") {
      socket.emit("joinAdminRoom");
      console.log(`[useChatSocket] Admin joined adminRoom`);
    }

    // Listen for new messages
    const handleNewMessage = (msg) => {
      if (msg.sessionId === sessionId) {
        setMessages((prev) => {
          // Check if message already exists to avoid duplicates
          const messageExists = prev.some(
            (m) =>
              m.message === msg.message &&
              m.senderRole === msg.senderRole &&
              new Date(m.createdAt).getTime() === new Date(msg.createdAt).getTime()
          );
          if (messageExists) return prev;
          return [...prev, msg];
        });
        setIsTyping(false);
      }
    };

    // Listen for typing indicators
    const handleUserTyping = (data) => {
      if (data.sessionId === sessionId && data.userId) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    };

    // Listen for errors
    const handleError = (error) => {
      console.error("[useChatSocket] Error:", error);
    };

    // Listen for room joined confirmation
    const handleRoomJoined = (data) => {
      if (data.sessionId === sessionId) {
        console.log(`[useChatSocket] Successfully joined room: ${sessionId}`);
      }
    };

    // Listen for admin room joined
    const handleAdminRoomJoined = () => {
      console.log(`[useChatSocket] Successfully joined adminRoom`);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("chat_error", handleError);
    socket.on("room_joined", handleRoomJoined);
    socket.on("admin_room_joined", handleAdminRoomJoined);

    return () => {
      if (sessionId) {
        socket.emit("leaveRoom", sessionId);
      }
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("chat_error", handleError);
      socket.off("room_joined", handleRoomJoined);
      socket.off("admin_room_joined", handleAdminRoomJoined);
    };
  }, [socket, isConnected, sessionId, role]);

  // Send message via socket
  const sendMessage = useCallback(
    (message) => {
      if (!socket || !isConnected || !sessionId || !message?.trim()) {
        console.warn("[useChatSocket] Cannot send message:", {
          socket: !!socket,
          isConnected,
          sessionId,
          message: !!message,
        });
        return false;
      }

      socket.emit("sendMessage", {
        sessionId,
        senderRole: role,
        message: message.trim(),
      });

      return true;
    },
    [socket, isConnected, sessionId, role]
  );

  // Send typing indicator
  const sendTyping = useCallback(
    (isTyping) => {
      if (!socket || !isConnected || !sessionId) return;

      socket.emit("typing", { sessionId, isTyping });

      // Clear typing indicator after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          socket.emit("typing", { sessionId, isTyping: false });
        }, 3000);
      }
    },
    [socket, isConnected, sessionId]
  );

  // Initialize messages from external source
  const setInitialMessages = useCallback((initialMessages) => {
    setMessages(initialMessages || []);
  }, []);

  return {
    messages,
    setMessages: setInitialMessages,
    sendMessage,
    sendTyping,
    isConnected,
    isTyping,
    typingUsers: Array.from(typingUsers),
    socket,
  };
}

