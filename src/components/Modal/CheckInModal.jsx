/* eslint-disable react/prop-types */
// components/Modal/CheckInModal.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SuccessButton, SecondaryButton } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useCheckInBooking } from "../../hooks/useBooking";
import {
  FaCheckCircle,
  FaGasPump,
  FaTachometerAlt,
  FaCamera,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaExclamationTriangle,
} from "react-icons/fa";

const CheckInModal = ({ show, onClose, booking }) => {
  
  const { mutate: checkInBooking, isPending: isLoading, error } = useCheckInBooking(
    booking?._id
  );

  // Check-in form state
  const [checkInData, setCheckInData] = useState({
    mileage: "",
    fuelLevel: "",
    notes: "",
    images: [],
  });

  // Image upload steps with better car visuals
  const [currentImageStep, setCurrentImageStep] = useState(0);
  const imageSteps = [
    {
      key: "front",
      label: "Front View",
      description: "Take a clear photo of the entire front of the vehicle",
      example: "Include headlights, bumper, and license plate",
    },
    {
      key: "driver_side",
      label: "Driver Side",
      description: "Full side view from driver's side",
      example: "Show entire side from front to rear",
    },
    {
      key: "passenger_side",
      label: "Passenger Side",
      description: "Full side view from passenger's side",
      example: "Show entire side from front to rear",
    },
    {
      key: "rear",
      label: "Rear View",
      description: "Clear photo of the back of the vehicle",
      example: "Include taillights, bumper, and license plate",
    },
    {
      key: "dashboard",
      label: "Dashboard",
      description: "Photo showing mileage and fuel gauge",
      example: "Clear shot of odometer and fuel indicator",
    },
    {
      key: "interior",
      label: "Interior",
      description: "Overall interior condition",
      example: "Show seats, steering wheel, and general condition",
    },
  ];

  // Fuel level options
  const fuelLevelOptions = [
    { value: "empty", label: "Empty", percentage: 0 },
    { value: "quarter", label: "¼ Tank", percentage: 25 },
    { value: "half", label: "½ Tank", percentage: 50 },
    { value: "three_quarters", label: "¾ Tank", percentage: 75 },
    { value: "full", label: "Full", percentage: 100 },
  ];

  // Clear error when modal is opened/closed or when form changes
  useEffect(() => {
    if (!show) {
      // Reset form and error when modal closes
      setCheckInData({
        mileage: "",
        fuelLevel: "",
        notes: "",
        images: [],
      });
      setCurrentImageStep(0);
    }
  }, [show]);

  // Handle check-in form changes
  const handleCheckInChange = (field, value) => {
    setCheckInData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image upload for current step
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newImage = {
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      step: imageSteps[currentImageStep].key,
      label: imageSteps[currentImageStep].label,
    };

    setCheckInData((prev) => ({
      ...prev,
      images: [...prev.images, newImage],
    }));

    // Auto-advance to next step if available
    if (currentImageStep < imageSteps.length - 1) {
      setCurrentImageStep(currentImageStep + 1);
    }
  };

  // Remove uploaded image
  const removeImage = (index) => {
    setCheckInData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Navigate between image steps
  const goToNextStep = () => {
    if (currentImageStep < imageSteps.length - 1) {
      setCurrentImageStep(currentImageStep + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentImageStep > 0) {
      setCurrentImageStep(currentImageStep - 1);
    }
  };

  // Get image for current step
  const getCurrentStepImage = () => {
    return checkInData.images.find(
      (img) => img.step === imageSteps[currentImageStep].key
    );
  };

  // Handle check-in submission
  const handleCheckInSubmit = async() => {
    if (!booking) return;

    // Validation (only mileage and fuel level are required)
    if (!checkInData.mileage || checkInData.mileage <= 0) {
      alert("Please enter a valid mileage");
      return;
    }

    if (!checkInData.fuelLevel) {
      alert("Please select fuel level");
      return;
    }

    const formData = new FormData();
    formData.append("bookingId", booking._id);
    formData.append("mileage", parseInt(checkInData.mileage));
    formData.append("fuelLevel", checkInData.fuelLevel);
    formData.append("notes", checkInData.notes);

    // Append images only if they exist
    checkInData.images.forEach((image) => {
      formData.append(`images`, image.file);
    });

    checkInBooking(formData, {
      onSuccess: (data) => {
        console.log("check in successfully!!",data)
        handleClose();
      },
    });
  };

  // Reset form when modal closes
  const handleClose = () => {
    setCheckInData({
      mileage: "",
      fuelLevel: "",
      notes: "",
      images: [],
    });
    setCurrentImageStep(0);
    onClose();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render car visual based on current step
  const renderCarVisual = () => {
    const currentStep = imageSteps[currentImageStep];

    return (
      <VisualGuideContainer>
        <StepHeader>
          <StepTitle>{currentStep.label}</StepTitle>
          <OptionalBadge>Optional</OptionalBadge>
        </StepHeader>

        <StepDescription>{currentStep.description}</StepDescription>

        <StepExample>📸 {currentStep.example}</StepExample>

        {/* Car Visual Representation */}
        <CarVisualContainer>
          {renderCarByStep(currentStep.key)}
        </CarVisualContainer>
      </VisualGuideContainer>
    );
  };

  // Render proper car visual for each step
  const renderCarByStep = (stepKey) => {
    switch (stepKey) {
      case "front":
        return <FrontViewCar />;
      case "driver_side":
        return <SideViewCar $side="left" />;
      case "passenger_side":
        return <SideViewCar $side="right" />;
      case "rear":
        return <RearViewCar />;
      case "dashboard":
        return <DashboardView />;
      case "interior":
        return <InteriorView />;
      default:
        return <DefaultCarView />;
    }
  };

  // Early return with null instead of false/undefined
  if (!show) {
    return null;
  }

  return (
    <CheckInModalOverlay onClick={handleClose}>
      <CheckInModalStyled onClick={(e)=> e.stopPropagation()}>
        <CheckInModalHeader>
          <CheckInIcon>
            <FaCheckCircle />
          </CheckInIcon>
          <CheckInModalTitle>Vehicle Check-in</CheckInModalTitle>
          <CheckInModalSubtitle>
            Record vehicle condition at pickup
          </CheckInModalSubtitle>
        </CheckInModalHeader>

        {/* Error Display */}
        {error && (
          <ErrorState>
            <ErrorIcon>
              <FaExclamationTriangle />
            </ErrorIcon>
            <ErrorText>
              {error?.response?.data?.message || "Failed to complete check-in. Please try again."}
            </ErrorText>
          </ErrorState>
        )}

        <CheckInModalContent>
          <VehicleInfoSection>
            <VehicleImage
              src={booking?.car?.images?.[0] || "/default-car.jpg"}
              alt={booking?.car?.model || "Car"}
            />
            <VehicleDetails>
              <VehicleModel>
                {booking?.car?.model || "Unknown Model"}
              </VehicleModel>
              <VehicleDetailsText>
                Pickup: {formatDate(booking?.pickupDate)}
              </VehicleDetailsText>
              <VehicleDetailsText>
                Location: {booking?.pickupLocation}
              </VehicleDetailsText>
            </VehicleDetails>
          </VehicleInfoSection>

          <FormSection>
            <FormGroup>
              <FormLabel>
                <FaTachometerAlt />
                Current Mileage *
              </FormLabel>
              <MileageInput
                type="number"
                placeholder="Enter current mileage"
                value={checkInData.mileage}
                onChange={(e) => handleCheckInChange("mileage", e.target.value)}
                min="0"
                step="1"
                disabled={isLoading}
              />
              <FormHelp>
                Please enter the exact mileage from the odometer
              </FormHelp>
            </FormGroup>

            <FormGroup>
              <FormLabel>
                <FaGasPump />
                Fuel Level *
              </FormLabel>
              <FuelLevelGrid>
                {fuelLevelOptions.map((option) => (
                  <FuelLevelOption
                    key={option.value}
                    $selected={checkInData.fuelLevel === option.percentage}
                    onClick={() =>
                      !isLoading &&
                      handleCheckInChange("fuelLevel", option.percentage)
                    }
                    $disabled={isLoading}
                  >
                    <FuelLevelIcon $level={option.percentage}>
                      <FaGasPump />
                    </FuelLevelIcon>
                    <FuelLevelLabel>{option.label}</FuelLevelLabel>
                  </FuelLevelOption>
                ))}
              </FuelLevelGrid>
            </FormGroup>

            <FormGroup>
              <FormLabel>
                <FaCamera />
                Vehicle Photos (Optional) - {imageSteps[currentImageStep].label}
              </FormLabel>

              <PhotoUploadSection>
                <StepIndicator>
                  Step {currentImageStep + 1} of {imageSteps.length} (Optional)
                </StepIndicator>

                {/* Visual Guide */}
                {renderCarVisual()}

                <PhotoUploadArea>
                  {getCurrentStepImage() ? (
                    <PhotoPreview>
                      <PhotoPreviewImage
                        src={getCurrentStepImage().preview}
                        alt={imageSteps[currentImageStep].label}
                      />
                      <RemovePhotoButton
                        onClick={() => {
                          const imageIndex = checkInData.images.findIndex(
                            (img) =>
                              img.step === imageSteps[currentImageStep].key
                          );
                          if (imageIndex !== -1) {
                            removeImage(imageIndex);
                          }
                        }}
                        $disabled={isLoading}
                      >
                        <FaTimes />
                      </RemovePhotoButton>
                    </PhotoPreview>
                  ) : (
                    <EmptyPhotoState>
                      <CameraIcon>
                        <FaCamera />
                      </CameraIcon>
                      <EmptyPhotoText>
                        Ready to capture{" "}
                        {imageSteps[currentImageStep].label.toLowerCase()}
                      </EmptyPhotoText>
                      <OptionalText>Optional - You can skip</OptionalText>
                    </EmptyPhotoState>
                  )}

                  <PhotoUploadButton>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                      id={`photo-upload-${currentImageStep}`}
                      disabled={isLoading}
                    />
                    <PhotoUploadLabel
                      htmlFor={`photo-upload-${currentImageStep}`}
                      $disabled={isLoading}
                    >
                      <FaCamera />
                      {getCurrentStepImage() ? "Retake Photo" : "Take Photo"}
                    </PhotoUploadLabel>
                  </PhotoUploadButton>
                </PhotoUploadArea>

                {/* Step Navigation */}
                <StepNavigation>
                  <StepNavButton
                    onClick={goToPrevStep}
                    disabled={currentImageStep === 0 || isLoading}
                    $variant="secondary"
                  >
                    <FaArrowLeft />
                    Previous
                  </StepNavButton>

                  <StepProgress>
                    {imageSteps.map((step, index) => (
                      <StepDot
                        key={step.key}
                        $active={index === currentImageStep}
                        $completed={checkInData.images.some(
                          (img) => img.step === step.key
                        )}
                      />
                    ))}
                  </StepProgress>

                  <StepNavButton
                    onClick={goToNextStep}
                    disabled={
                      currentImageStep === imageSteps.length - 1 || isLoading
                    }
                    $variant="primary"
                  >
                    Next
                    <FaArrowRight />
                  </StepNavButton>
                </StepNavigation>

                {/* Uploaded Images Preview */}
                {checkInData.images.length > 0 ? (
                  <UploadedImagesPreview>
                    <UploadedImagesTitle>Uploaded Photos</UploadedImagesTitle>
                    <UploadedImagesGrid>
                      {checkInData.images.map((image, index) => (
                        <UploadedImageItem key={index}>
                          <UploadedImagePreview
                            src={image.preview}
                            alt={image.label}
                          />
                          <UploadedImageLabel>{image.label}</UploadedImageLabel>
                        </UploadedImageItem>
                      ))}
                    </UploadedImagesGrid>
                  </UploadedImagesPreview>
                ) : null}
              </PhotoUploadSection>
            </FormGroup>

            <FormGroup>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <NotesTextarea
                placeholder="Note any existing damage, special conditions, or other observations..."
                value={checkInData.notes}
                onChange={(e) => handleCheckInChange("notes", e.target.value)}
                rows="3"
                disabled={isLoading}
              />
            </FormGroup>
          </FormSection>

          <CheckInTips>
            <TipsTitle>💡 Check-in Tips</TipsTitle>
            <TipsList>
              <Tip>
                Take clear photos in good lighting conditions (optional but
                recommended)
              </Tip>
              <Tip>Ensure the entire area is visible in the frame</Tip>
              <Tip>Capture close-ups of any existing damage</Tip>
              <Tip>Make sure the mileage is clearly readable</Tip>
            </TipsList>
          </CheckInTips>
        </CheckInModalContent>

        {/* Modal Actions */}
        <CheckInModalActions>
          <CheckInCancelButton
            onClick={handleClose}
            disabled={isLoading}
            $variant="secondary"
          >
            <FaTimes />
            Cancel
          </CheckInCancelButton>
          <CheckInConfirmButton
            onClick={handleCheckInSubmit}
            disabled={
              isLoading || !checkInData.mileage || !checkInData.fuelLevel
            }
            $variant="success"
          >
            {isLoading ? (
              <>
                <LoadingSpinner $size="sm" />
                Checking In...
              </>
            ) : (
              <>
                <FaCheck />
                Complete Check-in
              </>
            )}
          </CheckInConfirmButton>
        </CheckInModalActions>
      </CheckInModalStyled>
    </CheckInModalOverlay>
  );
};

export default CheckInModal;

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

// Error State Components
const ErrorState = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--error-light);
  border-radius: var(--radius-lg);
  border: 1px solid var(--error);
  margin-bottom: var(--space-lg);
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ErrorIcon = styled.div`
  color: var(--error);
  font-size: var(--text-lg);
  flex-shrink: 0;
`;

const ErrorText = styled.span`
  color: var(--error);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: 1.4;
`;

const OptionalBadge = styled.span`
  background: var(--gray-200);
  color: var(--text-secondary);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  margin-left: var(--space-sm);
`;

const OptionalText = styled.span`
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-style: italic;
  margin-top: var(--space-xs);
`;

const CheckInModalOverlay = styled.div`
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
  user-select: none; /* 🟢 prevent text selection */
`;

const CheckInModalStyled = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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

const CheckInModalHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-xl);
`;

const CheckInIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: var(--success-light);
  color: var(--success);
  border-radius: 50%;
  font-size: var(--text-2xl);
  margin: 0 auto var(--space-md) auto;
`;

const CheckInModalTitle = styled.h2`
  font-size: var(--text-2xl);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-weight: var(--font-bold);
  font-family: var(--font-heading);
`;

const CheckInModalSubtitle = styled.p`
  color: var(--text-secondary);
  margin: 0;
  font-size: var(--text-base);
  font-family: var(--font-body);
`;

const CheckInModalContent = styled.div`
  margin-bottom: var(--space-xl);
`;

const VehicleInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background: var(--surface);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
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

  &:disabled {
    background-color: var(--gray-100);
    cursor: not-allowed;
    opacity: 0.6;
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
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-normal);
  text-align: center;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  ${(props) =>
    !props.$disabled &&
    `
    &:hover {
      border-color: var(--success);
      background: var(--success-light);
    }
  `}
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

const StepIndicator = styled.div`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--primary);
  text-align: center;
  font-family: var(--font-body);
`;

const PhotoUploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-lg);
  background: var(--surface);
