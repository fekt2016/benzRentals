import React from "react";
import styled from "styled-components";
import {
  FaEdit,
  FaTrash,
  FaUser,
  FaCar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
} from "react-icons/fa";

const BookingCardList = ({ bookings, onEdit }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  return (
    <>
      {bookings.map((booking) => (
        <Card key={booking._id}>
          <CardHeader>
            <div>
              <strong>#BF-{booking._id.slice(18)}</strong>
              <Status status={booking.status}>{booking.status}</Status>
            </div>
            <div>
              <ActionButton color="#f59e0b" onClick={() => onEdit(booking)}>
                <FaEdit />
              </ActionButton>
              <ActionButton color="#ef4444">
                <FaTrash />
              </ActionButton>
            </div>
          </CardHeader>

          <CardRow>
            <FaUser />
            <div>
              <div className="label">Customer</div>
              <div className="value">{booking.user.fullName}</div>
            </div>
          </CardRow>

          <CardRow>
            <FaCar />
            <div>
              <div className="label">Vehicle</div>
              <div className="value">{booking.car.model}</div>
            </div>
          </CardRow>

          <CardRow>
            <FaCalendarAlt />
            <div>
              <div className="label">Pickup</div>
              <div className="value">
                {formatDate(booking.pickupDate)} at {booking.pickupTime}
              </div>
            </div>
          </CardRow>

          <CardRow>
            <FaMapMarkerAlt />
            <div>
              <div className="label">Location</div>
              <div className="value">{booking.pickupLocation}</div>
            </div>
          </CardRow>

          <CardRow>
            <FaDollarSign />
            <div>
              <div className="label">Total</div>
              <div className="value">${booking.totalPrice}</div>
            </div>
          </CardRow>

          <CardRow>
            <div className="label">Driver License</div>
            <Badge verified={booking.driverLicense?.verified}>
              {booking.driverLicense?.verified ? "Verified" : "Pending"}
            </Badge>
          </CardRow>

          <CardRow>
            <div className="label">Insurance</div>
            <Badge verified={booking.insurance?.verified}>
              {booking.insurance?.verified ? "Verified" : "Pending"}
            </Badge>
          </CardRow>
        </Card>
      ))}
    </>
  );
};

export default BookingCardList;

/* -------------------- STYLES -------------------- */
const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  display: none;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  .label {
    font-weight: 600;
    color: #64748b;
    font-size: 0.875rem;
  }

  .value {
    color: #334155;
    font-size: 0.9rem;
  }
`;

const Status = styled.span`
  padding: 0.25rem 0.75rem;
  margin-left: 0.5rem;
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
      default:
        return "background: #f3f4f6; color: #374151;";
    }
  }}
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${({ color }) => color || "#3b82f6"};
  color: white;
  margin-left: 0.5rem;

  &:hover {
    opacity: 0.8;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  background: ${({ verified }) => (verified ? "#d1fae5" : "#fef3c7")};
  color: ${({ verified }) => (verified ? "#065f46" : "#92400e")};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
`;
