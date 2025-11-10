/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import {
  FaEdit,
  FaTrash,
  FaUser,
  FaCar,
  FaDollarSign,
} from "react-icons/fa";
import  {useNavigate} from 'react-router-dom'
import {formatDate} from '../../utils/helper'

const BookingTable = ({ bookings, onDelete }) => {
  const navigate = useNavigate()

console.log(bookings)
  const handleDelete = (bookingId, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this booking? This action cannot be undone."
      )
    ) {
      onDelete?.(bookingId);
    }
  };

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Total Price</th>
            <th>Driver status</th>
            <th>Booking Status</th>
            <th className="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>
                <strong>#BF-{String(b._id).slice(-6).toUpperCase()}</strong>
              </td>
              <td>{formatDate(b.createdAt)}</td>
              <td>
                <InfoCell>
                  <FaUser size={12} />
                  <div>
                    <strong>{b.user?.fullName || "N/A"}</strong>
                    <span>{b.user?.email || "N/A"}</span>
                  </div>
                </InfoCell>
              </td>
              <td>
                <InfoCell>
                  <FaCar size={12} />
                  <div>
                    <strong>{b.car?.model || "N/A"}</strong>
                    <span>{b.car?.series || "N/A"}</span>
                  </div>
                </InfoCell>
              </td>
              <td>
                <PriceInfo>
                  <FaDollarSign size={12} />
                  <strong>${b.totalPrice.toFixed(2) || 0}</strong>
                </PriceInfo>
              </td>
              <td>
                <DriverStatus verified={b.driver?.verified}>
                  {b.driver?.verified ? "Verified" : "Pending"}
                </DriverStatus>
              </td>
              <td>
                <StatusPill data-status={b.status}>{b.status}</StatusPill>
              </td>
              <td>
                <ActionGroup>
                  <ActionButton
                    $variant="edit"
                    onClick={() => navigate(`/admin/bookings/${b._id}`)}
                  >
                    <FaEdit />
                   
                  </ActionButton>
                  <ActionButton
                    $variant="delete"
                    onClick={(e) => handleDelete(b._id, e)}
                  >
                    <FaTrash />
                   
                  </ActionButton>
                </ActionGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default BookingTable;

/* ------------------ Styles ------------------ */
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);

  th {
    background: var(--gray-50);
    text-align: left;
    padding: var(--space-md);
    font-weight: var(--font-semibold);
    color: var(--text-secondary);
    font-size: var(--text-sm);
    border-bottom: 1px solid var(--gray-200);
  }

  td {
    padding: var(--space-md);
    font-size: var(--text-sm);
    border-bottom: 1px solid var(--gray-100);
    color: var(--text-primary);
    vertical-align: middle;
  }

  tr:hover {
    background: var(--gray-50);
  }

  .th-actions {
    text-align: right;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const InfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  div {
    display: flex;
    flex-direction: column;
  }

  span {
    color: var(--text-muted);
    font-size: var(--text-xs);
  }
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--success);
  font-weight: var(--font-semibold);
`;

const DriverStatus = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  background: ${({ verified }) => (verified ? "#d1fae5" : "#fef3c7")};
  color: ${({ verified }) => (verified ? "#065f46" : "#92400e")};
`;

const StatusPill = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;

  &[data-status="confirmed"] {
    background: #d1fae5;
    color: #065f46;
  }
  &[data-status="pending"] {
    background: #fef3c7;
    color: #92400e;
  }
  &[data-status="cancelled"] {
    background: #fee2e2;
    color: #991b1b;
  }
  &[data-status="completed"] {
    background: #e0e7ff;
    color: #3730a3;
  }
  &[data-status="active"] {
    background: #f0f9ff;
    color: #0369a1;
  }
  &[data-status="payment_pending"] {
    background: #fff7ed;
    color: #ea580c;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 0.45rem 0.85rem;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  color: white;
  background: ${({ $variant }) =>
    $variant === "edit"
      ? "var(--primary)"
      : $variant === "delete"
      ? "var(--error)"
      : "var(--gray-400)"};
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }

  svg {
    font-size: 0.9em;
  }
`;
