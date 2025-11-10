/* eslint-disable react/react-in-jsx-scope */

import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  useGetBookingById,
  useUpdateUserBooking,
  useCancelBooking,
  useCheckInBooking,
  useCheckOutBooking,
} from "../bookings/useBooking";
import { ROUTE_CONFIG, PATHS } from "../../config/constants";
import usePageTitle from "../../app/hooks/usePageTitle";
import { formatDate, formatTime } from '../../utils/helper';
import ErrorState from "../../components/feedback/ErrorState";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import ModalWrapper from "../../components/ui/Modal";
import StatusBadgeComponent from "../../components/ui/StatusBadge";
import DriverDocumentModal from "../../features/drivers/DriverDocument";


import {
  PrimaryButton,
  SecondaryButton,
  AccentButton,
  SuccessButton,
  DangerButton,
} from "../../components/ui/Button";

// Import Modals
import ReviewModal from "../../components/ui/ReviewModal";
import CheckInModal from "../../components/ui/CheckInModal";
import CheckOutModal from "../../components/ui/CheckOutModal";

// Icons
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCreditCard,
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaCloudUploadAlt,
  FaTimes,
  FaShoppingCart,
  FaIdCard,
  FaShieldAlt,
  FaExclamationTriangle,
  FaGasPump,
  FaCog,
  FaUsers,
  FaPalette,
  FaBan,
  FaStar,
  FaUndo,
  FaRedo,
  FaSearch,
} from "react-icons/fa";

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const seoConfig = ROUTE_CONFIG[PATHS.BOOKING_DETAIL];
  const navigate = useNavigate();

  usePageTitle(
    `Booking #${bookingId?.slice(-8).toUpperCase()} - Mercedes Rentals`,
    seoConfig.description
  );

  const { 
    data: bookingData, 
    error: bookingError, 
    isLoading: isBookingLoading,
    refetch 
  } = useGetBookingById(bookingId);
  
  
  const { mutate: updateUserBooking } = useUpdateUserBooking(bookingId);
  const { mutate: cancelBooking, isLoading: isCancelling } = useCancelBooking();
  const { mutate: checkInBooking, isLoading: isCheckingIn } = useCheckInBooking();
  const { mutate: checkOutBooking, isLoading: isCheckingOut } = useCheckOutBooking();

  const booking = useMemo(() => bookingData?.data?.data || null, [bookingData]);
  console.log(booking)
  // State for modals
  const [timeLeft, setTimeLeft] = useState({});
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDriverDocumentModal, setShowDriverDocumentModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState(new Set());

  const currentError = bookingError;

  // Countdown timer
  useEffect(() => {
    if (!booking?.pickupDate) {
      setTimeLeft({});
      return;
    }

    const pickupDate = new Date(booking.pickupDate);
    const now = new Date();
    const difference = pickupDate - now;

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    } else {
      setTimeLeft({});
    }
  }, [booking?.pickupDate]);

  // Handler functions
  const handleCheckInSubmit = (formData) => {
    if (!booking) return;

    checkInBooking(
      {
        bookingId: booking._id,
        ...formData,
      },
      {
        onSuccess: () => {
          setShowCheckInModal(false);
          refetch();
        },
        onError: (error) => {
          console.error("Check-in failed:", error);
        },
      }
    );
  };

  const handleCheckOutSubmit = (formData) => {
    if (!booking) return;

    checkOutBooking(
      {
        bookingId: booking._id,
        ...formData,
      },
      {
        onSuccess: () => {
          setShowCheckOutModal(false);
          refetch();
        },
        onError: (error) => {
          console.error("Check-out failed:", error);
        },
      }
    );
  };

  const handleCancelBooking = () => {
    if (!booking) return;

    cancelBooking(
      {
        bookingId: booking._id,
        reason: cancellationReason || "No reason provided",
      },
      {
        onSuccess: () => {
          setShowCancelModal(false);
          setCancellationReason("");
          refetch();
        },
        onError: (error) => {
          console.error("Cancellation failed:", error);
        },
      }
    );
  };

  const handleReviewSuccess = () => {
    if (!booking?._id) return;
    
    setSubmittedReviews((prev) => {
      const newSet = new Set(prev);
      newSet.add(booking._id);
      return newSet;
    });
    setShowReviewModal(false);
    setTimeout(() => {
      refetch();
    }, 500);
  };

  const handleDocumentUpload = (formData) => {
 updateUserBooking(formData, {
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        console.error("Document upload failed:", error);
        throw new Error("Upload failed");
      }
    });
  };

  const handleProceedToPayment = () => {
   
    if (!booking?._id) {
      console.error("No booking ID available");
      return;
    }
    
    navigate(PATHS.CHECKOUT, { 
      state: { 
        bookingId: booking._id 
      } 
    });
  };

  const handleDownloadDocument = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, "_blank");
    }
  };

  // Helper functions
  const getStatusConfig = (status) => {
    const config = {
      confirmed: {
        color: "var(--success)",
        bgColor: "#d1fae5",
        icon: FaCheckCircle,
        label: "Confirmed",
        canCancel: true,
        animated: false
      },
      completed: {
        color: "var(--info)",
        bgColor: "#dbeafe",
        icon: FaCheckCircle,
        label: "Completed",
        canCancel: false,
        animated: false
      },
      cancelled: {
        color: "var(--error)",
        bgColor: "#fee2e2",
        icon: FaTimes,
        label: "Cancelled",
        canCancel: false,
        animated: false
      },
      pending: {
        color: "var(--warning)",
        bgColor: "#fef3c7",
        icon: FaClock,
        label: "Pending",
        canCancel: true,
        animated: false
      },
      active: {
        color: "var(--success)",
        bgColor: "#d1fae5",
        icon: FaCheckCircle,
        label: "Active",
        canCancel: false,
        animated: true
      },
      in_progress: {
        color: "var(--primary)",
        bgColor: "#e0f2fe",
        icon: FaClock,
        label: "In Progress",
        canCancel: false,
        animated: true
      },
      verification_pending: {
        color: "var(--warning)",
        bgColor: "#fef3c7",
        icon: FaClock,
        label: "Verification Pending",
        canCancel: true,
        animated: true
      },
      license_required: {
        color: "var(--warning)",
        bgColor: "#fef3c7",
        icon: FaExclamationTriangle,
        label: "License Required",
        canCancel: true,
        animated: false
      },
      pending_payment: {
        color: "var(--warning)",
        bgColor: "#fef3c7",
        icon: FaClock,
        label: "Pending Payment",
        canCancel: true,
        animated: false
      },
    };
    return config[status?.toLowerCase()] || config.pending;
  };

  const hasCheckedIn = () => {
    return (
      booking?.checkInData?.checkInTime ||
      booking?.checkIn?.status === "completed" ||
      booking?.status === "active" ||
      booking?.status === "in_progress"
    );
  };

  const hasCheckedOut = () => {
    return (
      booking?.checkOutData?.checkOutTime ||
      booking?.checkOut?.status === "completed" ||
      booking?.status === "completed"
    );
  };

  const canCheckIn = () => {
    try {
      if (!booking?.pickupDate) return { visible: false, enabled: false, reason: "No pickup date" };
      if (hasCheckedIn() || hasCheckedOut()) return { visible: false, enabled: false, reason: "Already checked in/out" };

      // ADDED: Only allow check-in if payment is completed
      const isPaid = booking?.paymentStatus === "paid";
      if (!isPaid) return { visible: false, enabled: false, reason: "Payment required" };

      const now = new Date();
      const pickupDate = new Date(booking.pickupDate);
      const returnDate = new Date(booking.returnDate);

      const checkInStart = new Date(pickupDate.getTime() - 60 * 60 * 1000);

      const allowedStatuses = [
        "confirmed",
        "active",
        "in_progress",
        "pending_payment", // Keep this but it won't show due to payment check above
        "verification_pending",
        "pending",
      ];

      const isWithinCheckInWindow = now >= checkInStart && now <= returnDate;
      const isCheckInEnabled = now >= checkInStart;

      return {
        visible: allowedStatuses.includes(booking.status) && !hasCheckedIn() && isPaid, // Added isPaid condition
        enabled: allowedStatuses.includes(booking.status) && isWithinCheckInWindow && isCheckInEnabled && !hasCheckedIn() && isPaid, // Added isPaid condition
        timeUntilCheckIn: checkInStart - now,
        reason: !isPaid ? "Payment required" :
                !allowedStatuses.includes(booking.status) ? "Invalid status" :
                !isWithinCheckInWindow ? "Outside check-in window" :
                "Available"
      };
    } catch (error) {
      console.error("Error in canCheckIn:", error);
      return { visible: false, enabled: false, reason: "Error" };
    }
  };

  const canCheckOut = () => {
    try {
      if (!booking?.returnDate) return { visible: false, enabled: false, reason: "No return date" };
      if (hasCheckedOut()) return { visible: false, enabled: false, reason: "Already checked out" };
      
      if (!hasCheckedIn()) return { visible: false, enabled: false, reason: "Check in first" };

      const now = new Date();
      const returnDate = new Date(booking.returnDate);
      
      const timeUntilReturn = returnDate - now;
      const oneHourInMs = 60 * 60 * 1000;

      const isWithinLastHour = timeUntilReturn <= oneHourInMs && timeUntilReturn > 0;
      const isReturnTimePassed = timeUntilReturn <= 0;

      const allowedStatuses = ["active", "confirmed", "in_progress"];
      const isStatusAllowed = allowedStatuses.includes(booking.status);

      let timeDisplay = "";
      if (timeUntilReturn > oneHourInMs) {
        const hours = Math.floor(timeUntilReturn / (60 * 60 * 1000));
        const minutes = Math.floor((timeUntilReturn % (60 * 60 * 1000)) / (60 * 1000));
        timeDisplay = `${hours}h ${minutes}m`;
      } else if (timeUntilReturn > 0) {
        const minutes = Math.floor(timeUntilReturn / (60 * 1000));
        timeDisplay = `${minutes}m`;
      }

      return {
        visible: true,
        enabled: isStatusAllowed && isWithinLastHour,
        reason: !isStatusAllowed ? "Invalid booking status" : 
                isReturnTimePassed ? "Return time has passed - please contact support" :
                !isWithinLastHour ? `Check-out available in ${timeDisplay}` : 
                `Available for check-out (${timeDisplay} left)`
      };
    } catch (error) {
      console.error("Error in canCheckOut:", error);
      return { visible: false, enabled: false, reason: "Error" };
    }
  };

  const canReviewBooking = () => {
    if (!booking) return false;
    
    return booking.status === "completed" &&
      !booking.review &&
      !submittedReviews.has(booking._id);
  };

  const hasReview = () => {
    return booking?.review || submittedReviews.has(booking?._id);
  };

  const getCancellationPolicy = () => {
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

  const calculateDuration = () => {
    if (!booking?.pickupDate || !booking?.returnDate) return 0;
    
    const pickup = new Date(booking.pickupDate);
    const returnDate = new Date(booking.returnDate);
    const diffTime = Math.abs(returnDate - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  const rentPrice = booking?.basePrice * calculateDuration()


  // Loading State
  if (isBookingLoading) {
    return (
      <PageWrapper>
        <LoadingState>
          <LoadingSpinner />
          <LoadingText>Loading booking details...</LoadingText>
        </LoadingState>
      </PageWrapper>
    );
  }

  // Error State
  if (currentError || !booking) {
    return (
      <PageWrapper>
        <ErrorState
          icon={FaExclamationTriangle}
          title={booking ? "Something went wrong" : "Booking Not Found"}
          message={
            currentError?.message || 
            "The booking you're looking for doesn't exist or cannot be loaded."
          }
          actions={[
            {
              text: "Try Again",
              onClick: () => refetch(),
              variant: 'primary',
              icon: FaRedo
            },
            {
              text: "Back to My Bookings",
              onClick: () => navigate("/bookings"),
              variant: 'secondary',
              icon: FaArrowLeft
            },
            {
              text: "Contact Support",
              onClick: () => navigate("/support"),
              variant: 'ghost',
              icon: FaSearch
            }
          ]}
          centered={true}
          size="lg"
        />
      </PageWrapper>
    );
  }

  // Computed values
  const statusConfig = getStatusConfig(booking.status);
  const hasDriverLicense = !!booking?.driver?.license?.fileUrl;
  const areDocumentsVerified = booking?.driver?.verified;
  const isPaymentPending = booking?.paymentStatus !== "paid";
  const showPaymentButton = areDocumentsVerified && isPaymentPending;
  const isUpcoming = booking?.pickupDate && new Date(booking.pickupDate) > new Date();
  const showCountdown = isUpcoming && Object.keys(timeLeft).length > 0;
  const cancellationPolicy = getCancellationPolicy();
  const checkInInfo = canCheckIn();
  const checkOutInfo = canCheckOut();
  // const isPaymentCompleted = booking?.paymentStatus === "paid";

  const verifiedDocuments = [
    ...(booking?.driver?.verified
      ? [
          {
            type: "license",
            name: "Driver's License",
            icon: FaIdCard,
            verified: true,
            documentUrl: booking.license?.documentUrl,
            verifiedAt: booking.license?.verifiedAt,
            verifiedBy: booking.licenses?.verifiedBy,
          },
        ]
      : []),
    ...(booking?.insurance?.verified
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

  const carDetails = {
    model: booking?.car?.model || "Unknown Model",
    make: booking?.car?.make || "Unknown Make",
    year: booking?.car?.year || "Unknown Year",
    type: booking?.car?.type || "Luxury Sedan",
    transmission: booking?.car?.transmission || "Automatic",
    fuelType: booking?.car?.fuelType || "Petrol",
    seats: booking?.car?.seats || 5,
    color: booking?.car?.color || "Unknown Color",
    licensePlate: booking?.car?.licensePlate || "N/A",
    images: booking?.car?.images || [],
    features: booking?.car?.features || [],
    dailyPrice: booking?.car?.dailyPrice || 0,
  };

  const totalDays = calculateDuration();
  const totalPrice = booking?.totalPrice || 0;

  return (
    <PageWrapper>
      {/* Header with Car Details and Countdown */}
      <Header>
        <StatuCheck>
          <BackButton>
            <SecondaryButton onClick={() => navigate("/bookings")} $size="sm">
              <FaArrowLeft />
              Back to Bookings
            </SecondaryButton>
          </BackButton>
          
          {checkInInfo.visible && (
            <CheckInButtonContainer>
              <SuccessButton
                onClick={() => setShowCheckInModal(true)}
                disabled={!checkInInfo.enabled}
                $size="sm"
              >
                <FaCheckCircle />
                {checkInInfo.enabled ? "Check In" : "Check In Soon"}
              </SuccessButton>

              {!checkInInfo.enabled && checkInInfo.timeUntilCheckIn > 0 && (
                <CheckInHint>
                  in {Math.ceil(checkInInfo.timeUntilCheckIn / (1000 * 60))} min
                </CheckInHint>
              )}
              {!checkInInfo.enabled && checkInInfo.timeUntilCheckIn <= 0 && (
                <CheckInHint>
                  Check-in available from 1 hour before pickup time
                </CheckInHint>
              )}
            </CheckInButtonContainer>
          )}

          {/* ADDED: Show payment requirement message when check-in is not visible due to payment */}
          {!checkInInfo.visible && !hasCheckedIn() && isUpcoming && isPaymentPending && (
            <PaymentRequiredMessage>
              <FaCreditCard />
              Complete payment to enable check-in
            </PaymentRequiredMessage>
          )}
           
          {showPaymentButton && (
            <ActionButton fullWidth>
              <AccentButton
                onClick={handleProceedToPayment}
                $size="sm"
              >
                <FaShoppingCart />
                Complete Payment
              </AccentButton>
            </ActionButton>
          )}

          {checkOutInfo.visible && (
            <CheckOutButtonContainer>
              <DangerButton
                onClick={() => setShowCheckOutModal(true)}
                disabled={!checkOutInfo.enabled}
                $size="sm"
              >
                <FaTimes />
                Check Out
                {!checkOutInfo.enabled && " (Disabled)"}
              </DangerButton>

              {checkOutInfo.enabled && (
                <CheckOutHint>
                  ⏰ Less than 1 hour until return time - Check out now
                </CheckOutHint>
              )}
            </CheckOutButtonContainer>
          )}
        </StatuCheck>
        
        <div>
          <HeaderActions>
            <StatusSection>
              <StatusBadgeComponent booking={booking} getStatusConfig={getStatusConfig} />
            </StatusSection>
            
            {showCountdown && booking.status === "confirmed" && (
              <CountdownSection>
                <CountdownLabel>Pickup in: </CountdownLabel>
                <CountdownTimer>
                  {timeLeft.days > 0 && (
                    <CountdownUnit>
                      <CountdownValue>{timeLeft.days || 0}</CountdownValue>
                      <CountdownLabelSmall>Days</CountdownLabelSmall>
                    </CountdownUnit>
                  )}
                  {!timeLeft.days > 0 && (
                    <>
                      <CountdownUnit>
                        <CountdownValue>{timeLeft.hours || 0}</CountdownValue>
                        <CountdownLabelSmall>H:</CountdownLabelSmall>
                      </CountdownUnit>
                      <CountdownUnit>
                        <CountdownValue>{timeLeft.minutes || 0}</CountdownValue>
                        <CountdownLabelSmall>M</CountdownLabelSmall>
                      </CountdownUnit>
                    </>
                  )}
                </CountdownTimer>
              </CountdownSection>
            )}
          </HeaderActions>
        </div>
        
        <HeaderMain>
          <CarHeaderSection>
            <CarImageLarge
              src={carDetails.images[0] || "/default-car.jpg"}
              alt={carDetails.model}
            />
            <CarHeaderInfo>
              <CarTitle>
                <CarModelLarge>{carDetails.model}</CarModelLarge>
                <CarMakeYear>
                  {carDetails.make} • {carDetails.year}
                </CarMakeYear>
              </CarTitle>

              <CarSpecsGrid>
                <CarSpecItem>
                  <FaCog />
                  <span>{carDetails.transmission}</span>
                </CarSpecItem>
                <CarSpecItem>
                  <FaGasPump />
                  <span>{carDetails.fuelType}</span>
                </CarSpecItem>
                <CarSpecItem>
                  <FaUsers />
                  <span>{carDetails.seats} seats</span>
                </CarSpecItem>
                <CarSpecItem>
                  <FaPalette />
                  <span>{carDetails.color}</span>
                </CarSpecItem>
              </CarSpecsGrid>
            </CarHeaderInfo>
          </CarHeaderSection>
        </HeaderMain>
      </Header>

      <ContentGrid>
        {/* Left Column - Main Details */}
        <MainSection>
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
                    <DetailLabel>Pickup Date & Time</DetailLabel>
                    <DetailValue>
                      {formatDate(booking.pickupDate)} at{" "}
                      {booking.pickupTime || "10:00 AM"}
                    </DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIcon>
                    <FaCalendarAlt />
                  </DetailIcon>
                  <DetailContent>
                    <DetailLabel>Return Date & Time</DetailLabel>
                    <DetailValue>
                      {formatDate(booking.returnDate)} at{" "}
                      {booking.returnTime || "10:00 AM"}
                    </DetailValue>
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
                    <DetailValue>{totalDays} days</DetailValue>
                  </DetailContent>
                </DetailItem>
              </DetailGrid>
            </CardContent>
          </Card>

          {/* Check-out Details */}
          {hasCheckedOut() && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <FaCheckCircle />
                  Check-out Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CheckOutDetailsSection>
                  <CheckOutDetailItem>
                    <strong>Status:</strong>
                    <CheckedOutBadgeSmall>
                      <FaCheckCircle />
                      Checked Out
                    </CheckedOutBadgeSmall>
                  </CheckOutDetailItem>
                  {booking.checkOutData?.checkOutTime && (
                    <CheckOutDetailItem>
                      <strong>Check-out Time:</strong>
                      {formatDate(booking.checkOutData.checkOutTime)} at{" "}
                      {formatTime(booking.checkOutData.checkOutTime)}
                    </CheckOutDetailItem>
                  )}
                  {booking.checkOutData?.mileage && (
                    <CheckOutDetailItem>
                      <strong>Final Mileage:</strong>
                      {booking.checkOutData.mileage.toLocaleString()} miles
                    </CheckOutDetailItem>
                  )}
                  {booking.checkOutData?.fuelLevel && (
                    <CheckOutDetailItem>
                      <strong>Fuel Level at Return:</strong>
                      <FuelLevelBadge level={booking.checkOutData.fuelLevel}>
                        {booking.checkOutData.fuelLevel}
                      </FuelLevelBadge>
                    </CheckOutDetailItem>
                  )}
                  {booking.checkOutData?.notes && (
                    <CheckOutDetailItem>
                      <strong>Notes:</strong>
                      <CheckOutNotes>{booking.checkOutData.notes}</CheckOutNotes>
                    </CheckOutDetailItem>
                  )}
                </CheckOutDetailsSection>
              </CardContent>
            </Card>
          )}

          {/* Review Section */}
          {canReviewBooking() && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <FaStar />
                  Share Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewSectionContent>
                  <ReviewPrompt>
                    How was your experience with the {carDetails.model}?
                  </ReviewPrompt>
                  <ReviewDescription>
                    Share your feedback to help other customers and improve our service.
                  </ReviewDescription>
                  <PrimaryButton
                    onClick={() => setShowReviewModal(true)}
                    $size="lg"
                  >
                    <FaStar />
                    Write a Review
                  </PrimaryButton>
                </ReviewSectionContent>
              </CardContent>
            </Card>
          )}

          {hasReview() && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <FaCheckCircle />
                  Your Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewedSection>
                  <ReviewedBadge>
                    <FaCheckCircle />
                    Thank you for your review!
                  </ReviewedBadge>
                  <ReviewedText>
                    Your feedback helps us improve our service for future customers.
                  </ReviewedText>
                </ReviewedSection>
              </CardContent>
            </Card>
          )}

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
                            onClick={() => handleDownloadDocument(doc.documentUrl)}
                            title={`Download ${doc.name}`}
                            $size="sm"
                          >
                            <FaDownload />
                          </DownloadButton>
                        </DocumentHeader>

                        <VerificationDetails>
                          <VerificationDetail>
                            <strong>Verified on:</strong>{" "}
                            {doc.verifiedAt ? formatDate(doc.verifiedAt) : "Recently"}
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
          {/* Action Buttons Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FaCog />
                Booking Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActionButtons>
                {/* Check-in Button */}
                {checkInInfo.visible && (
                  <ActionButton fullWidth>
                    <SuccessButton
                      onClick={() => setShowCheckInModal(true)}
                      disabled={!checkInInfo.enabled}
                      $size="sm"
                    >
                      <FaCheckCircle />
                      {checkInInfo.enabled ? "Check In" : "Check In Soon"}
                    </SuccessButton>

                    {!checkInInfo.enabled && checkInInfo.timeUntilCheckIn > 0 && (
                      <CheckInTimeHint>
                        Available in{" "}
                        {Math.ceil(checkInInfo.timeUntilCheckIn / (1000 * 60))}{" "}
                        min
                      </CheckInTimeHint>
                    )}
                  </ActionButton>
                )}

                  {showPaymentButton && (
            <ActionButton fullWidth>
              <AccentButton
                onClick={handleProceedToPayment}
                $size="sm"
              >
                <FaShoppingCart />
                Complete Payment
              </AccentButton>
            </ActionButton>
          )}
                

                {/* Check-out Button */}
                {checkOutInfo.visible && (
                  <ActionButton fullWidth>
                    <DangerButton
                      onClick={() => setShowCheckOutModal(true)}
                      $size="sm"
                      disabled={!checkOutInfo.enabled}
                    >
                      <FaTimes />
                      Check Out
                    
                    </DangerButton>

                    {!checkOutInfo.enabled && checkOutInfo.reason !== "Available for check-out" && (
                      <CheckOutTimeHint>
                        {checkOutInfo.reason}
                      </CheckOutTimeHint>
                    )}
                    
                    {checkOutInfo.enabled && (
                      <CheckOutTimeHint>
                        ⏰ Check-out enabled - Less than 1 hour until return
                      </CheckOutTimeHint>
                    )}
                  </ActionButton>
                )}

                {/* Review Button */}
                {canReviewBooking() && (
                  <ActionButton fullWidth>
                    <PrimaryButton
                      onClick={() => setShowReviewModal(true)}
                      $size="sm"
                    >
                      <FaStar />
                      Write Review
                    </PrimaryButton>
                  </ActionButton>
                )}

                {/* Cancel Booking Button */}
                {statusConfig.canCancel && (
                  <ActionButton fullWidth>
                    <DangerButton
                      onClick={() => setShowCancelModal(true)}
                      $size="sm"
                    >
                      <FaBan />
                      Cancel Booking
                    </DangerButton>
                  </ActionButton>
                )}

                {/* Document Management Section */}
                <ActionSectionTitle>Document Management</ActionSectionTitle>

                {!hasDriverLicense && (
                  <ActionButton fullWidth>
                    <SecondaryButton
                      onClick={() => setShowDriverDocumentModal(true)}
                      $size="sm"
                    >
                      <FaCloudUploadAlt />
                      Upload Driver Documents
                    </SecondaryButton>
                  </ActionButton>
                )}
              </ActionButtons>
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
                    ${booking.basePrice || 0} × {totalDays} days
                  </span>
                  <span>${rentPrice}</span>
                </PriceItem>
                <PriceItem>
                  <span>Deposit Amount</span>
                  <span>$150</span>
                </PriceItem>
                <TotalPrice>
                  <span>Total Amount</span>
                  <span>
                    ${(totalPrice).toFixed(2)}
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
                  <span>${totalPrice.toFixed(2)}</span>
                </PaymentItem>

                {isPaymentPending && !areDocumentsVerified && (
                  <PaymentMessage>
                    <InfoIcon>ℹ️</InfoIcon>
                    Complete document verification to proceed with payment.
                  </PaymentMessage>
                )}

                {isPaymentPending && areDocumentsVerified && (
                  <PaymentMessage warning>
                    <FaExclamationTriangle />
                    Payment required to complete booking and enable check-in.
                  </PaymentMessage>
                )}

                {!isPaymentPending && (
                  <PaymentMessage success>
                    <FaCheckCircle />
                    Payment completed. Your booking is confirmed and ready for check-in.
                  </PaymentMessage>
                )}
              </PaymentInfo>
            </CardContent>
          </Card>
        </Sidebar>
      </ContentGrid>

      {/* Bottom Action Buttons */}
      <ActionSection>
        <SecondaryButton onClick={() => navigate("/bookings")} $size="sm">
          <FaArrowLeft />
          Back to My Bookings
        </SecondaryButton>
        <PrimaryButton onClick={() => window.print()} $size="sm">
          Print Booking Details
        </PrimaryButton>
      </ActionSection>

      {/* Modals */}
      <ModalWrapper 
        show={showCheckInModal} 
        onClose={() => setShowCheckInModal(false)}
      >
        <CheckInModal
          show={showCheckInModal}
          onClose={() => setShowCheckInModal(false)}
          booking={booking}
          onCheckIn={handleCheckInSubmit}
          isCheckingIn={isCheckingIn}
        />
      </ModalWrapper>

      <ModalWrapper 
        show={showCheckOutModal} 
        onClose={() => setShowCheckOutModal(false)}
      >
        <CheckOutModal
          show={showCheckOutModal}
          onClose={() => setShowCheckOutModal(false)}
          booking={booking}
          onCheckOut={handleCheckOutSubmit}
          isCheckingOut={isCheckingOut}
        />
      </ModalWrapper>

      <ModalWrapper 
        show={showReviewModal} 
        onClose={() => setShowReviewModal(false)}
      >
        <ReviewModal
          show={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          booking={booking}
          onSuccess={handleReviewSuccess}
        />
      </ModalWrapper>

      {/* Driver Document Modal */}
      <ModalWrapper 
        show={showDriverDocumentModal} 
        onClose={() => setShowDriverDocumentModal(false)}
      >
        <DriverDocumentModal
          show={showDriverDocumentModal}
          onClose={() => setShowDriverDocumentModal(false)}
          bookingId={bookingId}
          onDocumentUpload={handleDocumentUpload}
        />
      </ModalWrapper>

      {/* Cancel Booking Modal */}
      <ModalWrapper 
        show={showCancelModal} 
        onClose={() => {
          setShowCancelModal(false);
          setCancellationReason("");
        }}
      >
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
              <strong>Vehicle:</strong> {carDetails.model}
              <br />
              <strong>Pickup:</strong> {formatDate(booking.pickupDate)}
              <br />
              <strong>Return:</strong> {formatDate(booking.returnDate)}
              <br />
              <strong>Total:</strong> ${totalPrice.toFixed(2)}
            </BookingInfo>

            <CancellationPolicy>
              <PolicyTitle>📋 Cancellation Policy</PolicyTitle>
              <PolicyMessage $type={cancellationPolicy.type}>
                {cancellationPolicy.message}
              </PolicyMessage>
              <PolicyNote>{cancellationPolicy.note}</PolicyNote>
            </CancellationPolicy>

            <ReasonSection>
              <ReasonLabel>Reason for cancellation (optional):</ReasonLabel>
              <ReasonTextarea
                placeholder="Please let us know why you're cancelling..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
            </ReasonSection>
          </CancelModalContent>

          <CancelModalActions>
            <CancelButton
              onClick={() => {
                setShowCancelModal(false);
                setCancellationReason("");
              }}
              $variant="secondary"
              disabled={isCancelling}
            >
              <FaUndo />
              Keep Booking
            </CancelButton>
            <CancelConfirmButton
              onClick={handleCancelBooking}
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
      </ModalWrapper>
    </PageWrapper>
  );
};

export default BookingDetailPage;

// Styled Components
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
  flex-direction: column;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    padding: var(--space-sm);
    gap: var(--space-md);
  }
`;

const BackButton = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const HeaderMain = styled.div`
  display: grid;
  gap: var(--space-xl); 
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
`;

const CarHeaderSection = styled.div`
  display: flex;
  gap: var(--space-lg);
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    align-items: center;
    gap: 0;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--space-lg);
