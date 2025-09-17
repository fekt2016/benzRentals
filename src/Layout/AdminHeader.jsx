// src/Layout/AdminHeader.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";

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

const IconButton = styled.button`
  background: none;
  border: none;
  position: relative;
  cursor: pointer;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    opacity: 0.7;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: ${({ theme }) => theme.colors.danger};
  color: white;
  font-size: 1rem;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
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
  border-radius: var(--radius-md);
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-width: 150px;
  display: ${({ open }) => (open ? "block" : "none")};
  z-index: 200;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    background: ${({ theme }) => theme.colors.grayLight};
  }
`;

const AdminHeader = ({ toggleSidebar }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const notifications = 3; // Example

  return (
    <HeaderContainer>
      <LeftSection>
        <IconButton onClick={toggleSidebar}>
          <FaBars />
        </IconButton>
        <h2>Admin Dashboard</h2>
      </LeftSection>

      <RightSection>
        <IconButton>
          <FaBell />
          {notifications > 0 && (
            <NotificationBadge>{notifications}</NotificationBadge>
          )}
        </IconButton>

        <ProfileMenu>
          <IconButton onClick={() => setProfileOpen(!profileOpen)}>
            <FaUserCircle />
          </IconButton>
          <Dropdown open={profileOpen}>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Logout</DropdownItem>
          </Dropdown>
        </ProfileMenu>
      </RightSection>
    </HeaderContainer>
  );
};

export default AdminHeader;
