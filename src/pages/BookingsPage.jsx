// BookingsPage.js - WITHOUT REVIEW MODAL
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  useMyBookings,
  useUpdateUserBooking,
  useCheckInBooking,
} from "../hooks/useBooking";
import { useMyDrivers } from "../hooks/useDriver";
import UpdateDocumentsModal from "../components/Modal/UpdateDocumentsModal";
import CheckInModal from "../components/Modal/CheckInModal";
import Pagination from "../components/Pagination";
import MobileCard from "../components/MobileCard";

// Import UI Components
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  DangerButton,
  SuccessButton,
} from "../components/ui/Button";
import {
  EmptyState,
  LoadingState,
  LoadingSpinner,
} from "../components/ui/LoadingSpinner";

// Icons
import {
  FaEdit,
  FaEye,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaCloudUploadAlt,
  FaTimes,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisH,
  FaBan,
  FaExclamationTriangle,
  FaUndo,
  FaFilter,
  FaSearch,
  FaCalendar,
  FaUser,
} from "react-icons/fa";
import usePageTitle from "../hooks/usePageTitle";

import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";

const BookingsPage = () => {
  const seoConfig = ROUTE_CONFIG[PATHS.BOOKINGS];
  usePageTitle(seoConfig.title, seoConfig.description);

  const { data: BookingsData, isLoading, refetch } = useMyBookings();
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const [checkingInBooking, setCheckingInBooking] = useState(null);

  // REMOVED: submittedReviews state and review-related states

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    search: "",
  });

  // Refs

  const { mutate: updateUserBooking } = useUpdateUserBooking(updatingBooking);

  const { mutate: checkInBooking, isLoading: isCheckingIn } =
    useCheckInBooking();

  const { data: DriversData } = useMyDrivers();
  const drivers = useMemo(() => DriversData?.data || [], [DriversData]);
  const bookings = useMemo(
    () => BookingsData?.data?.data || [],
    [BookingsData]
  );

  const navigate = useNavigate();

  // REMOVED: handleReviewSuccess function

  // Handle check-in submission
  const handleCheckInSubmit = (formData) => {
    if (!checkingInBooking) return;

    checkInBooking(formData, {
      onSuccess: () => {
        setCheckingInBooking(null);
        refetch();
      },
      onError: (error) => {
        console.error("Check-in failed:", error);
        alert("Check-in failed. Please try again.");
      },
    });
  };

  // Handle check-in close
  const handleCheckInClose = () => {
    setCheckingInBooking(null);
  };

  // Handle view driver details
  const handleViewDriverDetails = (driver) => {
    if (driver && driver.verified) {
      console.log("View driver details:", driver);
      alert(
        `Driver: ${driver.firstName} ${driver.lastName}\nLicense: ${
          driver.licenseNumber || "Not provided"
        }\nStatus: ${driver.verified ? "Verified" : "Pending"}`
      );
    }
  };

  // Handle quick verification check
  const handleQuickVerificationCheck = (booking) => {
    if (booking.driver?.verified) {
      alert("✅ Driver is verified and ready for check-in!");
    } else {
      alert(
        "⚠️ Driver verification pending. Please complete verification to proceed with check-in."
      );
      setUpdatingBooking(booking._id);
    }
  };

  // FIXED: Enhanced hasCheckedIn function
  const hasCheckedIn = (booking) => {
    return (
      booking.checkInData?.checkInTime ||
      booking.checkIn?.status === "completed" ||
      booking.status === "active" ||
      booking.status === "completed"
    );
  };

  // NEW: Check if booking can show check-in button (only for confirmed status)
  const canShowCheckInButton = (booking) => {
    return booking.status === "confirmed" && !hasCheckedIn(booking);
  };

  // NEW: Check if check-in is ready (within time window)
  const isCheckInReady = (booking) => {
    try {
      if (booking.status !== "confirmed" || hasCheckedIn(booking)) {
        return false;
      }

      const now = new Date();
      const pickupDate = new Date(booking.pickupDate);
      const returnDate = new Date(booking.returnDate);

      // Allow check-in from 2 hours before pickup until return date
      const checkInStart = new Date(pickupDate.getTime() - 2 * 60 * 60 * 1000);

      const isWithinTimeWindow = now >= checkInStart && now <= returnDate;

      return isWithinTimeWindow;
    } catch (error) {
      console.error("Error in isCheckInReady:", error);
      return false;
    }
  };

  // NEW: Get check-in status message
  const getCheckInStatus = (booking) => {
    if (hasCheckedIn(booking)) {
      return {
        type: "checked-in",
        message: "Checked In",
        disabled: true,
      };
    }

    if (booking.status !== "confirmed") {
      return {
        type: "not-available",
        message: "Not available",
        disabled: true,
      };
    }

    const now = new Date();
    const pickupDate = new Date(booking.pickupDate);
    const checkInStart = new Date(pickupDate.getTime() - 2 * 60 * 60 * 1000);

    if (now < checkInStart) {
      const hoursUntilCheckIn = Math.ceil(
        (checkInStart - now) / (1000 * 60 * 60)
      );
      return {
        type: "waiting",
        message: `Available in ${hoursUntilCheckIn}h`,
        disabled: true,
      };
    }

    return {
      type: "ready",
      message: "Check In",
      disabled: false,
    };
  };

  // Mock verified documents data - simplified without download URLs
  const getVerifiedDocuments = (booking) => {
    return [
      {
        name: "Driver's License",
        icon: FaFileAlt,
        verifiedAt: booking.driver?.verifiedAt || "2024-01-15",
        verifiedBy: booking.driver?.verifiedBy || "Admin User",
      },
      {
        name: "Insurance Certificate",
        icon: FaFileAlt,
        verifiedAt: booking.verifiedAt || "2024-01-15",
        verifiedBy: booking.verifiedBy || "Admin User",
      },
    ];
  };

  // Filter bookings based on filter criteria
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (filters.status !== "all" && booking.status !== filters.status) {
        return false;
      }

      const pickupDate = new Date(booking.pickupDate);
      const now = new Date();
      const isUpcoming = pickupDate > now;
      const isPast = pickupDate <= now;

      if (filters.dateRange === "upcoming" && !isUpcoming) {
        return false;
      }
      if (filters.dateRange === "past" && !isPast) {
        return false;
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const carModel = booking.car?.model?.toLowerCase() || "";
        const pickupLocation = booking.pickupLocation?.toLowerCase() || "";

        if (
          !carModel.includes(searchTerm) &&
          !pickupLocation.includes(searchTerm)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, filters]);

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination calculations based on filtered bookings
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handleUpdateDocuments = (data) => {
    try {
      if (data instanceof FormData) {
        updateUserBooking(data);
      } else {
        updateUserBooking({ driverId: data.driverId });
      }
      setUpdatingBooking(null);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: "all",
      dateRange: "all",
      search: "",
    });
  };

  // FIXED: Enhanced status configuration
  const getStatusConfig = (status) => {
    const config = {
      confirmed: {
        color: "var(--success)",
        icon: FaCheckCircle,
        canCancel: false,
      },
      completed: {
        color: "var(--info)",
        icon: FaCheckCircle,
        canCancel: false,
      },
      cancelled: {
        color: "var(--error)",
        icon: FaTimes,
        canCancel: false,
      },
      pending: {
        color: "var(--warning)",
        icon: FaClock,
        canCancel: false,
      },
      checked_in: {
        color: "var(--info)",
        icon: FaCheckCircle,
        canCancel: false,
      },
      active: {
        color: "var(--success)",
        icon: FaCheckCircle,
        canCancel: false,
      },
      verification_pending: {
        color: "var(--warning)",
        icon: FaClock,
        canCancel: false,
      },
      license_required: {
        color: "var(--warning)",
        icon: FaExclamationTriangle,
        canCancel: false,
      },
      pending_payment: {
        color: "var(--warning)",
        icon: FaClock,
        canCancel: false,
      },
      no_show: {
        color: "var(--error)",
        icon: FaTimes,
        canCancel: false,
      },
      overdue: {
        color: "var(--error)",
        icon: FaExclamationTriangle,
        canCancel: false,
      },
    };
    return config[status?.toLowerCase()] || config.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // REMOVED: canReviewBooking and hasReview functions

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper>
        <LoadingState message="Loading your bookings..." size="lg" />
      </PageWrapper>
    );
  }

  // Empty state
  if (!bookings.length) {
    return (
      <PageWrapper>
        <Header>
          <Title>My Bookings</Title>
        </Header>
        <EmptyState
          icon="🚗"
          title="No bookings yet"
          message="Your upcoming car rentals will appear here"
          action={
            <PrimaryButton onClick={() => navigate("/models")} $size="lg">
              Browse Available Cars
            </PrimaryButton>
          }
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header>
        <Title>My Bookings</Title>
        <Subtitle>Manage your luxury rental reservations</Subtitle>
        <BookingsInfo>
          <BookingsCount>
            {filteredBookings.length} of {bookings.length} booking
            {bookings.length !== 1 ? "s" : ""}
          </BookingsCount>
          <PaginationInfo>
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredBookings.length)} of{" "}
            {filteredBookings.length} bookings
          </PaginationInfo>
        </BookingsInfo>
      </Header>

      {/* Filter Section */}
      <FilterSection>
        <FilterHeader>
          <FilterTitle>
            <FaFilter />
            Filter Bookings
          </FilterTitle>
          {(filters.status !== "all" ||
            filters.dateRange !== "all" ||
            filters.search) && (
            <ClearFiltersButton onClick={clearFilters}>
              Clear All
            </ClearFiltersButton>
          )}
        </FilterHeader>

        <FilterGrid>
          <FilterGroup>
            <FilterLabel>
              <FaSearch />
              Search
            </FilterLabel>
            <SearchInput
              type="text"
              placeholder="Search by car model or location..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="license_required">License Required</option>
              <option value="verification_pending">Verification Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>
              <FaCalendar />
              Date Range
            </FilterLabel>
            <Select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </Select>
          </FilterGroup>
        </FilterGrid>

        <ActiveFilters>
          {filters.status !== "all" && (
            <ActiveFilterChip>
              Status: {filters.status}
              <RemoveFilter onClick={() => handleFilterChange("status", "all")}>
                ×
              </RemoveFilter>
            </ActiveFilterChip>
          )}
          {filters.dateRange !== "all" && (
            <ActiveFilterChip>
              Date: {filters.dateRange}
              <RemoveFilter
                onClick={() => handleFilterChange("dateRange", "all")}
              >
                ×
              </RemoveFilter>
            </ActiveFilterChip>
          )}
          {filters.search && (
            <ActiveFilterChip>
              Search: {filters.search}
              <RemoveFilter onClick={() => handleFilterChange("search", "")}>
                ×
              </RemoveFilter>
            </ActiveFilterChip>
          )}
        </ActiveFilters>
      </FilterSection>

      {/* Desktop Table View */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Check-in</TableHeader>
              <TableHeader>Vehicle</TableHeader>
              <TableHeader>Rental Period</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Driver</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;
              const showCheckInButton = canShowCheckInButton(booking);
              const checkInReady = isCheckInReady(booking);
              const checkInStatus = getCheckInStatus(booking);
              const isCheckedIn = hasCheckedIn(booking);

              return (
                <TableRow key={booking._id}>
                  <TableCell>
                    <CheckInCell>
                      {isCheckedIn ? (
                        <CheckedInBadge>
                          <FaCheckCircle />
                          Checked In
                          {booking.checkIn?.mileage && (
                            <CheckInDetails>
                              Mileage:{" "}
                              {booking.checkIn.mileage.toLocaleString()}
                            </CheckInDetails>
                          )}
                        </CheckedInBadge>
                      ) : showCheckInButton ? (
                        <CheckInButton
                          onClick={() => setCheckingInBooking(booking)}
                          disabled={checkInStatus.disabled}
                          $variant={checkInReady ? "success" : "secondary"}
                          $size="sm"
                        >
                          <FaCheckCircle />
                          {checkInStatus.message}
                        </CheckInButton>
                      ) : (
                        <CheckInHint>{checkInStatus.message}</CheckInHint>
                      )}
                    </CheckInCell>
                  </TableCell>
                  <TableCell>
                    <VehicleCell>
                      <CarImage
                        src={booking.car?.images?.[0] || "/default-car.jpg"}
                        alt={booking.car?.model || "Car"}
                        onError={(e) => {
                          e.target.src = "/default-car.jpg";
                        }}
                      />
                      <VehicleInfo>
                        <CarModel>
                          {booking.car?.model || "Unknown Model"}
                        </CarModel>
                        <CarType>Premium Sedan</CarType>
                      </VehicleInfo>
                    </VehicleCell>
                  </TableCell>

                  <TableCell>
                    <DateCell>
                      <DateGroup>
                        <strong>Pickup:</strong>
                        {formatDate(booking.pickupDate)}
                      </DateGroup>
                      <DateGroup>
                        <strong>Time:</strong> {booking.pickupTime} AM
                      </DateGroup>
                    </DateCell>
                  </TableCell>

                  <TableCell>
                    <PriceCell>
                      <TotalAmount>${booking.totalPrice || "0"}</TotalAmount>
                    </PriceCell>
                  </TableCell>

                  <TableCell>
                    <DocumentsCell>
                      <DocStatus $verified={booking.driver?.verified}>
                        {booking.driver
                          ? booking.driver?.verified
                            ? "Verified"
                            : "Pending verification"
                          : "Provide License"}
                      </DocStatus>
                      {/* Quick actions for driver verification */}
                      {booking.driver && (
                        <DriverQuickActions>
                          <QuickActionButton
                            onClick={() =>
                              handleViewDriverDetails(booking.driver)
                            }
                            title="View driver details"
                            $size="xs"
                          >
                            <FaEye />
                          </QuickActionButton>
                        </DriverQuickActions>
                      )}
                    </DocumentsCell>
                  </TableCell>

                  <TableCell>
                    <StatusCell>
                      <StatusBadge $color={statusConfig.color}>
                        <StatusIcon size={12} />
                        {booking.status || "unknown"}
                      </StatusBadge>
                    </StatusCell>
                  </TableCell>

                  {/* REMOVED: Review Column */}

                  <TableCell>
                    <ActionsCell>
                      <IconButton
                        onClick={() => navigate(`/booking/${booking._id}`)}
                        title="View details"
                      >
                        <FaEye />
                      </IconButton>

                      {/* Verification check button */}
                      {!booking.driver?.verified && (
                        <IconButton
                          onClick={() => handleQuickVerificationCheck(booking)}
                          title="Check verification status"
                          $variant="warning"
                        >
                          <FaExclamationTriangle />
                        </IconButton>
                      )}
                    </ActionsCell>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile Card View - Using MobileCard Component */}
      <MobileContainer>
        {currentBookings.map((booking) => {
          const statusConfig = getStatusConfig(booking.status);
          const verifiedDocuments = getVerifiedDocuments(booking);

          return (
            <MobileCard
              key={booking._id}
              booking={booking}
              statusConfig={statusConfig}
              showCheckInButton={canShowCheckInButton(booking)}
              checkInStatus={getCheckInStatus(booking)}
              isCheckedIn={hasCheckedIn(booking)}
              verifiedDocuments={verifiedDocuments}
              formatDate={formatDate}
              onViewDetails={() => navigate(`/booking/${booking._id}`)}
              onCheckIn={() => setCheckingInBooking(booking)}
              onViewDriverDetails={() =>
                handleViewDriverDetails(booking.driver)
              }
              onVerificationCheck={() => handleQuickVerificationCheck(booking)}
              // REMOVED: Review-related props
            />
          );
        })}
      </MobileContainer>

      {/* No Results State */}
      {filteredBookings.length === 0 && bookings.length > 0 && (
        <NoResults>
          <NoResultsIcon>🔍</NoResultsIcon>
          <NoResultsTitle>No bookings found</NoResultsTitle>
          <NoResultsText>
            Try adjusting your filters or search terms
          </NoResultsText>
          <ClearFiltersButton onClick={clearFilters}>
            Clear All Filters
          </ClearFiltersButton>
        </NoResults>
      )}

      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredBookings.length}
          itemsPerPage={itemsPerPage}
          showInfo={true}
        />
      )}

      {/* Update Modal - Keeping this for verification flow */}
      {updatingBooking && (
        <UpdateDocumentsModal
          show={!!updatingBooking}
          onClose={() => setUpdatingBooking(null)}
          drivers={drivers}
          onSubmit={(formData) => handleUpdateDocuments(formData)}
        />
      )}

      {/* Check-in Modal */}
      <CheckInModal
        show={!!checkingInBooking}
        onClose={handleCheckInClose}
        booking={checkingInBooking}
        onCheckIn={handleCheckInSubmit}
        isCheckingIn={isCheckingIn}
      />

      {/* REMOVED: ReviewModal */}
    </PageWrapper>
  );
};

