/* eslint-disable react/prop-types */
// src/components/Modals/VerificationModal.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FaTimes,
  FaCheck,
  FaCar,
  FaMapMarkerAlt,
  FaIdCard,
  FaShieldAlt,
  FaUser,
  FaSpinner,
  FaCreditCard,
} from "react-icons/fa";

const VerificationModal = ({
  selectedBooking,
  verificationData,
  onClose,
  onStatusUpdate,
  onVerificationChange,
  onCheckboxChange,
  onVerify,
}) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoStatusUpdate, setAutoStatusUpdate] = useState(false);

  const formatDateTime = (dateString) => new Date(dateString).toLocaleString();

  // const statusOptions = [
  //   "pending",
  //   "license required",
  //   "confirmed",
  //   "active",
  //   "completed",
  //   "cancelled",
  //   "payment_pending",
  // ];

  // Auto-set status to payment_pending when verification checkboxes are checked
  useEffect(() => {
    if (!selectedBooking?.driver?.verified) {
      if (
        verificationData.license.verified ||
        verificationData.insurance.verified
      ) {
        setAutoStatusUpdate(true);
        // onStatusUpdate(selectedBooking._id, "payment_pending");
        // } else if (autoStatusUpdate && statusUpdate === "payment_pending") {
        //   setAutoStatusUpdate(false);
        //   onStatusUpdate(
        //     selectedBooking._id,
        //     selectedBooking.status || "pending"
        //   );
      }
    }
  }, [
    verificationData.license.verified,
    verificationData.insurance.verified,
    autoStatusUpdate,

    selectedBooking,
    onStatusUpdate,
  ]);

  useEffect(() => {
    if (selectedBooking?.driver?.verified) {
      // onStatusUpdate(selectedBooking._id, "payment_pending");
    }
  }, [selectedBooking]);

  // const handleStatusChange = (status) => {
  //   setAutoStatusUpdate(false);
  //   onStatusUpdate(selectedBooking._id, status);
  // };

  const handleInputChange = (section, field, value) => {
    onVerificationChange(section, field, value);
    if (errors[section]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: "",
        },
      }));
    }
  };

  const handleCheckboxChange = (section, field, checked) => {
    onCheckboxChange(section, field, checked);
  };
  const validateForm = () => {
    // Skip validation if driver is already verified
    if (selectedBooking?.driver?.verified) {
      return true;
    }

    const newErrors = {};

    // Validate license section
    if (verificationData.license.verified) {
      if (!verificationData.license.name?.trim()) {
        newErrors.license = {
          ...newErrors.license,
          name: "Driver name is required",
        };
      }
      if (!verificationData.license.number?.trim()) {
        newErrors.license = {
          ...newErrors.license,
          number: "License number is required",
        };
      }
      if (!verificationData.license.issuedBy?.trim()) {
        newErrors.license = {
          ...newErrors.license,
          issuedBy: "Issuing authority is required",
        };
      }
      if (!verificationData.license.expiryDate) {
        newErrors.license = {
          ...newErrors.license,
          expiryDate: "Expiry date is required",
        };
      } else if (new Date(verificationData.license.expiryDate) < new Date()) {
        newErrors.license = {
          ...newErrors.license,
          expiryDate: "License has expired",
        };
      }
    }

    // Validate insurance section
    if (verificationData.insurance.verified) {
      if (!verificationData.insurance.provider?.trim()) {
        newErrors.insurance = {
          ...newErrors.insurance,
          provider: "Insurance provider is required",
        };
      }
      if (!verificationData.insurance.policyNumber?.trim()) {
        newErrors.insurance = {
          ...newErrors.insurance,
          policyNumber: "Policy number is required",
        };
      }
      if (!verificationData.insurance.expiryDate) {
        newErrors.insurance = {
          ...newErrors.insurance,
          expiryDate: "Expiry date is required",
        };
      } else if (new Date(verificationData.insurance.expiryDate) < new Date()) {
        newErrors.insurance = {
          ...newErrors.insurance,
          expiryDate: "Insurance has expired",
        };
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // const validateForm = () => {
  //   // Skip validation if driver is already verified
  //   if (selectedBooking?.driver?.verified) {
  //     return true;
  //   }

  //   const newErrors = {};

  //   if (verificationData.license.verified) {
  //     if (!verificationData.license.number.trim()) {
  //       newErrors.license = { number: "License number is required" };
  //     }
  //     if (!verificationData.license.issuedBy.trim()) {
  //       newErrors.license = { issuedBy: "Issuing authority is required" };
  //     }
  //     if (!verificationData.license.expiryDate) {
  //       newErrors.license = { expiryDate: "Expiry date is required" };
  //     } else if (new Date(verificationData.license.expiryDate) < new Date()) {
  //       newErrors.license = { expiryDate: "License has expired" };
  //     }
  //   }

  //   if (verificationData.insurance.verified) {
  //     if (!verificationData.insurance.provider.trim()) {
  //       newErrors.insurance = { provider: "Insurance provider is required" };
  //     }
  //     if (!verificationData.insurance.policyNumber.trim()) {
  //       newErrors.insurance = { policyNumber: "Policy number is required" };
  //     }
  //     if (!verificationData.insurance.expiryDate) {
  //       newErrors.insurance = { expiryDate: "Expiry date is required" };
  //     } else if (new Date(verificationData.insurance.expiryDate) < new Date()) {
  //       newErrors.insurance = { expiryDate: "Insurance has expired" };
  //     }
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onVerify();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedBooking) return null;

  const isDriverVerified = selectedBooking.driver?.verified;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <FaUser />
            Update Booking #BF-{selectedBooking._id.slice(-6).toUpperCase()}
            {isDriverVerified && (
              <VerifiedBadge>
                <FaCheck /> Driver Verified
              </VerifiedBadge>
            )}
          </ModalTitle>
          <CloseButton onClick={onClose} disabled={isSubmitting}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Booking Information Summary */}
          <InfoSection>
            <SectionTitle>
              <FaCar />
              Booking Summary
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Customer</InfoLabel>
                <InfoValue>{selectedBooking.user?.fullName}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Vehicle</InfoLabel>
                <InfoValue>
                  {selectedBooking.car?.model} - {selectedBooking.car?.name}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Driver Status</InfoLabel>
                <InfoValue>
                  <DriverStatus verified={isDriverVerified}>
                    {isDriverVerified ? "Verified" : "Pending Verification"}
                  </DriverStatus>
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Pickup Location</InfoLabel>
                <InfoValue>
                  <FaMapMarkerAlt /> {selectedBooking.pickupLocation}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Pickup Date</InfoLabel>
                <InfoValue>
                  {formatDateTime(selectedBooking.pickupDate)}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Return Date</InfoLabel>
                <InfoValue>
                  {formatDateTime(selectedBooking.returnDate)}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Total Price</InfoLabel>
                <InfoValue>${selectedBooking.totalPrice}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          {/* Status Update Section */}
          <InfoSection>
            <SectionTitle>
              <FaCheck />
              Booking Status
            </SectionTitle>
            {isDriverVerified && (
              <StatusNote>
                <FaCreditCard /> Driver verified - ready for payment
              </StatusNote>
            )}
            {!isDriverVerified && (
              <StatusNote>
                <FaCreditCard /> {selectedBooking.status}
              </StatusNote>
            )}
          </InfoSection>
          {!isDriverVerified &&
            selectedBooking.status === "license_required" && (
              <StatusHelpText>
                <FaCreditCard /> Waiting on driver to upload license and
                insurance proceed.
              </StatusHelpText>
            )}
          {/* Driver Verification Section - Only show if driver is NOT verified */}
          {!isDriverVerified && selectedBooking.driver && (
            <InfoSection>
              <SectionTitle>
                <FaIdCard />
                Driver Verification
                <DriverStatus verified={false}>
                  Pending Verification
                </DriverStatus>
              </SectionTitle>

              <VerificationNotice>
                <FaCreditCard />
                <strong>Note:</strong> Verify documents to automatically set
                status to &quot;Payment Pending&quot;
              </VerificationNotice>

              <DocumentsGrid>
                {/* License Section */}
                <DocumentSection>
                  <SubSectionTitle>
                    <FaIdCard />
                    Driver License
                    <DocStatus verified={verificationData.license.verified}>
                      {verificationData.license.verified
                        ? "Verified"
                        : "Pending"}
                    </DocStatus>
                  </SubSectionTitle>

                  <PreviewSection>
                    <ImagePreview
                      src={selectedBooking.driver.license?.fileUrl}
                      alt="Driver License"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=License+Image+Not+Found";
                      }}
                    />
                    <InputGrid>
                      <FormGroup>
                        <Label>Driver&apos;s Name *</Label>
                        <Input
                          type="text"
                          value={verificationData.license.name || ""}
                          onChange={(e) =>
                            handleInputChange("license", "name", e.target.value)
                          }
                          placeholder="Enter driver's full name"
                          disabled={isSubmitting}
                          error={errors.license?.name}
                        />
                        {errors.license?.name && (
                          <ErrorText>{errors.license.name}</ErrorText>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label>License Number *</Label>
                        <Input
                          type="text"
                          value={verificationData.license.number}
                          onChange={(e) =>
                            handleInputChange(
                              "license",
                              "number",
                              e.target.value
                            )
                          }
                          placeholder="Enter license number"
                          disabled={isSubmitting}
                          error={errors.license?.number}
                        />
                        {errors.license?.number && (
                          <ErrorText>{errors.license.number}</ErrorText>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label>Issued By *</Label>
                        <Input
                          type="text"
                          value={verificationData.license.issuedBy}
                          onChange={(e) =>
                            handleInputChange(
                              "license",
                              "issuedBy",
                              e.target.value
                            )
                          }
                          placeholder="Enter issuing authority"
                          disabled={isSubmitting}
                          error={errors.license?.issuedBy}
                        />
                        {errors.license?.issuedBy && (
                          <ErrorText>{errors.license.issuedBy}</ErrorText>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label>Expiry Date *</Label>
                        <Input
                          type="date"
                          value={verificationData.license.expiryDate}
                          onChange={(e) =>
                            handleInputChange(
                              "license",
                              "expiryDate",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          error={errors.license?.expiryDate}
                        />
                        {errors.license?.expiryDate && (
                          <ErrorText>{errors.license.expiryDate}</ErrorText>
                        )}
                      </FormGroup>
                      <CheckboxGroup>
                        <CheckboxLabel>
                          <CheckboxInput
                            type="checkbox"
                            checked={verificationData.license.verified}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "license",
                                "verified",
                                e.target.checked
                              )
                            }
                            disabled={isSubmitting}
                          />
                          <CheckboxCustom
                            checked={verificationData.license.verified}
                            disabled={isSubmitting}
                          />
                          Mark License as Verified
                        </CheckboxLabel>
                      </CheckboxGroup>
                    </InputGrid>
                  </PreviewSection>
                </DocumentSection>

                {/* Insurance Section */}
                <DocumentSection>
                  <SubSectionTitle>
                    <FaShieldAlt />
                    Insurance Document
                    <DocStatus verified={verificationData.insurance.verified}>
                      {verificationData.insurance.verified
                        ? "Verified"
                        : "Pending"}
                    </DocStatus>
                  </SubSectionTitle>

                  <PreviewSection>
                    <ImagePreview
                      src={selectedBooking.driver.insurance?.fileUrl}
                      alt="Insurance Document"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Insurance+Image+Not+Found";
                      }}
                    />
                    <InputGrid>
                      <FormGroup>
                        <Label>Insurance Provider *</Label>
                        <Input
                          type="text"
                          value={verificationData.insurance.provider}
                          onChange={(e) =>
                            handleInputChange(
                              "insurance",
                              "provider",
                              e.target.value
                            )
                          }
                          placeholder="Enter insurance provider"
                          disabled={isSubmitting}
                          error={errors.insurance?.provider}
                        />
                        {errors.insurance?.provider && (
                          <ErrorText>{errors.insurance.provider}</ErrorText>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label>Policy Number *</Label>
                        <Input
                          type="text"
                          value={verificationData.insurance.policyNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "insurance",
                              "policyNumber",
                              e.target.value
                            )
                          }
                          placeholder="Enter policy number"
                          disabled={isSubmitting}
                          error={errors.insurance?.policyNumber}
                        />
                        {errors.insurance?.policyNumber && (
                          <ErrorText>{errors.insurance.policyNumber}</ErrorText>
                        )}
                      </FormGroup>
                      <FormGroup>
                        <Label>Expiry Date *</Label>
                        <Input
                          type="date"
                          value={verificationData.insurance.expiryDate}
                          onChange={(e) =>
                            handleInputChange(
                              "insurance",
                              "expiryDate",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          error={errors.insurance?.expiryDate}
                        />
                        {errors.insurance?.expiryDate && (
                          <ErrorText>{errors.insurance.expiryDate}</ErrorText>
                        )}
                      </FormGroup>
                      <CheckboxGroup>
                        <CheckboxLabel>
                          <CheckboxInput
                            type="checkbox"
                            checked={verificationData.insurance.verified}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "insurance",
                                "verified",
                                e.target.checked
                              )
                            }
                            disabled={isSubmitting}
                          />
                          <CheckboxCustom
                            checked={verificationData.insurance.verified}
                            disabled={isSubmitting}
                          />
                          Mark Insurance as Verified
                        </CheckboxLabel>
                      </CheckboxGroup>
                    </InputGrid>
                  </PreviewSection>
                </DocumentSection>
              </DocumentsGrid>

              <VerificationNote>
                * Fill in the information from the documents and check the boxes
                to verify. Status will automatically change to &apos;Payment Pending&apos;
                when verified.
              </VerificationNote>
            </InfoSection>
          )}

          {/* Message when driver is already verified */}
          {isDriverVerified && (
            <InfoSection>
              <SectionTitle>
                <FaCheck />
                Driver Verification Complete
              </SectionTitle>
              <VerifiedMessage>
                <FaCheck className="icon" />
                <div>
                  <strong>Driver has been successfully verified</strong>
                  <p>
                    All documents have been reviewed and approved. You can now
                    update the booking status to proceed with the rental
                    process.
                  </p>
                </div>
              </VerifiedMessage>
            </InfoSection>
          )}
        </ModalBody>

        <ModalFooter>
          <CancelButton onClick={onClose} disabled={isSubmitting}>
            <FaTimes /> Cancel
          </CancelButton>
          <SaveButton onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FaSpinner className="spinner" />
                Saving...
              </>
            ) : (
              <>
                <FaCheck />{" "}
                {isDriverVerified ? "Update Status" : "Save Changes"}
              </>
            )}
          </SaveButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default VerificationModal;

// Add these new styled components
const VerifiedBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const StatusNote = styled.span`
  font-size: 0.875rem;
  color: #8b5cf6;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VerifiedMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  color: #065f46;

  .icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  strong {
    display: block;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0;
    opacity: 0.9;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    color: #374151;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fafafa;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #374151;
  margin-bottom: 1rem;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const AutoStatusNote = styled.span`
  font-size: 0.875rem;
  color: #8b5cf6;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem;
`;

const StatusOption = styled.button`
  padding: 0.75rem 1rem;
  border: 2px solid
    ${({ selected, status }) => (selected ? getStatusColor(status) : "#e5e7eb")};
  border-radius: 8px;
  background: ${({ selected, status }) =>
    selected ? getStatusColor(status) : "white"};
  color: ${({ selected }) => (selected ? "white" : "#6b7280")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-weight: 600;
  text-transform: capitalize;
  transition: all 0.2s;
  font-size: 0.875rem;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    border-color: ${({ status }) => getStatusColor(status)};
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-1px)")};
  }
`;

const StatusHelpText = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #8b5cf6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const VerificationNotice = styled.div`
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #0369a1;
  font-size: 0.875rem;

  strong {
    font-weight: 600;
  }
`;

const DocumentsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const DocumentSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const SubSectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #374151;
  margin-bottom: 1rem;
  justify-content: space-between;
`;

const DocStatus = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ verified }) => (verified ? "#d1fae5" : "#fef3c7")};
  color: ${({ verified }) => (verified ? "#065f46" : "#92400e")};