`;

const StatuCheck = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-lg);
  font-family: var(--font-body);
`;

const CarImageLarge = styled.img`
  width: 300px;
  height: 180px;
  border-radius: var(--radius-xl);
  object-fit: cover;
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
`;

const CarHeaderInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const CarTitle = styled.div`
  margin-bottom: var(--space-sm);
`;

const CarModelLarge = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  font-family: var(--font-heading);

  @media (max-width: 768px) {
    font-size: var(--text-3xl);
  }
`;

const CarMakeYear = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-lg);
  margin: 0;
  font-family: var(--font-body);
`;

const CarSpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-self: center;
  gap: var(--space-sm);
  margin: var(--space-sm) 0;
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: 2fr;
  }
`;

const CarSpecItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--surface);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
`;

const StatusSection = styled.div``;

const CountdownSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const CountdownLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-family: var(--font-body);
`;

const CountdownTimer = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const CountdownUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--surface);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  min-width: 60px;
`;

const CountdownValue = styled.div`
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  font-family: var(--font-heading);
`;

const CountdownLabelSmall = styled.div`
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const CheckInButtonContainer = styled.div`
  text-align: center;
`;

const CheckInHint = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: var(--space-sm);
  font-family: var(--font-body);
`;

const CheckOutButtonContainer = styled.div`
  text-align: center;
  display: flex;
`;

