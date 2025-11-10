// src/pages/admin/UsersManagementPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaUserPlus,
  FaFilter,
  FaUsers,
} from "react-icons/fa";
import { useGetUsers } from "../../hooks/useUser";

import { Card, LuxuryCard } from "../../components/Cards/Card";
import {
  PrimaryButton,
  
} from "../../components/ui/Button";
import { LoadingSpinner, ErrorState } from "../../components/ui/LoadingSpinner";
import {
  SearchInput,
  Select,
  FormField,
} from "../../components/forms/Form";
import { devices } from "../../styles/GlobalStyles";
import AdminAddUserModal from "../../components/Modal/AdminAddUserModal";


const UsersManagementPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
const navigate = useNavigate()
  const {
    data: usersData,
    isPending,
    isError,
    error,
  } = useGetUsers();

  const users = useMemo(() => usersData?.data?.data || [], [usersData]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.active) ||
        (statusFilter === "inactive" && !user.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const userStats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.active).length,
    inactive: users.filter((u) => !u.active).length,
    users: users.filter((u) => u.role === "user").length,
    admins: users.filter((u) => u.role === "admin").length,
  }), [users]);

  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const handleAddUser = () => setShowModal(true);
  const handleEditUser = (u) => console.log("Edit user:", u);
  const handleViewUser = (u) => {navigate(`/admin/users/${u._id}`)}
  const handleDeleteUser = (u) => {
    if (window.confirm(`Delete ${u.fullName}?`)) console.log("Deleted:", u);
  };

  // ---------- Loading & Error States ----------
  if (isPending) {
    return (
      <Container>
        <LoadingSpinner size="xl" />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorState
          title="Error Loading Users"
          message={error?.message || "Failed to load user data."}
          action={<PrimaryButton onClick={() => window.location.reload()}>Retry</PrimaryButton>}
        />
      </Container>
    );
  }

  // ---------- Main UI ----------
  return (
    <Container>
      {/* Header */}
      <HeaderSection>
        <HeaderContent>
          <HeaderTitle>User Management</HeaderTitle>
          <HeaderSubtitle>Manage users, roles, and activity</HeaderSubtitle>
        </HeaderContent>
        <HeaderActions>
          <PrimaryButton onClick={handleAddUser}>
            <FaUserPlus /> Add User
          </PrimaryButton>
        </HeaderActions>
      </HeaderSection>

      {/* Stats */}
      <StatsGrid>
        <StatCard>
          <StatIcon $color="var(--primary)"><FaUsers /></StatIcon>
          <StatContent>
            <StatValue>{userStats.total}</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="var(--success)"><FaEye /></StatIcon>
          <StatContent>
            <StatValue>{userStats.active}</StatValue>
            <StatLabel>Active Users</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="var(--warning)"><FaEdit /></StatIcon>
          <StatContent>
            <StatValue>{userStats.users}</StatValue>
            <StatLabel>Customers</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="var(--accent)"><FaFilter /></StatIcon>
          <StatContent>
            <StatValue>{userStats.admins}</StatValue>
            <StatLabel>Admins</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      {/* Controls */}
      <ControlsCard>
        <ControlsGrid>
          <FormField>
            <SearchInput
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormField>

          <FormField>
            <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} options={roleOptions} />
          </FormField>

          <FormField>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} />
          </FormField>
        </ControlsGrid>
      </ControlsCard>

      {/* Table / Mobile Cards */}
      <UserDataSection>
        <DesktopTable>
          <thead>
            <tr>
              <TableHeader>User</TableHeader>
              <TableHeader>Contact</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <TableCell>
                  <UserInfo>
                    <UserAvatar>{u.fullName?.[0] || "U"}</UserAvatar>
                    <UserDetails>
                      <UserName>{u.fullName}</UserName>
                      <UserJoinDate>Joined {new Date(u.createdAt).toLocaleDateString()}</UserJoinDate>
                    </UserDetails>
                  </UserInfo>
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><RoleBadge $role={u.role}>{u.role}</RoleBadge></TableCell>
                <TableCell><StatusBadge $active={u.status}>{u.status ? "Active" : "Inactive"}</StatusBadge></TableCell>
                <TableCell>
                  <ActionGroup>
                    <IconBtn onClick={() => handleViewUser(u)}><FaEye /></IconBtn>
                    <IconBtn onClick={() => handleEditUser(u)}><FaEdit /></IconBtn>
                    <IconBtn onClick={() => handleDeleteUser(u)}><FaTrash /></IconBtn>
                  </ActionGroup>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </DesktopTable>

        <MobileList>
          {filteredUsers.map((u) => (
            <UserCard key={u._id}>
              <CardHeader>
                <UserInfo>
                  <UserAvatar>{u.fullName?.[0]}</UserAvatar>
                  <div>
                    <UserName>{u.fullName}</UserName>
                    <UserJoinDate>{u.email}</UserJoinDate>
                  </div>
                </UserInfo>
                <StatusBadge $active={u.active}>{u.active ? "Active" : "Inactive"}</StatusBadge>
              </CardHeader>

              <CardBody>
                <InfoRow>
                  <span>Role:</span> <RoleBadge $role={u.role}>{u.role}</RoleBadge>
                </InfoRow>
                <InfoRow>
                  <span>Joined:</span> <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                </InfoRow>
                <ActionGroup>
                  <IconBtn onClick={() => handleViewUser(u)}><FaEye /></IconBtn>
                  <IconBtn onClick={() => handleEditUser(u)}><FaEdit /></IconBtn>
                  <IconBtn onClick={() => handleDeleteUser(u)}><FaTrash /></IconBtn>
                </ActionGroup>
              </CardBody>
            </UserCard>
          ))}
        </MobileList>
      </UserDataSection>
      {showModal && <AdminAddUserModal setShowModal={setShowModal}/>} 
    </Container>
  );
};