`;

const EmptyPhotoState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-muted);
`;

const CameraIcon = styled.div`
  font-size: var(--text-2xl);
  color: var(--gray-400);
`;

const EmptyPhotoText = styled.p`
  font-size: var(--text-sm);
  margin: 0;
  text-align: center;
  font-family: var(--font-body);
`;

const PhotoPreview = styled.div`
  position: relative;
  width: 200px;
  height: 150px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
`;

const PhotoPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemovePhotoButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: var(--error);
  color: var(--white);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  font-size: var(--text-sm);
  transition: all var(--transition-normal);
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  ${(props) =>
    !props.$disabled &&
    `
    &:hover {
      background: var(--error-dark);
      transform: scale(1.1);
    }
  `}
`;

const PhotoUploadButton = styled.div`
  display: inline-block;
`;

const PhotoUploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: ${(props) =>
    props.$disabled ? "var(--gray-400)" : "var(--primary)"};
  color: var(--white);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-normal);
  font-family: var(--font-body);
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  ${(props) =>
    !props.$disabled &&
    `
    &:hover {
      background: var(--primary-dark);
    }
  `}
`;

const StepNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
`;

const StepNavButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  background: ${(props) =>
    props.$variant === "primary" ? "var(--primary)" : "var(--white)"};
  color: ${(props) =>
    props.$variant === "primary" ? "var(--white)" : "var(--text-primary)"};
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-normal);
  font-family: var(--font-body);
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:not(:disabled):hover {
    background: ${(props) =>
      props.$variant === "primary" ? "var(--primary-dark)" : "var(--gray-100)"};
  }
`;

