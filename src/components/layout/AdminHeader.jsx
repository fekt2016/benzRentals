// src/components/layout/AdminHeader.jsx
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiBell,
  FiUser,
  FiMenu,
  FiSettings,
  FiLogOut,
  FiShield,
} from "react-icons/fi";
import { useLogout, useCurrentUser } from "../../features/auth/useAuth";
import { useToggleRole } from "../../features/users/useUser";
import { getAuthToken } from "../../utils/tokenService";
import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { GhostButton, SecondaryButton } from "../ui/Button";
import { devices } from "../../styles/GlobalStyles";

/**
 * AdminHeader Component
 * 
 * Navigation header for admin pages, matching the global design system.
 * - Uses global color tokens (var(--primary), var(--bg-*), var(--text-*))
 * - Responsive with mobile menu toggle
 * - Sticky positioning
 * - Consistent spacing using var(--space-*) variables
 */

/**
 * Header Container
 * - Sticky on top for easy navigation
 * - Uses global background and border colors
 * - Matches DriverHeader structure
 */
const HeaderContainer = styled.header`
  width: 100%;
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
`;

/**
 * Header Content Wrapper
 * - Uses global spacing for padding
 * - Flexbox layout for navigation items
 * - Responsive breakpoints match global styles
 */
const HeaderContent = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: var(--space-md) var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);

  @media ${devices.md} {
    padding: var(--space-sm) var(--space-md);
  }
`;

/**
 * Left Section
 * - Contains mobile menu toggle and title
 */
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

/**
 * Right Section
 * - Contains action buttons and profile menu
 */
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

/**
 * Mobile Menu Toggle Button
 * - Only visible on mobile
 * - Uses GhostButton from UI components
 */
const MobileMenuButton = styled(GhostButton)`
  display: none;

  @media ${devices.md} {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-sm);
    color: var(--text-primary);
    font-size: var(--text-xl);
  }
`;

/**
 * Dashboard Title
 * - Uses global typography variables
 * - Matches DriverHeader brand styling
 */
const DashboardTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  margin: 0;

  @media ${devices.md} {
    font-size: var(--text-lg);
  }
`;

/**
 * Icon Button
 * - Consistent with DriverHeader icon buttons
 * - Uses global colors and spacing
 */
const IconButton = styled(GhostButton)`
  position: relative;
  padding: var(--space-sm);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
  transition: all var(--transition-normal);

  &:hover {
    background: var(--gray-100);
    color: var(--primary);
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

/**
 * Notification Badge
 * - Uses global error color
 * - Consistent sizing
 */
const NotificationBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--error);
  color: var(--white);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-full);
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Profile Menu Container
 * - Relative positioning for dropdown
 */
const ProfileMenu = styled.div`
  position: relative;
`;

/**
 * Dropdown Menu
 * - Uses global colors, shadows, and border radius
 * - Positioned below profile button
 */
const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + var(--space-xs));
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  display: ${({ $open }) => ($open ? "block" : "none")};
  z-index: 200;
  overflow: hidden;
`;

/**
 * Dropdown Item
 * - Uses global spacing and colors
 * - Hover states match design system
 */
const DropdownItem = styled.button`
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  text-align: left;
  background: none;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  color: ${(props) => (props.disabled ? "var(--text-muted)" : "var(--text-primary)")};
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  transition: all var(--transition-fast);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover:not(:disabled) {
    background: var(--gray-100);
    color: var(--primary);
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-200);
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

/**
 * Role Toggle Button
 * - Uses global primary color
 * - Consistent with design system
 */
const RoleToggleButton = styled(SecondaryButton)`
  && {
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    border: 2px solid var(--primary);
    background: transparent;
    color: var(--primary);

    &:hover:not(:disabled) {
      background: var(--primary);
      color: var(--white);
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`;

// eslint-disable-next-line react/prop-types
const AdminHeader = ({ toggleSidebar, isMobile, sidebarOpen }) => {
  const { mutate: logout } = useLogout();
  const { mutate: toggleRole, isPending: isTogglingRole } = useToggleRole();
  const [profileOpen, setProfileOpen] = useState(false);
  const notifications = 3; // example badge count
  const authData = getAuthToken();
  const role = authData.role || null;
  const token = authData.token || null;
  const isAuthed = Boolean(token);
  
  // Decode token to get user ID
  let tokenUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      tokenUserId = decoded.id || decoded._id;
    } catch (e) {
      console.error('[AdminHeader] Error decoding token:', e);
    }
  }
  
  const queryClient = useQueryClient();
  
  // Get user data to check executive status
  const { data: userData, refetch: refetchUser } = useCurrentUser({ enabled: isAuthed });
  const user = useMemo(() => userData?.user || null, [userData]);
  
  
  const isExecutive = user?.executive === true;
  
  // Force refresh user data
  const handleRefreshUser = () => {
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    refetchUser();
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  const handleProfileClick = () => setProfileOpen(false);
  const handleSettingsClick = () => setProfileOpen(false);
  const handleToggleRole = () => {
    toggleRole();
    setProfileOpen(false);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          {/* Mobile Menu Toggle - Only visible on mobile */}
          {isMobile && (
            <MobileMenuButton
              aria-label="Toggle sidebar"
              aria-expanded={sidebarOpen}
              onClick={toggleSidebar}
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMenu />
            </MobileMenuButton>
          )}
          <DashboardTitle>Admin Dashboard</DashboardTitle>
        </LeftSection>

        <RightSection>
          {/* Role Toggle Button - Visible in header (only for executives) */}
          {role && user && isExecutive && (
            <RoleToggleButton
              as="button"
              $size="sm"
              onClick={handleToggleRole}
              disabled={isTogglingRole}
              title={`Switch to ${role === "admin" ? "User" : "Admin"} mode`}
            >
              <FiShield />
              {role === "admin" ? "User" : "Admin"}
            </RoleToggleButton>
          )}

          {/* Notifications Button */}
          <IconButton
            aria-label="Notifications"
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiBell />
            {notifications > 0 && (
              <NotificationBadge>{notifications}</NotificationBadge>
            )}
          </IconButton>

          {/* Profile Menu */}
          <ProfileMenu>
            <IconButton
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((p) => !p)}
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiUser />
            </IconButton>
            <Dropdown $open={profileOpen} role="menu">
              <DropdownItem onClick={handleProfileClick}>
                <FiUser />
                Profile
              </DropdownItem>
              <DropdownItem onClick={handleSettingsClick}>
                <FiSettings />
                Settings
              </DropdownItem>
              {role && user && isExecutive && (
                <DropdownItem onClick={handleToggleRole} disabled={isTogglingRole}>
                  <FiShield />
                  Switch to {role === "admin" ? "User" : "Admin"}
                </DropdownItem>
              )}
              <DropdownItem onClick={handleLogout}>
                <FiLogOut />
                Logout
              </DropdownItem>
            </Dropdown>
          </ProfileMenu>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default AdminHeader;
