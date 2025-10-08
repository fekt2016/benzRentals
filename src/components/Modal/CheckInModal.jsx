// components/Modal/CheckInModal.js
import React, { useState } from "react";
import styled from "styled-components";
import { SuccessButton, SecondaryButton } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import {
  FaCheckCircle,
  FaGasPump,
  FaTachometerAlt,
  FaCamera,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const CheckInModal = ({
  show,
  onClose,
  booking,
  onCheckIn,
  isCheckingIn = false,
}) => {
  // Check-in form state
  const [checkInData, setCheckInData] = useState({
    mileage: "",
    fuelLevel: "",
    notes: "",
    // images: [],
  });

  // Fuel level options
  const fuelLevelOptions = [
    { value: "empty", label: "Empty", percentage: 0 },
    { value: "quarter", label: "¼ Tank", percentage: 25 },
    { value: "half", label: "½ Tank", percentage: 50 },
    { value: "three_quarters", label: "¾ Tank", percentage: 75 },
    { value: "full", label: "Full", percentage: 100 },
  ];

  // Handle check-in form changes
  const handleCheckInChange = (field, value) => {
    setCheckInData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image upload for check-in
  //   const handleImageUpload = (event) => {
  //     const files = Array.from(event.target.files);
  //     if (files.length + checkInData.images.length > 5) {
  //       alert("Maximum 5 images allowed");
  //       return;
  //     }

  //     const newImages = files.map((file) => ({
  //       file,
  //       preview: URL.createObjectURL(file),
  //       name: file.name,
  //       type: file.type,
  //     }));

  //     setCheckInData((prev) => ({
  //       ...prev,
  //       images: [...prev.images, ...newImages],
  //     }));
  //   };

  // Remove uploaded image
  //   const removeImage = (index) => {
  //     setCheckInData((prev) => ({
  //       ...prev,
  //       images: prev.images.filter((_, i) => i !== index),
  //     }));
  //   };

  // Handle check-in submission
  const handleCheckInSubmit = () => {
    if (!booking) return;

    // Validation
    if (!checkInData.mileage || checkInData.mileage <= 0) {
      alert("Please enter a valid mileage");
      return;
    }

    if (!checkInData.fuelLevel) {
      alert("Please select fuel level");
      return;
    }

    // const formData = new FormData();
    // formData.append("bookingId", booking._id);
    // formData.append("mileage", parseInt(checkInData.mileage));
    // formData.append("fuelLevel", checkInData.fuelLevel);
    // formData.append("notes", checkInData.notes);

    // Append images
    // checkInData.images.forEach((image, index) => {
    //   console.log(index);
    //   formData.append(`images`, image.file);
    // });

    onCheckIn(checkInData);
  };

  // Reset form when modal closes
  const handleClose = () => {
    setCheckInData({
      mileage: "",
      fuelLevel: "",
      notes: "",
      //   images: [],
    });
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

  if (!show) return null;

  return (
    <CheckInModalOverlay>
      <CheckInModalStyled>
        <CheckInModalHeader>
          <CheckInIcon>
            <FaCheckCircle />
          </CheckInIcon>
          <CheckInModalTitle>Vehicle Check-in</CheckInModalTitle>
          <CheckInModalSubtitle>
            Record vehicle condition at pickup
          </CheckInModalSubtitle>
        </CheckInModalHeader>

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
                disabled={isCheckingIn}
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
                    $selected={checkInData.fuelLevel === option.value}
                    onClick={() =>
                      !isCheckingIn &&
                      handleCheckInChange("fuelLevel", option.value)
                    }
                    $disabled={isCheckingIn}
                  >
                    <FuelLevelIcon $level={option.percentage}>
                      <FaGasPump />
                    </FuelLevelIcon>
                    <FuelLevelLabel>{option.label}</FuelLevelLabel>
                  </FuelLevelOption>
                ))}
              </FuelLevelGrid>
            </FormGroup>

            {/* <FormGroup>
              <FormLabel>
                <FaCamera />
                Vehicle Photos (Optional)
              </FormLabel>
              <PhotoUploadSection>
                <PhotoUploadButton>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                    id="photo-upload"
                    disabled={isCheckingIn}
                  />
                  <PhotoUploadLabel
                    htmlFor="photo-upload"
                    $disabled={isCheckingIn}
                  >
                    <FaCamera />
                    Add Photos
                  </PhotoUploadLabel>
                </PhotoUploadButton>
                <PhotoHelp>
                  Take photos of any existing damage or special features
                </PhotoHelp>

                {checkInData.images.length > 0 && (
                  <PhotoPreviewGrid>
                    {checkInData.images.map((image, index) => (
                      <PhotoPreview key={index}>
                        <PhotoPreviewImage
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                        />
                        <RemovePhotoButton
                          onClick={() => !isCheckingIn && removeImage(index)}
                          $disabled={isCheckingIn}
                        >
                          <FaTimes />
                        </RemovePhotoButton>
                      </PhotoPreview>
                    ))}
                  </PhotoPreviewGrid>
                )}
              </PhotoUploadSection>
            </FormGroup> */}

            <FormGroup>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <NotesTextarea
                placeholder="Note any existing damage, special conditions, or other observations..."
                value={checkInData.notes}
                onChange={(e) => handleCheckInChange("notes", e.target.value)}
                rows="3"
                disabled={isCheckingIn}
              />
            </FormGroup>
          </FormSection>

          <CheckInTips>
            <TipsTitle>💡 Check-in Tips</TipsTitle>
            <TipsList>
              <Tip>Take clear photos of all four sides of the vehicle</Tip>
              <Tip>Capture close-ups of any existing scratches or damage</Tip>
              <Tip>Ensure mileage reading is clear and accurate</Tip>
              <Tip>Verify fuel level matches your selection</Tip>
            </TipsList>
          </CheckInTips>
        </CheckInModalContent>

        <CheckInModalActions>
          <CheckInCancelButton
            onClick={handleClose}
            disabled={isCheckingIn}
            $variant="secondary"
          >
            <FaTimes />
            Cancel
          </CheckInCancelButton>
          <CheckInConfirmButton
            onClick={handleCheckInSubmit}
            disabled={
              isCheckingIn || !checkInData.mileage || !checkInData.fuelLevel
            }
            $variant="success"
          >
            {isCheckingIn ? (
              <>
                <LoadingSpinner $size="sm" />
                Processing...
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
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  font-size: var(--text-xs);
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
