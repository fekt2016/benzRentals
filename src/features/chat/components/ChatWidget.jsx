import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX } from "react-icons/fi";
import ChatWindow from "./ChatWindow";
import { useCurrentUser } from "../../auth/useAuth";
import Cookies from "js-cookie";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const token = Cookies.get("token");
  const { data: userData } = useCurrentUser({ enabled: !!token });

  // Only show chat widget for authenticated users
  if (!token || !userData?.user) {
    return null;
  }

  const handleToggle = () => {
    if (isOpen) {
      setIsMinimized(true);
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsOpen(false);
    setIsMinimized(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            isOpen={isOpen}
            onClose={handleClose}
            onMinimize={handleMinimize}
          />
        )}
      </AnimatePresence>

      {!isOpen && (
        <WidgetButton
          onClick={handleToggle}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          $isMinimized={isMinimized}
        >
          {isMinimized ? (
            <motion.div
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
            >
              <FiMessageCircle />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, rotate: 180 }}
              animate={{ opacity: 1, rotate: 0 }}
            >
              <FiMessageCircle />
            </motion.div>
          )}
          {!isMinimized && <NotificationBadge />}
        </WidgetButton>
      )}
    </>
  );
};

export default ChatWidget;

// Styled Components
const WidgetButton = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--gradient-primary);
  border: none;
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  z-index: 9998;
  font-size: var(--text-2xl);
  transition: all var(--transition-normal);

  &:hover {
    box-shadow: var(--shadow-xl);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    width: 56px;
    height: 56px;
    bottom: 15px;
    right: 15px;
    font-size: var(--text-xl);
  }
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--error);
  border: 2px solid var(--white);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
`;

