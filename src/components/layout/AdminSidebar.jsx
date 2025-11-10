// src/components/layout/AdminSidebar.jsx
/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiTruck,
  FiUsers,
  FiFileText,
  FiBell,
  FiPlus,
  FiShield,
  FiBarChart2,
  FiMessageCircle,
  FiRadio,
  FiActivity,
} from "react-icons/fi";
import { ADMIN_PATHS } from "../../config/constants";
import { devices } from "../../styles/GlobalStyles";

/**
 * AdminSidebar Component
 * 
 * Navigation sidebar for admin pages, matching the global design system.
 * - Uses global CSS variables (var(--primary), var(--space-*), etc.)
 * - Responsive with mobile slide-in/out
 * - Consistent with DriverHeader styling
 * 
 * Design System Integration:
 * - Uses global color tokens from GlobalStyles.js
 * - Matches spacing and typography variables
 * - Responsive breakpoints from devices object
 */

/**
 * Sidebar Container
 * - Fixed on mobile (slides in/out)
 * - Sticky on desktop
 * - Uses global primary color
 */
const SidebarContainer = styled.aside`
  width: 280px;
  background: var(--primary);
  color: var(--white);
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-shadow: var(--shadow-md);

  /* Mobile: fixed + slide in/out */
  position: fixed;
  left: 0;
  top: 0;
  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(-100%)")};
  transition: transform var(--transition-normal);
  z-index: 999;

  /* Desktop: in-flow sticky column */
  @media (min-width: 769px) {
    position: sticky;
    top: 0;
    transform: none;
    z-index: 1;
  }
`;

/**
 * Sidebar Header
 * - Uses global typography and spacing
 * - Matches design system font families
 */
const SidebarHeader = styled.div`
  padding: var(--space-xl) var(--space-lg);
  font-family: var(--font-heading);
  font-weight: var(--font-bold);
  font-size: var(--text-xl);
  color: var(--white);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

/**
 * Sidebar Navigation
 * - Scrollable navigation area
 * - Uses global spacing
 */
const SidebarNav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-sm) 0;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-full);

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

/**
 * Sidebar Link
 * - Uses global spacing and colors
 * - Active state with primary-dark background
 * - Hover states match design system
 */
const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  color: var(--white);
  text-decoration: none;
  transition: all var(--transition-normal);
  border-left: 3px solid transparent;
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  opacity: 0.9;

  &.active {
    background: var(--primary-dark);
    font-weight: var(--font-semibold);
    border-left-color: rgba(255, 255, 255, 0.9);
    opacity: 1;
  }

  &:hover:not(.active) {
    background: var(--primary-dark);
    opacity: 1;
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
    flex-shrink: 0;
  }
`;

const AdminSidebar = ({ open, toggleSidebar, isMobile }) => {
  // Close after navigating on mobile
  const handleNav = () => {
    if (isMobile && typeof toggleSidebar === "function") {
      toggleSidebar(); // toggles to false after click
    }
  };

  // Navigation links configuration
  const navLinks = [
    {
      path: ADMIN_PATHS.DASHBOARD,
      label: "Dashboard",
      icon: FiHome,
      end: true,
    },
    {
      path: ADMIN_PATHS.ADD_CAR,
      label: "Add Car",
      icon: FiPlus,
    },
    {
      path: ADMIN_PATHS.CARS,
      label: "Cars",
      icon: FiTruck,
    },
    {
      path: ADMIN_PATHS.DRIVERS,
      label: "Drivers",
      icon: FiShield,
    },
    {
      path: ADMIN_PATHS.BOOKINGS,
      label: "Bookings",
      icon: FiFileText,
    },
    {
      path: ADMIN_PATHS.USERS,
      label: "Users",
      icon: FiUsers,
    },
    {
      path: ADMIN_PATHS.REPORTS,
      label: "Reports",
      icon: FiBarChart2,
    },
    {
      path: ADMIN_PATHS.NOTIFICATIONS,
      label: "Notifications",
      icon: FiBell,
    },
    {
      path: ADMIN_PATHS.CHATS,
      label: "Chat Sessions",
      icon: FiMessageCircle,
    },
    {
      path: ADMIN_PATHS.CHAT_USERS,
      label: "My Users",
      icon: FiUsers,
    },
    {
      path: ADMIN_PATHS.ONLINE_USERS,
      label: "Online Users",
      icon: FiRadio,
    },
    {
      path: ADMIN_PATHS.ACTIVITY_LOGS,
      label: "Activity Logs",
      icon: FiActivity,
    },
  ];

  return (
    <SidebarContainer
      $open={open}
      role="complementary"
      aria-hidden={!open && isMobile}
      aria-expanded={!!open}
    >
      <SidebarHeader>Benz Admin</SidebarHeader>

      <SidebarNav>
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <SidebarLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={handleNav}
            >
              <Icon />
              {link.label}
            </SidebarLink>
          );
        })}
      </SidebarNav>
    </SidebarContainer>
  );
};

export default AdminSidebar;
