// BookingsPage.js - REFACTORED WITH SEPARATE CHECK-IN MODAL
import React, { useMemo, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  useMyBookings,
  useUpdateUserBooking,
  useCancelBooking,
  useCheckInBooking,
} from "../hooks/useBooking";
import { useMyDrivers } from "../hooks/useDriver";
import UpdateDocumentsModal from "../components/Modal/UpdateDocumentsModal";
import ReviewModal from "../components/Modal/ReviewModal";
import CheckInModal from "../components/Modal/CheckInModal";
import Pagination from "../components/Pagination";

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
} from "react-icons/fa";
import usePageTitle from "../hooks/usePageTitle";

import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";

const BookingsPage = () => {
  const seoConfig = ROUTE_CONFIG[PATHS.BOOKINGS];
  usePageTitle(seoConfig.title, seoConfig.description);

  const { data: BookingsData, isLoading, refetch } = useMyBookings();
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [checkingInBooking, setCheckingInBooking] = useState(null);

  // Track submitted reviews
  const [submittedReviews, setSubmittedReviews] = useState(new Set());

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
  const reasonRef = useRef(null);

  const { mutate: updateUserBooking } = useUpdateUserBooking(updatingBooking);
  const { mutate: cancelBooking, isLoading: isCancelling } = useCancelBooking();
  const { mutate: checkInBooking, isLoading: isCheckingIn } =
    useCheckInBooking();

  const { data: DriversData } = useMyDrivers();
  const drivers = useMemo(() => DriversData?.data || [], [DriversData]);
  const bookings = useMemo(
    () => BookingsData?.data?.data || [],
    [BookingsData]
  );
  console.log(bookings);
  const navigate = useNavigate();

  // Fuel level labels for display
  const fuelLevelLabels = {
    empty: "Empty",
    quarter: "¼ Tank",
    half: "½ Tank",
    three_quarters: "¾ Tank",
    full: "Full",
  };

  // Handle successful review submission
  const handleReviewSuccess = (bookingId) => {
    setSubmittedReviews((prev) => {
      const newSet = new Set(prev);
      newSet.add(bookingId);
      return newSet;
    });
    setReviewingBooking(null);
    setTimeout(() => {
      refetch();
    }, 500);
  };

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

  // Check if booking is eligible for check-in
  const canCheckIn = (booking) => {
    const now = new Date();
    const pickupDate = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);

    // Allow check-in from 2 hours before pickup until return date
    const checkInStart = new Date(pickupDate.getTime() - 2 * 60 * 60 * 1000);

    return (
      booking.status === "confirmed" &&
      now >= checkInStart &&
      now <= returnDate &&
      !booking.checkIn
    );
  };

  // Check if booking has been checked in
  const hasCheckedIn = (booking) => {
    return booking.checkIn && booking.checkIn.status === "completed";
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

  // Generate page numbers for pagination
  // const getPageNumbers = () => {
  //   const pages = [];
  //   const maxVisiblePages = 5;

  //   if (totalPages <= maxVisiblePages) {
  //     for (let i = 1; i <= totalPages; i++) {
  //       pages.push(i);
  //     }
  //   } else {
  //     pages.push(1);
  //     let start = Math.max(2, currentPage - 1);
  //     let end = Math.min(totalPages - 1, currentPage + 1);

  //     if (currentPage <= 2) {
  //       end = 4;
  //     }

  //     if (currentPage >= totalPages - 1) {
  //       start = totalPages - 3;
  //     }

  //     if (start > 2) {
  //       pages.push("ellipsis-start");
  //     }

  //     for (let i = start; i <= end; i++) {
  //       pages.push(i);
  //     }

  //     if (end < totalPages - 1) {
  //       pages.push("ellipsis-end");
  //     }

  //     if (totalPages > 1) {
  //       pages.push(totalPages);
  //     }
  //   }

  //   return pages;
  // };

  // const handlePageChange = (page) => {
  //   if (page >= 1 && page <= totalPages) {
  //     setCurrentPage(page);
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // };

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

  // Handle cancel booking
  const handleCancelBooking = (cancellationReason) => {
    if (!cancellingBooking) return;

    cancelBooking(
      {
        bookingId: cancellingBooking._id,
        reason: cancellationReason,
      },
      {
        onSuccess: () => {
          setCancellingBooking(null);
          refetch();
          if (reasonRef.current) {
            reasonRef.current.value = "";
          }
        },
        onError: (error) => {
          console.error("Cancellation failed:", error);
        },
      }
    );
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

  const getStatusConfig = (status) => {
    const config = {
      confirmed: {
        color: "var(--success)",
        icon: FaCheckCircle,
        canCancel: true,
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
        canCancel: true,
      },
      checked_in: {
        color: "var(--info)",
        icon: FaCheckCircle,
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

  // Check if booking can be reviewed
  const canReviewBooking = (booking) => {
    const canReview =
      booking.status === "completed" &&
      !booking.review &&
      !submittedReviews.has(booking._id);
    return canReview;
  };

  // Check if booking has review (either in DB or locally submitted)
  const hasReview = (booking) => {
    return booking.review || submittedReviews.has(booking._id);
  };

  const getCancellationPolicy = (booking) => {
    if (!booking?.pickupDate) {
      return {
        type: "unknown",
        message: "Cancellation policy not available",
        note: "Please contact support for cancellation details",
      };
    }

    const pickupDate = new Date(booking.pickupDate);
    const now = new Date();
    const hoursUntilPickup = (pickupDate - now) / (1000 * 60 * 60);

    if (hoursUntilPickup > 24) {
      return {
        type: "full_refund",
        message: "Free cancellation - Full refund available",
        note: "Cancel at least 24 hours before pickup for full refund",
      };
    } else if (hoursUntilPickup > 6) {
      return {
        type: "partial_refund",
        message: "Partial refund available",
        note: "50% refund if cancelled 6-24 hours before pickup",
      };
    } else {
      return {
        type: "no_refund",
        message: "No refund available",
        note: "Cancellations within 6 hours of pickup are non-refundable",
      };
    }
  };

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
              {/* <TableHeader>Location</TableHeader> */}
              <TableHeader>Total</TableHeader>
              <TableHeader>Driver</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Review</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentBookings.map((booking) => {
              console.log(booking);
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;
              const canCancel = statusConfig.canCancel;
              const isCheckInEligible = canCheckIn(booking);
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
                      ) : isCheckInEligible ? (
                        <CheckInButton
                          onClick={() => setCheckingInBooking(booking)}
                          $variant="success"
                          $size="sm"
                        >
                          <FaCheckCircle />
                          Check In
                        </CheckInButton>
                      ) : (
                        <CheckInHint>
                          {booking.status === "confirmed"
                            ? "Available at pickup time"
                            : "Not available"}
                        </CheckInHint>
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

                  <TableCell>
                    <ReviewCell>
                      {hasReview(booking) ? (
                        <ReviewedBadge>
                          <FaCheckCircle />
                          Reviewed
                        </ReviewedBadge>
                      ) : canReviewBooking(booking) ? (
                        <ReviewButton
                          onClick={() => setReviewingBooking(booking)}
                          title="Write a review"
                          $size="sm"
                        >
                          <FaStar />
                          Write Review
                        </ReviewButton>
                      ) : (
                        <ReviewHint>Complete trip to review</ReviewHint>
                      )}
                    </ReviewCell>
                  </TableCell>

                  <TableCell>
                    <ActionsCell>
                      <IconButton
                        onClick={() => navigate(`/booking/${booking._id}`)}
                        title="View details"
                      >
                        <FaEye />
                      </IconButton>
                      <IconButton
                        onClick={() => setUpdatingBooking(booking._id)}
                        title="Update documents"
                        $variant="secondary"
                      >
                        <FaEdit />
                      </IconButton>
                      {/* {isCheckInEligible && (
                        <IconButton
                          onClick={() => setCheckingInBooking(booking)}
                          title="Check in"
                          $variant="success"
                        >
                          <FaCheckCircle />
                        </IconButton>
                      )} */}
                      {canCancel && (
                        <IconButton
                          onClick={() => setCancellingBooking(booking)}
                          title="Cancel booking"
                          $variant="danger"
                        >
                          <FaBan />
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

      {/* Mobile Card View */}
      <MobileContainer>
        {currentBookings.map((booking) => {
          const statusConfig = getStatusConfig(booking.status);
          const StatusIcon = statusConfig.icon;
          const canCancel = statusConfig.canCancel;
          const isCheckInEligible = canCheckIn(booking);
          const isCheckedIn = hasCheckedIn(booking);

          return (
            <MobileCard key={booking._id}>
              <CardHeader>
                <VehicleInfo>
                  <CarImage
                    src={booking.car?.images?.[0] || "/default-car.jpg"}
                    alt={booking.car?.model || "Car"}
                    onError={(e) => {
                      e.target.src = "/default-car.jpg";
                    }}
                  />
                  <div>
                    <CarModel>{booking.car?.model || "Unknown Model"}</CarModel>
                    <CarType>Premium Sedan • Automatic</CarType>
                  </div>
                </VehicleInfo>
                <StatusBadge $color={statusConfig.color}>
                  <StatusIcon size={12} />
                  {booking.status || "unknown"}
                </StatusBadge>
              </CardHeader>

              <CardContent>
                <InfoGrid>
                  <InfoItem>
                    <FaCalendarAlt />
                    <div>
                      <InfoLabel>Pickup Date</InfoLabel>
                      <InfoValue>{formatDate(booking.pickupDate)}</InfoValue>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <FaCalendarAlt />
                    <div>
                      <InfoLabel>Return Date</InfoLabel>
                      <InfoValue>{formatDate(booking.returnDate)}</InfoValue>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <FaMapMarkerAlt />
                    <div>
                      <InfoLabel>Location</InfoLabel>
                      <InfoValue>
                        {booking.pickupLocation || "Not specified"}
                      </InfoValue>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <FaDollarSign />
                    <div>
                      <InfoLabel>Total Amount</InfoLabel>
                      <InfoValue>${booking.totalPrice || "0"}</InfoValue>
                    </div>
                  </InfoItem>
                </InfoGrid>

                <DocumentsSection>
                  <SectionTitle>Document Status</SectionTitle>
                  <DocumentStatusGroup>
                    <MobileDocStatus $verified={booking.driver?.verified}>
                      <FaFileAlt />
                      {booking.driver
                        ? booking.driver?.verified
                          ? "Verified"
                          : "Pending verification"
                        : "Provide License"}
                      <StatusIndicator $verified={booking.driver?.verified} />
                    </MobileDocStatus>
                  </DocumentStatusGroup>
                </DocumentsSection>

                {/* Check-in Section for Mobile */}
                <CheckInSection>
                  <SectionTitle>Check-in Status</SectionTitle>
                  {isCheckedIn ? (
                    <CheckedInBadgeMobile>
                      <FaCheckCircle />
                      Checked In
                      {booking.checkIn?.mileage && (
                        <CheckInDetailsMobile>
                          Mileage: {booking.checkIn.mileage.toLocaleString()} •
                          Fuel:{" "}
                          {fuelLevelLabels[booking.checkIn.fuelLevel] ||
                            booking.checkIn.fuelLevel}
                        </CheckInDetailsMobile>
                      )}
                    </CheckedInBadgeMobile>
                  ) : isCheckInEligible ? (
                    <MobileCheckInButton
                      onClick={() => setCheckingInBooking(booking)}
                      $variant="success"
                      $size="sm"
                    >
                      <FaCheckCircle />
                      Check In Vehicle
                    </MobileCheckInButton>
                  ) : (
                    <CheckInHintMobile>
                      {booking.status === "confirmed"
                        ? "Check-in available at pickup time"
                        : "Check-in not available"}
                    </CheckInHintMobile>
                  )}
                </CheckInSection>

                {/* Review Section for Mobile */}
                <ReviewSection>
                  <SectionTitle>Review Status</SectionTitle>
                  {hasReview(booking) ? (
                    <ReviewedBadge>
                      <FaCheckCircle />
                      Review Submitted
                    </ReviewedBadge>
                  ) : canReviewBooking(booking) ? (
                    <MobileReviewButton
                      onClick={() => setReviewingBooking(booking)}
                      $size="sm"
                    >
                      <FaStar />
                      Write a Review
                    </MobileReviewButton>
                  ) : (
                    <ReviewHintMobile>
                      Complete your trip to leave a review
                    </ReviewHintMobile>
                  )}
                </ReviewSection>
              </CardContent>

              <CardActions>
                <MobileButton
                  onClick={() => navigate(`/booking/${booking._id}`)}
                  $variant="primary"
                  $size="sm"
                >
                  <FaEye />
                  View Details
                </MobileButton>
                <MobileButton
                  onClick={() => setUpdatingBooking(booking._id)}
                  $variant="secondary"
                  $size="sm"
                >
                  <FaCloudUploadAlt />
                  Update Documents
                </MobileButton>
                {isCheckInEligible && (
                  <MobileButton
                    onClick={() => setCheckingInBooking(booking)}
                    $variant="success"
                    $size="sm"
                  >
                    <FaCheckCircle />
                    Check In
                  </MobileButton>
                )}
                {canCancel && (
                  <MobileButton
                    onClick={() => setCancellingBooking(booking)}
                    $variant="danger"
                    $size="sm"
                  >
                    <FaBan />
                    Cancel
                  </MobileButton>
                )}
              </CardActions>
            </MobileCard>
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
        // <PaginationContainer>
        //   <PaginationInfoMobile>
        //     Showing {startIndex + 1}-
        //     {Math.min(endIndex, filteredBookings.length)} of{" "}
        //     {filteredBookings.length} bookings
        //   </PaginationInfoMobile>

        //   <Pagination>
        //     <PaginationButton
        //       onClick={() => handlePageChange(currentPage - 1)}
        //       disabled={currentPage === 1}
        //       $disabled={currentPage === 1}
        //     >
        //       <FaChevronLeft />
        //       Previous
        //     </PaginationButton>

        //     <PageNumbers>
        //       {getPageNumbers().map((page, index) => {
        //         if (page === "ellipsis-start" || page === "ellipsis-end") {
        //           return (
        //             <Ellipsis key={`ellipsis-${index}`}>
        //               <FaEllipsisH />
        //             </Ellipsis>
        //           );
        //         }

        //         return (
        //           <PageNumber
        //             key={page}
        //             $active={currentPage === page}
        //             onClick={() => handlePageChange(page)}
        //           >
        //             {page}
        //           </PageNumber>
        //         );
        //       })}
        //     </PageNumbers>

        //     <PaginationButton
        //       onClick={() => handlePageChange(currentPage + 1)}
        //       disabled={currentPage === totalPages}
        //       $disabled={currentPage === totalPages}
        //     >
        //       Next
        //       <FaChevronRight />
        //     </PaginationButton>
        //   </Pagination>
        // </PaginationContainer>
      )}

      {/* Update Modal */}
      {updatingBooking && (
        <UpdateDocumentsModal
          show={!!updatingBooking}
          onClose={() => setUpdatingBooking(null)}
          drivers={drivers}
          onSubmit={(formData) => handleUpdateDocuments(formData)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBooking && (
        <CancelModalOverlay>
          <CancelModal>
            <CancelModalHeader>
              <WarningIcon>
                <FaExclamationTriangle />
              </WarningIcon>
              <CancelModalTitle>Cancel Booking</CancelModalTitle>
            </CancelModalHeader>

            <CancelModalContent>
              <p>Are you sure you want to cancel this booking?</p>

              <BookingInfo>
                <strong>Vehicle:</strong>{" "}
                {cancellingBooking.car?.model || "Unknown Model"}
                <br />
                <strong>Pickup:</strong>{" "}
                {formatDate(cancellingBooking.pickupDate)}
                <br />
                <strong>Return:</strong>{" "}
                {formatDate(cancellingBooking.returnDate)}
                <br />
                <strong>Total:</strong> ${cancellingBooking.totalPrice || "0"}
              </BookingInfo>

              <CancellationPolicy>
                <PolicyTitle>📋 Cancellation Policy</PolicyTitle>
                {(() => {
                  const policy = getCancellationPolicy(cancellingBooking);
                  return (
                    <>
                      <PolicyMessage $type={policy.type}>
                        {policy.message}
                      </PolicyMessage>
                      <PolicyNote>{policy.note}</PolicyNote>
                    </>
                  );
                })()}
              </CancellationPolicy>

              <ReasonSection>
                <ReasonLabel>Reason for cancellation (optional):</ReasonLabel>
                <ReasonTextarea
                  placeholder="Please let us know why you're cancelling..."
                  ref={reasonRef}
                />
              </ReasonSection>
            </CancelModalContent>

            <CancelModalActions>
              <CancelButton
                onClick={() => {
                  setCancellingBooking(null);
                  if (reasonRef.current) {
                    reasonRef.current.value = "";
                  }
                }}
                $variant="secondary"
                disabled={isCancelling}
              >
                <FaUndo />
                Keep Booking
              </CancelButton>
              <CancelConfirmButton
                onClick={() =>
                  handleCancelBooking(
                    reasonRef.current?.value || "No reason provided"
                  )
                }
                disabled={isCancelling}
                $variant="danger"
              >
                {isCancelling ? (
                  <>
                    <LoadingSpinner $size="sm" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <FaBan />
                    Confirm Cancellation
                  </>
                )}
              </CancelConfirmButton>
            </CancelModalActions>
          </CancelModal>
        </CancelModalOverlay>
      )}

      {/* Check-in Modal */}
      <CheckInModal
        show={!!checkingInBooking}
        onClose={handleCheckInClose}
        booking={checkingInBooking}
        onCheckIn={handleCheckInSubmit}
        isCheckingIn={isCheckingIn}
      />

      <ReviewModal
        show={!!reviewingBooking}
        onClose={() => setReviewingBooking(null)}
        booking={reviewingBooking}
        onSuccess={() => {
          if (reviewingBooking && reviewingBooking._id) {
            handleReviewSuccess(reviewingBooking._id);
          }
        }}
      />
    </PageWrapper>
  );
};

export default BookingsPage;

// ============================================================================
// STYLED COMPONENTS (Keep all the existing styled components)
// ============================================================================

// [All the existing styled components remain exactly the same...]

// ============================================================================
// STYLED COMPONENTS (FIXED - removed whileHover)
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
  /* margin-bottom: var(--space-xs); */
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

const LocationCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: var(--text-sm);
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

const ReviewCell = styled.div`
  display: flex;
  justify-content: center;
`;

const ReviewButton = styled(PrimaryButton)`
  && {
    padding: var(--space-sm) var(--space-md);
    min-width: auto;
    font-size: var(--text-xs);
  }
`;

const ReviewedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--success);
  color: var(--white);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

const ReviewHint = styled.div`
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
  }
`;

// Mobile Card Styles
const MobileContainer = styled.div`
  display: none;
  padding: var(--space-md);
  gap: var(--space-md);

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const MobileCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
`;

const CardContent = styled.div`
  margin-bottom: var(--space-md);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const InfoLabel = styled.div`
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);
`;

const InfoValue = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const DocumentsSection = styled.div`
  background: var(--surface);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
`;

const SectionTitle = styled.h3`
  font-size: var(--text-sm);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

const DocumentStatusGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const MobileDocStatus = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  font-size: var(--text-sm);
  color: ${(props) => (props.$verified ? "#065f46" : "#92400e")};
  background: ${(props) => (props.$verified ? "#d1fae5" : "#fef3c7")};
  border-radius: var(--radius-md);
  font-family: var(--font-body);
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.$verified ? "var(--success)" : "var(--warning)"};
  margin-left: auto;
`;

// Mobile Check-in Styles
const CheckInSection = styled.div`
  background: var(--surface);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  margin-top: var(--space-md);
`;

const CheckedInBadgeMobile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: var(--success);
  color: var(--white);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-align: center;
  font-family: var(--font-body);
`;

const CheckInDetailsMobile = styled.span`
  font-size: var(--text-xs);
  opacity: 0.9;
  font-weight: var(--font-normal);
  margin-top: var(--space-xs);
`;

const MobileCheckInButton = styled(SuccessButton)`
  && {
    width: 100%;
    justify-content: center;
    font-size: var(--text-sm);
  }
`;

const CheckInHintMobile = styled.div`
  text-align: center;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-style: italic;
  font-family: var(--font-body);
`;

const ReviewSection = styled.div`
  background: var(--surface);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  margin-top: var(--space-md);
`;

const MobileReviewButton = styled(PrimaryButton)`
  && {
    width: 100%;
    justify-content: center;
    font-size: var(--text-sm);
  }
`;

const ReviewHintMobile = styled.div`
  text-align: center;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-style: italic;
  font-family: var(--font-body);
`;

const CardActions = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const MobileButton = styled(SecondaryButton)`
  && {
    flex: 1;
    justify-content: center;
    font-size: var(--text-sm);

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
  }
`;

// Star Rating Components

// Pagination Styles
const PaginationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  background: var(--white);
  border-top: 1px solid var(--gray-200);

  @media (max-width: 768px) {
    padding: var(--space-lg);
  }
`;

// const PaginationInfoMobile = styled.span`
//   color: var(--text-secondary);
//   font-size: var(--text-sm);
//   font-family: var(--font-body);
//   text-align: center;

//   @media (min-width: 769px) {
//     display: none;
//   }
// `;

// const Pagination = styled.div`
//   display: flex;
//   align-items: center;
//   gap: var(--space-sm);
//   flex-wrap: wrap;
//   justify-content: center;

//   @media (max-width: 768px) {
//     gap: var(--space-xs);
//   }
// `;

// const PaginationButton = styled.button`
//   display: flex;
//   align-items: center;
//   gap: var(--space-sm);
//   padding: var(--space-sm) var(--space-md);
//   background: var(--white);
//   border: 1px solid var(--gray-300);
//   border-radius: var(--radius-md);
//   color: var(--text-primary);
//   font-size: var(--text-sm);
//   font-weight: var(--font-medium);
//   cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
//   transition: all var(--transition-normal);
//   font-family: var(--font-body);

//   &:hover:not(:disabled) {
//     background: var(--primary);
//     color: var(--white);
//     border-color: var(--primary);
//   }

//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }

//   @media (max-width: 768px) {
//     padding: var(--space-xs) var(--space-sm);
//     font-size: var(--text-xs);
//   }
// `;

const PageNumbers = styled.div`
  display: flex;
  gap: var(--space-xs);
  align-items: center;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const PageNumber = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: var(--space-xs);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: ${(props) => (props.$active ? "var(--primary)" : "var(--white)")};
  color: ${(props) => (props.$active ? "var(--white)" : "var(--text-primary)")};
  font-size: var(--text-sm);
  font-weight: ${(props) =>
    props.$active ? "var(--font-semibold)" : "var(--font-normal)"};
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    background: ${(props) =>
      props.$active ? "var(--primary)" : "var(--gray-100)"};
    border-color: ${(props) =>
      props.$active ? "var(--primary)" : "var(--gray-400)"};
  }

  @media (max-width: 768px) {
    min-width: 36px;
    height: 36px;
    font-size: var(--text-xs);
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-family: var(--font-body);

  @media (max-width: 768px) {
    min-width: 36px;
    height: 36px;
    font-size: var(--text-xs);
  }
`;

// Cancel Modal Styles
const CancelModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-md);
`;

const CancelModal = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: var(--space-lg);
    margin: var(--space-md);
  }
`;

const CancelModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  text-align: center;
  justify-content: center;
`;

const WarningIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: var(--error-light);
  color: var(--error);
  border-radius: 50%;
  font-size: var(--text-xl);
`;

const CancelModalTitle = styled.h2`
  font-size: var(--text-2xl);
  color: var(--error);
  margin: 0;
  font-weight: var(--font-bold);
  font-family: var(--font-heading);
`;

const CancelModalContent = styled.div`
  margin-bottom: var(--space-xl);
  text-align: center;

  p {
    color: var(--text-primary);
    margin-bottom: var(--space-lg);
    font-size: var(--text-lg);
    font-family: var(--font-body);
  }
`;

const BookingInfo = styled.div`
  background: var(--surface);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  text-align: left;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-family: var(--font-body);

  strong {
    color: var(--text-primary);
  }
`;

const CancellationPolicy = styled.div`
  background: var(--info-light);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  text-align: left;
`;

const PolicyTitle = styled.h4`
  font-size: var(--text-sm);
  color: var(--info-dark);
  margin: 0 0 var(--space-sm) 0;
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

const PolicyMessage = styled.div`
  font-size: var(--text-sm);
  color: ${(props) =>
    props.$type === "full_refund"
      ? "var(--success)"
      : props.$type === "partial_refund"
      ? "var(--warning)"
      : props.$type === "no_refund"
      ? "var(--error)"
      : "var(--text-secondary)"};
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);
`;

const PolicyNote = styled.div`
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-style: italic;
  font-family: var(--font-body);
`;

const ReasonSection = styled.div`
  text-align: left;
  margin-top: var(--space-lg);
`;

const ReasonLabel = styled.label`
  display: block;
  font-size: var(--text-sm);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const ReasonTextarea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: var(--space-sm);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const CancelModalActions = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CancelButton = styled(SecondaryButton)`
  && {
    min-width: 140px;

    @media (max-width: 768px) {
      min-width: auto;
    }
  }
`;

const CancelConfirmButton = styled(DangerButton)`
  && {
    min-width: 180px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      min-width: auto;
    }
  }
`;

const VehicleImage = styled.img`
  width: 100px;
  height: 70px;
  border-radius: var(--radius-md);
  object-fit: cover;

  @media (max-width: 768px) {
    width: 120px;
    height: 80px;
  }
`;

const VehicleDetails = styled.div`
  flex: 1;
`;

const VehicleModel = styled.h3`
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-weight: var(--font-semibold);
  font-family: var(--font-heading);
`;

const VehicleDetailsText = styled.p`
  color: var(--text-secondary);
  margin: 0 0 var(--space-xs) 0;
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const FormLabel = styled.label`
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-body);
`;

const MileageInput = styled.input`
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
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

const FormHelp = styled.span`
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const FuelLevelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-sm);

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FuelLevelOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  border: 2px solid
    ${(props) => (props.$selected ? "var(--success)" : "var(--gray-300)")};
  border-radius: var(--radius-md);
  background: ${(props) =>
    props.$selected ? "var(--success-light)" : "var(--white)"};
  cursor: pointer;
  transition: all var(--transition-normal);
  text-align: center;

  &:hover {
    border-color: var(--success);
    background: var(--success-light);
  }
`;

const FuelLevelIcon = styled.div`
  color: ${(props) => {
    const level = props.$level;
    if (level === 0) return "var(--error)";
    if (level <= 25) return "var(--warning)";
    if (level <= 50) return "var(--info)";
    if (level <= 75) return "var(--success)";
    return "var(--success-dark)";
  }};
  font-size: var(--text-lg);
`;

const FuelLevelLabel = styled.span`
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const PhotoUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const PhotoUploadButton = styled.div`
  display: inline-block;
`;

const PhotoUploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--primary);
  color: var(--white);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: var(--font-body);

  &:hover {
    background: var(--primary-dark);
  }
`;

const PhotoHelp = styled.span`
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const PhotoPreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-sm);
`;

const PhotoPreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const PhotoPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemovePhotoButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: var(--error);
  color: var(--white);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: var(--text-xs);
  transition: all var(--transition-normal);

  &:hover {
    background: var(--error-dark);
    transform: scale(1.1);
  }
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-family: var(--font-body);
  resize: vertical;
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

const CheckInTips = styled.div`
  background: var(--info-light);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  margin-top: var(--space-xl);
`;

const TipsTitle = styled.h4`
  font-size: var(--text-sm);
  color: var(--info-dark);
  margin: 0 0 var(--space-md) 0;
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

const TipsList = styled.ul`
  margin: 0;
  padding-left: var(--space-lg);
`;

const Tip = styled.li`
  color: var(--info-dark);
  font-size: var(--text-sm);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);

  &:last-child {
    margin-bottom: 0;
  }
`;

const CheckInModalActions = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CheckInCancelButton = styled(SecondaryButton)`
  && {
    min-width: 120px;

    @media (max-width: 768px) {
      min-width: auto;
    }
  }
`;

const CheckInConfirmButton = styled(SuccessButton)`
  && {
    min-width: 160px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      min-width: auto;
    }
  }
`;
