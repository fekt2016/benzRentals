import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { useGetBookings } from "../../hooks/useBooking";
import { useVerifyDriver } from "../../hooks/useDriver";
import BookingStats from "../../components/BookingStats";
import BookingTable from "../../components/BookingTable";
import VerificationModal from "../../components/Modal/VerificationModal";

const AdminBookingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [verificationData, setVerificationData] = useState({
    license: {
      name: "",
      number: "",
      issuedBy: "",
      expiryDate: "",
      verified: false,
    },
    insurance: {
      provider: "",
      policyNumber: "",
      expiryDate: "",
      verified: false,
    },
  });

  const { data: bookingsData } = useGetBookings();
  const bookings = useMemo(() => bookingsData?.data || [], [bookingsData]);

  const { mutate: verifyDriver } = useVerifyDriver();

  // Filtering logic
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.car?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats summary
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    payment_pending: bookings.filter((b) => b.status === "payment_pending")
      .length,
  };

  // Open verification modal
  const handleOpenVerification = (booking) => {
    setSelectedBooking(booking);

    // Pre-fill verification data if driver exists
    if (booking.driver) {
      setVerificationData({
        license: {
          name: booking.driver.fullName || "",
          number: booking.driver.license?.number || "",
          issuedBy: booking.driver.license?.issuedBy || "",
          expiryDate: booking.driver.license?.expiryDate?.split("T")[0] || "",
          verified: booking.driver.license?.verified || false,
        },
        insurance: {
          provider: booking.driver.insurance?.provider || "",
          policyNumber: booking.driver.insurance?.policyNumber || "",
          expiryDate: booking.driver.insurance?.expiryDate?.split("T")[0] || "",
          verified: booking.driver.insurance?.verified || false,
        },
      });
    }

    setIsVerificationModalOpen(true);
  };

  // Handle driver verification
  const handleVerifyDriver = (verificationData) => {
    if (!selectedBooking?.driver?._id) {
      console.error("No driver ID found for verification");
      return;
    }

    verifyDriver(
      {
        driverId: selectedBooking.driver._id,
        verificationData,
      },
      {
        onSuccess: (data) => {
          console.log("Driver verified successfully:", data);
          handleCloseModal();
          // In a real app, you might want to refetch bookings here
        },
        onError: (error) => {
          console.error("Error verifying driver:", error);
        },
      }
    );
  };

  // Handle verification data changes
  const handleVerificationChange = (section, field, value) => {
    setVerificationData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (section, field, checked) => {
    setVerificationData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked,
      },
    }));
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setIsVerificationModalOpen(false);
    setSelectedBooking(null);
    setVerificationData({
      license: {
        name: "",
        number: "",
        issuedBy: "",
        expiryDate: "",
        verified: false,
      },
      insurance: {
        provider: "",
        policyNumber: "",
        expiryDate: "",
        verified: false,
      },
    });
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      console.log("Deleting booking:", bookingId);
      // Add your delete mutation here
    }
  };

  return (
    <Container>
      {/* Header Controls */}
      <Header>
        <Title>Booking Management</Title>
        <Controls>
          <SearchBox>
            <FaSearch />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="payment_pending">Payment Pending</option>
          </FilterSelect>
        </Controls>
      </Header>

      {/* Stats */}
      <BookingStats stats={stats} />

      {/* Table */}
      <TableContainer>
        <BookingTable
          bookings={filteredBookings}
          onOpenVerification={handleOpenVerification}
          onDelete={handleDeleteBooking}
        />
      </TableContainer>

      {/* Verification Modal */}
      {isVerificationModalOpen && selectedBooking && (
        <VerificationModal
          selectedBooking={selectedBooking}
          verificationData={verificationData}
          onClose={handleCloseModal}
          onVerificationChange={handleVerificationChange}
          onCheckboxChange={handleCheckboxChange}
          onVerify={() => handleVerifyDriver(verificationData)}
        />
      )}
    </Container>
  );
};

export default AdminBookingPage;

/* -------------------- STYLES -------------------- */
const Container = styled.div`
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  color: #1e293b;
  font-size: 2rem;
  font-weight: 700;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    width: 250px;
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    }
  }

  svg {
    position: absolute;
    left: 0.75rem;
    color: #6b7280;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;
