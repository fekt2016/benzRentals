// src/pages/admin/AdminDashboardPage.jsx
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  FaCalendarCheck,
  FaDollarSign,
  FaPlus,
  FaChartLine,
  FaCog,
  FaSearch,
  FaFilter,
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
  BarElement,
  Title,
} from "chart.js";

import { Card, LuxuryCard } from "../../components/Cards/Card";
import { PrimaryButton, GhostButton } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useGetBookings } from "../../hooks/useBooking";
import { devices } from "../../styles/GlobalStyles";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const AdminDashboardPage = () => {
  const [timeFilter, setTimeFilter] = useState("30days");

  const { data: bookingData, isLoading, isError } = useGetBookings({
    sort: "-createdAt",
    include: "user,car",
    limit: 5,
  });

  const bookings = useMemo(() => bookingData?.data || [], [bookingData]);

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.basePrice || 0) + (b.extraCharges || 0),
    0
  );
  const totalBasePrice = bookings.reduce((sum, b) => sum + (b.basePrice || 0), 0);
  const totalExtraCharges = bookings.reduce(
    (sum, b) => sum + (b.extraCharges || 0),
    0
  );

  const paidBookings = bookings.filter(
    (b) => b.paymentStatus === "paid" || b.paymentStatus === "completed"
  ).length;
  const unpaidBookings = bookings.filter(
    (b) => b.paymentStatus === "unpaid" || b.paymentStatus === "pending"
  ).length;

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      color: "var(--success)",
      icon: <FaDollarSign />,
    },
    {
      label: "Base Price Total",
      value: `$${totalBasePrice.toLocaleString()}`,
      color: "var(--primary)",
      icon: <FaChartLine />,
    },
    {
      label: "Extra Charges",
      value: `$${totalExtraCharges.toLocaleString()}`,
      color: "var(--accent)",
      icon: <FaCog />,
    },
    {
      label: "Paid / Unpaid",
      value: `${paidBookings}/${unpaidBookings}`,
      color: "var(--info)",
      icon: <FaCalendarCheck />,
    },
  ];

  /** ---------------- CHARTS ---------------- **/
  const revenueByMonth = useMemo(() => {
    const monthMap = {};
    bookings.forEach((b) => {
      const month = new Date(b.createdAt).toLocaleString("default", {
        month: "short",
      });
      const total = (b.basePrice || 0) + (b.extraCharges || 0);
      monthMap[month] = (monthMap[month] || 0) + total;
    });
    const labels = Object.keys(monthMap);
    const data = Object.values(monthMap);
    return {
      labels,
      datasets: [
        {
          label: "Revenue ($)",
          data,
          borderColor: "var(--primary)",
          backgroundColor: "rgba(92, 206, 251, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [bookings]);

  const paymentStatusData = useMemo(() => {
    const statusMap = { paid: 0, unpaid: 0, pending: 0, refunded: 0 };
    bookings.forEach((b) => {
      const status = b.paymentStatus || "pending";
      statusMap[status] = (statusMap[status] || 0) + 1;
    });
    return {
      labels: Object.keys(statusMap),
      datasets: [
        {
          label: "Payment Status",
          data: Object.values(statusMap),
          backgroundColor: [
            "var(--success)",
            "var(--error)",
            "var(--warning)",
            "var(--info)",
          ],
        },
      ],
    };
  }, [bookings]);

  /** ---------------- RENDER ---------------- **/
  if (isLoading)
    return (
      <DashboardContainer>
        <LoadingSpinner size="xl" />
      </DashboardContainer>
    );

  if (isError)
    return (
      <DashboardContainer>
        <p style={{ color: "red", textAlign: "center" }}>Failed to load data</p>
      </DashboardContainer>
    );

  return (
    <DashboardContainer>
      {/* Header */}
      <DashboardHeader>
        <HeaderContent>
          <HeaderTitle>Admin Dashboard</HeaderTitle>
          <HeaderSubtitle>
            Real-time business insights and financial overview powered by bookings
          </HeaderSubtitle>
        </HeaderContent>

        <HeaderActions>
          <SearchBar>
            <FaSearch style={{ color: "var(--text-light)", marginRight: "8px" }} />
            <SearchInput placeholder="Search bookings or customers..." />
          </SearchBar>
          <GhostButton>
            <FaFilter /> Filter
          </GhostButton>
        </HeaderActions>
      </DashboardHeader>

      {/* Stats Overview */}
      <StatsGrid>
        {stats.map((stat, i) => (
          <StatCard key={i} $color={stat.color}>
            <StatIcon $color={stat.color}>{stat.icon}</StatIcon>
            <StatContent>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatContent>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Charts */}
      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Revenue by Month</ChartTitle>
            <FilterSelect value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </FilterSelect>
          </ChartHeader>
          <ChartContainer>
            {revenueByMonth.labels.length ? (
              <Line data={revenueByMonth} />
            ) : (
              <EmptyState>No revenue data yet</EmptyState>
            )}
          </ChartContainer>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Payment Status</ChartTitle>
          </ChartHeader>
          <ChartContainer>
            {paymentStatusData.labels.length ? (
              <Pie data={paymentStatusData} />
            ) : (
              <EmptyState>No payment data</EmptyState>
            )}
          </ChartContainer>
        </ChartCard>
      </ChartsGrid>

      {/* Recent Bookings */}
      <TableSection>
        <SectionHeader>
          <SectionTitle>Recent Bookings</SectionTitle>
          <PrimaryButton>
            <FaPlus /> New Booking
          </PrimaryButton>
        </SectionHeader>

        <ResponsiveTable>
          {/* Desktop Table */}
          <DesktopTable>
            <TableHead>
              <tr>
                <TableHeader>Booking ID</TableHeader>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Vehicle</TableHeader>
                <TableHeader>Base Price</TableHeader>
                <TableHeader>Extra Charges</TableHeader>
                <TableHeader>Total</TableHeader>
                <TableHeader>Payment</TableHeader>
                <TableHeader>Status</TableHeader>
              </tr>
            </TableHead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <TableRow key={b._id}>
                  <TableCell>#{b._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>{b.user?.fullName || "N/A"}</TableCell>
                  <TableCell>{b.car?.model || "N/A"}</TableCell>
                  <TableCell>${b.basePrice?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>${b.extraCharges?.toFixed(2) || "0.00"}</TableCell>
                  <TableCell>
                    ${(b.basePrice + (b.extraCharges || 0)).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.paymentStatus}>{b.paymentStatus}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.status}>{b.status}</StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </DesktopTable>

          {/* Mobile Card List */}
          <MobileCardList>
            {bookings.slice(0, 5).map((b) => (
              <MobileCard key={b._id}>
                <MobileCardHeader>
                  <strong>#{b._id.slice(-6).toUpperCase()}</strong>
                  <StatusBadge status={b.status}>{b.status}</StatusBadge>
                </MobileCardHeader>

                <MobileCardBody>
                  <MobileRow>
                    <span>Customer:</span>
                    <span>{b.user?.fullName || "N/A"}</span>
                  </MobileRow>

                  <MobileRow>
                    <span>Vehicle:</span>
                    <span>{b.car?.model || "N/A"}</span>
                  </MobileRow>

                  <MobileRow>
                    <span>Base Price:</span>
                    <span>${b.basePrice?.toFixed(2) || "0.00"}</span>
                  </MobileRow>

                  <MobileRow>
                    <span>Extra Charges:</span>
                    <span>${b.extraCharges?.toFixed(2) || "0.00"}</span>
                  </MobileRow>

                  <MobileRow>
                    <span>Total:</span>
                    <strong>${(b.basePrice + (b.extraCharges || 0)).toFixed(2)}</strong>
                  </MobileRow>

                  <MobileRow>
                    <span>Payment:</span>
                    <StatusBadge status={b.paymentStatus}>
                      {b.paymentStatus}
                    </StatusBadge>
                  </MobileRow>
                </MobileCardBody>
              </MobileCard>
            ))}
          </MobileCardList>
        </ResponsiveTable>
      </TableSection>
    </DashboardContainer>
  );
};

export default AdminDashboardPage;

/* ---------------- STYLES ---------------- */
const DashboardContainer = styled.div`
  padding: var(--space-xl);
  background: var(--surface);
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: var(--space-2xl);
`;

const HeaderContent = styled.div``;
const HeaderTitle = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
`;
const HeaderSubtitle = styled.p`
  color: var(--text-muted);
  font-size: var(--text-lg);
`;
const HeaderActions = styled.div`
  display: flex;
  gap: var(--space-md);
  align-items: center;
`;
const SearchBar = styled(Card)`
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
`;
const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
`;
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  width: 60px;
  height: 60px;
  border-radius: var(--radius-lg);
  background: ${({ $color }) => $color};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const StatContent = styled.div``;
const StatValue = styled.div`
  font-size: var(--text-2xl);
  font-weight: bold;
`;
const StatLabel = styled.div`
  color: var(--text-muted);
  font-size: var(--text-sm);
`;
const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);

  @media ${devices.md} {
    grid-template-columns: 1fr;
  }
`;
const ChartCard = styled(Card)`
  padding: var(--space-xl);
  border-radius: var(--radius-2xl);
`;
const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
`;
const ChartTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: 600;
`;
const ChartContainer = styled.div`
  height: 300px;
`;
const FilterSelect = styled.select`
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-300);
  font-size: var(--text-sm);
`;
const EmptyState = styled.div`
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  padding-top: 50px;
`;

/* ---------- Responsive Table ---------- */
const TableSection = styled(LuxuryCard)`
  padding: var(--space-xl);
`;
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-md);
`;
const SectionTitle = styled.h2`
  font-size: var(--text-2xl);
  font-weight: 600;
`;

const ResponsiveTable = styled.div`
  width: 100%;
`;

const DesktopTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  @media (max-width: 768px) {
    display: none;
  }
`;

const TableHead = styled.thead`
  background: var(--gray-50);
`;
const TableHeader = styled.th`
  padding: var(--space-md);
  text-align: left;
  text-transform: uppercase;
  font-size: var(--text-xs);
  color: var(--text-muted);
`;
const TableRow = styled.tr`
  border-bottom: 1px solid var(--gray-200);
  &:hover {
    background: var(--gray-50);
  }
`;
const TableCell = styled.td`
  padding: var(--space-md);
  font-size: var(--text-base);
`;

/* ---------- Mobile Card View ---------- */
const MobileCardList = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }
`;
const MobileCard = styled(LuxuryCard)`
  padding: var(--space-md);
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;
const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-md);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-sm);
`;
const MobileCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;
const MobileRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--text-primary);
  span:first-child {
    color: var(--text-muted);
  }
`;

/* ---------- Status Badge ---------- */
const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: var(--text-xs);
  text-transform: uppercase;
  font-weight: var(--font-semibold);
  background: ${({ status }) =>
    status === "completed" || status === "paid"
      ? "#E0F2FE"
      : status === "active"
      ? "#DCFCE7"
      : status === "unpaid" || status === "pending"
      ? "#FEF9C3"
      : "#F3F4F6"};
  color: ${({ status }) =>
    status === "completed" || status === "paid"
      ? "#1E40AF"
      : status === "active"
      ? "#166534"
      : status === "unpaid" || status === "pending"
      ? "#92400E"
      : "#374151"};
`;