export default BookingsPage;

// ============================================================================
// STYLED COMPONENTS (Keep existing styles, they're fine)
// ============================================================================

const PageWrapper = styled.div`
  padding: 0;
  background: var(--background);
  min-height: 100vh;
`;

const Header = styled.div`
  background: var(--white);
  padding: var(--space-xl);
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: 0;
`;

const Title = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-family: var(--font-heading);
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin: 0 0 var(--space-md) 0;
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

const BookingsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
`;

const BookingsCount = styled.span`
  background: var(--gray-200);
  color: var(--text-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const PaginationInfo = styled.span`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-family: var(--font-body);

  @media (max-width: 768px) {
    display: none;
  }
`;

// Filter Section Styles
const FilterSection = styled.div`
  background: var(--white);
  padding: var(--space-xl);
  border-bottom: 1px solid var(--gray-200);
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
`;

const FilterTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin: 0;
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);
`;

const ClearFiltersButton = styled.button`
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    background: var(--primary);
    color: var(--white);
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const FilterLabel = styled.label`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: var(--font-medium);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-body);
`;

const SearchInput = styled.input`
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const Select = styled.select`
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  background: var(--white);
  cursor: pointer;
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
`;

const ActiveFilterChip = styled.span`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--primary-light);
  color: var(--primary-dark);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const RemoveFilter = styled.button`
  background: none;
  border: none;
  color: var(--primary-dark);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: var(--primary);
    color: var(--white);
  }
`;

