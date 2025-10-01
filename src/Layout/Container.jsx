// src/components/layout/Container.jsx
import React from "react";
import styled from "styled-components";
import { devices } from "../styles/GlobalStyles";

const Container = ({
  children,
  className = "",
  size = "default",
  padding = true,
  as = "div", // Allow changing HTML element
  ...props // Capture all other props
}) => {
  return (
    <ContainerWrapper
      as={as}
      className={className}
      $size={size}
      $padding={padding}
      {...props}
    >
      {children}
    </ContainerWrapper>
  );
};

const ContainerWrapper = styled.div`
  max-width: ${(props) => {
    switch (props.$size) {
      case "wide":
        return "1400px";
      case "narrow":
        return "800px";
      default:
        return "1200px";
    }
  }};
  margin: 0 auto;
  padding: ${(props) => (props.$padding ? "0 var(--space-lg)" : "0")};

  @media ${devices.md} {
    padding: ${(props) => (props.$padding ? "0 var(--space-md)" : "0")};
  }

  @media ${devices.sm} {
    padding: ${(props) => (props.$padding ? "0 var(--space-sm)" : "0")};
  }
`;

export default Container;
