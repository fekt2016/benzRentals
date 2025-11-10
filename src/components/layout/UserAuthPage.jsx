import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaBars, FaTimes } from "react-icons/fa";

// Import UI Components
import { GhostButton } from "../ui/Button";
// import { LoadingState } from "../components/ui/LoadingSpinner";

export default function UserAuthPage() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { path: "/profile", label: "Profile" },
    { path: "/settings", label: "Settings" },
    { path: "/bookings", label: "My Bookings" },
    { path: "/reviews", label: "My Reviews" },
    { path: "/notifications", label: "My Notifications" },
  ];

  return (
    <Container>
      {/* Mobile Header with Menu Button */}
      <MobileHeader>
        <MenuButton onClick={() => setOpen(true)}>
          <FaBars size={20} />
        </MenuButton>
        <MobileTitle>Account</MobileTitle>
      </MobileHeader>

      {/* Sidebar */}
      <Sidebar open={open}>
        <CloseBtn onClick={() => setOpen(false)}>
          <FaTimes size={20} />
        </CloseBtn>
        <SidebarHeader>
          <SidebarTitle>My Account</SidebarTitle>
        </SidebarHeader>
        <Nav>
          {links.map((link) => (
            <NavItem key={link.path} $active={location.pathname === link.path}>
              <StyledLink
                to={link.path}
                onClick={() => setOpen(false)}
                $active={location.pathname === link.path}
              >
                {link.label}
              </StyledLink>
            </NavItem>
          ))}
        </Nav>
      </Sidebar>

      {/* Overlay for mobile */}
      <Overlay $open={open} onClick={() => setOpen(false)} />

      {/* Main content */}
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}

// Styled Components using Global CSS Variables
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--background);
  font-family: var(--font-body);
`;

/* ---------- Mobile Header ---------- */
const MobileHeader = styled.div`
  display: none;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MenuButton = styled(GhostButton)`
  && {
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: auto;

    &:hover {
      background: var(--gray-100);
      color: var(--primary);
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

const MobileTitle = styled.h1`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

/* ---------- Sidebar ---------- */
const Sidebar = styled.aside`
  width: 280px;
  background: var(--white);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: ${({ open }) => (open ? "0" : "-100%")};
  height: 100vh;
  padding: var(--space-xl) var(--space-lg);
  transition: left var(--transition-normal);
  z-index: 1040;
  box-shadow: ${({ open }) => (open ? "var(--shadow-xl)" : "none")};
  overflow-y: auto;

  @media (min-width: 768px) {
    position: relative;
    left: 0;
    box-shadow: none;
    border-right: 1px solid var(--gray-200);
  }
`;

const SidebarHeader = styled.div`
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: var(--space-xl);
  text-align: center;
`;

const SidebarTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

/* ---------- Navigation ---------- */
const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex: 1;
`;

const NavItem = styled.div`
  border-radius: var(--radius-lg);
  background: ${({ $active }) =>
    $active ? "var(--primary-light)" : "transparent"};
  border-left: 4px solid
    ${({ $active }) => ($active ? "var(--primary)" : "transparent")};
  transition: all var(--transition-normal);
  overflow: hidden;

  &:hover {
    background: ${({ $active }) =>
      $active ? "var(--primary-light)" : "var(--gray-50)"};
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ $active }) =>
    $active ? "var(--primary)" : "var(--text-primary)"};
  font-weight: var(--font-medium);
  font-family: var(--font-body);
  display: block;
  padding: var(--space-md) var(--space-lg);
  font-size: var(--text-base);
  position: relative;
  transition: all var(--transition-normal);

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: var(--space-sm);
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: ${({ $active }) =>
      $active ? "var(--primary)" : "var(--gray-400)"};
    border-radius: 50%;
    transition: all var(--transition-normal);
  }

  &:hover {
    color: ${({ $active }) =>
      $active ? "var(--primary)" : "var(--primary-dark)"};
  }
`;

/* ---------- Close Button & Overlay ---------- */
const CloseBtn = styled(GhostButton)`
  && {
    position: absolute;
    top: var(--space-lg);
    right: var(--space-lg);
    background: var(--gray-100);
    padding: var(--space-sm);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: auto;
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);

    &:hover {
      background: var(--primary);
      color: var(--white);
    }

    @media (min-width: 768px) {
      display: none;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1039;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: all var(--transition-normal);

  @media (min-width: 768px) {
    display: none;
  }
`;

/* ---------- Main Content ---------- */
const Main = styled.main`
  flex: 1;
  padding: var(--space-xl);
  background: var(--surface);
  min-height: 100vh;

  @media (max-width: 768px) {
    margin-top: 80px;
    padding: var(--space-lg);
  }

  @media (max-width: 480px) {
    padding: var(--space-md);
  }
`;

// Export components for potential reuse
export {
  Container,
  MobileHeader,
  MenuButton,
  MobileTitle,
  Sidebar,
  SidebarHeader,
  SidebarTitle,
  Nav,
  NavItem,
  StyledLink,
  CloseBtn,
  Overlay,
  Main,
};
