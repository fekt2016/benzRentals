// src/Layout/AdminLayout.jsx
import React, { useState } from "react";
import styled from "styled-components";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Outlet } from "react-router-dom";

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.grayLight};
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <LayoutContainer>
      <AdminSidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ContentContainer>
        <AdminHeader toggleSidebar={toggleSidebar} />
        <MainContent>
          <Outlet />
        </MainContent>
      </ContentContainer>
    </LayoutContainer>
  );
};

export default AdminLayout;
