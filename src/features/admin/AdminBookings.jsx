import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useGetBookings } from "../../features/bookings/useBooking";
import BookingStats from "../../features/bookings/BookingStats";
import BookingTable from "../../features/bookings/BookingTable";
import BookingCardList from "../../features/bookings/BookingCardList";
import { Card, LuxuryCard } from "../../features/cars/Card";
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
} from "../../components/ui/Button";
import {
  LoadingSpinner,
  EmptyState,
  ErrorState,
} from "../../components/ui/LoadingSpinner";
import { SearchInput, Select, FormField } from "../../features/bookings/Form";

const AdminBookingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const { data: bookingsData, isLoading, error } = useGetBookings();
  const bookings = useMemo(() => bookingsData?.data || [], [bookingsData]);

  // 🔎 Filtering logic
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 📊 Stats summary
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    payment_pending: bookings.filter((b) => b.status === "payment_pending")
      .length,
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "payment_pending", label: "Payment Pending" },
  ];

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      console.log("Deleting booking:", bookingId);
      // TODO: connect delete mutation here
    }
  };

  // 🧭 Handle row click to open Booking Detail Page
  const handleRowClick = (booking) => {
    navigate(`/admin/bookings/${booking._id}`);
  };


  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner size="xl" />
      </Container>
    );
  }

 
  if (error) {
    return (
      <Container>
        <ErrorState
          title="Error Loading Bookings"
          message="There was an error loading the bookings data. Please try again."
          action={
            <PrimaryButton onClick={() => window.location.reload()}>
              Retry
            </PrimaryButton>
          }
        />
      </Container>
    );
  }

  // 🕳 Empty State
  if (bookings.length === 0) {
    return (
      <Container>
        <EmptyState
          title="No Bookings Found"
          message="There are no bookings in the system yet."
         
          action={<PrimaryButton>Create First Booking</PrimaryButton>}
        />
      </Container>
    );
  }

  return (
    <Container>

      <HeaderSection>
        <HeaderContent>
          <HeaderTitle>Booking Management</HeaderTitle>
          <HeaderSubtitle>
            Manage and monitor all rental bookings in your system
          </HeaderSubtitle>
        </HeaderContent>

        <HeaderActions>
          <PrimaryButton $size="md">+ New Booking</PrimaryButton>
        </HeaderActions>
      </HeaderSection>

      
      <ControlsCard>
        <ControlsGrid>
          <FormField style={{ minWidth: "300px" }}>
            <SearchInput
              placeholder="Search by customer name, car model, or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormField>

          <FormField style={{ minWidth: "200px" }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
          </FormField>

          <ActionsGroup>
            <GhostButton $size="md">Export Data</GhostButton>
            <SecondaryButton $size="md">Filter Options</SecondaryButton>
          </ActionsGroup>
        </ControlsGrid>
      </ControlsCard>

   
      <StatsSection>
        <BookingStats stats={stats} />
      </StatsSection>

     
      <TableSection>
        <TableHeader>
          <TableTitle>
            Bookings ({filteredBookings.length} of {bookings.length})
            {searchTerm && <SearchTerm>for &quot;{searchTerm}&quot;</SearchTerm>}
          </TableTitle>

          <TableActions>
            <RefreshButton onClick={() => window.location.reload()}>
              Refresh
            </RefreshButton>
          </TableActions>
        </TableHeader>

        {filteredBookings.length === 0 ? (
          <EmptyState
            title="No Matching Bookings"
            message={`No bookings found matching your search criteria. ${
              searchTerm
                ? "Try adjusting your search term."
                : "Try selecting a different status filter."
            }`}
            action={
              <GhostButton
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </GhostButton>
            }
          />
        ) : (
          <>
            {/* Desktop View */}
            <DesktopView>
              <BookingTable
                bookings={filteredBookings}
                onDelete={handleDeleteBooking}
                onRowClick={handleRowClick}
              />
            </DesktopView>

            {/* Mobile View */}
            <MobileView>
              <BookingCardList
                bookings={filteredBookings}
                onDelete={handleDeleteBooking}
                onCardClick={handleRowClick}
              />
            </MobileView>
          </>
        )}
      </TableSection>
    </Container>
  );
};

export default AdminBookingPage;

/* ---------------- Styled Components ---------------- */
const Container = styled.div`
  padding: var(--space-xl);
  background: var(--surface);
  min-height: 100vh;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: var(--space-lg);
  }

  @media (max-width: 480px) {
    padding: var(--space-md);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2xl);
  flex-wrap: wrap;
  gap: var(--space-lg);
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  background: var(--gradient-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeaderSubtitle = styled.p`
  color: var(--text-muted);
  font-size: var(--text-lg);
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--space-md);
  align-items: center;
`;

const ControlsCard = styled(Card)`
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  background: var(--white);
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--space-lg);
  align-items: end;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const ActionsGroup = styled.div`
  display: flex;
  gap: var(--space-sm);
  align-items: center;
`;

const StatsSection = styled.div`
  margin-bottom: var(--space-2xl);
`;

const TableSection = styled(LuxuryCard)`
  padding: var(--space-xl);
  background: var(--white);
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
`;

const TableTitle = styled.h2`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const SearchTerm = styled.span`
  font-size: var(--text-base);
  color: var(--text-muted);
  background: var(--gray-100);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
`;

const TableActions = styled.div`
  display: flex;
  gap: var(--space-sm);
  align-items: center;
`;

const RefreshButton = styled(GhostButton)`
  font-size: var(--text-sm);
`;

const DesktopView = styled.div`
  display: block;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileView = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: block;
  }
`;
