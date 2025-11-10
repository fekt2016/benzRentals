import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser, useLogout } from "../../features/auth/useAuth";
import { useToggleRole } from "../../features/users/useUser";
import { PATHS } from "../../config/constants";
import NotificationBell from "../../features/notifications/NotificationBell";
import { devices } from "../../styles/GlobalStyles";
import {
  PrimaryButton,
  SecondaryButton,
  ButtonLink,
} from "../ui/Button";
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
  FiShield,
  FiHeart,
  FiGift,
} from "react-icons/fi";
import { getAuthToken } from "../../utils/tokenService";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [platform, setPlatform] = useState(null); // "ios" | "android" | "web"

  const authData = getAuthToken();
  const token = authData.token || null;
  const role = authData.role || null;
  const isAuthed = Boolean(token);
  const { data: userData } = useCurrentUser({ enabled: isAuthed });
  const { mutate: logout } = useLogout();
  const { mutate: toggleRole, isPending: isTogglingRole } = useToggleRole();
  const user = useMemo(() => userData?.user || null, [userData]);
  const isExecutive = user?.executive === true;

  const location = useLocation();
  const dropdownRef = useRef();
  const headerRef = useRef();
  const sentinelRef = useRef();
  const navigate = useNavigate();

  // ✅ Detect device type
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isMobileDevice = isAndroid || isIOS;
    setIsMobile(isMobileDevice);
    setPlatform(isIOS ? "ios" : isAndroid ? "android" : "web");

    console.log("[DeviceDetection] platform:", isIOS ? "iOS" : isAndroid ? "Android" : "Web");
  }, []);

  // ✅ Unified “Open App” logic (works in dev + prod)
  const openMobileApp = () => {
    const env = import.meta.env.MODE || process.env.NODE_ENV || "development";
    const localIp =
      window.location.hostname === "localhost"
        ? "192.168.100.58" // 👈 change to your LAN IP shown in Expo
        : window.location.hostname;

    // Development (Expo Go)
    if (env === "development") {
      const expoUrl = `exp://${localIp}:8081`;
      console.log("[OpenApp] Expo dev URL:", expoUrl);
      window.location.href = expoUrl;
      setTimeout(() => {
        alert(
          "If the app didn’t open, ensure your Expo app is running and your phone & computer are on the same Wi-Fi network."
        );
      }, 1200);
      return;
    }

    // Production (deep link)
    const appScheme = "benzflex://";
    const iosStore = "https://apps.apple.com/app/id1234567890"; // 🧩 your App Store link
    const androidStore = "https://play.google.com/store/apps/details?id=com.benzflex"; // 🧩 your Play Store link

    const fallbackUrl = platform === "ios" ? iosStore : androidStore;

    // Attempt deep link → fallback
    const now = Date.now();
    window.location.href = appScheme;
    setTimeout(() => {
      if (Date.now() - now < 1500) {
        window.location.href = fallbackUrl;
      }
    }, 1000);
  };

  // ✅ Scroll shadow
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { root: null, rootMargin: "-50px 0px 0px 0px", threshold: 0 }
    );
    observer.observe(sentinel);
    return () => sentinel && observer.unobserve(sentinel);
  }, []);

  // Redirect admin to dashboard
  useEffect(() => {
    if (role === "admin" && location.pathname === PATHS.HOME) {
      navigate("/admin", { replace: true });
    }
  }, [role, location.pathname]);

  // Dropdown close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate(PATHS.HOME);
    setDropdownOpen(false);
  };

  const navItems = [
    { path: PATHS.HOME, label: "Home" },
    { path: PATHS.MODELS, label: "Our Fleet" },
    { path: PATHS.ABOUT, label: "About Us" },
    { path: PATHS.SUPPORT, label: "Support" },
    { path: PATHS.CONTACT, label: "Contact" },
  ];

  return (
    <>
      <Sentinel ref={sentinelRef} />
      <StyledHeader
        ref={headerRef}
        $scrolled={scrolled}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <HeaderContainer>
          <Logo to={PATHS.HOME}>
            <LogoImage src="/images/benzflexLogo.png" alt="benzflex logo" />
          </Logo>

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

            <RightSection>
              {user ? (
                <>
                  <NotificationBellWrapper>
                    <NotificationBell />
                  </NotificationBellWrapper>

                  {role && isExecutive && (
                    <RoleToggleButton
                      as="button"
                      $size="sm"
                      onClick={() => toggleRole()}
                      disabled={isTogglingRole}
                      title={`Switch to ${role === "user" ? "Admin" : "User"} mode`}
                    >
                      <FiShield />
                      {role === "user" ? "Admin" : "User"}
                    </RoleToggleButton>
                  )}

                  {/* ✅ Only show on mobile */}
                  {isMobile && (
                    <SecondaryButton
                      as="button"
                      $size="md"
                      onClick={openMobileApp}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Open App
                    </SecondaryButton>
                  )}

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
                      <UserName>{user.fullName?.split(" ")[0]}</UserName>
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
                            <div className="user-email">{user.fullName}</div>
                            <div className="user-email">{user.email}</div>
                          </DropdownHeader>
                          <DropdownItem to="/bookings">
                            <FiCalendar /> My Bookings
                          </DropdownItem>
                          <DropdownItem to="/reviews">
                            <FiStar /> My Reviews
                          </DropdownItem>
                          <DropdownItem to="/notifications">
                            <FiBell /> Notifications
                          </DropdownItem>
                          <DropdownItem to="/profile">
                            <FiUser /> My Profile
                          </DropdownItem>
                          <DropdownItem to="/wishlist">
                            <FiHeart /> Wishlist
                          </DropdownItem>
                          <DropdownItem to="/referrals">
                            <FiGift /> Referrals
                          </DropdownItem>
                          <DropdownItem to="/settings">
                            <FiSettings /> Settings
                          </DropdownItem>
                          {isExecutive && (
                            <>
                              <DropdownDivider />
                              <ToggleRoleButton
                                onClick={() => toggleRole()}
                                disabled={isTogglingRole}
                              >
                                <FiShield /> Switch to{" "}
                                {role === "user" ? "Admin" : "User"}
                              </ToggleRoleButton>
                              <DropdownDivider />
                            </>
                          )}
                          <LogoutButton onClick={handleLogout}>
                            <FiLogOut /> Sign Out
                          </LogoutButton>
                        </DropdownMenu>
                      )}
                    </AnimatePresence>
                  </UserSection>
                </>
              ) : (
                <>
                  <AuthButton to={PATHS.LOGIN} $size="md">
                    <FiUser style={{ marginRight: "var(--space-xs)" }} />
                    Account
                  </AuthButton>

                  {/* ✅ Only on mobile for guests */}
                  {isMobile && (
                    <SecondaryButton
                      as="button"
                      $size="md"
                      onClick={openMobileApp}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Open App
                    </SecondaryButton>
                  )}
                </>
              )}

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

        {/* Mobile menu */}
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
                {isMobile && (
                  <MobileNavItem>
                    <MobileAuthButton as="button" onClick={openMobileApp} $size="sm">
                      Open App
                    </MobileAuthButton>
                  </MobileNavItem>
                )}
              </MobileNav>
            </MobileMenu>
          )}
        </AnimatePresence>
      </StyledHeader>
    </>
  );
}