// No Results Styles
const NoResults = styled.div`
  text-align: center;
  padding: var(--space-2xl);
  background: var(--white);
  margin: var(--space-xl);
  border-radius: var(--radius-xl);
  border: 1px solid var(--gray-200);
`;

const NoResultsIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-lg);
`;

const NoResultsTitle = styled.h3`
  font-size: var(--text-xl);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);
`;

const NoResultsText = styled.p`
  color: var(--text-secondary);
  margin: 0 0 var(--space-lg) 0;
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

// Desktop Table Styles
const TableContainer = styled.div`
  background: var(--white);
  margin: 0;
  padding: var(--space-xl);
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
`;

const TableHead = styled.thead`
  background: var(--surface);
`;

const TableHeader = styled.th`
  padding: var(--space-sm);
  text-align: left;
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--gray-200);
  font-family: var(--font-body);
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--gray-100);
  transition: background var(--transition-normal);

  &:hover {
    background: var(--surface);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: var(--space-sm);
  vertical-align: middle;
`;

const VehicleCell = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const CarImage = styled.img`
  width: 60px;
  height: 50px;
  border-radius: var(--radius-md);
  object-fit: cover;
`;

const VehicleInfo = styled.div`
  flex: 1;
`;

const CarModel = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const CarType = styled.div`
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-family: var(--font-body);
`;

const DateCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const DateGroup = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const PriceCell = styled.div`
  text-align: left;
`;

const TotalAmount = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

const DocumentsCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const DocStatus = styled.div`
  font-size: var(--text-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  background: ${(props) => (props.$verified ? "#d1fae5" : "#fef3c7")};
  color: ${(props) => (props.$verified ? "#065f46" : "#92400e")};
  font-weight: var(--font-medium);
  width: fit-content;
  font-family: var(--font-body);
`;

// Driver Quick Actions
const DriverQuickActions = styled.div`
  display: flex;
  gap: var(--space-xs);
  margin-top: var(--space-xs);
`;

const QuickActionButton = styled(GhostButton)`
  && {
    padding: var(--space-xs);
    min-width: auto;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--text-xs);

    ${(props) =>
      props.$variant === "warning" &&
      `
      color: var(--warning);
      border-color: var(--warning);
      
      &:hover:not(:disabled) {
        background: var(--warning);
        color: var(--white);
      }
    `}
  }
`;

const StatusCell = styled.div`
  text-align: left;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  width: fit-content;
  background: ${(props) => props.$color}20;
  color: ${(props) => props.$color};
  text-transform: capitalize;
  font-family: var(--font-body);
`;

// Check-in Cell Styles
const CheckInCell = styled.div`
  display: flex;
  justify-content: center;
`;

