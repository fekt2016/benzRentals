import { useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useMyBookings } from "../hooks/useBooking";
import { useMyDrivers } from "../hooks/useDriver";
import UpdateDocumentsModal from "../components/Modal/UpdateDocumentsModal";
import ReviewModal from "../components/Modal/ReviewModal";
import { useUpdateUserBooking } from "../hooks/useBooking";
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

const BookingsPage = () => {
  const { data: BookingsData } = useMyBookings();
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
      confirmed: { color: "#10b981", icon: FaCheckCircle },
      completed: { color: "#3b82f6", icon: FaCheckCircle },
      cancelled: { color: "#ef4444", icon: FaClock },
      pending: { color: "#f59e0b", icon: FaClock },
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
            readonly={readonly}
          >
            {star <= rating ? <FaStar /> : <FaRegStar />}
          </StarButton>
        ))}
      </StarsContainer>
    );
  };

  if (!bookings.length) {
    return (
      <PageWrapper>
        <Header>
          <Title>My Bookings</Title>
        </Header>
        <EmptyState>
          <EmptyIcon>🚗</EmptyIcon>
          <EmptyTitle>No bookings yet</EmptyTitle>
          <EmptyText>Your upcoming car rentals will appear here</EmptyText>
          <CtaButton onClick={() => navigate("/cars")}>
            Browse Available Cars
          </CtaButton>
        </EmptyState>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Header>
        <Title>My Bookings</Title>
        <Subtitle>Manage your rental reservations</Subtitle>
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
                      <DocStatus verified={booking.driverLicense?.verified}>
                        {booking.driver
                          ? booking.driver?.verified
                            ? "Verified"
                            : "Pending verification"
                          : "provide License"}
                      </DocStatus>
                    </DocumentsCell>
                  </TableCell>

                  <TableCell>
                    <StatusCell>
                      <StatusBadge color={statusConfig.color}>
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
                        variant="secondary"
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
                <StatusBadge color={statusConfig.color}>
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
                    <MobileDocStatus verified={booking.driver?.verified}>
                      <FaFileAlt />
                      {booking.driver
                        ? booking.driver?.verified
                          ? "Verified"
                          : "Pending verification"
                        : "provide License"}
                      <StatusIndicator verified={booking.driver?.verified} />
                    </MobileDocStatus>
                  </DocumentStatusGroup>
                </DocumentsSection>

                {/* Review Section for Mobile */}
                <ReviewSection>
                  <SectionTitle>Review Status</SectionTitle>
                  {canReviewBooking(booking) ? (
                    <MobileReviewButton
                      onClick={() => setReviewingBooking(booking)}
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
                  variant="primary"
                >
                  <FaEye />
                  View Details
                </MobileButton>
                <MobileButton
                  onClick={() => setUpdatingBooking(booking._id)}
                  variant="secondary"
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

// New Styled Components for Review Features
const ReviewCell = styled.div`
  display: flex;
  justify-content: center;
`;

const ReviewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }
`;

const ReviewedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ReviewHint = styled.div`
  font-size: 0.7rem;
  color: #6b7280;
  text-align: center;
  font-style: italic;
`;

const ReviewSection = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const MobileReviewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }
`;

const ReviewHintMobile = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
`;

const StarsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: ${(props) => (props.readonly ? "default" : "pointer")};
  color: #fbbf24;
  font-size: 1.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: ${(props) => (props.readonly ? "none" : "scale(1.2)")};
  }
`;

const ReviewCarInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const ReviewForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

// Updated existing styled components to accommodate new review column
// const TableHeader = styled.th`
//   padding: 1rem;
//   text-align: left;
//   font-weight: 600;
//   color: #374151;
//   font-size: 0.875rem;
//   text-transform: uppercase;
//   letter-spacing: 0.05em;
//   border-bottom: 1px solid #e2e8f0;

//   /* Make review column a bit narrower */
//   &:nth-child(7) {
//     width: 120px;
//   }
// `;

// ... rest of your existing styled components remain the same

// Styled Components
const PageWrapper = styled.div`
  padding: 0;
  background: #f8fafc;
  min-height: 100vh;
`;

const Header = styled.div`
  background: white;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: #64748b;
  margin: 0 0 1rem 0;
  font-size: 1rem;
`;

const BookingsCount = styled.span`
  background: #e2e8f0;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  max-width: 400px;
  margin: 2rem auto;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
`;

const CtaButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

// Desktop Table Styles
const TableContainer = styled.div`
  background: white;
  margin: 0;
  padding: 2rem;
  display: block;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  background: #f8fafc;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;

  &:hover {
    background: #f8fafc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
`;

const VehicleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CarImage = styled.img`
  width: 60px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
`;

const VehicleInfo = styled.div`
  flex: 1;
`;

const CarModel = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const CarType = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const DateCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DateGroup = styled.div`
  font-size: 0.875rem;
  color: #374151;
`;

const LocationCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const PriceCell = styled.div`
  text-align: left;
`;

const TotalAmount = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
`;

const DocumentsCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DocStatus = styled.div`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: ${(props) => (props.verified ? "#d1fae5" : "#fef3c7")};
  color: ${(props) => (props.verified ? "#065f46" : "#92400e")};
  font-weight: 500;
  width: fit-content;
`;

const StatusCell = styled.div`
  text-align: left;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
  background: ${(props) => props.color}20;
  color: ${(props) => props.color};
  text-transform: capitalize;
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background: ${(props) =>
    props.variant === "secondary" ? "#f1f5f9" : "#3b82f6"};
  color: ${(props) => (props.variant === "secondary" ? "#374151" : "white")};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) =>
      props.variant === "secondary" ? "#e2e8f0" : "#2563eb"};
  }
`;

// Mobile Card Styles
const MobileContainer = styled.div`
  display: none;
  padding: 1rem;
  gap: 1rem;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const MobileCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardContent = styled.div`
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
`;

const DocumentsSection = styled.div`
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  color: #374151;
  margin: 0 0 0.75rem 0;
  font-weight: 600;
`;

const DocumentStatusGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MobileDocStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: ${(props) => (props.verified ? "#065f46" : "#92400e")};
  background: ${(props) => (props.verified ? "#d1fae5" : "#fef3c7")};
  border-radius: 6px;
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.verified ? "#10b981" : "#f59e0b")};
  margin-left: auto;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const MobileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: ${(props) =>
    props.variant === "primary" ? "none" : "1px solid #e2e8f0"};
  background: ${(props) => (props.variant === "primary" ? "#3b82f6" : "white")};
  color: ${(props) => (props.variant === "primary" ? "white" : "#374151")};
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  justify-content: center;

  &:hover {
    background: ${(props) =>
      props.variant === "primary" ? "#2563eb" : "#f8fafc"};
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
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
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;

  &:hover {
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const UploadSection = styled.div`
  margin-bottom: 1.5rem;
`;

const UploadLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }
`;

const UploadIcon = styled.div`
  color: #6b7280;
`;

const FileHint = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const FileName = styled.div`
  margin-left: auto;
  font-size: 0.875rem;
  color: #059669;
  font-weight: 600;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`;

const SubmitButton = styled.button`
  flex: 2;
  padding: 0.75rem 1.5rem;
  border: none;
  background: #10b981;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #059669;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;
