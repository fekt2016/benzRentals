// src/components/Header.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar"; // make sure NavBar.jsx exists
import { PATHS } from "../routes/routePaths";
import { Link } from "react-router-dom";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { data } = useAuth();
  console.log("userdata", data);
  const user = null;
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <StyledHeader scrolled={scrolled}>
      <Logo to={PATHS.HOME}>BenzFlex</Logo>

      <Right>
        <NavWrapper>
          <Navbar />
        </NavWrapper>

        {user ? (
          <AvatarWrapper>
            <Avatar src={user.avatar} alt={user.name} />
          </AvatarWrapper>
        ) : (
          <ButtonLink to={PATHS.LOGIN}>Login</ButtonLink>
        )}
      </Right>
    </StyledHeader>
  );
}

/* ---------- Styled Components ---------- */

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  padding: 1rem 2rem;
  z-index: 999;

  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  background-color: ${({ scrolled, theme }) =>
    scrolled ? theme.colors.background : "transparent"};
  box-shadow: ${({ scrolled }) =>
    scrolled ? "0 4px 12px rgba(0,0,0,0.1)" : "none"};
`;

const Logo = styled(Link)`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const ButtonLink = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  transition: background 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const AvatarWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
