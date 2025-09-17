import React, { useState } from "react";
import styled from "styled-components";
import {
  FaCarSide,
  FaCalendarCheck,
  FaDollarSign,
  FaUsers,
  FaBell,
  FaPlus,
  FaCheck,
} from "react-icons/fa";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

// Dummy Data
const bookingsData = [
  {
    id: "B001",
    user: "John Doe",
    car: "Mercedes C-Class",
    pickup: "2025-09-18",
    drop: "2025-09-20",
    status: "Confirmed",
  },
  {
    id: "B002",
    user: "Jane Smith",
    car: "Mercedes E-Class",
    pickup: "2025-09-19",
    drop: "2025-09-22",
    status: "Pending",
  },
  {
    id: "B003",
    user: "Mike Ross",
    car: "Mercedes S-Class",
    pickup: "2025-09-20",
    drop: "2025-09-21",
    status: "Completed",
  },
];

const carAvailability = [
  { type: "Available", count: 6, color: "#10b981" },
  { type: "Booked", count: 4, color: "#ef4444" },
];

const notifications = [
  { message: "Booking B004 is pending approval", type: "warning" },
  { message: "Car C003 maintenance overdue", type: "danger" },
];

const usersAnalytics = { newUsers: 3, activeUsers: 5, returningUsers: 2 };
const revenueData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Revenue ($)",
      data: [1200, 1900, 1400, 2200, 2000, 2500],
      borderColor: "#0ea5e9",
      backgroundColor: "rgba(14, 165, 233, 0.2)",
    },
  ],
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: ${({ bg }) => bg || "#fff"};
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: ${({ theme }) => theme.shadows.md};
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CardTitle = styled.span`
  font-weight: 500;
  font-size: 1.2rem;
`;
const CardValue = styled.span`
  font-weight: 700;
  font-size: 1.8rem;
  margin-top: 0.5rem;
`;
const IconWrapper = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;
const Th = styled.th`
  text-align: left;
  padding: 0.8rem;
  border-bottom: 2px solid #e5e7eb;
`;
const Td = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid #e5e7eb;
`;
const Badge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  color: #fff;
  background-color: ${({ status }) => {
    if (status === "Confirmed") return "#10b981";
    if (status === "Pending") return "#f59e0b";
    if (status === "Completed") return "#0ea5e9";
    return "#6b7280";
  }};
  font-size: 0.8rem;
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
`;
const NotificationItem = styled.li`
  background-color: ${({ type }) =>
    type === "danger" ? "#f87171" : "#fbbf24"};
  color: #fff;
  padding: 0.8rem;
  border-radius: var(--radius-sm);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;
const ActionButton = styled.button`
  background-color: ${({ bg }) => bg || "#0ea5e9"};
  color: #fff;
  padding: 0.8rem 1.2rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  &:hover {
    opacity: 0.85;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid #e5e7eb;
  margin-bottom: 1rem;
`;

const ChartsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ChartContainer = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 400px;
`;

const AdminDashboardPage = () => {
  const [filter, setFilter] = useState("7days");

  const filteredBookings = bookingsData; // Replace with real filter logic

  const pieData = {
    labels: carAvailability.map((c) => c.type),
    datasets: [
      {
        data: carAvailability.map((c) => c.count),
        backgroundColor: carAvailability.map((c) => c.color),
      },
    ],
  };

  return (
    <Container>
      <h1>Admin Dashboard</h1>

      {/* Quick Actions */}
      <QuickActions>
        <ActionButton bg="#0ea5e9">
          <FaPlus /> Add New Car
        </ActionButton>
        <ActionButton bg="#10b981">
          <FaCheck /> Approve Booking
        </ActionButton>
        <ActionButton bg="#f59e0b">
          <FaUsers /> View Users
        </ActionButton>
      </QuickActions>

      {/* User Analytics */}
      <SectionTitle>User Analytics</SectionTitle>
      <CardsGrid>
        <Card bg="#0ea5e9">
          <IconWrapper>
            <FaUsers />
          </IconWrapper>
          <CardTitle>New Users</CardTitle>
          <CardValue>{usersAnalytics.newUsers}</CardValue>
        </Card>
        <Card bg="#10b981">
          <IconWrapper>
            <FaUsers />
          </IconWrapper>
          <CardTitle>Active Users</CardTitle>
          <CardValue>{usersAnalytics.activeUsers}</CardValue>
        </Card>
        <Card bg="#f59e0b">
          <IconWrapper>
            <FaUsers />
          </IconWrapper>
          <CardTitle>Returning Users</CardTitle>
          <CardValue>{usersAnalytics.returningUsers}</CardValue>
        </Card>
      </CardsGrid>

      {/* Charts Side by Side */}
      <ChartsWrapper>
        <ChartContainer>
          <SectionTitle>Car Availability</SectionTitle>
          <Pie data={pieData} />
        </ChartContainer>
        <ChartContainer>
          <SectionTitle>Revenue Overview</SectionTitle>
          <Line data={revenueData} />
        </ChartContainer>
      </ChartsWrapper>

      {/* Recent Bookings */}
      <SectionTitle>Recent Bookings</SectionTitle>
      <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="7days">Last 7 Days</option>
        <option value="30days">Last 30 Days</option>
        <option value="all">All</option>
      </FilterSelect>
      <Table>
        <thead>
          <tr>
            <Th>Booking ID</Th>
            <Th>User</Th>
            <Th>Car</Th>
            <Th>Pickup</Th>
            <Th>Drop</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((b) => (
            <tr key={b.id}>
              <Td>{b.id}</Td>
              <Td>{b.user}</Td>
              <Td>{b.car}</Td>
              <Td>{b.pickup}</Td>
              <Td>{b.drop}</Td>
              <Td>
                <Badge status={b.status}>{b.status}</Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Notifications */}
      <SectionTitle>Notifications</SectionTitle>
      <NotificationList>
        {notifications.map((n, idx) => (
          <NotificationItem key={idx} type={n.type}>
            <FaBell style={{ marginRight: "0.5rem" }} /> {n.message}
          </NotificationItem>
        ))}
      </NotificationList>
    </Container>
  );
};

export default AdminDashboardPage;
