// src/Layout/AdminHeader.jsx
import React, { useState } from "react";
import styled from "styled-components";
import {
  FaBell,
  FaUserCircle,
  FaBars,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useLogout } from "../hooks/useAuth";
import { GhostButton } from "../components/ui/Button";

const HeaderContainer = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const IconButton = styled(GhostButton)`
  position: relative;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.5rem;
  border-radius: 50%;
  border: 1px solid transparent;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[300]};
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileMenu = styled.div`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 3rem;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-width: 200px;
  display: ${({ open }) => (open ? "block" : "none")};
  z-index: 200;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: 0.9rem;

  &:hover {
    background: ${({ theme }) => theme.colors.grayLight};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }
`;

const DashboardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const AdminHeader = ({ toggleSidebar }) => {
  const { mutate: logout } = useLogout();
  const [profileOpen, setProfileOpen] = useState(false);
  const notifications = 3; // Example

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  const handleProfileClick = () => {
    // Handle profile navigation
    setProfileOpen(false);
  };

  const handleSettingsClick = () => {
    // Handle settings navigation
    setProfileOpen(false);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <IconButton
          onClick={toggleSidebar}
          $size="sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBars />
        </IconButton>
        <DashboardTitle>Admin Dashboard</DashboardTitle>
      </LeftSection>

      <RightSection>
        <IconButton
          $size="sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBell />
          {notifications > 0 && (
            <NotificationBadge>{notifications}</NotificationBadge>
          )}
        </IconButton>

        <ProfileMenu>
          <IconButton
            onClick={() => setProfileOpen(!profileOpen)}
            $size="sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUserCircle />
          </IconButton>
          <Dropdown open={profileOpen}>
            <DropdownItem onClick={handleProfileClick}>
              <FaUserCircle />
              Profile
            </DropdownItem>
            <DropdownItem onClick={handleSettingsClick}>
              <FaCog />
              Settings
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </DropdownItem>
          </Dropdown>
        </ProfileMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default AdminHeader;
