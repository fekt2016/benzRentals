import React from "react";
import styled from "styled-components";
import {
  FaEdit,
  FaTrash,
  FaUser,
  FaCar,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";

const BookingTable = ({ bookings, onOpenVerification, onDelete }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const handleDelete = (bookingId, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this booking? This action cannot be undone."
      )
    ) {
      onDelete(bookingId);
    }
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>Booking ID</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Vehicle</th>
          {/* <th>Pickup Date</th>
          <th>Return Date</th> */}
          <th>Total Price</th>
          <th>Driver Status</th>
          <th>Booking Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <tr key={booking._id}>
            <td>
              <strong>#BF-{booking._id.slice(-6).toUpperCase()}</strong>
            </td>
            <td>
              <strong>{formatDate(booking.createdAt)}</strong>
            </td>
            <td>
              <CustomerInfo>
                <FaUser size={12} />
                <div>
                  <strong>{booking.user?.fullName || "N/A"}</strong>
                  <span>{booking.user?.email || "N/A"}</span>
                </div>
              </CustomerInfo>
            </td>
            <td>
              <VehicleInfo>
                <FaCar size={12} />
                <div>
                  <strong>{booking.car?.model || "N/A"}</strong>
                  <span>{booking.car?.name || "N/A"}</span>
                </div>
              </VehicleInfo>
            </td>
            {/* <td>
              <DateInfo>
                <FaCalendarAlt size={12} />
                <div>
                  <strong>{formatDate(booking.pickupDate)}</strong>
                  <span>{booking.pickupTime || "Time TBD"}</span>
                </div>
              </DateInfo>
            </td> */}
            <td>
              <DateInfo>
                <FaCalendarAlt size={12} />
                <div>
                  <strong>{formatDate(booking.returnDate)}</strong>
                  <span>Return</span>
                </div>
              </DateInfo>
            </td>
            <td>
              <PriceInfo>
                <FaDollarSign size={12} />
                <strong>${booking.totalPrice}</strong>
              </PriceInfo>
            </td>
            <td>
              <DriverStatus verified={booking.driver?.verified}>
                {booking.driver?.verified ? "Verified" : "Pending"}
              </DriverStatus>
            </td>
            <td>
              <Status status={booking.status}>{booking.status}</Status>
            </td>
            <td>
              <ActionButtons>
                <ActionButton
                  color="#3b82f6"
                  onClick={() => onOpenVerification(booking)}
                  title="Update Booking"
                >
                  <FaEdit />
                  Update
                </ActionButton>
                <ActionButton
                  color="#ef4444"
                  onClick={(e) => handleDelete(booking._id, e)}
                  title="Delete Booking"
                >
                  <FaTrash />
                  Delete
                </ActionButton>
              </ActionButtons>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default BookingTable;

// STYLED COMPONENTS
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  th {
    background: #f8fafc;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #475569;
    font-size: 0.875rem;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
  }

  tr:hover {
    background: #f8fafc;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  div {
    display: flex;
    flex-direction: column;
  }

  span {
    font-size: 0.875rem;
    color: #64748b;
  }
`;

const VehicleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  div {
    display: flex;
    flex-direction: column;
  }

  span {
    font-size: 0.875rem;
    color: #64748b;
  }
`;

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  div {
    display: flex;
    flex-direction: column;
  }

  span {
    font-size: 0.875rem;
    color: #64748b;
  }
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #059669;
`;

const DriverStatus = styled.span`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ verified }) => (verified ? "#d1fae5" : "#fef3c7")};
  color: ${({ verified }) => (verified ? "#065f46" : "#92400e")};
`;

const Status = styled.span`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${({ status }) => {
    switch (status) {
      case "confirmed":
        return "background: #d1fae5; color: #065f46;";
      case "pending":
        return "background: #fef3c7; color: #92400e;";
      case "cancelled":
        return "background: #fee2e2; color: #991b1b;";
      case "completed":
        return "background: #e0e7ff; color: #3730a3;";
      case "active":
        return "background: #f0f9ff; color: #0369a1;";
      case "payment_pending":
        return "background: #fff7ed; color: #ea580c;";
      default:
        return "background: #f3f4f6; color: #374151;";
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${({ color }) => color || "#3b82f6"};
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;