export default UsersManagementPage;


const Container = styled.div`
  padding: var(--space-xl);
  background: var(--surface);
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-2xl);
`;

const HeaderContent = styled.div``;
const HeaderTitle = styled.h1`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
`;
const HeaderSubtitle = styled.p`
  color: var(--text-muted);
`;
const HeaderActions = styled.div``;

/* Stats */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
`;
const StatCard = styled(LuxuryCard)`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
`;
const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: var(--radius-lg);
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;
const StatContent = styled.div``;
const StatValue = styled.div`
  font-weight: var(--font-bold);
  font-size: var(--text-xl);
`;
const StatLabel = styled.div`
  color: var(--text-muted);
  font-size: var(--text-sm);
`;

/* Controls */
const ControlsCard = styled(Card)`
  padding: var(--space-lg);
  margin-bottom: var(--space-2xl);
`;
const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 180px 180px;
  gap: var(--space-lg);
  align-items: center;

  @media ${devices.md} {
    grid-template-columns: 1fr;
  }
`;

/* Table / Mobile Cards */
const UserDataSection = styled(LuxuryCard)`
  padding: var(--space-xl);
`;

const DesktopTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  @media (max-width: 768px) {
    display: none;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: var(--space-md);
  color: var(--text-muted);
  text-transform: uppercase;
  font-size: var(--text-xs);
  border-bottom: 1px solid var(--gray-200);
`;

const TableCell = styled.td`
  padding: var(--space-md);
  border-bottom: 1px solid var(--gray-100);
`;

const MobileList = styled.div`
  display: none;
  flex-direction: column;
  gap: var(--space-md);
  @media (max-width: 768px) {
    display: flex;
  }
`;

const UserCard = styled(Card)`
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  background: var(--white);
  box-shadow: var(--shadow-sm);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CardBody = styled.div`
  margin-top: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: var(--text-sm);
`;

/* Common Reusables */
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;
const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
`;
const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;
const UserName = styled.div`
  font-weight: var(--font-semibold);
`;
const UserJoinDate = styled.div`
  color: var(--text-muted);
  font-size: var(--text-xs);
`;

const RoleBadge = styled.span`
  padding: 4px 8px;
  border-radius: 20px;
  background: ${({ $role }) =>
    $role === "admin" ? "var(--primary)" : "var(--gray-200)"};
  color: ${({ $role }) =>
    $role === "admin" ? "white" : "var(--text-secondary)"};
  font-size: var(--text-xs);
  text-transform: uppercase;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 20px;
  background: ${({ $active }) => ($active ? "var(--success)" : "var(--error)")};
  color: white;
  font-size: var(--text-xs);
  text-transform: uppercase;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: var(--space-xs);
`;
const IconBtn = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--gray-200);
  }
`;
