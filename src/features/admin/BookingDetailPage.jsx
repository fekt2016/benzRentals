import React, { useMemo } from "react";
import styled from "styled-components";
import {
  FaUser,
  FaCar,
  FaDollarSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaIdCard,
  FaArrowLeft,
  FaReceipt,
  FaFileInvoiceDollar,
  FaCog,
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useGetBookingById } from "../../hooks/useBooking";
import { PrimaryButton, GhostButton } from "../../components/ui/Button";
import { LuxuryCard } from "../../components/Cards/Card";
import { LoadingSpinner, ErrorState } from "../../components/ui/LoadingSpinner";
import { formatDate } from "../../utils/helper";
import { SectionHeader, SectionContent } from "../../components/ui/SectionCard";

const BookingDetailPage = () => {
  const { bookingId: id } = useParams();
  const navigate = useNavigate();
const [modalData, setModalData] = React.useState(null);
  const { data: bookingData, isLoading, error } = useGetBookingById(id);
  const booking = useMemo(() => bookingData?.data?.data || null, [bookingData]);

  if (isLoading)
    return (
      <Centered>
        <LoadingSpinner size="xl" />
      </Centered>
    );

  if (error || !booking)
    return (
      <Centered>
        <ErrorState
          title="Booking Not Found"
          message="Unable to load booking details. Please try again."
          action={<PrimaryButton onClick={() => navigate(-1)}>Go Back</PrimaryButton>}
        />
      </Centered>
    );

  return (
    <Container>
      {/* Header */}
      <PageHeader>
        <HeaderContent>
          <HeaderLeft>
            <GhostButton onClick={() => navigate(-1)}>
              <FaArrowLeft /> Back
            </GhostButton>
            <Title>Booking Details</Title>
          </HeaderLeft>
          <HeaderActions>
            <PrimaryButton>Edit Booking</PrimaryButton>
          </HeaderActions>
        </HeaderContent>
      </PageHeader>

      {/* Content */}
      <ContentGrid>
        {/* Booking Overview */}
        <LuxuryCard>
          <SectionContent>
            <CardTitle><FaCalendarAlt /> Booking Overview</CardTitle>
            <InfoGrid>
              <InfoItem><Label>ID</Label><Value>#BF-{booking._id.slice(-6).toUpperCase()}</Value></InfoItem>
              <InfoItem><Label>Status</Label><StatusPill data-status={booking.status}>{booking.status}</StatusPill></InfoItem>
              <InfoItem><Label>Payment Status</Label><StatusPill data-status={booking.paymentStatus}>{booking.paymentStatus}</StatusPill></InfoItem>
              <InfoItem><Label>Base Price</Label><PriceValue><FaDollarSign /> {booking.basePrice}</PriceValue></InfoItem>
              <InfoItem><Label>Total Price</Label><PriceValue><FaDollarSign /> {booking.totalPrice}</PriceValue></InfoItem>
              <InfoItem><Label>Deposit</Label><Value>${booking.depositAmount}</Value></InfoItem>
              <InfoItem><Label>Rental Days</Label><Value>{booking.rentalDays}</Value></InfoItem>
              <InfoItem><Label>Created</Label><Value>{formatDate(booking.createdAt)}</Value></InfoItem>
              <InfoItem><Label>Updated</Label><Value>{formatDate(booking.updatedAt)}</Value></InfoItem>
            </InfoGrid>
          </SectionContent>
        </LuxuryCard>

        {/* Customer Info */}
        <LuxuryCard>
          <SectionContent>
            <CardTitle><FaUser /> Customer Information</CardTitle>
            <InfoGrid>
              <InfoItem><Label>Name</Label><Value>{booking.user?.fullName}</Value></InfoItem>
              <InfoItem><Label>Email</Label><Value>{booking.user?.email}</Value></InfoItem>
              <InfoItem><Label>Phone</Label><Value>{booking.user?.phone}</Value></InfoItem>
            </InfoGrid>
          </SectionContent>
        </LuxuryCard>

        {/* Vehicle Info */}
        <LuxuryCard>
          <SectionContent>
            <CardTitle><FaCar /> Vehicle Information</CardTitle>
            <InfoGrid>
              <InfoItem><Label>Series</Label><Value>{booking.car?.series}</Value></InfoItem>
              <InfoItem><Label>Model</Label><Value>{booking.car?.model}</Value></InfoItem>
              <InfoItem><Label>Price Per Day</Label><Value>${booking.car?.pricePerDay}</Value></InfoItem>
              <InfoItem><Label>Start Mileage</Label><Value>{booking.startMileage} miles</Value></InfoItem>
            </InfoGrid>
          </SectionContent>
        </LuxuryCard>

        {/* Schedule */}
        <LuxuryCard>
          <SectionContent>
            <CardTitle><FaCalendarAlt /> Schedule & Location</CardTitle>
            <InfoGrid>
              <InfoItem><Label>Pickup Date</Label><Value>{formatDate(booking.pickupDate)}</Value></InfoItem>
              <InfoItem><Label>Pickup Time</Label><Value>{booking.pickupTime}</Value></InfoItem>
              <InfoItem><Label>Return Date</Label><Value>{formatDate(booking.returnDate)}</Value></InfoItem>
              <InfoItem><Label>Return Time</Label><Value>{booking.returnTime}</Value></InfoItem>
              <InfoItem><Label>Pickup Location</Label><Value><FaMapMarkerAlt /> {booking.pickupLocation}</Value></InfoItem>
              <InfoItem><Label>Return Location</Label><Value><FaMapMarkerAlt /> {booking.returnLocation}</Value></InfoItem>
              <InfoItem><Label>Time Zone</Label><Value>{booking.timeZone}</Value></InfoItem>
            </InfoGrid>
          </SectionContent>
        </LuxuryCard>

        {/* Payment Info */}
        <LuxuryCard>
          <SectionContent>
            <CardTitle><FaReceipt /> Payment & Charges</CardTitle>
            <InfoGrid>
              <InfoItem><Label>Payment Method</Label><Value>{booking.paymentMethod}</Value></InfoItem>
              <InfoItem><Label>Cleaning Fee</Label><Value>${booking.cleaningFee}</Value></InfoItem>
              <InfoItem><Label>Damage Fee</Label><Value>${booking.damageFee}</Value></InfoItem>
              <InfoItem><Label>Extra Charges</Label><Value>${booking.extraCharges}</Value></InfoItem>
              <InfoItem><Label>Tax</Label><Value>${booking.taxAmount}</Value></InfoItem>
              <InfoItem><Label>Stripe Session ID</Label><Value>{booking.stripeSessionId || "N/A"}</Value></InfoItem>
            </InfoGrid>
          </SectionContent>
        </LuxuryCard>

        {/* Rental Terms */}
        <LuxuryCard>
          <SectionContent>
            <CardTitle><FaFileInvoiceDollar /> Rental Terms</CardTitle>
            <InfoGrid>
               <InfoItem><Label>agreementSigned</Label><Value>{booking.rentalTerms?.agreementSigned ? "Yes" : "No"}</Value></InfoItem>
              <InfoItem><Label>Mileage Limit</Label><Value>{booking.rentalTerms?.mileageLimit} miles</Value></InfoItem>
              <InfoItem><Label>Fuel Policy</Label><Value>{booking.rentalTerms?.fuelPolicy}</Value></InfoItem>
              <InfoItem><Label>Cleaning Fee</Label><Value>${booking.rentalTerms?.cleaningFee}</Value></InfoItem>
              <InfoItem><Label>Late Return Fee</Label><Value>${booking.rentalTerms?.lateReturnFee}</Value></InfoItem>
              <InfoItem><Label>Damage Deposit</Label><Value>${booking.rentalTerms?.damageDeposit}</Value></InfoItem>
            </InfoGrid>
          </SectionContent>
        </LuxuryCard>

        {/* Driver Info */}
        <LuxuryCard>
          <SectionContent>
            <CardTitle><FaIdCard /> Driver Information</CardTitle>
            {booking.driver ? (
              <InfoGrid>
                <InfoItem><Label>Name</Label><Value>{booking.driver?.name}</Value></InfoItem>
                <InfoItem><Label>License Number</Label><Value>{booking.driver?.license?.number}</Value></InfoItem>
                <InfoItem><Label>Insurance Provider</Label><Value>{booking.driver?.insurance?.provider}</Value></InfoItem>
              </InfoGrid>
            ) : (
              <EmptyText>No driver assigned to this booking.</EmptyText>
            )}
          </SectionContent>
        </LuxuryCard>

       
<LuxuryCard>
  <SectionContent>
    <CardTitle><FaCog /> Check-In / Check-Out</CardTitle>
    <InfoGrid>
      {/* Check-In */}
      <InfoItem>
        <Label>Status</Label>
        <StatusPill data-status={booking.checkInData?.checkedInBy ? "confirmed" : "pending"}>
          {booking.checkInData?.checkedInBy ? "Checked In" : "Not Checked In"}
        </StatusPill>
      </InfoItem>
      <InfoItem><Label>Checked In By</Label><Value>{booking.checkInData?.checkedInBy || "N/A"}</Value></InfoItem>
      <InfoItem><Label>Check-In Notes</Label><Value>{booking.checkInData?.notes || "N/A"}</Value></InfoItem>

      {/* Show Images if Present */}
      {booking.checkInData?.checkInImages?.length > 0 && (
        <InfoItem>
          <Label>Check-In Photos</Label>
          <PrimaryButton
            $size="sm"
            onClick={() => setModalData({ type: "checkin", images: booking.checkInData.checkInImages })}
          >
            View Images ({booking.checkInData.checkInImages.length})
          </PrimaryButton>
        </InfoItem>
      )}

      {/* Check-Out */}
      <InfoItem>
        <Label>Checked Out</Label>
        <StatusPill data-status={booking.checkOutData?.checkedOutBy ? "confirmed" : "pending"}>
          {booking.checkOutData?.checkedOutBy ? "Checked Out" : "Not Checked Out"}
        </StatusPill>
      </InfoItem>
      <InfoItem><Label>Checked Out By</Label><Value>{booking.checkOutData?.checkedOutBy || "N/A"}</Value></InfoItem>
      <InfoItem><Label>Allowed Mileage</Label><Value>{booking.checkOutData?.allowedMileage || 0} miles</Value></InfoItem>
      <InfoItem><Label>Fuel Charge</Label><Value>${booking.checkOutData?.fuelCharge || 0}</Value></InfoItem>

      {/* Show Images if Present */}
      {booking.checkOutData?.checkInImages?.length > 0 && (
        <InfoItem>
          <Label>Check-Out Photos</Label>
          <PrimaryButton
            $size="sm"
            onClick={() => setModalData({ type: "checkout", images: booking.checkOutData.images })}
          >
            View Images ({booking.checkOutData.images.length})
          </PrimaryButton>
        </InfoItem>
      )}
    </InfoGrid>
  </SectionContent>
</LuxuryCard>


      </ContentGrid>
      {/* Image Modal */}
{modalData && (
  <ModalOverlay onClick={() => setModalData(null)}>
    <ModalContent onClick={(e) => e.stopPropagation()}>
      <ModalHeader>
        <h3>{modalData.type === "checkin" ? "Check-In Images" : "Check-Out Images"}</h3>
        <CloseButton onClick={() => setModalData(null)}>×</CloseButton>
      </ModalHeader>
      <ImageGrid>
        {modalData.images.map((img, idx) => (
          <ImageWrapper key={idx}>
            <img src={img} alt={`inspection-${idx}`} />
          </ImageWrapper>
        ))}
      </ImageGrid>
    </ModalContent>
  </ModalOverlay>
)}

    </Container>
  );
};