const StepProgress = styled.div`
  display: flex;
  gap: var(--space-xs);
`;

const StepDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) =>
    props.$active
      ? "var(--primary)"
      : props.$completed
      ? "var(--success)"
      : "var(--gray-300)"};
  transition: all var(--transition-normal);
`;

const UploadedImagesPreview = styled.div`
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--gray-200);
`;

const UploadedImagesTitle = styled.h4`
  font-size: var(--text-sm);
  color: var(--text-primary);
  margin: 0 0 var(--space-md) 0;
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

const UploadedImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--space-sm);
`;

const UploadedImageItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
`;

const UploadedImagePreview = styled.img`
  width: 80px;
  height: 60px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  border: 1px solid var(--gray-200);
`;

const UploadedImageLabel = styled.span`
  font-size: var(--text-xs);
  color: var(--text-secondary);
  text-align: center;
  font-family: var(--font-body);
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

  &:disabled {
    background-color: var(--gray-100);
    cursor: not-allowed;
    opacity: 0.6;
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
  padding-top: var(--space-lg);
  border-top: 1px solid var(--gray-200);

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

const VisualGuideContainer = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin: var(--space-md) 0;
  border: 1px solid var(--gray-200);
`;

const StepHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
`;

const StepTitle = styled.h4`
  font-size: var(--text-lg);
  color: var(--text-primary);
  margin: 0;
  font-weight: var(--font-bold);
  font-family: var(--font-heading);
