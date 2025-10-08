// src/components/booking/BookingForm.jsx
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useCreateBooking } from "../../hooks/useBooking";
import { useNavigate } from "react-router-dom";
import { devices } from "../../styles/GlobalStyles";

// Import UI Components
import {
  FormGroup,
  Label,
  ErrorMessage as ErrorMessageBase,
} from "../forms/Form";
import { PrimaryButton } from "../ui/Button";
import { Card } from "../Cards/Card";
import { LoadingSpinner } from "../ui/LoadingSpinner";

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

// Time options for dropdown
const TIME_OPTIONS = ["08:00", "08:30", "09:00", "17:00", "17:30", "18:00"];

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
    pickupTime: "10:00",
    returnDate: "",
    returnTime: "10:00",
    selectedLicense: null,
    selectedDriver: null,
    driverName: "", // NEW: Added driver name field
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
  }, [form.pickupDate, form.returnDate, formErrors, isError, reset]);

  // FIXED: Simplified validation - only require valid dates
  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];

    // Date validation
    if (form.pickupDate && form.returnDate) {
      if (form.pickupDate < today) {
        errors.pickupDate = "Pickup date cannot be in the past";
      }

      // Check if it's the same date but return time is before pickup time
      if (form.pickupDate === form.returnDate) {
        if (form.returnTime <= form.pickupTime) {
          errors.returnTime =
            "Return time must be after pickup time on the same day";
        }
      } else if (form.returnDate <= form.pickupDate) {
        errors.returnDate = "Return date must be after pickup date";
      }

      const pickup = new Date(form.pickupDate);
      const returnDate = new Date(form.returnDate);
      const daysDifference = (returnDate - pickup) / (1000 * 60 * 60 * 24);

      if (daysDifference > 30) {
        errors.returnDate = "Maximum rental period is 30 days";
      }
    }

    // FIXED: Only warnings for driver/license, not blocking
    if (!form.selectedDriver) {
      const hasExistingLicenses = licenses && licenses.length > 0;

      if (hasExistingLicenses && !form.selectedLicense && !licenseFile) {
        errors.license = "Please select a license or upload a new one";
      } else if (!hasExistingLicenses && !licenseFile) {
        errors.license = "Please upload your driver license";
      }

      // NEW: Validate driver name when uploading new license
      if (!form.selectedLicense && licenseFile && !form.driverName.trim()) {
        errors.driverName =
          "Driver name is required when uploading a new license";
      }
    }

    setFormErrors(errors);

    // FIXED: SIMPLE VALIDATION - Only require valid dates to enable button
    const hasValidDates =
      form.pickupDate &&
      form.returnDate &&
      form.pickupTime &&
      form.returnTime &&
      (form.returnDate > form.pickupDate ||
        (form.returnDate === form.pickupDate &&
          form.returnTime > form.pickupTime)) &&
      form.pickupDate >= today;

    // FIXED: Enable button with just valid dates
    // Driver/license requirements are warnings, not blockers
    setIsFormValid(hasValidDates);
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

      // Clear any previous errors for this field
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name === "insurance") setInsuranceFile(file);
    if (name === "driverLicense") setLicenseFile(file);
  };

  const handleLicenseSelection = (licenseId) => {
    setForm((prev) => ({
      ...prev,
      selectedLicense: prev.selectedLicense === licenseId ? null : licenseId,
      selectedDriver: null, // Clear driver selection
      driverName: "", // Clear driver name when selecting existing license
    }));
    // Clear license file when selecting existing license
    setLicenseFile(null);
  };

  const handleDriverSelection = (driverId) => {
    setForm((prev) => ({
      ...prev,
      selectedDriver: prev.selectedDriver === driverId ? null : driverId,
      selectedLicense: null, // Clear license selection
      driverName: "", // Clear driver name when selecting verified driver
    }));
    // Clear files when selecting verified driver
    setLicenseFile(null);
    setInsuranceFile(null);
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

  // FIXED: Simplified submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FIXED: Only check for date validity, not full form validity
    const hasValidDates =
      form.pickupDate &&
      form.returnDate &&
      form.pickupTime &&
      form.returnTime &&
      (form.returnDate > form.pickupDate ||
        (form.returnDate === form.pickupDate &&
          form.returnTime > form.pickupTime)) &&
      form.pickupDate >= new Date().toISOString().split("T")[0];

    if (!hasValidDates) {
      setFormErrors((prev) => ({
        ...prev,
        submit: "Please select valid pickup and return dates/times",
      }));
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});

    const {
      pickupLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      selectedLicense,
      selectedDriver,
      driverName, // NEW: Include driver name
    } = form;

    try {
      const formData = new FormData();
      formData.append("car", car._id);
      formData.append("pickupLocation", pickupLocation);
      formData.append("pickupDate", pickupDate);
      formData.append("returnDate", returnDate);
      formData.append("pickupTime", pickupTime);
      formData.append("returnTime", returnTime);

      if (selectedDriver) {
        formData.append("driverId", selectedDriver);
      } else {
        if (selectedLicense) formData.append("license", selectedLicense);
        if (insuranceFile) formData.append("insurance", insuranceFile);
        if (licenseFile) formData.append("driverLicense", licenseFile);
        // NEW: Add driver name when uploading new license
        if (driverName.trim() && !selectedLicense) {
          formData.append("driverName", driverName.trim());
        }
      }

      for (let [key, value] of formData) {
        console.log(`${key}:${value}`);
      }
      const booking = await createBooking(formData);

      const bookingData = JSON.parse(JSON.stringify(booking));

      const bookingId = bookingData.data.data._id;

      navigate("/checkout", { state: { bookingId: bookingId } });
    } catch (error) {
      console.error("Booking failed:", error);
      setFormErrors((prev) => ({
        ...prev,
        submit: "Booking failed. Please try again.",
      }));
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

    const start = new Date(`${form.pickupDate}T${form.pickupTime}`);
    const end = new Date(`${form.returnDate}T${form.returnTime}`);

    // Calculate hours difference
    const hoursDifference = (end - start) / (1000 * 60 * 60);

    // Minimum 1 day charge
    const days = Math.max(hoursDifference / 24, 1);

    return days > 0 ? Math.ceil(days) * car.pricePerDay : 0;
  };

  const totalDays = calculateTotal() / car.pricePerDay;
  const totalPrice = calculateTotal();
  const serviceFee = 29.99;
  const grandTotal = totalPrice + serviceFee;

  // Get minimum date for return date (pickup date)
  const getMinReturnDate = () => {
    if (!form.pickupDate) return "";
    return form.pickupDate;
  };

  // Get maximum date (30 days from pickup)
  const getMaxReturnDate = () => {
    if (!form.pickupDate) return "";
    const maxDate = new Date(form.pickupDate);
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  // Get available return times based on pickup date and time
  const getAvailableReturnTimes = () => {
    if (form.pickupDate !== form.returnDate) {
      return TIME_OPTIONS;
    }

    // If same day, only show times after pickup time
    return TIME_OPTIONS.filter((time) => time > form.pickupTime);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormHeader>
        <h2>Book Your Adventure</h2>
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

      {/* Date & Time Selection */}
      <FormSection>
        <SectionTitle> Select Dates & Times</SectionTitle>
        <DateTimeGrid>
          <FormGroup>
            <Label htmlFor="pickupLocation">Pick-up Location</Label>
            <Select
              id="pickupLocation"
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
          <FormRow>
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
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label htmlFor="pickupTime">Pick-up Time *</Label>
              <Select
                id="pickupTime"
                name="pickupTime"
                value={form.pickupTime}
                onChange={handleChange}
                required
              >
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="returnTime">Return Time *</Label>
              <Select
                id="returnTime"
                name="returnTime"
                value={form.returnTime}
                onChange={handleChange}
                disabled={!form.returnDate}
                required
                $error={!!formErrors.returnTime}
              >
                {getAvailableReturnTimes().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Select>
              {formErrors.returnTime && (
                <FieldError>{formErrors.returnTime}</FieldError>
              )}
            </FormGroup>
          </FormRow>
        </DateTimeGrid>

        {/* Price Summary */}
        {totalDays > 0 && (
          <PriceSummary>
            <SummaryItem>
              <span>
                ${car.pricePerDay} × {Math.ceil(totalDays)}{" "}
                {Math.ceil(totalDays) === 1 ? "day" : "days"}
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
          <SectionTitle> Select Verified Driver</SectionTitle>
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
                    <DriverBadge> Verified</DriverBadge>
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
          <SectionTitle> Upload Documents</SectionTitle>

          {/* NEW: Driver Name Field - Only show when uploading new license */}
          {/* {showDriverNameField && ( */}
          <DriverNameSection>
            <FormGroup>
              <Label htmlFor="driverName">👤 Driver Name *</Label>
              <Input
                id="driverName"
                type="text"
                name="driverName"
                value={form.driverName}
                onChange={handleChange}
                placeholder="Enter the driver's full name"
                $error={!!formErrors.driverName}
              />
              {formErrors.driverName && (
                <FieldError>{formErrors.driverName}</FieldError>
              )}
              <DriverNameHint>
                Please enter the name exactly as it appears on the driver's
                license
              </DriverNameHint>
            </FormGroup>
          </DriverNameSection>
          {/* )} */}

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
                    {hasExistingLicenses && !form.selectedLicense
                      ? "Required if no license selected"
                      : "Optional"}
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
        disabled={!isFormValid || isSubmitting}
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
            Reserve Now - $
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
            ? "✅ Ready to book!"
            : "⏳ Select valid pickup and return dates/times"}
        </StatusIndicator>
      </FormStatus>
    </FormContainer>
  );
};

export default BookingForm;

// Enhanced Styled Components with Global Styles
const FormContainer = styled.form`
  width: 100%;
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-lg);
  animation: ${slideUp} 0.6s ease-out;
  border: 1px solid var(--gray-200);

  @media ${devices.sm} {
    padding: var(--space-sm);
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 2px solid var(--gray-100);

  h2 {
    margin: 0;
    color: var(--text-primary);
    font-size: var(--text-3xl);
    font-family: var(--font-heading);
    font-weight: var(--font-semibold);
  }

  @media ${devices.sm} {
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-sm);
  }
`;

const PriceDisplay = styled.div`
  text-align: right;
`;

const Price = styled.span`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--primary-dark);
  font-family: var(--font-heading);
`;

const PriceLabel = styled.span`
  font-size: var(--text-base);
  color: var(--secondary);
  margin-left: var(--space-xs);
`;

const FormSection = styled(Card)`
  margin-bottom: var(--space-sm);
  padding: var(--space-sm);
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
`;

const SectionTitle = styled.h3`
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-primary);
  font-size: var(--text-2xl);
  font-family: var(--font-heading);
  font-weight: var(--font-semibold);
  display: flex;
  align-items: center;
`;

// NEW: Driver Name Section
const DriverNameSection = styled.div`
  margin-bottom: var(--space-xs);
  /* padding: var(--space-xs); */
  /* background: var(--primary-light); */
  /* border-radius: var(--radius-lg); */
  /* border-left: 4px solid var(--primary); */
`;

const DriverNameHint = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
  padding: 0 0 0 var(--space-md);
  /* margin-top: var(--space-xs); */
  font-style: italic;
`;

// NEW: Updated grid for date and time fields
const DateTimeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--space-md);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// FIXED: Added missing Select component
const Select = styled.select`
  padding: var(--space-sm);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  transition: all var(--transition-normal);
  background: var(--white);
  font-family: var(--font-body);
  width: 100%;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }

  &:disabled {
    background: var(--gray-100);
    color: var(--text-muted);
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: var(--space-md);
  border: 2px solid
    ${(props) => (props.$error ? "var(--error)" : "var(--gray-300)")};
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all var(--transition-normal);
  background: var(--white);
  font-family: var(--font-body);
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$error ? "var(--error)" : "var(--primary)"};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$error ? "rgba(239, 68, 68, 0.1)" : "rgba(211, 47, 47, 0.1)"};
  }

  &:disabled {
    background: var(--gray-100);
    color: var(--text-muted);
    cursor: not-allowed;
  }