export default BookingDetailPage;


const Container = styled.div`
  padding: var(--space-xl);
  background: var(--surface);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const PageHeader = styled(SectionHeader)`
  background: var(--white);
  border-radius: var(--radius-2xl);
  padding: var(--space-xl);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--space-md);
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-xl);
`;

const CardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-lg);
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const Label = styled.span`
  color: var(--text-muted);
  font-size: var(--text-xs);
  text-transform: uppercase;
  font-weight: var(--font-medium);
`;

const Value = styled.span`
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
`;

const PriceValue = styled(Value)`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--primary);
`;

const StatusPill = styled.span`
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  &[data-status="confirmed"] { background: #d1fae5; color: #065f46; }
  &[data-status="pending"] { background: #fef3c7; color: #92400e; }
  &[data-status="cancelled"] { background: #fee2e2; color: #991b1b; }
  &[data-status="completed"] { background: #e0e7ff; color: #3730a3; }
  &[data-status="unpaid"] { background: #fff7ed; color: #92400e; }
`;

const EmptyText = styled.p`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-style: italic;
  text-align: center;
`;
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--space-lg);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);

  h3 {
    margin: 0;
    font-size: var(--text-xl);
    color: var(--text-primary);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: var(--text-2xl);
  color: var(--text-muted);
  cursor: pointer;

  &:hover {
    color: var(--error);
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-md);
`;

const ImageWrapper = styled.div`
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;
