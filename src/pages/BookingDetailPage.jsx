// src/pages/BookingDetailPage.jsx
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGetBookingById } from "../hooks/useBooking";
import { useUpdateUserBooking } from "../hooks/useBooking";
import { ROUTE_CONFIG, PATHS } from "../routes/routePaths";
import usePageTitle from "../hooks/usePageTitle";

// Button Components
import {
  PrimaryButton,
  SecondaryButton,
  AccentButtonLink,
  GhostButton,
} from "../components/ui/Button";

// Icons
import {
  FaArrowLeft,
  FaCar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCreditCard,
  FaFilePdf,
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaCloudUploadAlt,
  FaTimes,
  FaShoppingCart,
  FaIdCard,
  FaShieldAlt,
} from "react-icons/fa";

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const seoConfig = ROUTE_CONFIG[PATHS.BOOKING];

  // Use the custom SEO hook
  usePageTitle(
    `Booking #${bookingId?.slice(-8).toUpperCase()} - Mercedes Rentals`,
    seoConfig.description
  );

  const { data: bookingData } = useGetBookingById(bookingId);
  const { mutate: updateUserBooking } = useUpdateUserBooking(bookingId);

  const booking = useMemo(() => bookingData?.data?.data || null, [bookingData]);
  const navigate = useNavigate();

  // State for file uploads
  const [driverLicenseFile, setDriverLicenseFile] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);

  if (!booking) {
    return (
      <PageWrapper>
        <ErrorState>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Booking Not Found</ErrorTitle>
          <ErrorText>The booking you're looking for doesn't exist.</ErrorText>
          <SecondaryButton
            onClick={() => navigate("/check-bookings")}
            $size="lg"
          >
            <FaArrowLeft />
            Back to My Bookings
          </SecondaryButton>
        </ErrorState>
      </PageWrapper>
    );
  }

  const getStatusConfig = (status) => {
    const config = {
      confirmed: {
        color: "var(--success)",
        bgColor: "#d1fae5",
        icon: FaCheckCircle,
        label: "Confirmed",
      },
      completed: {
        color: "var(--info)",
        bgColor: "#dbeafe",
        icon: FaCheckCircle,
        label: "Completed",
      },
      cancelled: {
        color: "var(--error)",
        bgColor: "#fee2e2",
        icon: FaClock,
        label: "Cancelled",
      },
      pending: {
        color: "var(--warning)",
        bgColor: "#fef3c7",
        icon: FaClock,
        label: "Pending",
      },
    };
    return config[status?.toLowerCase()] || config.pending;
  };

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDuration = () => {
    const pickup = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);
    const diffTime = Math.abs(returnDate - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleDownloadDocument = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("driverLicense", driverLicenseFile);
      formData.append("insurance", insuranceFile);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      updateUserBooking(formData);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    }
  };

  const handleProceedToPayment = () => {
    const checkoutData = {
      _id: booking._id,
      car: {
        model: booking.car?.model,
        image: booking.car?.images?.[0],
        pricePerDay: booking.car?.pricePerDay,
      },
      pickupDate: booking.pickupDate,
      returnDate: booking.returnDate,
      pickupLocation: booking.pickupLocation,
      totalPrice: booking.totalPrice,
      user: booking.user,
      driverLicense: booking.driverLicenses,
      insurance: booking.insurance,
    };

    navigate("/checkout", { state: { checkoutData } });
  };

  const hasDriverLicense = !!booking.driver?.license?.fileUrl;
  const hasInsurance = !!booking.driver?.insurance?.fileUrl;

  // Check if documents are verified and payment is not completed
  const areDocumentsVerified = booking?.driver?.verified;
  const isPaymentPending = booking.paymentStatus !== "paid";
  const showPaymentButton = areDocumentsVerified && isPaymentPending;

  // Get verified documents for display
  const verifiedDocuments = [
    ...(booking.driverLicenses?.verified
      ? [
          {
            type: "driverLicense",
            name: "Driver's License",
            icon: FaIdCard,
            verified: true,
            documentUrl: booking.driverLicenses?.documentUrl,
            verifiedAt: booking.driverLicenses?.verifiedAt,
            verifiedBy: booking.driverLicenses?.verifiedBy,
          },
        ]
      : []),
    ...(booking.insurance?.verified
      ? [
          {
            type: "insurance",
            name: "Insurance Document",
            icon: FaShieldAlt,
            verified: true,
            documentUrl: booking.insurance?.documentUrl,
            verifiedAt: booking.insurance?.verifiedAt,
            verifiedBy: booking.insurance?.verifiedBy,
          },
        ]
      : []),
  ];

  return (
    <PageWrapper>
      <Header>
        <SecondaryButton onClick={() => navigate("/check-bookings")} $size="sm">
          <FaArrowLeft />
          Back to Bookings
        </SecondaryButton>
        <HeaderContent>
          <Title>Booking Details</Title>
          <BookingId># {booking._id?.slice(-8).toUpperCase()}</BookingId>
        </HeaderContent>
        <StatusBadge color={statusConfig.color} bgColor={statusConfig.bgColor}>
          <StatusIcon />
          {statusConfig.label}
        </StatusBadge>
      </Header>

      <ContentGrid>
        {/* Left Column - Main Details */}
        <MainSection>
          {/* Car Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaCar />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CarInfo>
                <CarImage
                  src={booking.car?.images?.[0] || "/default-car.jpg"}
                  alt={booking.car?.model}
                />
                <CarDetails>
                  <CarModel>{booking.car?.model}</CarModel>
                  <CarSpecs>Automatic • 5 Seats • Premium</CarSpecs>
                  <CarFeatures>Air Conditioning • GPS • Bluetooth</CarFeatures>
                </CarDetails>
              </CarInfo>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaCalendarAlt />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DetailGrid>
                <DetailItem>
                  <DetailIcon>
                    <FaCalendarAlt />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Pickup Date</DetailLabel>
                    <DetailValue>{formatDate(booking.pickupDate)}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FaCalendarAlt />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Return Date</DetailLabel>
                    <DetailValue>{formatDate(booking.returnDate)}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FaMapMarkerAlt />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Pickup Location</DetailLabel>
                    <DetailValue>{booking.pickupLocation}</DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FaClock />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Duration</DetailLabel>
                    <DetailValue>{calculateDuration()} days</DetailValue>
                  </DetailContent>
                </DetailItem>
              </DetailGrid>
            </CardContent>
          </Card>

          {/* Verified Documents Section */}
          {verifiedDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <FaCheckCircle />
                  Verified Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VerifiedDocumentsList>
                  {verifiedDocuments.map((doc, index) => {
                    const DocumentIcon = doc.icon;
                    return (
                      <VerifiedDocumentItem key={index}>
                        <DocumentHeader>
                          <DocumentIconWrapper>
                            <DocumentIcon />
                          </DocumentIconWrapper>
                          <DocumentInfo>
                            <DocumentName>{doc.name}</DocumentName>
                            <VerifiedBadge>
                              <FaCheckCircle />
                              Verified
                            </VerifiedBadge>
                          </DocumentInfo>
                          <DownloadButton
                            onClick={() =>
                              handleDownloadDocument(doc.documentUrl)
                            }
                            title={`Download ${doc.name}`}
                            $size="sm"
                          >
                            <FaDownload />
                          </DownloadButton>
                        </DocumentHeader>

                        {/* Verification Details */}
                        <VerificationDetails>
                          <VerificationDetail>
                            <strong>Verified on:</strong>{" "}
                            {doc.verifiedAt
                              ? formatDate(doc.verifiedAt)
                              : "Recently"}
                          </VerificationDetail>
                          {doc.verifiedBy && (
                            <VerificationDetail>
                              <strong>Verified by:</strong> {doc.verifiedBy}
                            </VerificationDetail>
                          )}
                        </VerificationDetails>
                      </VerifiedDocumentItem>
                    );
                  })}
                </VerifiedDocumentsList>

                <VerificationNote>
                  <FaCheckCircle />
                  All required documents have been verified and approved.
                </VerificationNote>
              </CardContent>
            </Card>
          )}
        </MainSection>

        {/* Right Column - Sidebar */}
        <Sidebar>
          {/* Documents Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaFilePdf />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form
                encType="multipart/form-data"
                noValidate
                onSubmit={handleFileUpload}
              >
                <DocumentsList>
                  {/* Driver's License Section */}
                  {hasDriverLicense ? (
                    <DocumentItem>
                      <DocumentInfo>
                        <DocumentName>Driver's License</DocumentName>
                        <DocumentStatus verified={booking.driver.verified}>
                          {booking.driver.verified
                            ? "Verified"
                            : "Pending Verification"}
                        </DocumentStatus>
                      </DocumentInfo>
                      <DownloadButton
                        onClick={() =>
                          handleDownloadDocument(
                            booking.driver.license?.fileUrl
                          )
                        }
                        $size="sm"
                      >
                        <FaDownload />
                      </DownloadButton>
                    </DocumentItem>
                  ) : (
                    <UploadSection>
                      <UploadTitle>Upload Driver's License</UploadTitle>
                      <FileInput
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          setDriverLicenseFile(e.target.files[0])
                        }
                        id="driver-license-upload"
                      />
                      <FileLabel htmlFor="driver-license-upload">
                        <UploadIcon>
                          <FaCloudUploadAlt />
                        </UploadIcon>
                        <div>
                          <div>Choose license file</div>
                          <FileHint>PNG, JPG, or PDF (max 5MB)</FileHint>
                        </div>
                        {driverLicenseFile && (
                          <FileName>{driverLicenseFile.name}</FileName>
                        )}
                      </FileLabel>
                    </UploadSection>
                  )}

                  {/* Insurance Section */}
                  {hasInsurance ? (
                    <DocumentItem>
                      <DocumentInfo>
                        <DocumentName>Insurance Document</DocumentName>
                        <DocumentStatus verified={booking.insurance?.verified}>
                          {booking.insurance?.verified
                            ? "Verified"
                            : "Pending Verification"}
                        </DocumentStatus>
                      </DocumentInfo>
                      <DownloadButton
                        onClick={() =>
                          handleDownloadDocument(booking.insurance?.documentUrl)
                        }
                        $size="sm"
                      >
                        <FaDownload />
                      </DownloadButton>
                    </DocumentItem>
                  ) : (
                    <UploadSection>
                      <UploadTitle>Upload Insurance Document</UploadTitle>
                      <FileInput
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setInsuranceFile(e.target.files[0])}
                        id="insurance-upload"
                      />
                      <FileLabel htmlFor="insurance-upload">
                        <UploadIcon>
                          <FaCloudUploadAlt />
                        </UploadIcon>
                        <div>
                          <div>Choose insurance file</div>
                          <FileHint>PNG, JPG, or PDF (max 5MB)</FileHint>
                        </div>
                        {insuranceFile && (
                          <FileName>{insuranceFile.name}</FileName>
                        )}
                      </FileLabel>
                      {driverLicenseFile && insuranceFile && (
                        <UploadAction>
                          <PrimaryButton type="submit" $size="sm">
                            Upload Documents
                          </PrimaryButton>
                          <GhostButton
                            onClick={() => {
                              setDriverLicenseFile(null);
                              setInsuranceFile(null);
                            }}
                            $size="sm"
                          >
                            <FaTimes />
                          </GhostButton>
                        </UploadAction>
                      )}
                    </UploadSection>
                  )}
                </DocumentsList>
              </Form>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaDollarSign />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PriceBreakdown>
                <PriceItem>
                  <span>
                    ${booking.car?.pricePerDay || 0} × {calculateDuration()}{" "}
                    days
                  </span>
                  <span>${booking.totalPrice}</span>
                </PriceItem>
                <PriceItem>
                  <span>Tax (8%)</span>
                  <span>${(booking.totalPrice * 0.08).toFixed(2)}</span>
                </PriceItem>
                <TotalPrice>
                  <span>Total Amount</span>
                  <span>
                    $
                    {(booking.totalPrice + booking.totalPrice * 0.08).toFixed(
                      2
                    )}
                  </span>
                </TotalPrice>
              </PriceBreakdown>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaCreditCard />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentInfo>
                <PaymentItem>
                  <span>Payment Method:</span>
                  <span>{booking.paymentMethod || "Credit Card"}</span>
                </PaymentItem>
                <PaymentItem>
                  <span>Payment Status:</span>
                  <PaymentStatus paid={booking.paymentStatus === "paid"}>
                    {booking.paymentStatus === "paid" ? "Paid" : "Pending"}
                  </PaymentStatus>
                </PaymentItem>
                <PaymentItem>
                  <span>Paid Amount:</span>
                  <span>${booking.totalPrice}</span>
                </PaymentItem>

                {/* Payment Button - Only show when documents are verified but payment is pending */}
                {showPaymentButton && (
                  <PaymentButtonContainer>
                    <AccentButtonLink
                      onClick={handleProceedToPayment}
                      $size="lg"
                    >
                      <FaShoppingCart />
                      Proceed to Payment
                    </AccentButtonLink>
                    <PaymentHelpText>
                      Your documents have been verified. Complete payment to
                      confirm your booking.
                    </PaymentHelpText>
                  </PaymentButtonContainer>
                )}

                {/* Message when documents are not verified */}
                {isPaymentPending && !areDocumentsVerified && (
                  <PaymentMessage>
                    <InfoIcon>ℹ️</InfoIcon>
                    Complete document verification to proceed with payment.
                  </PaymentMessage>
                )}

                {/* Message when payment is already completed */}
                {!isPaymentPending && (
                  <PaymentMessage success>
                    <FaCheckCircle />
                    Payment completed. Your booking is confirmed.
                  </PaymentMessage>
                )}
              </PaymentInfo>
            </CardContent>
          </Card>
        </Sidebar>
      </ContentGrid>

      {/* Action Buttons */}
      <ActionSection>
        <SecondaryButton onClick={() => navigate("/check-bookings")} $size="lg">
          <FaArrowLeft />
          Back to My Bookings
        </SecondaryButton>
        <PrimaryButton onClick={() => window.print()} $size="lg">
          Print Booking Details
        </PrimaryButton>
      </ActionSection>
    </PageWrapper>
  );
};

