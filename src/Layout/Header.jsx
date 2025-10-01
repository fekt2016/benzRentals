// src/components/Header.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser, useLogout } from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { PATHS } from "../routes/routePaths";
import NotificationBell from "../components/NotificationBell";

// Import reusable buttons
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  ButtonLink,
} from "../components/ui/Button";

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
  FiBell,
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
    { path: PATHS.ABOUT, label: "About Us" },
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
          <LogoIcon>🚗</LogoIcon>
          <LogoText>
            Benz<span>Flex</span>
          </LogoText>
        </Logo>

        {/* Desktop Navigation */}
        <NavContainer>
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
              <>
                {/* Notification Bell - Only show for logged-in users */}
                <NotificationBellWrapper>
                  <NotificationBell />
                </NotificationBellWrapper>

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

                        <DropdownItem to="/notifications">
                          <FiBell />
                          Notifications
                        </DropdownItem>

                        <DropdownItem to="/profile">
                          <FiSettings />
                          Profile Settings
                        </DropdownItem>

                        <DropdownDivider />

                        <LogoutButton onClick={handleLogout}>
                          <FiLogOut />
                          Sign Out
                        </LogoutButton>
                      </DropdownMenu>
                    )}
                  </AnimatePresence>
                </UserSection>
              </>
            ) : (
              <AuthButton to={PATHS.LOGIN} $size="md">
                <FiUser style={{ marginRight: "var(--space-xs)" }} />
                Account
              </AuthButton>
            )}

            {/* Mobile Menu Button */}
            <MobileMenuButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              $size="sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </MobileMenuButton>
          </RightSection>
        </NavContainer>
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

              {user ? (
                <>
                  {/* Mobile Notification Bell for logged-in users */}
                  <MobileNavItem>
                    <MobileNotificationSection>
                      <NotificationBell mobileView={true} />
                    </MobileNotificationSection>
                  </MobileNavItem>

                  <MobileNavItem>
                    <MobileNavLink to="/bookings">
                      <FiCalendar style={{ marginRight: "var(--space-xs)" }} />
                      My Bookings
                    </MobileNavLink>
                  </MobileNavItem>

                  <MobileNavItem>
                    <MobileNavLink to="/reviews">
                      <FiStar style={{ marginRight: "var(--space-xs)" }} />
                      My Reviews
                    </MobileNavLink>
                  </MobileNavItem>

                  <MobileNavItem>
                    <MobileNavLink to="/notifications">
                      <FiBell style={{ marginRight: "var(--space-xs)" }} />
                      Notifications
                    </MobileNavLink>
                  </MobileNavItem>

                  <MobileNavItem>
                    <MobileNavLink to="/profile">
                      <FiSettings style={{ marginRight: "var(--space-xs)" }} />
                      Profile Settings
                    </MobileNavLink>
                  </MobileNavItem>

                  <MobileNavItem>
                    <MobileLogoutButton onClick={handleLogout} $size="sm">
                      <FiLogOut style={{ marginRight: "var(--space-xs)" }} />
                      Sign Out
                    </MobileLogoutButton>
                  </MobileNavItem>
                </>
              ) : (
                <MobileNavItem>
                  <MobileAuthButton to={PATHS.LOGIN} $size="sm">
                    <FiUser style={{ marginRight: "var(--space-xs)" }} />
                    Account
                  </MobileAuthButton>
                </MobileNavItem>
              )}
            </MobileNav>
          </MobileMenu>
        )}
      </AnimatePresence>
    </StyledHeader>
  );
}

// Styled Components
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
    scrolled ? "1px solid var(--gray-200)" : "none"};
  transition: all var(--transition-normal);
  box-shadow: ${({ scrolled }) => (scrolled ? "var(--shadow-md)" : "none")};
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md) var(--space-lg);
  position: relative;

  @media (max-width: 768px) {
    padding: var(--space-md);
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  transition: transform var(--transition-normal);
  font-family: var(--font-heading);

  &:hover {
    transform: translateY(-2px);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: 1.5rem;
`;

const LogoText = styled.div`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--secondary);
  font-family: var(--font-heading);

  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: var(--text-xl);
  }
`;

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  flex: 1;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: flex-end;
    gap: var(--space-sm);
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--space-xs);

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.div`
  position: relative;
