// src/pages/UserAuthPage.jsx
import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaBars, FaTimes } from "react-icons/fa";

export default function UserAuthPage() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { path: "/profile", label: "Profile" },
    { path: "/bookings", label: "My Bookings" },
    { path: "/reviews", label: "My Reviews" },
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
              <StyledLink to={link.path} onClick={() => setOpen(false)}>
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

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background || "#FFFFFF"};
  font-family: ${({ theme }) => theme.typography?.fonts?.body || "inherit"};
`;

/* ---------- Mobile Header ---------- */
export const MobileHeader = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.md || "1.5rem"};
  padding: ${({ theme }) => theme.spacing?.lg || "2rem"};
  background: ${({ theme }) => theme.colors.white || "#FFFFFF"};
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.gray?.[200] || "#E5E7EB"};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex?.fixed || 1030};

  @media (max-width: ${({ theme }) => theme.breakpoints?.md || "768px"}) {
    display: flex;
  }
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text?.primary || "#1A1A1A"};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing?.sm || "1rem"};
  border-radius: ${({ theme }) => theme.borderRadius?.sm || "8px"};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions?.fast || "0.15s ease"};

  &:hover {
    background: ${({ theme }) => theme.colors.gray?.[100] || "#F3F4F6"};
    color: ${({ theme }) => theme.colors.primary || "#D32F2F"};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const MobileTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography?.sizes?.xl || "1.25rem"};
  font-weight: ${({ theme }) => theme.typography?.fontWeights?.semibold || 600};
  color: ${({ theme }) => theme.colors.text?.primary || "#1A1A1A"};
  margin: 0;
  font-family: ${({ theme }) => theme.typography?.fonts?.heading || "inherit"};
`;

/* ---------- Sidebar ---------- */
export const Sidebar = styled.aside`
  width: 280px;
  background: ${({ theme }) => theme.colors.white || "#FFFFFF"};
  color: ${({ theme }) => theme.colors.text?.primary || "#1A1A1A"};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: ${({ $open }) => ($open ? "0" : "-100%")};
  height: 100vh;
  padding: ${({ theme }) =>
    `${theme.spacing?.xl || "3rem"} ${theme.spacing?.lg || "2rem"}`};
  transition: left ${({ theme }) => theme.transitions?.normal || "0.3s ease"};
  z-index: ${({ theme }) => theme.zIndex?.modal || 1040};
  box-shadow: ${({ $open }) =>
    $open ? "0 32px 64px rgba(0,0,0,0.24)" : "none"};
  overflow-y: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || "768px"}) {
    position: relative;
    left: 0;
    box-shadow: none;
    border-right: 1px solid
      ${({ theme }) => theme.colors.gray?.[200] || "#E5E7EB"};
  }
`;

export const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing?.lg || "2rem"} 0;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.gray?.[200] || "#E5E7EB"};
  margin-bottom: ${({ theme }) => theme.spacing?.xl || "3rem"};
  text-align: center;
`;

export const SidebarTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography?.sizes?.["2xl"] || "1.5rem"};
  font-weight: ${({ theme }) => theme.typography?.fontWeights?.semibold || 600};
  color: ${({ theme }) => theme.colors.text?.primary || "#1A1A1A"};
  margin: 0;
  font-family: ${({ theme }) => theme.typography?.fonts?.heading || "inherit"};
`;

/* ---------- Navigation ---------- */
export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.sm || "1rem"};
  flex: 1;
`;

export const NavItem = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius?.lg || "16px"};
  background: ${({ theme, $active }) =>
    $active ? `${theme.colors.primary}10` : "transparent"};
  border-left: 4px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : "transparent")};
  transition: all ${({ theme }) => theme.transitions?.normal || "0.3s ease"};
  overflow: hidden;

  &:hover {
    background: ${({ theme, $active }) =>
      $active
        ? `${theme.colors.primary}15`
        : theme.colors.gray?.[50] || "#F9FAFB"};
  }
`;

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.text?.primary};
  font-weight: ${({ theme }) => theme.typography?.fontWeights?.medium || 500};
  font-family: ${({ theme }) => theme.typography?.fonts?.body || "inherit"};
  display: block;
  padding: ${({ theme }) =>
    `${theme.spacing?.md || "1rem"} ${theme.spacing?.lg || "2rem"}`};
  font-size: ${({ theme }) => theme.typography?.sizes?.base || "1rem"};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: ${({ theme }) => theme.spacing?.sm || "1rem"};
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.gray?.[400]};
    border-radius: 50%;
    transition: all ${({ theme }) => theme.transitions?.normal || "0.3s ease"};
  }
`;

/* ---------- Close Button & Overlay ---------- */
export const CloseBtn = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing?.lg || "2rem"};
  right: ${({ theme }) => theme.spacing?.lg || "2rem"};
  background: ${({ theme }) => theme.colors.gray?.[100] || "#F3F4F6"};
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing?.sm || "1rem"};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || "16px"};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) =>
    theme.shadows?.sm || "0 2px 8px rgba(0, 0, 0, 0.06)"};
  transition: all ${({ theme }) => theme.transitions?.normal || "0.3s ease"};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || "768px"}) {
    display: none;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: ${({ theme }) => (theme.zIndex?.modal || 1040) - 1};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: all ${({ theme }) => theme.transitions?.normal || "0.3s ease"};

  @media (min-width: ${({ theme }) => theme.breakpoints?.md || "768px"}) {
    display: none;
  }
`;

/* ---------- Main Content ---------- */
export const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing?.xl || "3rem"};
  background: ${({ theme }) => theme.colors.surface || "#F8FAFC"};
  min-height: 100vh;

  @media (max-width: ${({ theme }) => theme.breakpoints?.md || "768px"}) {
    margin-top: 80px;
  }
`;
