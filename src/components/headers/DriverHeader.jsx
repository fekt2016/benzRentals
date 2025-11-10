// src/components/headers/DriverHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiX,
  FiDollarSign,
  FiActivity,
} from "react-icons/fi";
import { useLogout, useCurrentUser } from "../../features/auth/useAuth";
import { PATHS } from "../../config/constants";
import { devices } from "../../styles/GlobalStyles";
import { GhostButton } from "../ui/Button";
import Cookies from "js-cookie";

/**
 * DriverHeader Component
 * 
 * Navigation header for driver pages, matching the design system.
 * - Uses global color tokens (var(--primary), var(--bg-*), var(--text-*))
 * - Responsive with mobile menu
 * - Sticky positioning on mobile
 * - Consistent spacing using var(--space-*) variables
 * 
 * Navigation Links:
 * - /driver/dashboard (Dashboard)
 * - /driver/requests (Bookings/Requests)
 * - /driver/trips (Trips)
 * - /driver/earnings (Earnings)
 * - /profile (Profile)
 * - /logout (Logout)
 */

/**
 * Header Container
 * - Sticky on mobile for easy navigation
 * - Uses global background and border colors
 * - Matches AdminHeader structure
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
 * Logo/Brand Section
 * - Left side of header
 */
const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const BrandTitle = styled.h1`
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
 * Navigation Section
 * - Desktop navigation links
 * - Hidden on mobile (replaced by mobile menu)
 */
const NavSection = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  @media ${devices.md} {
    display: none;
  }
`;

/**
 * Navigation Link
 * - Uses global color tokens
 * - Active state styling
 * - Consistent spacing with icons
 */
const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-normal);
  position: relative;

  /* Active state - matches current route */
  ${({ $active }) =>
    $active &&
    `
    color: var(--primary);
    background: var(--primary-light);
    font-weight: var(--font-semibold);
  `}

  /* Hover state */
  &:hover:not([aria-current="page"]) {
    color: var(--primary);
    background: var(--gray-100);
  }

  /* Icon spacing */
  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

/**
 * Right Section
 * - Profile and logout actions
 * - Mobile menu toggle
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
 * Mobile Menu Overlay
 * - Full-screen overlay on mobile
 * - Slides in from top
 * - Uses global background colors
 */
const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;

  @media ${devices.md} {
    display: block;
  }
`;

/**
 * Mobile Menu Panel
 * - Slides in from top on mobile
 * - Contains all navigation links
 * - Uses global spacing and colors
 */
const MobileMenuPanel = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--white);
  z-index: 1000;
  padding: var(--space-lg);
  box-shadow: var(--shadow-lg);
  display: none;

  @media ${devices.md} {
    display: block;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
`;

const MobileMenuTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  margin: 0;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all var(--transition-normal);

  ${({ $active }) =>
    $active &&
    `
    color: var(--primary);
    background: var(--primary-light);
    font-weight: var(--font-semibold);
  `}

  &:hover {
    background: var(--gray-100);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

/**
 * Action Button (Logout)
 * - Uses GhostButton styling
 * - Consistent with AdminHeader actions
 */
const ActionButton = styled(GhostButton)`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  color: var(--text-secondary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);

  &:hover {
    color: var(--error);
    background: var(--gray-100);
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }

  @media ${devices.md} {
    display: none; /* Hide on mobile, show in mobile menu */
  }
`;

const DriverHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  
  // Check if token exists before enabling query
  const token = Cookies.get("token");
  const { data: userData } = useCurrentUser({ enabled: !!token });
  const user = userData?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate(PATHS.LOGIN);
  };

  // Check if a route is active
  const isActive = (path) => {
    if (path === PATHS.DRIVER_DASHBOARD) {
      return location.pathname === PATHS.DRIVER_DASHBOARD;
    }
    return location.pathname.startsWith(path);
  };

  // Navigation links configuration
  // Matches the routes defined in constants.js
  const navLinks = [
    {
      path: PATHS.DRIVER_DASHBOARD,
      label: "Dashboard",
      icon: FiHome,
    },
    {
      path: PATHS.DRIVER_REQUESTS,
      label: "Requests",
      icon: FiCalendar,
    },
    {
      path: PATHS.DRIVER_TRIPS,
      label: "Trips",
      icon: FiActivity,
    },
    {
      path: PATHS.DRIVER_EARNINGS,
      label: "Earnings",
      icon: FiDollarSign,
    },
  ];

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          {/* Brand/Logo Section */}
          <BrandSection>
            <BrandTitle>Driver Portal</BrandTitle>
          </BrandSection>

          {/* Desktop Navigation */}
          <NavSection>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  $active={isActive(link.path)}
                  aria-current={isActive(link.path) ? "page" : undefined}
                >
                  <Icon />
                  {link.label}
                </NavLink>
              );
            })}
          </NavSection>

          {/* Right Section - Actions */}
          <RightSection>
            {/* Desktop Logout Button */}
            <ActionButton
              onClick={handleLogout}
              aria-label="Logout"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiLogOut />
              Logout
            </ActionButton>

            {/* Mobile Menu Toggle */}
            <MobileMenuButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </MobileMenuButton>
          </RightSection>
        </HeaderContent>
      </HeaderContainer>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <MobileMenuOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <MobileMenuPanel
            ref={menuRef}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <MobileMenuHeader>
              <MobileMenuTitle>Driver Portal</MobileMenuTitle>
              <MobileMenuButton
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FiX />
              </MobileMenuButton>
            </MobileMenuHeader>

            <MobileNavLinks>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <MobileNavLink
                    key={link.path}
                    to={link.path}
                    $active={isActive(link.path)}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon />
                    {link.label}
                  </MobileNavLink>
                );
              })}
              <MobileNavLink
                to={PATHS.PROFILE}
                $active={location.pathname === PATHS.PROFILE}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser />
                Profile
              </MobileNavLink>
              <MobileNavLink
                as="button"
                onClick={handleLogout}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "var(--error)",
                }}
              >
                <FiLogOut />
                Logout
              </MobileNavLink>
            </MobileNavLinks>
          </MobileMenuPanel>
        </>
      )}
    </>
  );
};

export default DriverHeader;

