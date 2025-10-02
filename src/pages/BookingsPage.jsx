// import { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMyBookings } from "../hooks/useBooking";
import { useMyDrivers } from "../hooks/useDriver";
import UpdateDocumentsModal from "../components/Modal/UpdateDocumentsModal";
import ReviewModal from "../components/Modal/ReviewModal";
import { useUpdateUserBooking } from "../hooks/useBooking";

// Import UI Components
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
} from "../components/ui/Button";
import { EmptyState, LoadingState } from "../components/ui/LoadingSpinner";

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
  FaComment,
  FaRegStar,
  FaRegSmile,
} from "react-icons/fa";
import { useMemo, useState } from "react";
import usePageTitle from "../hooks/usePageTitle";

import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";

const BookingsPage = () => {
  const seoConfig = ROUTE_CONFIG[PATHS.BOOKINGS];

  // Use the custom SEO hook
  usePageTitle(seoConfig.title, seoConfig.description);

  const { data: BookingsData, isLoading } = useMyBookings();
  const [updatingBooking, setUpdatingBooking] = useState(null);
  const [reviewingBooking, setReviewingBooking] = useState(null);

  const { mutate: updateUserBooking } = useUpdateUserBooking(updatingBooking);

  const { data: DriversData } = useMyDrivers();

  const drivers = useMemo(() => DriversData?.data || [], [DriversData]);
  const bookings = useMemo(
    () => BookingsData?.data?.data || [],
    [BookingsData]
  );

  const navigate = useNavigate();

  const handleUpdateDocuments = (data) => {
    try {
      console.log("Submitting document update with data:", data);
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

  const getStatusConfig = (status) => {
    const config = {
      confirmed: { color: "var(--success)", icon: FaCheckCircle },
      completed: { color: "var(--info)", icon: FaCheckCircle },
      cancelled: { color: "var(--error)", icon: FaClock },
      pending: { color: "var(--warning)", icon: FaClock },
    };
    return config[status?.toLowerCase()] || config.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const canReviewBooking = (booking) => {
    return booking.status === "completed" && !booking.review;
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <StarsContainer>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarButton
            key={star}
            onClick={() => !readonly && onRatingChange(star)}
            $readonly={readonly}
          >
            {star <= rating ? <FaStar /> : <FaRegStar />}
          </StarButton>
        ))}
      </StarsContainer>
    );
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
        <BookingsCount>
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
        </BookingsCount>
      </Header>

      {/* Desktop Table View */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Vehicle</TableHeader>
              <TableHeader>Rental Period</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Driver</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Review</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;

              return (
                <TableRow key={booking._id}>
                  <TableCell>
                    <VehicleCell>
                      <CarImage
                        src={booking.car?.images[0] || "/default-car.jpg"}
                        alt={booking.car?.model}
                      />
                      <VehicleInfo>
                        <CarModel>{booking.car?.model}</CarModel>
                        <CarType>Premium Sedan</CarType>
                      </VehicleInfo>
                    </VehicleCell>
                  </TableCell>

                  <TableCell>
                    <DateCell>
                      <DateGroup>
                        <strong>Pickup:</strong>{" "}
                        {formatDate(booking.pickupDate)}
                      </DateGroup>
                      <DateGroup>
                        <strong>Return:</strong>{" "}
                        {formatDate(booking.returnDate)}
                      </DateGroup>
                    </DateCell>
                  </TableCell>

                  <TableCell>
                    <LocationCell>
                      <FaMapMarkerAlt />
                      {booking.pickupLocation}
                    </LocationCell>
                  </TableCell>

                  <TableCell>
                    <PriceCell>
                      <TotalAmount>${booking.totalPrice}</TotalAmount>
                    </PriceCell>
                  </TableCell>

                  <TableCell>
                    <DocumentsCell>
                      <DocStatus $verified={booking.driverLicense?.verified}>
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
                        {booking.status}
                      </StatusBadge>
                    </StatusCell>
                  </TableCell>

                  <TableCell>
                    <ReviewCell>
                      {canReviewBooking(booking) ? (
                        <ReviewButton
                          onClick={() => {
                            console.log("booking", booking);
                            setReviewingBooking(booking);
                          }}
                          title="Write a review"
                          $size="sm"
                        >
                          <FaStar />
                          Write Review
                        </ReviewButton>
                      ) : booking.review ? (
                        <ReviewedBadge>
                          <FaCheckCircle />
                          Reviewed
                        </ReviewedBadge>
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
        {bookings.map((booking) => {
          const statusConfig = getStatusConfig(booking.status);
          const StatusIcon = statusConfig.icon;

          return (
            <MobileCard key={booking._id}>
              <CardHeader>
                <VehicleInfo>
                  <CarImage
                    src={booking.car?.images[0] || "/default-car.jpg"}
                    alt={booking.car?.model}
                  />
                  <div>
                    <CarModel>{booking.car?.model}</CarModel>
                    <CarType>Premium Sedan • Automatic</CarType>
                  </div>
                </VehicleInfo>
                <StatusBadge $color={statusConfig.color}>
                  <StatusIcon size={12} />
                  {booking.status}
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
                      <InfoValue>{booking.pickupLocation}</InfoValue>
                    </div>
                  </InfoItem>

                  <InfoItem>
                    <FaDollarSign />
                    <div>
                      <InfoLabel>Total Amount</InfoLabel>
                      <InfoValue>${booking.totalPrice}</InfoValue>
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

                {/* Review Section for Mobile */}
                <ReviewSection>
                  <SectionTitle>Review Status</SectionTitle>
                  {canReviewBooking(booking) ? (
                    <MobileReviewButton
                      onClick={() => setReviewingBooking(booking)}
                      $size="sm"
                    >
                      <FaStar />
                      Write a Review
                    </MobileReviewButton>
                  ) : booking.review ? (
                    <ReviewedBadge>
                      <FaCheckCircle />
                      Review Submitted
                    </ReviewedBadge>
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
              </CardActions>
            </MobileCard>
          );
        })}
      </MobileContainer>

      {/* Update Modal */}
      {updatingBooking && (
        <UpdateDocumentsModal
          show={!!updatingBooking}
          onClose={() => setUpdatingBooking(null)}
          drivers={drivers}
          onSubmit={(formData) => handleUpdateDocuments(formData)}
        />
      )}

      <ReviewModal
        show={!!reviewingBooking}
        onClose={() => setReviewingBooking(null)}
        booking={reviewingBooking}
      />
    </PageWrapper>
  );
};

export default BookingsPage;

// Styled Components using Global Variables
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

const BookingsCount = styled.span`
  background: var(--gray-200);
  color: var(--text-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
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
  padding: var(--space-md);
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
  padding: var(--space-md);
  vertical-align: middle;
`;

const VehicleCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const CarImage = styled.img`
  width: 60px;
  height: 40px;
  border-radius: var(--radius-md);
  object-fit: cover;
`;

const VehicleInfo = styled.div`
  flex: 1;
`;

const CarModel = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);
`;

const CarType = styled.div`
  font-size: var(--text-sm);
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
  }
`;

// Star Rating Components
const StarsContainer = styled.div`
  display: flex;
  gap: var(--space-sm);
  margin: var(--space-sm) 0;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: ${(props) => (props.$readonly ? "default" : "pointer")};
  color: var(--warning);
  font-size: var(--text-lg);
  transition: transform var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: ${(props) => (props.$readonly ? "none" : "scale(1.2)")};
  }
`;
