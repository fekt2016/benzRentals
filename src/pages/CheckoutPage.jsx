import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PATHS } from "../routes/routePaths";
import { formatDate } from "../utils/helper";
import UpdateDocumentsModal from "../components/Modal/UpdateDocumentsModal";
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiShield,
  FiMapPin,
  FiCalendar,
} from "react-icons/fi";
import { useMyDrivers } from "../hooks/useDriver";
import { useAddBookingDriver, useGetBookingById } from "../hooks/useBooking";
import { useStripePayment } from "../hooks/usePayment";

const paymentMethods = [{ id: "stripe", name: "Stripe", icon: FiCreditCard }];

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId } = location?.state || {};

  const { data: bookingResponse } = useGetBookingById(bookingId);
  const { data: myDrivers } = useMyDrivers();
  const { mutate: processStripePayment, isPending: isStripeProcessing } =
    useStripePayment();

  const drivers = useMemo(() => myDrivers?.data || [], [myDrivers]);

  const booking = useMemo(
    () => bookingResponse?.data?.data || {},
    [bookingResponse]
  );

  const { mutate: addBookingDriver } = useAddBookingDriver(booking?._id);

  const [showModal, setShowModal] = useState(false);

  // Calculate total price
  const totalDays = useMemo(() => {
    const pickup = new Date(booking?.pickupDate);
    const ret = new Date(booking?.returnDate);
    return Math.max(1, Math.ceil((ret - pickup) / (1000 * 60 * 60 * 24)));
  }, [booking?.pickupDate, booking?.returnDate]);

  const subtotal = totalDays * booking?.car?.pricePerDay;
  const tax = subtotal * 0.08;
  const totalPrice = subtotal + tax;

  // Determine if documents are verified
  const allVerified =
    booking?.driver?.insurance?.verified && booking?.driver?.license?.verified;

  // In your CheckoutPage component - update the handleStripePayment function
  const handleStripePayment = () => {
    if (!allVerified) {
      alert("Documents are pending verification. Cannot proceed to payment.");
      return;
    }

    const paymentData = {
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking?.car?.name || "Car Rental",
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${window.location.origin}${PATHS.CONFIRMATION}?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking?._id}`,
      cancel_url: `${window.location.origin}${PATHS.CHECKOUT}`,
      metadata: {
        booking_id: booking?._id,
        car_id: booking?.car?._id,
        total_days: totalDays,
        total_amount: totalPrice,
      },
    };

    // Debug log
    processStripePayment(paymentData, {
      onSuccess: (response) => {
        navigate(PATHS.CONFIRMATION, {
          state: {
            bookingId: booking._id,
            booking: booking, // Pass the entire booking object
            sessionId: response.id,
            totalPrice: totalPrice,
            totalDays: totalDays,
          },
        });
      },
    });
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateDocuments = (formData) => {
    try {
      if (formData instanceof FormData) {
        addBookingDriver(formData);
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <PageWrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft />
          Back
        </BackButton>
        <Title>Checkout</Title>
        <SecurityBadge>
          <FiShield />
          Secure Checkout
        </SecurityBadge>
      </Header>
      <ContentGrid>
        <SummarySection>
          <SectionHeader>
            <SectionTitle>Booking Summary</SectionTitle>
            <EditLink>Edit</EditLink>
          </SectionHeader>
          <CarCard>
            <CarImage
              src={booking?.car?.images[0] || "/default-car.jpg"}
              alt={booking?.car?.model}
            />
            <CarDetails>
              <CarName>{booking?.car?.name}</CarName>
              <CarSpecs>Automatic • 5 Seats • Premium</CarSpecs>
              <CarPrice>${booking?.car?.pricePerDay}/day</CarPrice>
            </CarDetails>
          </CarCard>
          <DetailsCard>
            <DetailItem>
              <DetailIcon>
                <FiCalendar />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Pickup Date</DetailLabel>
                <DetailValue>{formatDate(booking.pickupDate)}</DetailValue>
              </DetailContent>
            </DetailItem>

            <DetailItem>
              <DetailIcon>
                <FiCalendar />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Return Date</DetailLabel>
                <DetailValue>{formatDate(booking?.returnDate)}</DetailValue>
              </DetailContent>
            </DetailItem>

            <DetailItem>
              <DetailIcon>
                <FiClock />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Pickup Time</DetailLabel>
                <DetailValue>Assigned after payment</DetailValue>
              </DetailContent>
            </DetailItem>

            <DetailItem>
              <DetailIcon>
                <FiMapPin />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>Location</DetailLabel>
                <DetailValue>{booking.pickupLocation}</DetailValue>
              </DetailContent>
            </DetailItem>
          </DetailsCard>
          <PriceCard>
            <PriceTitle>Price Breakdown</PriceTitle>
            <PriceItem>
              <span>
                ${booking?.car?.pricePerDay} × {totalDays} days
              </span>
              <span>${subtotal.toFixed(2)}</span>
            </PriceItem>
            <PriceItem>
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </PriceItem>
            <Divider />
            <TotalPrice>
              <span>Total Amount</span>
              <span>${totalPrice.toFixed(2)}</span>
            </TotalPrice>
          </PriceCard>

          {/* Document Verification */}
          <DocumentsCard>
            <SectionTitle>Driver info</SectionTitle>
            {!booking?.driver && (
              <SecureBadge>Driver required to complete booking</SecureBadge>
            )}
            {booking?.driver && (
              <DocumentStatus verified={allVerified}>
                <StatusIcon verified={allVerified}>
                  {allVerified ? <FiCheck /> : <FiClock />}
                </StatusIcon>
                <StatusText>
                  <strong>
                    {allVerified
                      ? "All documents verified"
                      : "Pending verification"}
                  </strong>
                  <span>
                    {allVerified
                      ? "You're ready to book!"
                      : "Waiting for admin approval"}
                  </span>
                </StatusText>
              </DocumentStatus>
            )}
            {booking?.driver && (
              <DocumentsGrid>
                <DocumentItem verified={booking?.driver.insurance?.verified}>
                  <DocumentIcon>
                    <FiShield />
                  </DocumentIcon>
                  <DocumentInfo>
                    <DocumentName>Insurance</DocumentName>
                    <DocumentStatusText
                      verified={booking?.driver.insurance?.verified}
                    >
                      {booking?.driver.insurance?.verified
                        ? "Verified"
                        : "Pending"}
                    </DocumentStatusText>
                  </DocumentInfo>
                </DocumentItem>
                <DocumentItem verified={booking?.driver.license?.verified}>
                  <DocumentIcon>
                    <FiCreditCard />
                  </DocumentIcon>
                  <DocumentInfo>
                    <DocumentName>Driver License</DocumentName>
                    <DocumentStatusText
                      verified={booking?.driver.license?.verified}
                    >
                      {booking?.driver.license?.verified
                        ? "Verified"
                        : "Pending"}
                    </DocumentStatusText>
                  </DocumentInfo>
                </DocumentItem>
              </DocumentsGrid>
            )}
          </DocumentsCard>

          {!booking?.driver && (
            <>
              <SectionTitle>Driver documents</SectionTitle>
              <SubmitButton onClick={handleOpenModal}>upload</SubmitButton>
            </>
          )}
        </SummarySection>

        {/* Right Column - Payment Form */}
        <FormSection>
          <FormWrapper>
            <FormHeader>
              <SectionTitle>Payment Details</SectionTitle>
              <SecureBadge>
                <FiShield />
                256-bit SSL Secure
              </SecureBadge>
            </FormHeader>

            <PaymentMethodCard>
              <SectionSubtitle>Payment Method</SectionSubtitle>
              <PaymentGrid>
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <PaymentCard key={method.id} selected={true}>
                      <PaymentIcon>
                        <IconComponent />
                      </PaymentIcon>
                      <PaymentName>{method.name}</PaymentName>
                      <RadioDot selected={true} />
                    </PaymentCard>
                  );
                })}
              </PaymentGrid>
            </PaymentMethodCard>

            {/* Stripe Message */}
            <PaymentMessage>
              <p>
                You will be redirected to Stripe to complete your payment
                securely.
              </p>
              {isStripeProcessing && (
                <div style={{ marginTop: "10px", color: "#3b82f6" }}>
                  <FiClock /> Redirecting to Stripe...
                </div>
              )}
            </PaymentMessage>

            <PaymentDetailsCard>
              <SectionSubtitle>Payment Summary</SectionSubtitle>
              <PaymentSummary>
                <SummaryItem>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </SummaryItem>
                <SummaryItem>
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </SummaryItem>
                <SummaryDivider />
                <SummaryTotal>
                  <span>Total to pay</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </SummaryTotal>
              </PaymentSummary>
            </PaymentDetailsCard>

            <ActionCard>
              <SubmitButton
                type="button"
                onClick={handleStripePayment}
                disabled={!allVerified || isStripeProcessing}
                processing={isStripeProcessing}
              >
                {isStripeProcessing ? (
                  <LoadingSpinner>
                    <div></div>
                    <div></div>
                    <div></div>
                  </LoadingSpinner>
                ) : (
                  <>
                    <FiCreditCard />
                    Pay with Stripe
                  </>
                )}
                <Amount>${totalPrice.toFixed(2)}</Amount>
              </SubmitButton>

              {!allVerified && (
                <WarningMessage>
                  <FiClock />
                  Waiting for document verification to complete payment
                </WarningMessage>
              )}

              <SecurityNote>
                <FiShield />
                Your payment information is secure and encrypted
              </SecurityNote>
            </ActionCard>
          </FormWrapper>
        </FormSection>
      </ContentGrid>

      {showModal && (
        <UpdateDocumentsModal
          show={showModal}
          onClose={handleCloseModal}
          drivers={drivers}
          onSubmit={handleUpdateDocuments}
        />
      )}
    </PageWrapper>
  );
}

// Styled components (removed unused ones)
const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 1rem 0;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: #64748b;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateX(-2px);
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const EditLink = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const SectionSubtitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const CarCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #f1f5f9;
`;

const CarImage = styled.img`
  width: 100px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
`;

const CarDetails = styled.div`
  flex: 1;
`;

const CarName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #1e293b;
`;

const CarSpecs = styled.p`
  color: #64748b;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
`;

const CarPrice = styled.div`
  color: #3b82f6;
  font-weight: 600;
  font-size: 1.125rem;
`;

const DetailsCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #f1f5f9;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
`;

const DetailIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 600;
  color: #1e293b;
`;

const PriceCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #f1f5f9;
`;

const PriceTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1e293b;
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #64748b;
`;

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 1rem 0;
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  padding-top: 0.5rem;
`;

const DocumentsCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #f1f5f9;
`;

const DocumentStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${(props) => (props.verified ? "#f0fdf4" : "#fffbeb")};
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const StatusIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => (props.verified ? "#10b981" : "#f59e0b")};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusText = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    color: ${(props) => (props.verified ? "#10b981" : "#f59e0b")};
  }

  span {
    font-size: 0.875rem;
    color: #64748b;
  }
`;

const DocumentsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid ${(props) => (props.verified ? "#10b981" : "#f59e0b")};
`;

const DocumentIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.25rem;
`;

const DocumentInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DocumentName = styled.span`
  font-weight: 500;
  color: #1e293b;
`;

const DocumentStatusText = styled.span`
  color: ${(props) => (props.verified ? "#10b981" : "#f59e0b")};
  font-weight: 600;
  font-size: 0.875rem;
`;

const FormSection = styled.div`
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
  border: 1px solid #f1f5f9;
  position: sticky;
  top: 2rem;
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SecureBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
  font-size: 0.875rem;
  font-weight: 600;
`;

const PaymentMethodCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
`;

const PaymentGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const PaymentCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e2e8f0")};
  border-radius: 12px;
  background: ${(props) => (props.selected ? "#f0f9ff" : "white")};
`;

const PaymentIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
`;

const PaymentName = styled.span`
  flex: 1;
  font-weight: 500;
`;

const RadioDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#cbd5e1")};
  background: ${(props) => (props.selected ? "#3b82f6" : "transparent")};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
    display: ${(props) => (props.selected ? "block" : "none")};
  }
`;

const PaymentDetailsCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
`;

const PaymentSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  color: #64748b;
`;

const SummaryDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
`;

const ActionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 2rem;
  border-radius: 16px;
  background: ${(props) => (props.processing ? "#9ca3af" : "#3b82f6")};
  color: white;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border: none;
  font-size: 1.125rem;
  transition: all 0.2s;
  position: relative;

  &:hover:not(:disabled) {
    background: ${(props) => (props.processing ? "#9ca3af" : "#2563eb")};
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 10px 25px -5px rgb(59 130 246 / 0.5)"};
  }

  &:disabled {
    background: #9ca3af;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  gap: 4px;

  div {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }

    @keyframes bounce {
      0%,
      80%,
      100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }
  }
`;

const Amount = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`;

const WarningMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fffbeb;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  color: #f59e0b;
  font-weight: 500;
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  color: #64748b;
  font-size: 0.875rem;
`;

const PaymentMessage = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  color: #0369a1;

  p {
    margin: 0;
    font-weight: 500;
  }
`;
