// src/components/sections/SectionHeader.jsx
import React from "react";
import styled from "styled-components";
import { devices } from "../../styles/GlobalStyles";

const SectionHeader = ({
  subtitle,
  title,
  description,
  align = "center",
  className = "",
}) => {
  return (
    <HeaderWrapper $align={align} className={className}>
      {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
      <SectionTitle>{title}</SectionTitle>
      {description && <SectionDescription>{description}</SectionDescription>}
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  text-align: ${(props) => props.$align};
  margin-bottom: var(--space-2xl);

  @media ${devices.md} {
    margin-bottom: var(--space-xl);
  }
`;

const SectionSubtitle = styled.div`
  color: var(--primary);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-md);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-5xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  font-family: var(--font-heading);
  line-height: 1.2;

  @media ${devices.md} {
    font-size: var(--text-4xl);
  }

  @media ${devices.sm} {
    font-size: var(--text-3xl);
  }
`;

const SectionDescription = styled.p`
  font-size: var(--text-lg);
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: ${(props) => (props.$align === "center" ? "0 auto" : "0")};
  font-family: var(--font-body);

  @media ${devices.sm} {
    font-size: var(--text-base);
  }
`;

export default SectionHeader;