export default BookingDetailPage;

// Styled Components - Updated to use global CSS variables
const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--background);
  padding: 0;
`;

const Header = styled.div`
  background: var(--white);
  padding: var(--space-xl);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-lg);
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-family: var(--font-heading);

  @media (max-width: 768px) {
    font-size: var(--text-4xl);
  }
`;

const BookingId = styled.p`
  color: var(--text-muted);
  font-size: var(--text-base);
  margin: 0;
  font-family: "Courier New", monospace;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  text-transform: capitalize;
  white-space: nowrap;
  font-family: var(--font-body);
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-2xl) var(--space-lg);
  max-width: 400px;
  margin: 0 auto;
  min-height: 400px;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: var(--space-lg);
`;

const ErrorTitle = styled.h2`
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
`;

const ErrorText = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
  font-family: var(--font-body);
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-lg);
  padding: var(--space-lg);
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
    padding: var(--space-md);
  }

  @media (max-width: 768px) {
    padding: var(--space-md);
    gap: var(--space-md);
  }
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);

  @media (max-width: 1024px) {
    order: -1;
  }
`;

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: 1px solid var(--gray-200);
`;

const CardHeader = styled.div`
  padding: var(--space-lg) var(--space-lg) 0;
`;

const CardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const CardContent = styled.div`
  padding: var(--space-lg);