/* ---------- Styles (same as before, unchanged) ---------- */
const Sentinel = styled.div`position: absolute; top: 0; width: 100%; height: 50px;`;
const StyledHeader = styled(motion.header)`
  position: fixed; top: 0; width: 100%; z-index: 9000;
  background: ${({ $scrolled }) => ($scrolled ? "var(--white)" : "transparent")};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(20px)" : "none")};
  border-bottom: ${({ $scrolled }) => ($scrolled ? "1px solid var(--gray-200)" : "none")};
  transition: all var(--transition-normal);
  box-shadow: ${({ $scrolled }) => ($scrolled ? "var(--shadow-md)" : "none")};
`;
const HeaderContainer = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  max-width: 120rem; margin: 0 auto; padding: var(--space-sm) var(--space-lg);
`;
const Logo = styled(Link)`display: flex; align-items: center;`;
const LogoImage = styled.img`width: 6rem; height: 6rem; border-radius: var(--radius-lg);`;
const NavContainer = styled.div`display: flex; align-items: center; gap: var(--space-lg); flex: 1; justify-content: flex-end;`;
const Nav = styled.nav`display: flex; align-items: center; gap: var(--space-xs); @media (max-width: 768px) { display: none; }`;
const NavItem = styled.div`position: relative;`;
const NavLink = styled(Link)`
  padding: var(--space-sm) var(--space-md); text-decoration: none;
  color: ${(props) => (props.$isActive ? "var(--primary)" : "var(--text-secondary)")};
  font-weight: var(--font-medium);