`;

const NavLink = styled(Link)`
  position: relative;
  padding: var(--space-sm) var(--space-md);
  text-decoration: none;
  color: ${(props) =>
    props.$isActive ? "var(--primary)" : "var(--text-secondary)"};
  font-weight: var(--font-medium);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-body);

  &:hover {
    color: var(--primary);
    background: rgba(211, 47, 47, 0.1);
  }

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${(props) => (props.$isActive ? "80%" : "0%")};
    height: 2px;
    background: var(--primary);
    transform: translateX(-50%);
    transition: width var(--transition-normal);
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
  background: var(--primary);
  border-radius: 2px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const NotificationBellWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const AuthButton = styled(ButtonLink)`
  && {
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-lg);
    font-weight: var(--font-semibold);
    display: flex;
    align-items: center;
    font-family: var(--font-body);
  }
`;

const MobileMenuButton = styled(PrimaryButton)`
  && {
    display: none;
    padding: var(--space-sm);
    border-radius: var(--radius-lg);
    font-size: var(--text-lg);
    min-width: auto;
    width: 48px;
    height: 48px;

    @media (max-width: 768px) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const UserSection = styled.div`
  position: relative;
`;

const UserAvatar = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  background: rgba(211, 47, 47, 0.1);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 2px solid transparent;
  font-family: var(--font-body);

  &:hover {
    background: rgba(211, 47, 47, 0.2);
    border-color: rgba(211, 47, 47, 0.3);
  }

  .chevron {
    transition: transform var(--transition-normal);
    color: var(--text-muted);
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
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
`;

const UserName = styled.span`
  font-weight: var(--font-semibold);
  color: var(--text-primary);

  @media (max-width: 480px) {
    display: none;
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--space-xs);
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  backdrop-filter: blur(20px);
  min-width: 240px;
  overflow: hidden;
  z-index: 1001;
`;

const DropdownHeader = styled.div`
  padding: var(--space-md);
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
  border-bottom: 1px solid var(--gray-200);
  font-family: var(--font-body);

  div:first-child {
    font-size: var(--text-sm);
    color: var(--text-muted);
    margin-bottom: var(--space-xs);
  }

  .user-email {
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    font-size: var(--text-sm);
  }
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  transition: all var(--transition-fast);
  border-left: 3px solid transparent;
  font-family: var(--font-body);

  &:hover {
    background: var(--gray-50);
    color: var(--primary);
    border-left-color: var(--primary);
  }

  svg {
    width: 18px;
    height: 18px;
    color: var(--text-muted);
  }

  &:hover svg {
    color: var(--primary);
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: var(--gray-200);
  margin: var(--space-xs) 0;
`;

const LogoutButton = styled(SecondaryButton)`
  && {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    border: none;
    border-radius: 0;
    color: var(--error);
    border-color: var(--error);
    background: transparent;
    font-weight: var(--font-medium);
    border-left: 3px solid transparent;
    font-family: var(--font-body);

    &:hover {
      background: #fef2f2;
      border-left-color: var(--error);
      color: var(--error);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  background: var(--white);
  border-top: 1px solid var(--gray-200);

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  padding: var(--space-md);
`;

const MobileNavItem = styled.div`
  margin-bottom: var(--space-xs);
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: var(--space-sm) var(--space-md);
  text-decoration: none;
  color: ${(props) =>
    props.$isActive ? "var(--primary)" : "var(--text-secondary)"};
  font-weight: var(--font-medium);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  background: ${(props) =>
    props.$isActive ? "rgba(211, 47, 47, 0.1)" : "transparent"};
  font-family: var(--font-body);

  &:hover {
    background: rgba(211, 47, 47, 0.1);
    color: var(--primary);
  }
`;

const MobileNotificationSection = styled.div`
  display: flex;
  justify-content: center;
  padding: var(--space-xs) 0;
`;

const MobileAuthButton = styled(ButtonLink)`
  && {
    display: block;
    padding: var(--space-sm) var(--space-md);
    text-decoration: none;
    font-weight: var(--font-semibold);
    border-radius: var(--radius-lg);
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-body);
  }
`;

const MobileLogoutButton = styled(SecondaryButton)`
  && {
    display: block;
    padding: var(--space-sm) var(--space-md);
    font-weight: var(--font-semibold);
    border-radius: var(--radius-lg);
    text-align: center;
    width: 100%;
    border: 2px solid var(--error);
    color: var(--error);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-body);

    &:hover {
      background: #fef2f2;
      color: var(--error);
    }
  }
`;
