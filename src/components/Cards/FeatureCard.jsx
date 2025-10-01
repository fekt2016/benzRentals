// src/components/cards/FeatureCard.jsx
import React from "react";
import styled from "styled-components";
import { devices } from "../../styles/GlobalStyles";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color = "var(--primary)",
  className = "",
  variant = "horizontal", // horizontal or vertical
}) => {
  return (
    <CardWrapper className={className} $variant={variant}>
      <FeatureIcon $color={color} $variant={variant}>
        <Icon />
      </FeatureIcon>
      <FeatureContent $variant={variant}>
        <h3>{title}</h3>
        <p>{description}</p>
      </FeatureContent>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  display: flex;
  gap: var(--space-md);
  padding: var(--space-xl);
  background: var(--surface);
  border-radius: var(--radius-xl);
  transition: all var(--transition-normal);
  font-family: var(--font-body);
  flex-direction: ${(props) =>
    props.$variant === "vertical" ? "column" : "row"};
  text-align: ${(props) => (props.$variant === "vertical" ? "center" : "left")};

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  @media ${devices.sm} {
    flex-direction: column;
    text-align: center;
    padding: var(--space-lg);
    gap: var(--space-md);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${(props) => props.$color}20;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.$color};
  font-size: var(--text-xl);
  flex-shrink: 0;
  margin: ${(props) =>
    props.$variant === "vertical" ? "0 auto var(--space-md)" : "0"};

  @media ${devices.sm} {
    width: 50px;
    height: 50px;
    font-size: var(--text-lg);
    margin: 0 auto;
  }
`;

const FeatureContent = styled.div`
  h3 {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-xs);
    font-family: var(--font-heading);
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
    font-family: var(--font-body);
  }
`;

export default FeatureCard;
