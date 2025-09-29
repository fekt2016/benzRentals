// src/components/ui/Cards.jsx
import styled from "styled-components";
import { motion } from "framer-motion";

export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: all ${({ theme }) => theme.transitions.normal};
  overflow: hidden;

  ${({ $hover }) =>
    $hover &&
    `
    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.lg};
      transform: translateY(-4px);
    }
  `}
`;

export const LuxuryCard = styled(Card)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius["2xl"]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
  backdrop-filter: blur(20px);

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: translateY(-6px);
  }
`;

export const GlassCard = styled(Card)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
`;

export const StatsCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background: ${({ theme }) => theme.gradients.luxury};
  color: white;
  border: none;

  h3 {
    font-size: ${({ theme }) => theme.typography.sizes["4xl"]};
    font-weight: ${({ theme }) =>
      theme.typography.fontWeights["Plus Jakarta Sans"].bold};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    color: white;
  }

  p {
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }
`;