`;

const DriverStatus = styled.span`
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${({ verified }) => (verified ? "#d1fae5" : "#fef3c7")};
  color: ${({ verified }) => (verified ? "#065f46" : "#92400e")};
`;

const PreviewSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
`;

const InputGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${(props) => (props.error ? "#ef4444" : "#d1d5db")};
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.error ? "#ef4444" : "#3b82f6")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.error ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)"};
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const CheckboxGroup = styled.div`
  margin-top: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;

  &:has(input:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CheckboxInput = styled.input`
  display: none;
`;

const CheckboxCustom = styled.span`
  width: 20px;
  height: 20px;
  border: 2px solid ${(props) => (props.checked ? "#10b981" : "#d1d5db")};
  border-radius: 4px;
  background: ${(props) => (props.checked ? "#10b981" : "white")};
  position: relative;
  transition: all 0.2s;

  &::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
    opacity: ${(props) => (props.checked ? 1 : 0)};
  }

  ${(props) =>
    props.disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}
`;

const VerificationNote = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
  margin-top: 1rem;
  text-align: center;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  color: #374151;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #10b981;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #059669;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #9ca3af;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case "confirmed":
      return "#10b981";
    case "pending":
      return "#f59e0b";
    case "cancelled":
      return "#ef4444";
    case "completed":
      return "#3b82f6";
    case "active":
      return "#06b6d4";
    case "payment_pending":
      return "#8b5cf6";
    default:
      return "#6b7280";
  }
};
