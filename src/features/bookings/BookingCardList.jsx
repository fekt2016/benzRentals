/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import {
  FaUser,
  FaCar,
  FaDollarSign,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { SecondaryButton, GhostButton } from "../../components/ui/Button";
import { LuxuryCard } from "../../features/cars/Card";
import { useNavigate } from "react-router-dom";
import {formatDate} from '../../utils/helper'

const BookingCardList = ({ bookings, onDelete }) => {
const navigate = useNavigate()

  return (
    <CardList>
      {bookings.map((b) => (
        <Card key={b._id} className="luxury-card">
          <CardHeader>
            <BookingId>#BF-{String(b._id).slice(-6).toUpperCase()}</BookingId>
            <StatusPill data-status={b.status}>{b.status}</StatusPill>
          </CardHeader>

          <CardBody>
            <InfoGroup>
              <FaUser size={14} />
              <div>
                <strong>{b.user?.fullName || "N/A"}</strong>
                <small>{b.user?.email || "N/A"}</small>
              </div>
            </InfoGroup>

            <InfoGroup>
              <FaCar size={14} />
              <div>
                <strong>{b.car?.model || "N/A"}</strong>
                <small>{b.car?.series || "—"}</small>
              </div>
            </InfoGroup>

            <InfoGroup>
              <FaCalendarAlt size={14} />
              <div>
                <strong>{formatDate(b.returnDate)}</strong>
                <small>Return</small>
              </div>
            </InfoGroup>

            <PriceInfo>
              <FaDollarSign size={14} />
              <strong>${b.totalPrice.toFixed(2)}</strong>
            </PriceInfo>
          </CardBody>

          <CardFooter>
            <ActionGroup>
              <SecondaryButton
                $size="sm"
                 onClick={() => navigate(`/admin/bookings/${b._id}`)}
              >
                <FaEdit /> Edit
              </SecondaryButton>
              <GhostButton
                $size="sm"
                onClick={() =>
                  window.confirm("Delete this booking?") && onDelete(b._id)
                }
              >
                <FaTrash /> Delete
              </GhostButton>
            </ActionGroup>
          </CardFooter>
        </Card>
      ))}
    </CardList>
  );
};

export default BookingCardList;

/* ---------- Styles ---------- */
const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const Card = styled(LuxuryCard)`
  padding: var(--space-lg);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  background: var(--white);
  box-shadow: var(--shadow-md);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
`;

const BookingId = styled.span`
  font-weight: var(--font-semibold);
  color: var(--primary);
  font-size: var(--text-sm);
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
`;

const InfoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  div {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
  }

  strong {
    color: var(--text-primary);
    font-size: var(--text-sm);
  }

  small {
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

const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const StatusPill = styled.span`
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  font-size: var(--text-xs);
  text-transform: uppercase;
  font-weight: var(--font-semibold);

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