`;

const StepDescription = styled.p`
  color: var(--text-secondary);
  margin: 0 0 var(--space-sm) 0;
  font-size: var(--text-sm);
  text-align: center;
  font-family: var(--font-body);
`;

const StepExample = styled.div`
  background: var(--info-light);
  color: var(--info-dark);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-md);
  text-align: center;
  font-family: var(--font-body);
`;

const CarVisualContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 150px;
  margin: var(--space-md) 0;
`;

// Simplified Car Views
const FrontViewCar = styled.div`
  width: 120px;
  height: 60px;
  background: var(--primary);
  border-radius: 10px 10px 5px 5px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 20px;
    right: 20px;
    height: 20px;
    background: linear-gradient(135deg, #87ceeb, #b0e2ff);
    clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
    border-radius: 3px;
  }
`;

const SideViewCar = styled.div.attrs((props) => ({
  $side: props.$side || "left",
}))`
  width: 150px;
  height: 50px;
  background: var(--primary);
  border-radius: 8px 20px 20px 8px;
  position: relative;
  transform: ${(props) => (props.$side === "right" ? "scaleX(-1)" : "none")};

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 20px;
    right: 40px;
    height: 15px;
    background: linear-gradient(135deg, #87ceeb, #b0e2ff);
    border-radius: 4px;
  }
`;

