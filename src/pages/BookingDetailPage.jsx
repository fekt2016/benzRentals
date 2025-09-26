// src/pages/BookingDetailPage.jsx
import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGetBookingById } from "../hooks/useBooking";
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

import { useUpdateUserBooking } from "../hooks/useBooking";

const BookingDetailPage = () => {
  const { bookingId } = useParams();

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
          <BackButton onClick={() => navigate("/check-bookings")}>
            <FaArrowLeft />
            Back to My Bookings
          </BackButton>
        </ErrorState>
      </PageWrapper>
    );
  }

  const getStatusConfig = (status) => {
    const config = {
      confirmed: {
        color: "#10b981",
        bgColor: "#d1fae5",
        icon: FaCheckCircle,
        label: "Confirmed",
      },
      completed: {
        color: "#3b82f6",
        bgColor: "#dbeafe",
        icon: FaCheckCircle,
        label: "Completed",
      },
      cancelled: {
        color: "#ef4444",
        bgColor: "#fee2e2",
        icon: FaClock,
        label: "Cancelled",
      },
      pending: {
        color: "#f59e0b",
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
        <BackButton onClick={() => navigate("/check-bookings")}>
          <FaArrowLeft />
          Back to Bookings
        </BackButton>
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
                        // disabled={isUploading}
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
                      {/* {driverLicenseFile && (
                      <UploadAction>
                        <UploadButton
                          onClick={() =>
                            handleFileUpload("driverLicense", driverLicenseFile)
                          }
                          disabled={isUploading}
                        >
                          {isUploading ? "Uploading..." : "Upload License"}
                        </UploadButton>
                        <CancelUpload
                          onClick={() => setDriverLicenseFile(null)}
                        >
                          <FaTimes />
                        </CancelUpload>
                      </UploadAction>
                    )} */}
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
                        // disabled={isUploading}
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
                          <UploadButton
                          // onClick={() => handleFileUpload()}
                          // disabled={isUploading}
                          >
                            {/* {isUploading ? "Uploading..." : "Upload"} */}
                            upload
                          </UploadButton>
                          {/* <CancelUpload onClick={() => setInsuranceFile(null)}>
                        <FaTimes />
                      </CancelUpload> */}
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
                    <PaymentButton onClick={handleProceedToPayment}>
                      <FaShoppingCart />
                      Proceed to Payment
                    </PaymentButton>
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
        <SecondaryButton onClick={() => navigate("/check-bookings")}>
          <FaArrowLeft />
          Back to My Bookings
        </SecondaryButton>
        <PrimaryButton onClick={() => window.print()}>
          Print Booking Details
        </PrimaryButton>
      </ActionSection>
    </PageWrapper>
  );
};

export default BookingDetailPage;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 0;
`;

const Header = styled.div`
  background: white;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const BookingId = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0;
  font-family: "Courier New", monospace;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  border-radius: 20px;
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  max-width: 400px;
  margin: 0 auto;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    order: -1;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 0;
`;

const CardTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;
const Form = styled.form`
  /* display: flex;
  flex-direction: column;
  gap: 1rem; */
`;
const CarInfo = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const CarImage = styled.img`
  width: 200px;
  height: 120px;
  border-radius: 8px;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const CarSpecs = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
`;

const CarFeatures = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
`;

const DetailGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

const DetailIcon = styled.div`
  color: #3b82f6;
  padding: 0.5rem;
  background: #eff6ff;
  border-radius: 8px;
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
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
`;

// New Verified Documents Styles
const VerifiedDocumentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const VerifiedDocumentItem = styled.div`
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 8px;
  padding: 1rem;
`;

const DocumentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
`;

const DocumentIconWrapper = styled.div`
  color: #059669;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #d1fae5;
  border-radius: 8px;
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #059669;
  font-weight: 500;
`;

const VerificationDetails = styled.div`
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
`;

const VerificationDetail = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: #374151;
  }
`;

const VerificationNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 1rem;
`;

// Existing styles remain the same...
const DocumentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DocumentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
`;

// ... (rest of the existing styles remain exactly the same)

const UploadSection = styled.div`
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px dashed #e2e8f0;
`;

const UploadTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
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
  background: white;

  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
  }

  ${(props) =>
    props.disabled &&
    `
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      border-color: #d1d5db;
      background: white;
    }
  `}
`;

const UploadIcon = styled.div`
  color: #6b7280;
  font-size: 1.5rem;
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

const UploadAction = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  align-items: center;
`;

const UploadButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: #10b981;
  color: white;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  flex: 1;

  &:hover:not(:disabled) {
    background: #059669;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const CancelUpload = styled.button`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
`;

const PriceBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 2px solid #e2e8f0;
  font-weight: 700;
  font-size: 1.125rem;
  color: #1e293b;
`;

const PaymentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PaymentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PaymentStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${(props) => (props.paid ? "#d1fae5" : "#fef3c7")};
  color: ${(props) => (props.paid ? "#065f46" : "#92400e")};
`;

const PaymentButtonContainer = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const PaymentButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const PaymentHelpText = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  text-align: center;
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
`;

const PaymentMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-top: 1rem;
  background: ${(props) => (props.success ? "#d1fae5" : "#eff6ff")};
  color: ${(props) => (props.success ? "#065f46" : "#374151")};
  border-left: 4px solid ${(props) => (props.success ? "#10b981" : "#3b82f6")};
`;

const InfoIcon = styled.span`
  font-size: 1rem;
`;

const ActionSection = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 2rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1.5rem;
  }
`;

const PrimaryButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const SecondaryButton = styled.button`
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;
const DocumentStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${(props) => (props.paid ? "#d1fae5" : "#fef3c7")};
  color: ${(props) => (props.paid ? "#065f46" : "#92400e")};
`;
const DownloadButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;
