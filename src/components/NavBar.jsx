// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { PATHS } from "../routes/routePaths";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Nav>
      <NavContainer>
        <Hamburger onClick={() => setIsOpen(!isOpen)}>
          <span />
          <span />
          <span />
        </Hamburger>

        <Menu isOpen={isOpen}>
          <MenuItem>
            <MenuLink to={PATHS.HOME}>Home</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to={PATHS.MODELS}>Models</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to={PATHS.LOCATIONS}>Locations</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to={PATHS.CONTACT}>Contact</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to={PATHS.HELP_CENTER}>Help</MenuLink>
          </MenuItem>

          {/* Login/Register Buttons */}
        </Menu>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;

// ---------------- Styled Components ---------------- //
const Nav = styled.nav`
  /* position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  background-color: ${({ scrolled, theme }) =>
    scrolled ? theme.colors.background : "transparent"};
  box-shadow: ${({ scrolled }) =>
    scrolled ? "0 4px 12px rgba(0,0,0,0.1)" : "none"}; */
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 5px;

  span {
    height: 3px;
    width: 25px;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
    transition: all 0.3s;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Menu = styled.ul`
  display: flex;
  list-style: none;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    position: absolute;
    top: 70px;
    right: 0;
    background: ${({ theme }) => theme.colors.background};
    flex-direction: column;
    width: 200px;
    padding: 1.5rem;
    border-radius: 0 0 0 8px;
    transition: all 0.3s ease-in-out;
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(100%)"};
  }
`;

const MenuItem = styled.li``;

const MenuLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;
