// src/Layout/AdminSidebar.jsx
import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCar,
  FaUsers,
  FaFileAlt,
  FaBell,
} from "react-icons/fa";

const SidebarContainer = styled.aside`
  width: 250px;
  background: ${({ theme }) => theme.colors.primary}; // primary background
  display: flex;
  flex-direction: column;
  position: fixed;
  /* height: 100vh; */
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  transition: transform 0.3s ease-in-out;
  z-index: 100;

  @media (min-width: 768px) {
    transform: translateX(0);
    position: relative;
  }
`;

const SidebarHeader = styled.div`
  padding: 2rem;
  font-weight: 700;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.white};
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  transition: background 0.2s;

  &.active {
    background: ${({ theme }) => theme.colors.primaryDark};
    color: white;
    font-weight: 600;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const AdminSidebar = ({ open }) => {
  return (
    <SidebarContainer open={open}>
      <SidebarHeader>Benz Admin</SidebarHeader>
      <SidebarLink to="/admin">
        <FaTachometerAlt /> Dashboard
      </SidebarLink>
      <SidebarLink to="/admin/cars/new">
        <FaFileAlt /> Add Car
      </SidebarLink>
      <SidebarLink to="/admin/cars">
        <FaCar /> Cars
      </SidebarLink>
      <SidebarLink to="/admin/bookings">
        <FaFileAlt /> Bookings
      </SidebarLink>
      <SidebarLink to="/admin/users">
        <FaUsers /> Users
      </SidebarLink>
      <SidebarLink to="/admin/reports">
        <FaFileAlt /> Reports
      </SidebarLink>
      {/* Notification Page Link */}
      <SidebarLink to="/admin/notifications">
        <FaBell /> Notifications
      </SidebarLink>
    </SidebarContainer>
  );
};

export default AdminSidebar;