const CheckInButton = styled(SuccessButton)`
  && {
    padding: var(--space-sm) var(--space-md);
    min-width: auto;
    font-size: var(--text-xs);

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--gray-300);
      color: var(--gray-600);
      border-color: var(--gray-300);

      &:hover {
        background: var(--gray-300);
        color: var(--gray-600);
        border-color: var(--gray-300);
      }
    }
  }
`;

const CheckedInBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--success);
  color: var(--white);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-align: center;
  font-family: var(--font-body);
`;

const CheckInDetails = styled.span`
  font-size: var(--text-xs);
  opacity: 0.9;
  font-weight: var(--font-normal);
`;

const CheckInHint = styled.div`
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-align: center;
  font-style: italic;
  font-family: var(--font-body);
`;

const ActionsCell = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const IconButton = styled(GhostButton)`
  && {
    padding: var(--space-sm);
    min-width: auto;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;

    ${(props) =>
      props.$variant === "danger" &&
      `
      color: var(--error);
      border-color: var(--error);
      
      &:hover:not(:disabled) {
        background: var(--error);
        color: var(--white);
      }
    `}

    ${(props) =>
      props.$variant === "success" &&
      `
      color: var(--success);
      border-color: var(--success);
      
      &:hover:not(:disabled) {
        background: var(--success);
        color: var(--white);
      }
    `}

    ${(props) =>
      props.$variant === "warning" &&
      `
      color: var(--warning);
      border-color: var(--warning);
      
      &:hover:not(:disabled) {
        background: var(--warning);
        color: var(--white);
      }
    `}
  }
`;

// Mobile Container
const MobileContainer = styled.div`
  display: none;
  padding: var(--space-md);
  gap: var(--space-md);

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;
