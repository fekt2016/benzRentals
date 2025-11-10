// src/components/layout/DriverLayout.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Outlet, useLocation } from "react-router-dom";
import DriverHeader from "../headers/DriverHeader";

/**
 * DriverLayout Component
 * 
 * Provides a consistent layout wrapper for all driver pages.
 * - Uses the same design system as AdminLayout (spacing, colors, typography)
 * - Includes DriverHeader at the top
 * - Responsive design with mobile support
 * - Uses <Outlet /> for nested route rendering
 * 
 * Design System Integration:
 * - Uses global CSS variables (var(--space-*), var(--bg-*), etc.)
 * - Matches AdminLayout structure for consistency
 * - Responsive breakpoints align with global styles
 */
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--surface);
  width: 100%;
`;

/**
 * Main Content Area
 * - Responsive padding using global spacing variables
 * - Prevents horizontal overflow on mobile
 * - Matches AdminLayout content styling
 */
const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--surface);
  padding: var(--space-md);

  /* Responsive padding using global spacing tokens */
  @media (min-width: 480px) {
    padding: var(--space-lg);
  }
  @media (min-width: 768px) {
    padding: var(--space-xl);
  }
  @media (min-width: 1024px) {
    padding: var(--space-2xl);
  }

  /* Ensure content doesn't overflow viewport */
  min-height: calc(100vh - 80px); /* Account for header height */
`;

const DriverLayout = () => {
  const location = useLocation();

  return (
    <LayoutContainer>
      {/* Driver Header - Sticky on mobile, consistent with AdminLayout */}
      <DriverHeader />

      {/* Main Content Area - Renders nested routes via <Outlet /> */}
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  );
};

export default DriverLayout;

