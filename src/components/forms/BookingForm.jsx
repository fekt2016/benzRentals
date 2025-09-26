import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useCreateBooking } from "../../hooks/useBooking";
import { useNavigate } from "react-router-dom";

const MISSOURI_CITIES = [
  "Kansas City",
  "St. Louis",
  "Springfield",
  "Columbia",
  "Independence",
  "Lee's Summit",
  "O'Fallon",
  "St. Joseph",
  "St. Charles",
  "Blue Springs",
];

// Animations
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const BookingForm = ({ car, licenses, drivers }) => {
  const {
    mutateAsync: createBooking,
    error,
    isError,
    reset,
  } = useCreateBooking();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    pickupLocation: MISSOURI_CITIES[0],
    pickupDate: "",
    returnDate: "",
    selectedLicense: null,
    selectedDriver: null,
  });

  const [insuranceFile, setInsuranceFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate form whenever form state changes
  useEffect(() => {
    validateForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, insuranceFile, licenseFile]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      setFormErrors({});
    }
    if (isError) {
      reset();
    }
  }, [form.pickupDate, formErrors, isError, reset, form.returnDate]);

  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];

    // Date validation
    if (form.pickupDate && form.returnDate) {
      const pickup = new Date(form.pickupDate);
      const returnDate = new Date(form.returnDate);
      // const todayDate = new Date(today);

      if (form.pickupDate < today) {
        errors.pickupDate = "Pickup date cannot be in the past";
      }

      if (form.returnDate <= form.pickupDate) {
        errors.returnDate = "Return date must be after pickup date";
      }

      if ((returnDate - pickup) / (1000 * 60 * 60 * 24) > 30) {
        errors.returnDate = "Maximum rental period is 30 days";
      }
    }

    // Driver/License validation
    if (!form.selectedDriver) {
      if (!form.selectedLicense && licenses && licenses.length > 0) {
        errors.license = "Please select a license or choose a verified driver";
      }
    }

    setFormErrors(errors);

    // Enable button only when basic requirements are met
    const basicValid =
      form.pickupDate &&
      form.returnDate &&
      form.returnDate > form.pickupDate &&
      form.pickupDate >= today;

    const driverValid = form.selectedDriver || (licenseFile && insuranceFile);

    setIsFormValid(
      basicValid && driverValid && Object.keys(errors).length === 0
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      // Validate file type and size
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "Please upload a JPEG, PNG, or PDF file",
        }));
        return;
      }

      if (file.size > maxSize) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "File size must be less than 5MB",
        }));
        return;
      }
    }

    if (name === "insurance") setInsuranceFile(file);
    if (name === "driverLicense") setLicenseFile(file);
  };

  const handleLicenseSelection = (licenseId) => {
    setForm((prev) => ({
      ...prev,
      selectedLicense: prev.selectedLicense === licenseId ? null : licenseId,
      selectedDriver: null, // Clear driver selection
    }));
  };

  const handleDriverSelection = (driverId) => {
    setForm((prev) => ({
      ...prev,
      selectedDriver: prev.selectedDriver === driverId ? null : driverId,
      selectedLicense: null, // Clear license selection
    }));
  };

  const getErrorMessage = () => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return "An unexpected error occurred. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setFormErrors((prev) => ({
        ...prev,
        submit: "Please fix the errors above before submitting",
      }));
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    const {
      pickupLocation,
      pickupDate,
      returnDate,
      selectedLicense,
      selectedDriver,
    } = form;

    try {
      const formData = new FormData();
      formData.append("car", car._id);
      formData.append("pickupLocation", pickupLocation);
      formData.append("pickupDate", pickupDate);
      formData.append("returnDate", returnDate);

      if (selectedDriver) {
        formData.append("driverId", selectedDriver);
      } else {
        if (selectedLicense) formData.append("license", selectedLicense);
        if (insuranceFile) formData.append("insurance", insuranceFile);
        if (licenseFile) formData.append("driverLicense", licenseFile);
      }

      const booking = await createBooking(formData);
      const bookingData = JSON.parse(JSON.stringify(booking));
      const bookingId = bookingData.data.data._id;

      navigate("/checkout", { state: { bookingId: bookingId } });
    } catch (error) {
      console.error("Booking failed:", error);
      // Error is handled by the hook and will be displayed via isError
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasExistingLicenses = licenses && licenses.length > 0;
  const verifiedDrivers =
    drivers?.filter(
      (d) => d.license?.verified === true && d.insurance?.verified === true
    ) || [];

  // Calculate total days and price
  const calculateTotal = () => {
    if (!form.pickupDate || !form.returnDate) return 0;
    const start = new Date(form.pickupDate);
    const end = new Date(form.returnDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * car.pricePerDay : 0;
  };

  const totalDays = calculateTotal() / car.pricePerDay;
  const totalPrice = calculateTotal();
  const serviceFee = 29.99;
  const grandTotal = totalPrice + serviceFee;

  // Get minimum date for return date (pickup date + 1 day)
  const getMinReturnDate = () => {
    if (!form.pickupDate) return "";
    const minDate = new Date(form.pickupDate);
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split("T")[0];
  };

  // Get maximum date (30 days from pickup)
  const getMaxReturnDate = () => {
    if (!form.pickupDate) return "";
    const maxDate = new Date(form.pickupDate);
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormHeader>
        <h2>🚗 Book Your Adventure</h2>
        <PriceDisplay>
          <Price>${car.pricePerDay}</Price>
          <PriceLabel>/day</PriceLabel>
        </PriceDisplay>
      </FormHeader>

      {/* Error Display */}
      {(isError || formErrors.submit) && (
        <ErrorBox $shake={!!formErrors.submit}>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>{formErrors.submit || getErrorMessage()}</ErrorText>
          <CloseButton
            onClick={() => {
              reset();
              setFormErrors((prev) => ({ ...prev, submit: null }));
            }}
          >
            ×
          </CloseButton>
        </ErrorBox>
      )}

      {/* Date Selection */}
      <FormSection>
        <SectionTitle>📅 Select Dates</SectionTitle>
        <DateGrid>
          <FormGroup>
            <Label>Pick-up Location</Label>
            <Select
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={handleChange}
            >
              {MISSOURI_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="pickupDate">Pick-up Date *</Label>
            <Input
              id="pickupDate"
              type="date"
              name="pickupDate"
              value={form.pickupDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              required
              $error={!!formErrors.pickupDate}
            />
            {formErrors.pickupDate && (
              <FieldError>{formErrors.pickupDate}</FieldError>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="returnDate">Return Date *</Label>
            <Input
              id="returnDate"
              type="date"
              name="returnDate"
              value={form.returnDate}
              onChange={handleChange}
              min={getMinReturnDate()}
              max={getMaxReturnDate()}
              disabled={!form.pickupDate}
              required
              $error={!!formErrors.returnDate}
            />
            {formErrors.returnDate && (
              <FieldError>{formErrors.returnDate}</FieldError>
            )}
          </FormGroup>
        </DateGrid>

        {/* Price Summary */}
        {totalDays > 0 && (
          <PriceSummary>
            <SummaryItem>
              <span>
                ${car.pricePerDay} × {totalDays}{" "}
                {totalDays === 1 ? "day" : "days"}
              </span>
              <span>${totalPrice.toFixed(2)}</span>
            </SummaryItem>
            <SummaryItem>
              <span>Service fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </SummaryItem>
            <TotalPrice>
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </TotalPrice>
          </PriceSummary>
        )}
      </FormSection>

      {/* Driver Selection */}
      {verifiedDrivers.length > 0 && (
        <FormSection>
          <SectionTitle>👥 Select Verified Driver</SectionTitle>
          <CardsContainer>
            {verifiedDrivers.map((driver) => (
              <DriverCard
                key={driver._id}
                selected={form.selectedDriver === driver._id}
                onClick={() => handleDriverSelection(driver._id)}
              >
                <DriverInfo>
                  <DriverAvatar>
                    {driver.name?.charAt(0).toUpperCase()}
                  </DriverAvatar>
                  <DriverDetails>
                    <DriverName>{driver.name}</DriverName>
                    <DriverBadge>✅ Verified</DriverBadge>
                  </DriverDetails>
                </DriverInfo>
                <Radio selected={form.selectedDriver === driver._id}>
                  {form.selectedDriver === driver._id && <RadioDot />}
                </Radio>
              </DriverCard>
            ))}
          </CardsContainer>
          {formErrors.license && !form.selectedDriver && (
            <FieldError>{formErrors.license}</FieldError>
          )}
        </FormSection>
      )}

      {/* License Selection */}
      {hasExistingLicenses && !form.selectedDriver && (
        <FormSection>
          <SectionTitle>📝 Select Your License</SectionTitle>
          <CardsContainer>
            {licenses.map((license) => (
              <LicenseCard
                key={license._id}
                selected={form.selectedLicense === license._id}
                onClick={() => handleLicenseSelection(license._id)}
              >
                <LicenseInfo>
                  <LicenseNumber>{license.licenseNumber}</LicenseNumber>
                  <LicenseDetails>
                    <span>{license.state}</span>
                    <span>
                      Expires:{" "}
                      {new Date(license.expiryDate).toLocaleDateString()}
                    </span>
                  </LicenseDetails>
                </LicenseInfo>
                <Radio selected={form.selectedLicense === license._id}>
                  {form.selectedLicense === license._id && <RadioDot />}
                </Radio>
              </LicenseCard>
            ))}
          </CardsContainer>
          {formErrors.license && <FieldError>{formErrors.license}</FieldError>}
        </FormSection>
      )}

      {/* File Uploads */}
      {!form.selectedDriver && (
        <FormSection>
          <SectionTitle>📎 Upload Documents</SectionTitle>
          <FileUploadGrid>
            <FileUploadGroup>
              <FileLabel>
                <FileInput
                  type="file"
                  name="insurance"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
                <FileUploadBox $error={!!formErrors.insurance}>
                  <FileIcon>📄</FileIcon>
                  <FileText>
                    {insuranceFile ? insuranceFile.name : "Upload Insurance"}
                  </FileText>
                  <FileHint>Optional</FileHint>
                </FileUploadBox>
              </FileLabel>
              {formErrors.insurance && (
                <FieldError>{formErrors.insurance}</FieldError>
              )}
            </FileUploadGroup>

            <FileUploadGroup>
              <FileLabel>
                <FileInput
                  type="file"
                  name="driverLicense"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
                <FileUploadBox $error={!!formErrors.driverLicense}>
                  <FileIcon>🪪</FileIcon>
                  <FileText>
                    {licenseFile ? licenseFile.name : "Upload Driver License"}
                  </FileText>
                  <FileHint>
                    {hasExistingLicenses ? "Optional" : "Required"}
                  </FileHint>
                </FileUploadBox>
              </FileLabel>
              {formErrors.driverLicense && (
                <FieldError>{formErrors.driverLicense}</FieldError>
              )}
            </FileUploadGroup>
          </FileUploadGrid>
        </FormSection>
      )}

      {/* Important Notice */}
      <NoticeBox>
        <NoticeIcon>💡</NoticeIcon>
        <NoticeText>
          Payment will be processed only after your driver's license and
          insurance are verified. Free cancellation up to 24 hours before
          pickup.
        </NoticeText>
      </NoticeBox>

      {/* Submit Button */}
      <SubmitButton
        type="submit"
        disabled={!isFormValid}
        $isValid={isFormValid}
        $submitting={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Spinner />
            Processing...
          </>
        ) : (
          <>
            🚀 Reserve Now - $
            {grandTotal > serviceFee
              ? grandTotal.toFixed(2)
              : (car.pricePerDay + serviceFee).toFixed(2)}
          </>
        )}
      </SubmitButton>

      {/* Form Status Indicator */}
      <FormStatus>
        <StatusIndicator $valid={isFormValid}>
          {isFormValid
            ? "✅ Form ready to submit"
            : "⏳ Complete all required fields"}
        </StatusIndicator>
      </FormStatus>
    </FormContainer>
  );
};

export default BookingForm;

// Enhanced Styled Components with Error States
const FormContainer = styled.form`
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: ${slideUp} 0.6s ease-out;
`;

const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  animation: ${(props) => (props.$shake ? shake : "none")} 0.5s ease-in-out;
`;

const ErrorIcon = styled.div`
  font-size: 1.2rem;
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-weight: 500;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #dc2626;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #fecaca;
    border-radius: 50%;
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f4f8;

  h2 {
    margin: 0;
    color: #1f2937;
    font-size: 1.5rem;
  }
`;

const PriceDisplay = styled.div`
  text-align: right;
`;

const Price = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
`;

const PriceLabel = styled.span`
  font-size: 1rem;
  color: #6b7280;
  margin-left: 0.25rem;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DateGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${(props) => (props.$error ? "#dc2626" : "#e5e7eb")};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.$error ? "#dc2626" : "#3b82f6")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$error ? "rgba(220, 38, 38, 0.1)" : "rgba(59, 130, 246, 0.1)"};
  }

  &:disabled {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FieldError = styled.span`
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  font-weight: 500;
`;

const PriceSummary = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #6b7280;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0 0 0;
  font-weight: 700;
  font-size: 1.1rem;
  color: #1f2937;
  border-top: 2px solid #e5e7eb;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DriverCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${slideUp} 0.4s ease-out;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const DriverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DriverAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
`;

const DriverDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DriverName = styled.strong`
  font-size: 1.1rem;
  color: #1f2937;
`;

const DriverBadge = styled.span`
  font-size: 0.8rem;
  color: #059669;
  background: #d1fae5;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  width: fit-content;
`;

const LicenseCard = styled(DriverCard)``;

const LicenseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LicenseNumber = styled.strong`
  font-size: 1.1rem;
  color: #1f2937;
`;

const LicenseDetails = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6b7280;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const Radio = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#d1d5db")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.selected ? "#3b82f6" : "white")};
  transition: all 0.3s ease;
`;

const RadioDot = styled.div`
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
`;

const FileUploadGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FileUploadGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileLabel = styled.label`
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const FileUploadBox = styled.div`
  padding: 1.5rem;
  border: 2px dashed ${(props) => (props.$error ? "#dc2626" : "#d1d5db")};
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:hover {
    border-color: ${(props) => (props.$error ? "#dc2626" : "#3b82f6")};
    background: #f0f9ff;
  }
`;

const FileIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const FileText = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.2rem;
`;

const FileHint = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

const NoticeBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f0f9ff;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  margin: 1.5rem 0;
`;

const NoticeIcon = styled.div`
  font-size: 1.5rem;
`;

const NoticeText = styled.p`
  margin: 0;
  color: #1e40af;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem 2rem;
  background: ${(props) => {
    if (props.$submitting) return "#9ca3af";
    if (!props.$isValid) return "#d1d5db";
    return "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)";
  }};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: ${(props) =>
    props.$submitting || !props.$isValid ? "not-allowed" : "pointer"};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: ${(props) =>
      props.$isValid && !props.$submitting ? pulse : "none"}
    2s infinite;

  &:hover:not(:disabled) {
    transform: ${(props) =>
      props.$isValid && !props.$submitting ? "translateY(-2px)" : "none"};
    box-shadow: ${(props) =>
      props.$isValid && !props.$submitting
        ? "0 10px 25px rgba(59, 130, 246, 0.3)"
        : "none"};
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const FormStatus = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const StatusIndicator = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${(props) => (props.$valid ? "#d1fae5" : "#fef3c7")};
  color: ${(props) => (props.$valid ? "#065f46" : "#92400e")};
`;
