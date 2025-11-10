// src/components/layout/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Outlet, useLocation } from "react-router-dom";
import { devices } from "../../styles/GlobalStyles";

/**
 * AdminLayout Component
 * 
 * Provides a consistent layout wrapper for all admin pages.
 * - Uses global CSS variables (var(--space-*), var(--bg-*), etc.)
 * - Includes AdminSidebar and AdminHeader
 * - Responsive design with mobile support
 * - Uses <Outlet /> for nested route rendering
 * 
 * Design System Integration:
 * - Uses global CSS variables from GlobalStyles.js
 * - Matches DriverLayout structure for consistency
 * - Responsive breakpoints from devices object
 */
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--surface);
  width: 100%;

  @media ${devices.md} {
    flex-direction: column;
  }
`;

/**
 * Content Container
 * - Flex container for header and main content
 * - Prevents content overflow on mobile
 */
const ContentContainer = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: none;
`;

/**
 * Main Content Area
 * - Responsive padding using global spacing variables
 * - Prevents horizontal overflow on mobile
 * - Matches DriverLayout content styling
 */
const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--surface);
  padding: var(--space-md);
  min-height: calc(100vh - 80px); /* Account for header height */

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

  /* Table styling for admin pages */
  table {
    width: 100%;
    max-width: 100%;
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0 var(--space-xs);
    min-width: 0;
  }

  th,
  td {
    padding: var(--space-md);
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  td img,
  th img {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: var(--radius-md);
  }
`;

/**
 * Mobile Overlay
 * - Dark overlay when sidebar is open on mobile
 * - Uses global transition variables
 */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? "visible" : "hidden")};
  transition: opacity var(--transition-normal), visibility var(--transition-normal);

  @media (min-width: 769px) {
    display: none;
  }
`;

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Track viewport size
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile && sidebarOpen) closeSidebar();
  }, [location.pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isMobile, sidebarOpen]);

  return (
    <LayoutContainer>
      <AdminSidebar
        open={sidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <Overlay $show={sidebarOpen && isMobile} onClick={closeSidebar} />
      <ContentContainer>
        <AdminHeader
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
        />
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentContainer>
    </LayoutContainer>
  );
};

export default AdminLayout;