const CheckOutHint = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: var(--space-sm);
  font-family: var(--font-body);
`;

// ADDED: New styled components for payment messaging
const PaymentRequiredMessage = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--warning-light);
  color: var(--warning-dark);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid var(--warning);
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

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const ActionButton = styled.div`
  /* display: flex;
  ${(props) => props.fullWidth && "width: 100%;"} */
`;

const ActionSectionTitle = styled.h4`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: var(--space-lg) 0 var(--space-sm) 0;
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--gray-200);
  font-family: var(--font-body);
`;

const CheckOutDetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const CheckOutDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--gray-100);

  &:last-child {
    border-bottom: none;
  }

  strong {
    color: var(--text-primary);
    font-family: var(--font-body);
  }
`;

const CheckedOutBadgeSmall = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  background: var(--error);
  color: var(--white);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

const FuelLevelBadge = styled.span`
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  background: ${(props) => {
    switch (props.level) {
      case "full":
        return "#d1fae5";
      case "three_quarters":
        return "#bbf7d0";
      case "half":
        return "#fef3c7";
      case "quarter":
        return "#fed7aa";
      case "empty":
        return "#fee2e2";
      default:
        return "#e5e7eb";
    }
  }};
  color: ${(props) => {
    switch (props.level) {
      case "full":
        return "#065f46";
      case "three_quarters":
        return "#065f46";
      case "half":
        return "#92400e";
      case "quarter":
        return "#9a3412";
      case "empty":
        return "#991b1b";
      default:
        return "#374151";
    }
  }};
  text-transform: capitalize;
  font-family: var(--font-body);
`;