`;

const Form = styled.form``;

const CarInfo = styled.div`
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const CarImage = styled.img`
  width: 200px;
  height: 120px;
  border-radius: var(--radius-lg);
  object-fit: cover;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
`;

const CarDetails = styled.div`
  flex: 1;
`;

const CarModel = styled.h3`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-family: var(--font-heading);
`;

const CarSpecs = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-base);
  margin: 0 0 var(--space-sm) 0;
  font-family: var(--font-body);
`;

const CarFeatures = styled.p`
  color: var(--text-light);
  font-size: var(--text-sm);
  margin: 0;
  font-family: var(--font-body);
`;

const DetailGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
`;

const DetailIcon = styled.div`
  color: var(--primary);
  padding: var(--space-sm);
  background: rgba(211, 47, 47, 0.1);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);
`;

const DetailValue = styled.div`
  font-size: var(--text-base);
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

// New Verified Documents Styles
const VerifiedDocumentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const VerifiedDocumentItem = styled.div`
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
`;

const DocumentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-sm);
`;

const DocumentIconWrapper = styled.div`
  color: var(--success);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #d1fae5;
  border-radius: var(--radius-lg);
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentName = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--success);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const VerificationDetails = styled.div`
  background: var(--white);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-200);
`;

const VerificationDetail = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: var(--text-primary);
  }
`;

