import React from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import { Table, Th, Td } from "./StyledComponents"; // reuse table styles

const sampleBookings = [
  { date: "2025-09-01", bookings: 5, revenue: 1200 },
  { date: "2025-09-02", bookings: 8, revenue: 1800 },
  { date: "2025-09-03", bookings: 4, revenue: 900 },
  { date: "2025-09-04", bookings: 12, revenue: 2500 },
];

const sampleUsers = [
  { name: "John Doe", email: "john@example.com", bookings: 3 },
  { name: "Jane Smith", email: "jane@example.com", bookings: 5 },
];

const AdminReportPage = () => {
  return (
    <ReportContainer>
      <ReportHeader>
        <PageTitle>Reports</PageTitle>
        <FilterGroup>
          <input type="date" />
          <input type="date" />
          <select>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </FilterGroup>
      </ReportHeader>

      <ChartsGrid>
        <ChartCard>
          <h3>Total Bookings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sampleBookings}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <h3>Revenue Overview ($)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sampleBookings}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <TableWrapper>
        <h3>Top Users</h3>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Bookings</Th>
            </tr>
          </thead>
          <tbody>
            {sampleUsers.map((user, idx) => (
              <tr key={idx}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>{user.bookings}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </ReportContainer>
  );
};

export default AdminReportPage;

const ReportContainer = styled.div`
  padding: 2rem;
`;
const ReportHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;

  select,
  input {
    padding: 0.6rem 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid ${({ theme }) => theme.colors.gray};
    font-size: 1.4rem;
    min-width: 120px;
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 2rem;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;
const Th = styled.th`
  padding: 0.8rem;
  text-align: left;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
`;
const Td = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
`;
