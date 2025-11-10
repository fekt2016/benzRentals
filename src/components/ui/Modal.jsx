/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */

import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useEffect } from "react";

const ModalWrapper = ({ show, onClose, children, animation = "fade" }) => {
  // Close when pressing ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Animation variants
  const modalVariants = {
    fade: {
      initial: { opacity: 0, scale: 0.9, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.9, y: 20 },
      transition: { type: "spring", stiffness: 180, damping: 18, duration: 0.25 },
    },
    slide: {
      initial: { opacity: 0, y: 100 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 100 },
      transition: { type: "spring", stiffness: 180, damping: 20, duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {show && (
        <Overlay
          as={motion.div}
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <ModalContent
            as={motion.div}
            key="modal"
            {...modalVariants[animation]}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ModalWrapper;

// Overlay
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  width: 100vw;
  height: 100vh;
  user-select: none;
`;

// Modal box
const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 1.5rem;
`;