const VerificationNote = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background: #d1fae5;
  color: #065f46;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-top: var(--space-lg);
  font-family: var(--font-body);
`;

const DocumentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const DocumentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  background: var(--surface);
  border-radius: var(--radius-lg);
`;

const UploadSection = styled.div`
  padding: var(--space-lg);
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--gray-300);
`;

const UploadTitle = styled.h4`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-md) 0;
  font-family: var(--font-body);
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  border: 2px dashed var(--gray-400);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  background: var(--white);

  &:hover {
    border-color: var(--primary);
    background: rgba(211, 47, 47, 0.1);
  }
`;

const UploadIcon = styled.div`
  color: var(--text-muted);
  font-size: 1.5rem;
`;

const FileHint = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const FileName = styled.div`
  margin-left: auto;
  font-size: var(--text-sm);
  color: var(--success);
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

const UploadAction = styled.div`
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
  align-items: center;
`;

const DownloadButton = styled(PrimaryButton)`
  && {
    padding: var(--space-sm) var(--space-md);
    min-width: auto;
  }
`;

const PriceBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--gray-100);
  font-family: var(--font-body);

  &:last-child {
    border-bottom: none;
  }
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-sm);
  border-top: 2px solid var(--gray-200);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const PaymentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const PaymentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-body);
`;

const PaymentStatus = styled.span`
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  background: ${(props) => (props.paid ? "#d1fae5" : "#fef3c7")};
  color: ${(props) => (props.paid ? "#065f46" : "#92400e")};
  font-family: var(--font-body);
`;

const PaymentButtonContainer = styled.div`
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--gray-200);
`;

const PaymentHelpText = styled.p`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-align: center;
  margin: var(--space-sm) 0 0 0;
  line-height: 1.4;
  font-family: var(--font-body);
`;

const PaymentMessage = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  margin-top: var(--space-lg);
  background: ${(props) => (props.success ? "#d1fae5" : "#eff6ff")};
  color: ${(props) => (props.success ? "#065f46" : "#374151")};
  border-left: 4px solid
    ${(props) => (props.success ? "var(--success)" : "var(--info)")};
  font-family: var(--font-body);
`;

const InfoIcon = styled.span`
  font-size: 1rem;
`;

const ActionSection = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  padding: var(--space-lg);
  background: var(--white);
  border-top: 1px solid var(--gray-200);
  margin-top: var(--space-lg);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: var(--space-md);
  }
`;

const DocumentStatus = styled.span`
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  background: ${(props) => (props.verified ? "#d1fae5" : "#fef3c7")};
  color: ${(props) => (props.verified ? "#065f46" : "#92400e")};
  font-family: var(--font-body);
`;