const RearViewCar = styled.div`
  width: 120px;
  height: 60px;
  background: var(--primary);
  border-radius: 5px 5px 10px 10px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 15px;
    left: 40px;
    right: 40px;
    height: 15px;
    background: linear-gradient(135deg, #87ceeb, #b0e2ff);
    border-radius: 3px;
  }
`;

const DashboardView = styled.div`
  width: 140px;
  height: 70px;
  background: var(--gray-800);
  border-radius: 8px;
  border: 2px solid var(--gray-600);
  position: relative;

  &::before {
    content: "MILEAGE";
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    height: 25px;
    background: var(--info-light);
    border: 1px solid var(--info);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: var(--text-primary);
    font-weight: bold;
  }
`;

const InteriorView = styled.div`
  width: 140px;
  height: 70px;
  background: var(--gray-200);
  border-radius: 8px;
  border: 2px solid var(--gray-400);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 15px;
    left: 20px;
    width: 35px;
    height: 25px;
    background: var(--primary);
    border-radius: 5px 5px 0 0;
  }

  &::after {
    content: "";
    position: absolute;
    top: 15px;
    right: 20px;
    width: 35px;
    height: 25px;
    background: var(--primary);
    border-radius: 5px 5px 0 0;
  }
`;

const DefaultCarView = styled.div`
  font-size: 3rem;
  text-align: center;
  color: var(--primary);
`;