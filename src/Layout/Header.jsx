// src/components/Header.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser, useLogout } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { PATHS } from "../routes/routePaths";

// Icons
import {
  FiUser,
  FiLogOut,
  FiSettings,
  FiCalendar,
  FiStar,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: userData } = useCurrentUser();
  const { mutate: logout } = useLogout();

  const location = useLocation();
  const dropdownRef = useRef();
  const headerRef = useRef();
  const navigate = useNavigate();

  const user = useMemo(() => userData?.user || null, [userData]);
  const role = useMemo(() => {
    if (!userData?.token) return null;
    try {
      const decoded = jwtDecode(userData.token);
      return decoded.role;
    } catch {
      return null;
    }
  }, [userData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate(PATHS.HOME);
    setDropdownOpen(false);
  };

  if (role === "admin") navigate("/admin");

  const navItems = [
    { path: PATHS.HOME, label: "Home" },
    { path: PATHS.MODELS, label: "Our Fleet" },
    { path: PATHS.ABOUT, label: "About" },
    { path: PATHS.CONTACT, label: "Contact" },
  ];

  return (
    <StyledHeader
      ref={headerRef}
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <HeaderContainer>
        {/* Logo */}
        <Logo to={PATHS.HOME}>
          <LogoIcon>{/* <FiCar /> */}</LogoIcon>
          <LogoText>
            Benz<span>Flex</span>
          </LogoText>
        </Logo>

        {/* Desktop Navigation */}
        <Nav>
          {navItems.map((item) => (
            <NavItem key={item.path}>
              <NavLink
                to={item.path}
                $isActive={location.pathname === item.path}
              >
                {item.label}
                {location.pathname === item.path && (
                  <ActiveIndicator layoutId="activeIndicator" />
                )}
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        {/* Right Section */}
        <RightSection>
          {user ? (
            <UserSection ref={dropdownRef}>
              <UserAvatar
                onClick={() => setDropdownOpen(!dropdownOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarPlaceholder>
                    <FiUser />
                  </AvatarPlaceholder>
                )}
                <UserName>{user.name?.split(" ")[0]}</UserName>
                <FiChevronDown
                  className={`chevron ${dropdownOpen ? "open" : ""}`}
                />
              </UserAvatar>

              <AnimatePresence>
                {dropdownOpen && (
                  <DropdownMenu
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DropdownHeader>
                      <div>Signed in as</div>
                      <div className="user-email">{user.email}</div>
                    </DropdownHeader>

                    <DropdownItem to="/bookings">
                      <FiCalendar />
                      My Bookings
                    </DropdownItem>

                    <DropdownItem to="/reviews">
                      <FiStar />
                      My Reviews
                    </DropdownItem>

                    <DropdownItem to="/profile">
                      <FiSettings />
                      Profile Settings
                    </DropdownItem>

                    <DropdownDivider />

                    <DropdownButton onClick={handleLogout}>
                      <FiLogOut />
                      Sign Out
                    </DropdownButton>
                  </DropdownMenu>
                )}
              </AnimatePresence>
            </UserSection>
          ) : (
            <AuthButtons>
              <LoginButton to={PATHS.LOGIN}>Sign In</LoginButton>
              <SignUpButton to={PATHS.REGISTER}>Get Started</SignUpButton>
            </AuthButtons>
          )}

          {/* Mobile Menu Button */}
          <MobileMenuButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </MobileMenuButton>
        </RightSection>
      </HeaderContainer>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MobileNav>
              {navItems.map((item) => (
                <MobileNavItem key={item.path}>
                  <MobileNavLink
                    to={item.path}
                    $isActive={location.pathname === item.path}
                  >
                    {item.label}
                  </MobileNavLink>
                </MobileNavItem>
              ))}

              {!user && (
                <>
                  <MobileNavItem>
                    <MobileNavLink to={PATHS.LOGIN}>Sign In</MobileNavLink>
                  </MobileNavItem>
                  <MobileNavItem>
                    <MobileButtonLink to={PATHS.REGISTER}>
                      Get Started
                    </MobileButtonLink>
                  </MobileNavItem>
                </>
              )}
            </MobileNav>
          </MobileMenu>
        )}
      </AnimatePresence>
    </StyledHeader>
  );
}

// // Animations
// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// const slideIn = keyframes`
//   from {
//     transform: translateX(-100%);
//   }
//   to {
//     transform: translateX(0);
//   }
// `;

const StyledHeader = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: ${({ scrolled }) =>
    scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent"};
  backdrop-filter: ${({ scrolled }) =>
    scrolled ? "blur(20px) saturate(180%)" : "none"};
  border-bottom: ${({ scrolled }) =>
    scrolled ? "1px solid rgba(255, 255, 255, 0.2)" : "none"};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ scrolled }) =>
    scrolled ? "0 8px 32px rgba(0, 0, 0, 0.1)" : "none"};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;

  span {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.div`
  position: relative;
`;

const NavLink = styled(Link)`
  position: relative;
  padding: 0.75rem 1.25rem;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? "#3b82f6" : "#64748b")};
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${(props) => (props.$isActive ? "80%" : "0%")};
    height: 2px;
    background: #3b82f6;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover::before {
    width: 80%;
  }
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: #3b82f6;
  border-radius: 2px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const AuthButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
`;

const LoginButton = styled(AuthButton)`
  color: #64748b;
  background: transparent;

  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }
`;

const SignUpButton = styled(AuthButton)`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
`;

const UserSection = styled.div`
  position: relative;
`;

const UserAvatar = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background: rgba(59, 130, 246, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.3);
  }

  .chevron {
    transition: transform 0.3s ease;
    color: #64748b;
  }

  .chevron.open {
    transform: rotate(180deg);
  }
`;

const AvatarImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #1e293b;

  @media (max-width: 480px) {
    display: none;
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  min-width: 240px;
  overflow: hidden;
  z-index: 1001;
`;

const DropdownHeader = styled.div`
  padding: 1.25rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;

  div:first-child {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 0.25rem;
  }

  .user-email {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.9rem;
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: #475569;
  font-weight: 500;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background: #f8fafc;
    color: #3b82f6;
    border-left-color: #3b82f6;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  color: #ef4444;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;

  &:hover {
    background: #fef2f2;
    border-left-color: #ef4444;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem;
  cursor: pointer;
  font-size: 1.25rem;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  background: white;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const MobileNavItem = styled.div`
  margin-bottom: 0.5rem;
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 1rem 1.25rem;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? "#3b82f6" : "#475569")};
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.$isActive ? "rgba(59, 130, 246, 0.1)" : "transparent"};

  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
`;

const MobileButtonLink = styled(Link)`
  display: block;
  padding: 1rem 1.25rem;
  text-decoration: none;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  font-weight: 600;
  border-radius: 10px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
`;
