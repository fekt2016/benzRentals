// src/components/sections/StatsGrid.jsx (Flexbox version)
import React from "react";
import styled from "styled-components";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { devices } from "../../styles/GlobalStyles";

const StatsGrid = ({ stats, animationControls, className = "" }) => {
  const statVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.6,
      },
    },
  };

  return (
    <StatsGridWrapper className={className}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial="hidden"
          animate={animationControls}
          variants={statVariants}
          custom={index}
        >
          <StatCard>
            <StatIcon>
              <stat.icon />
            </StatIcon>
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        </motion.div>
      ))}
    </StatsGridWrapper>
  );
};

const StatsGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: start;
  justify-items: center;
  gap: var(--space-lg);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);

  @media ${devices.lg} {
    gap: var(--space-md);
  }

  @media ${devices.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
    padding: 0 var(--space-md);
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: var(--space-xl) var(--space-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media ${devices.sm} {
    padding: var(--space-lg) var(--space-md);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-md);
  color: var(--white);
  font-size: var(--text-xl);

  @media ${devices.md} {
    width: 50px;
    height: 50px;
    font-size: var(--text-lg);
  }

  @media ${devices.sm} {
    width: 50px;
    height: 50px;
    font-size: var(--text-lg);
  }
`;

const StatNumber = styled.div`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  font-family: var(--font-heading);
  line-height: 1.2;

  @media ${devices.md} {
    font-size: var(--text-3xl);
  }

  @media ${devices.sm} {
    font-size: var(--text-3xl);
  }
`;

const StatLabel = styled.div`
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  line-height: 1.4;
`;

export default StatsGrid;