`;

const FieldError = styled(ErrorMessageBase)`
  margin-top: var(--space-xs);
  font-size: var(--text-sm);
`;

const PriceSummary = styled.div`
  margin-top: var(--space-md);
  padding: var(--space-md);
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  color: var(--text-muted);
  font-family: var(--font-body);

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-100);
  }
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  padding: var(--space-md) 0 0 0;
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  color: var(--text-primary);
  border-top: 2px solid var(--gray-200);
  font-family: var(--font-body);
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: var(--space-md); */
`;

const DriverCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  border: 2px solid
    ${(props) => (props.selected ? "var(--primary)" : "var(--gray-300)")};
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  animation: ${slideUp} 0.4s ease-out;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const DriverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const DriverAvatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
`;

const DriverDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  @media ${devices.sm} {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`;

const DriverName = styled.strong`
  font-size: var(--text-lg);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const DriverBadge = styled.span`
  font-size: var(--text-sm);
  color: var(--success);
  background: var(--gray-100);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  width: fit-content;
  font-family: var(--font-body);
`;

const LicenseCard = styled(DriverCard)``;

const LicenseInfo = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: var(--space-sm); */
`;

const LicenseNumber = styled.strong`
  font-size: var(--text-lg);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const LicenseDetails = styled.div`
  display: flex;
  /* gap: var(--space-md); */
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);

  @media (max-width: 480px) {
    flex-direction: column;
    /* gap: var(--space-xs); */
  }
`;

const Radio = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid
    ${(props) => (props.selected ? "var(--primary)" : "var(--gray-400)")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.selected ? "var(--primary)" : "var(--white)"};
  transition: all var(--transition-normal);
`;

const RadioDot = styled.div`
  width: 8px;
  height: 8px;
  background: var(--white);
  border-radius: 50%;
`;

const FileUploadGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FileUploadGroup = styled(FormGroup)``;

const FileLabel = styled.label`
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const FileUploadBox = styled.div`
  padding: var(--space-lg);
  border: 2px dashed
    ${(props) => (props.$error ? "var(--error)" : "var(--gray-400)")};
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all var(--transition-normal);
  background: var(--white);
  cursor: pointer;

  &:hover {
    border-color: ${(props) =>
      props.$error ? "var(--error)" : "var(--primary)"};
    background: var(--gray-50);
  }
`;

const FileIcon = styled.div`
  font-size: 2rem;
  margin-bottom: var(--space-sm);
`;

const FileText = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
  font-family: var(--font-body);
`;

const FileHint = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);
`;

const NoticeBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--accent);
  border-radius: var(--radius-lg);
  /* border-left: 4px solid var(--primary); */
  margin: var(--space-lg) 0;