const CheckOutNotes = styled.p`
  color: var(--text-secondary);
  font-style: italic;
  margin: 0;
  font-family: var(--font-body);
`;

const CheckInTimeHint = styled.div`
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--space-xs);
  font-family: var(--font-body);
`;

const CheckOutTimeHint = styled.div`
  font-size: var(--text-xs);
  color: var(--text-muted);
  text-align: center;
  margin-top: var(--space-xs);
  font-family: var(--font-body);
`;

const ReviewSectionContent = styled.div`
  text-align: center;
  padding: var(--space-lg);
`;

const ReviewPrompt = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
`;

const ReviewDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

const ReviewedSection = styled.div`
  text-align: center;
  padding: var(--space-lg);
`;

const ReviewedBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--success);
  color: var(--white);
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-md);
  font-family: var(--font-body);
`;

const ReviewedText = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

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

// UPDATED: PaymentMessage to handle warning state
const PaymentMessage = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  margin-top: var(--space-lg);
  background: ${(props) => 
    props.success ? "#d1fae5" : 
    props.warning ? "#fef3c7" : 
    "#eff6ff"
  };
  color: ${(props) => 
    props.success ? "#065f46" : 
    props.warning ? "#92400e" : 
    "#374151"
  };
  border-left: 4px solid
    ${(props) => 
      props.success ? "var(--success)" : 
      props.warning ? "var(--warning)" : 
      "var(--info)"
    };
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