`;
const ActiveIndicator = styled(motion.div)`
  position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
  width: 80%; height: 2px; background: var(--primary);
`;
const RightSection = styled.div`display: flex; align-items: center; gap: var(--space-sm);`;
const NotificationBellWrapper = styled.div`display: flex; align-items: center;`;
const RoleToggleButton = styled(SecondaryButton)`
  && { white-space: nowrap; display: flex; align-items: center; gap: var(--space-xs); font-size: var(--text-sm); }
`;
const AuthButton = styled(ButtonLink)`&& { padding: var(--space-sm) var(--space-md); border-radius: var(--radius-lg); display: flex; align-items: center; }`;
const MobileMenuButton = styled(PrimaryButton)`&& { display: none; @media ${devices.md} { display: flex; } }`;
const UserSection = styled.div`position: relative;`;
const UserAvatar = styled(motion.div)`display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-full); background: rgba(251,137,92,0.3); cursor: pointer;`;
const AvatarImage = styled.img`width: 3.6rem; height: 3.6rem; border-radius: 50%; object-fit: cover;`;
const AvatarPlaceholder = styled.div`width: 36px; height: 36px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: var(--white);`;
const UserName = styled.span`font-weight: var(--font-semibold); color: var(--text-primary);`;
const DropdownMenu = styled(motion.div)`position: absolute; top: 100%; right: 0; margin-top: var(--space-xs); background: var(--white); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); border: 1px solid var(--gray-200); min-width: 240px;`;
const DropdownHeader = styled.div`padding: var(--space-md); background: var(--gray-50); border-bottom: 1px solid var(--gray-200);`;
const DropdownItem = styled(Link)`display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm) var(--space-md); text-decoration: none; color: var(--text-secondary);`;
const DropdownDivider = styled.div`height: 1px; background: var(--gray-200);`;
const ToggleRoleButton = styled(SecondaryButton)`&& { width: 100%; color: var(--primary); justify-content: flex-start; gap: var(--space-sm); }`;
const LogoutButton = styled(SecondaryButton)`&& { width: 100%; color: var(--error); }`;
const MobileMenu = styled(motion.div)`display: none; background: var(--white); border-top: 1px solid var(--gray-200); @media ${devices.md} { display: block; }`;
const MobileNav = styled.nav`display: flex; flex-direction: column; padding: var(--space-md);`;
const MobileNavItem = styled.div`margin-bottom: var(--space-xs);`;
const MobileNavLink = styled(Link)`display: block; padding: var(--space-sm) var(--space-md); text-decoration: none; color: ${(p) => (p.$isActive ? "var(--primary)" : "var(--text-secondary)")}; font-weight: var(--font-medium);`;
const MobileAuthButton = styled(ButtonLink)`&& { display: block; padding: var(--space-sm) var(--space-md); text-align: center; }`;