`;

const NoticeIcon = styled.div`
  font-size: 1.5rem;
`;

const NoticeText = styled.p`
  margin: 0;
  color: var(--white);
  font-size: var(--text-base);
  line-height: 1.5;
  font-weight: var(--font-semibold);
  font-family: var(--font-body);
`;

const SubmitButton = styled(PrimaryButton)`
  width: 100%;
  padding: var(--space-lg) var(--space-2xl);
  background: ${(props) => {
    if (props.$submitting) return "var(--gray-400)";
    if (!props.$isValid) return "var(--gray-300)";
    return "var(--gradient-primary)";
  }};
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  cursor: ${(props) =>
    props.$submitting || !props.$isValid ? "not-allowed" : "pointer"};
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  animation: ${(props) =>
      props.$isValid && !props.$submitting ? pulse : "none"}
    2s infinite;

  &:hover:not(:disabled) {
    transform: ${(props) =>
      props.$isValid && !props.$submitting ? "translateY(-2px)" : "none"};
    box-shadow: ${(props) =>
      props.$isValid && !props.$submitting ? "var(--shadow-lg)" : "none"};
  }
`;

const Spinner = styled(LoadingSpinner)`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid var(--white);
`;

const FormStatus = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--space-md);
`;

const StatusIndicator = styled.div`
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  background: ${(props) =>
    props.$valid ? "var(--gray-100)" : "var(--gray-100)"};
  color: ${(props) => (props.$valid ? "var(--success)" : "var(--warning)")};
  font-family: var(--font-body);
`;

const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--gray-50);
  border: 1px solid var(--error);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  animation: ${(props) => (props.$shake ? shake : "none")} 0.5s ease-in-out;
`;

const ErrorIcon = styled.div`
  font-size: var(--text-lg);
`;

const ErrorText = styled.span`
  color: var(--error);
  font-weight: var(--font-medium);
  flex: 1;
  font-family: var(--font-body);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: var(--text-xl);
  color: var(--error);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: var(--gray-200);
  }
`;
const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
