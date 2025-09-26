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
      {/* Sidebar */}
      <Sidebar open={open}>
        <CloseBtn onClick={() => setOpen(false)}>
          <FaTimes size={20} />
        </CloseBtn>
        <Nav>
          {links.map((link) => (
            <NavItem key={link.path} active={location.pathname === link.path}>
              <StyledLink to={link.path} onClick={() => setOpen(false)}>
                {link.label}
              </StyledLink>
            </NavItem>
          ))}
        </Nav>
      </Sidebar>

      {/* Main content */}
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}

// -------------------- Styles --------------------

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.fonts.body};
`;

const Sidebar = styled.div`
  width: 250px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: ${({ open }) => (open ? "0" : "-100%")};
  height: 100vh;
  padding: 80px 1rem 1rem;
  transition: left 0.3s ease-in-out;
  z-index: 999;

  @media (min-width: 768px) {
    position: relative;
    left: 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const NavItem = styled.div`
  border-radius: var(--radius-sm);
  background: ${({ active }) =>
    active ? "var(--color-grey-200)" : "transparent"};
  transition: background 0.3s, border-left 0.3s;
  background-color: ${({ active }) =>
    active ? "var(--color-grey-200)" : " transparent"};

  &:hover {
    background: ${({ active }) =>
      active ? "var(--color-grey-200)" : "var(--color-grey-200)"};
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  display: block;
  padding: 0.9rem 1rem;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;
