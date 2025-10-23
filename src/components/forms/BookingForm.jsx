/* eslint-disable react/prop-types */
// src/components/booking/BookingForm.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useCreateBooking, useGetCarBookings } from "../../hooks/useBooking";
import { useNavigate } from "react-router-dom";
import { devices } from "../../styles/GlobalStyles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {pulse, slideUp,  shake} from '../../styles/animations';

// Import UI Components
import {
  FormGroup,
  Label,
  ErrorMessage as ErrorMessageBase,
} from "../forms/Form";
import { PrimaryButton } from "../ui/Button";
import { Card } from "../Cards/Card";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ErrorState, LoadingState } from "../ui/LoadingSpinner";

// Time options for dropdown - All times from 6:00 AM to 10:00 PM
const TIME_OPTIONS = [
  "01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  "22:00","22:30","23:00","23:30","24:00"
];

// Only St. Louis city available
const MISSOURI_CITIES = [
  "St. Louis"
];

const BookingForm = ({ car, licenses, drivers }) => {
  // Hook states with proper error handling
  const { 
    mutateAsync: createBooking, 
    error: createBookingError, 
    isError: isCreateBookingError, 
    reset: resetCreateBooking,
    isLoading: isCreatingBooking 
  } = useCreateBooking();

  const { 
    data: bookingsData, 
    error: bookingsError, 
    isError: isBookingsError, 
    isLoading: isBookingsLoading,
    refetch: refetchBookings 
  } = useGetCarBookings(car?._id);

  const carBookings = useMemo(() => {
    return bookingsData?.data?.data || [];
  }, [bookingsData]);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    pickupLocation: "St. Louis",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    selectedLicense: null,
    selectedDriver: null,
    driverName: "",
  });

  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [availableTimes, setAvailableTimes] = useState({
    pickup: TIME_OPTIONS,
    return: TIME_OPTIONS,
  });
  const [conflictingDates, setConflictingDates] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getToday = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split("T")[0];
  }, []);

  // Get yesterday's date in YYYY-MM-DD format
  const getYesterday = useCallback(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return yesterday.toISOString().split("T")[0];
  }, []);

  // Enhanced error message extraction
  const getErrorMessage = useCallback((error) => {
    if (!error) return null;
    
    // Axios error structure
    if (error.response?.data) {
      const { data } = error.response;
      
      // Handle different backend error formats
      if (typeof data === 'string') {
        return data;
      }
      if (data.message) {
        return data.message;
      }
      if (data.error) {
        return data.error;
      }
      if (data.errors && Array.isArray(data.errors)) {
        return data.errors.join(', ');
      }
      if (typeof data === 'object') {
        // Try to get first error message from object
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError)) {
          return firstError[0];
        }
        return firstError || 'An error occurred';
      }
    }
    
    // Network error or other error types
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }, []);

  const getBookingErrorMessage = useCallback(() => {
    return getErrorMessage(createBookingError) || getErrorMessage(bookingsError);
  }, [createBookingError, bookingsError, getErrorMessage]);

  // Get all booked dates from existing bookings
  const getBookedDates = useCallback(() => {
    const bookedDates = new Set();

    carBookings.forEach((booking) => {
      if (["cancelled", "rejected"].includes(booking.status)) return;

      const start = new Date(booking.pickupDate);
      const end = new Date(booking.returnDate);

      // Add all dates between start and end (inclusive)
      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        bookedDates.add(date.toISOString().split("T")[0]);
      }
    });

    return Array.from(bookedDates);
  }, [carBookings]);

  // Enhanced booking conflict detection
  const hasBookingConflict = useCallback(
    (pickupDate, pickupTime, returnDate, returnTime) => {
      if (!carBookings.length) return false;

      const requestedPickup = new Date(`${pickupDate}T${pickupTime}`);
      const requestedReturn = new Date(`${returnDate}T${returnTime}`);

      // Check if any dates are booked
      const bookedDates = getBookedDates();
      const start = new Date(pickupDate);
      const end = new Date(returnDate);

      for (
        let date = new Date(start);
        date <= end;
        date.setDate(date.getDate() + 1)
      ) {
        const dateString = date.toISOString().split("T")[0];
        if (bookedDates.includes(dateString)) {
          return true;
        }
      }

      // Check for time conflicts
      return carBookings.some((booking) => {
        if (["cancelled", "rejected", "completd"].includes(booking.status)) return false;

        const existingPickup = new Date(
          `${booking.pickupDate}T${booking.pickupTime}`
        );
        const existingReturn = new Date(
          `${booking.returnDate}T${booking.returnTime}`
        );

        // Check for any overlap
        const hasOverlap =
          (requestedPickup >= existingPickup &&
            requestedPickup < existingReturn) ||
          (requestedReturn > existingPickup &&
            requestedReturn <= existingReturn) ||
          (requestedPickup <= existingPickup &&
            requestedReturn >= existingReturn);

        return hasOverlap;
      });
    },
    [carBookings, getBookedDates]
  );

  // Get conflicting dates for current selection
  const getConflictingDates = useCallback(() => {
    if (!form.pickupDate || !form.returnDate) return [];

    const bookedDates = getBookedDates();
    const start = new Date(form.pickupDate);
    const end = new Date(form.returnDate);
    const conflicts = [];

    for (
      let date = new Date(start);
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      const dateString = date.toISOString().split("T")[0];
      if (bookedDates.includes(dateString)) {
        conflicts.push(dateString);
      }
    }

    return conflicts;
  }, [form.pickupDate, form.returnDate, getBookedDates]);

  // Get available time slots based on selected date
  const getAvailableTimes = useCallback(
    (date) => {
      if (!date) return TIME_OPTIONS;

      // If the date is fully booked, return empty array
      if (getBookedDates().includes(date)) {
        return [];
      }

      const today = getToday();
      const yesterday = getYesterday();
      
      // Prevent booking on yesterday or any past date
      if (date <= yesterday) {
        return [];
      }

      // If it's today, only show times from current time onward
      if (date === today) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        // Filter times to only include future times
        return TIME_OPTIONS.filter(time => time >= currentTime);
      }

      // For future dates, return all times
      return TIME_OPTIONS;
    },
    [getBookedDates, getToday, getYesterday]
  );

  // Get disabled dates for DatePicker - Enhanced to include past dates
  const getDisabledDates = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const disabledDates = [];

    // Add all past dates including yesterday
    disabledDates.push({ before: today });

    // Add dates beyond 30 days from today
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    disabledDates.push({ after: maxDate });

    // Add booked dates
    const bookedDates = getBookedDates();
    bookedDates.forEach((dateStr) => {
      const date = new Date(dateStr);
      if (date >= today) { // Only disable booked dates that are today or in the future
        disabledDates.push(date);
      }
    });

    return disabledDates;
  }, [getBookedDates]);

  // Enhanced validation with conflict checking and past date prevention
  const validateForm = useCallback(() => {
    const errors = {};
    const yesterday = getYesterday();

    // Date validation - Enhanced to prevent past dates
    if (form.pickupDate && form.returnDate) {
      // Prevent booking on yesterday or any past date
      if (form.pickupDate <= yesterday) {
        errors.pickupDate = "Pickup date cannot be in the past. Please select today or a future date.";
      }

      // Prevent return date from being in the past
      if (form.returnDate <= yesterday) {
        errors.returnDate = "Return date cannot be in the past. Please select today or a future date.";
      }

      // Check if it's the same date but return time is before pickup time
      if (form.pickupDate === form.returnDate) {
        if (form.returnTime <= form.pickupTime) {
          errors.returnTime =
            "Return time must be after pickup time on the same day";
        }
      } else if (form.returnDate < form.pickupDate) {
        errors.returnDate = "Return date must be after pickup date";
      }

      const pickup = new Date(`${form.pickupDate}T${form.pickupTime}`);
      const returnDate = new Date(`${form.returnDate}T${form.returnTime}`);
      const daysDifference = (returnDate - pickup) / (1000 * 60 * 60 * 24);

      if (daysDifference > 30) {
        errors.returnDate = "Maximum rental period is 30 days";
      }

      // Enhanced: Check for booking conflicts
      if (
        form.pickupDate &&
        form.pickupTime &&
        form.returnDate &&
        form.returnTime
      ) {
        const hasConflict = hasBookingConflict(
          form.pickupDate,
          form.pickupTime,
          form.returnDate,
          form.returnTime
        );

        if (hasConflict) {
          const conflicts = getConflictingDates();
          if (conflicts.length > 0) {
            errors.conflict = `The following dates are already booked: ${conflicts.join(
              ", "
            )}. Please choose different dates.`;
          } else {
            errors.conflict =
              "Selected dates/times are not available. Please choose different dates or times.";
          }
        }
      }
    }

    // Driver and license validation
    if (!form.selectedDriver) {
      const hasExistingLicenses = licenses && licenses.length > 0;

      if (hasExistingLicenses && !form.selectedLicense && !licenseFile) {
        errors.license = "Please select a license or upload a new one";
      } else if (!hasExistingLicenses && !licenseFile) {
        errors.license = "Please upload your driver license";
      }

      if (!form.selectedLicense && licenseFile && !form.driverName.trim()) {
        errors.driverName =
          "Driver name is required when uploading a new license";
      }
    }

    // Terms acceptance validation
    if (!acceptedTerms) {
      errors.terms = "You must accept the terms and conditions to proceed";
    }

    setFormErrors(errors);

    // Update conflicting dates
    setConflictingDates(getConflictingDates());

    // Form is valid only when dates are valid AND no conflicts AND not in the past AND terms accepted
    const hasValidDates = Boolean(
      form.pickupDate &&
        form.returnDate &&
        form.pickupTime &&
        form.returnTime &&
        form.pickupDate > yesterday &&
        form.returnDate > yesterday &&
        (form.returnDate > form.pickupDate ||
          (form.returnDate === form.pickupDate &&
            form.returnTime > form.pickupTime)) &&
        !errors.conflict
    );

    setIsFormValid(hasValidDates && acceptedTerms);
  }, [form, licenseFile, hasBookingConflict, licenses, getConflictingDates, getYesterday, acceptedTerms]);

  // Validate form whenever form state changes
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  // Update available times when dates change
  useEffect(() => {
    if (form.pickupDate) {
      const pickupTimes = getAvailableTimes(form.pickupDate);
      setAvailableTimes((prev) => ({ ...prev, pickup: pickupTimes }));

      // If pickup time is no longer available or not set, set it to the first available time
      if (!form.pickupTime || !pickupTimes.includes(form.pickupTime)) {
        setForm((prev) => ({ 
          ...prev, 
          pickupTime: pickupTimes[0] || "" 
        }));
      }
    }

    if (form.returnDate) {
      const returnTimes = getAvailableTimes(form.returnDate);
      setAvailableTimes((prev) => ({ ...prev, return: returnTimes }));

      // If return time is no longer available or not set, set it to the first available time
      if (!form.returnTime || !returnTimes.includes(form.returnTime)) {
        setForm((prev) => ({ 
          ...prev, 
          returnTime: returnTimes[0] || "" 
        }));
      }
    }
  }, [
    form.pickupDate,
    form.returnDate,
    form.pickupTime,
    form.returnTime,
    getAvailableTimes,
  ]);

  // Refresh bookings data periodically to catch recent bookings
  useEffect(() => {
    const interval = setInterval(() => {
      refetchBookings();
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, [refetchBookings]);

  // Clear errors when user starts typing
  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      setFormErrors({});
    }
    if (isCreateBookingError) {
      resetCreateBooking();
    }
  }, [form.pickupDate, form.returnDate, formErrors, isCreateBookingError, resetCreateBooking]);

  // Handle DatePicker changes with past date prevention
  const handlePickupDateChange = (date) => {
    if (!date) {
      setPickupDate(null);
      setForm((prev) => ({ ...prev, pickupDate: "" }));
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent selection of past dates
    if (date < today) {
      setFormErrors((prev) => ({
        ...prev,
        pickupDate: "Cannot select past dates. Please choose today or a future date."
      }));
      return;
    }

    setPickupDate(date);
    const dateString = date ? date.toISOString().split("T")[0] : "";
    setForm((prev) => ({
      ...prev,
      pickupDate: dateString,
      // Reset return date if it's before the new pickup date
      ...(returnDate && date && returnDate < date && { returnDate: "" }),
    }));

    if (returnDate && date && returnDate < date) {
      setReturnDate(null);
    }
  };

  const handleReturnDateChange = (date) => {
    if (!date) {
      setReturnDate(null);
      setForm((prev) => ({ ...prev, returnDate: "" }));
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent selection of past dates
    if (date < today) {
      setFormErrors((prev) => ({
        ...prev,
        returnDate: "Cannot select past dates. Please choose today or a future date."
      }));
      return;
    }

    setReturnDate(date);
    const dateString = date ? date.toISOString().split("T")[0] : "";
    setForm((prev) => ({ ...prev, returnDate: dateString }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      const maxSize = 5 * 1024 * 1024;

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

      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    if (name === "insurance") setInsuranceFile(file);
    if (name === "driverLicense") setLicenseFile(file);
  };

  const handleLicenseSelection = (licenseId) => {
    setForm((prev) => ({
      ...prev,
      selectedLicense: prev.selectedLicense === licenseId ? null : licenseId,
      selectedDriver: null,
      driverName: "",
    }));
    setLicenseFile(null);
  };

  const handleDriverSelection = (driverId) => {
    setForm((prev) => ({
      ...prev,
      selectedDriver: prev.selectedDriver === driverId ? null : driverId,
      selectedLicense: null,
      driverName: "",
    }));
    setLicenseFile(null);
    setInsuranceFile(null);
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
    if (formErrors.terms) {
      setFormErrors(prev => ({ ...prev, terms: null }));
    }
  };

  // Enhanced submit handler with comprehensive conflict checking and past date validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check terms acceptance
    if (!acceptedTerms) {
      setFormErrors((prev) => ({
        ...prev,
        terms: "You must accept the terms and conditions to proceed"
      }));
      return;
    }

    // Refresh bookings data before final check
    await refetchBookings();

    const yesterday = getYesterday();

    // Final validation for past dates
    if (form.pickupDate <= yesterday || form.returnDate <= yesterday) {
      setFormErrors((prev) => ({
        ...prev,
        submit: "Cannot book for past dates. Please select today or future dates."
      }));
      return;
    }

    // Final comprehensive conflict check before submission
    if (
      form.pickupDate &&
      form.pickupTime &&
      form.returnDate &&
      form.returnTime
    ) {
      const hasConflict = hasBookingConflict(
        form.pickupDate,
        form.pickupTime,
        form.returnDate,
        form.returnTime
      );

      if (hasConflict) {
        const conflicts = getConflictingDates();
        if (conflicts.length > 0) {
          setFormErrors((prev) => ({
            ...prev,
            submit: `Sorry, the dates ${conflicts.join(
              ", "
            )} are already booked. Please select different dates.`,
          }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            submit:
              "Sorry, this time slot was just booked by someone else. Please select different dates/times.",
          }));
        }
        return;
      }
    }

    const hasValidDates = Boolean(
      form.pickupDate &&
        form.returnDate &&
        form.pickupTime &&
        form.returnTime &&
        form.pickupDate > yesterday &&
        form.returnDate > yesterday &&
        (form.returnDate > form.pickupDate ||
          (form.returnDate === form.pickupDate &&
            form.returnTime > form.pickupTime))
    );

    if (!hasValidDates) {
      setFormErrors((prev) => ({
        ...prev,
        submit: "Please select valid pickup and return dates/times (today or future dates only)",
      }));
      return;
    }

    setFormErrors({});

    const {
      pickupLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      selectedLicense,
      selectedDriver,
      driverName,
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
        if (driverName.trim() && !selectedLicense) {
          formData.append("driverName", driverName.trim());
        }
      }

      const booking = await createBooking(formData);
      
      const bookingData = JSON.parse(JSON.stringify(booking));
      const bookingId = bookingData.data.data._id;

      navigate("/checkout", { state: { bookingId: bookingId } });
    } catch (error) {
      console.error("Booking failed:", error);
      
      // Extract backend error message
      const backendError = getErrorMessage(error);
      
      if (
        backendError?.includes("already booked") ||
        backendError?.includes("conflict") ||
        backendError?.includes("available") ||
        backendError?.includes("overlap")
      ) {
        setFormErrors((prev) => ({
          ...prev,
          submit: backendError || "This time slot is no longer available. Please select different dates/times.",
        }));
        await refetchBookings();
      } else {
        setFormErrors((prev) => ({
          ...prev,
          submit: backendError || "Booking failed. Please try again.",
        }));
      }
    }
  };

  const hasExistingLicenses = licenses && licenses.length > 0;
  const verifiedDrivers = useMemo(
    () =>
      drivers?.filter(
        (d) => d.license?.verified === true && d.insurance?.verified === true
      ) || [],
    [drivers]
  );

  // Calculate total days and price
  const calculateTotal = useCallback(() => {
    if (!form.pickupDate || !form.returnDate) return 0;

    const start = new Date(`${form.pickupDate}T${form.pickupTime}`);
    const end = new Date(`${form.returnDate}T${form.returnTime}`);

    const hoursDifference = (end - start) / (1000 * 60 * 60);
    const days = Math.max(hoursDifference / 24, 1);

    return days > 0 ? Math.ceil(days) * car.pricePerDay : 0;
  }, [
    form.pickupDate,
    form.returnDate,
    form.pickupTime,
    form.returnTime,
    car.pricePerDay,
  ]);

  const totalPrice = calculateTotal();
  const totalDays = totalPrice / car.pricePerDay;
  const serviceFee = 29.99;
  const grandTotal = totalPrice + serviceFee;

  // Get available return times - Now returns all times
  const getAvailableReturnTimes = useCallback(() => {
    // Return all available return times without filtering by pickup time
    return availableTimes.return;
  }, [availableTimes.return]);

  // Check if current selection has booking conflict
  const hasCurrentConflict = useCallback(() => {
    if (
      !form.pickupDate ||
      !form.pickupTime ||
      !form.returnDate ||
      !form.returnTime
    ) {
      return false;
    }
    return hasBookingConflict(
      form.pickupDate,
      form.pickupTime,
      form.returnDate,
      form.returnTime
    );
  }, [
    form.pickupDate,
    form.pickupTime,
    form.returnDate,
    form.returnTime,
    hasBookingConflict,
  ]);

  // Check if current selection includes past dates
  const hasPastDates = useCallback(() => {
    const yesterday = getYesterday();
    return form.pickupDate <= yesterday || form.returnDate <= yesterday;
  }, [form.pickupDate, form.returnDate, getYesterday]);

  const disabledDates = getDisabledDates();

  // Show loading state while fetching bookings
  if (isBookingsLoading) {
    return (
      <FormContainer>
        <LoadingState 
          message="Loading available dates and times..." 
          size="lg"
        />
      </FormContainer>
    );
  }

  // Show error state if bookings fail to load
  if (isBookingsError) {
    const errorMessage = getErrorMessage(bookingsError);
    return (
      <FormContainer>
        <ErrorState
          title="Failed to load availability"
          message={errorMessage || "We couldn't load the available dates. Please try refreshing the page."}
          action={
            <PrimaryButton onClick={() => refetchBookings()}>
              Try Again
            </PrimaryButton>
          }
        />
      </FormContainer>
    );
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Loading overlay for creating booking */}
      {isCreatingBooking && (
        <LoadingOverlay>
          <LoadingSpinner size="lg" />
          <LoadingText>Creating your booking...</LoadingText>
        </LoadingOverlay>
      )}

      <FormHeader>
        <h2>Book Your Adventure</h2>
        <PriceDisplay>
          <Price>${car.pricePerDay}</Price>
          <PriceLabel>/day</PriceLabel>
        </PriceDisplay>
      </FormHeader>

      {/* Error Display */}
      {(isCreateBookingError || formErrors.submit || formErrors.conflict) && (
        <ErrorBox $shake={!!(formErrors.submit || formErrors.conflict)}>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorText>
            {formErrors.submit || formErrors.conflict || getBookingErrorMessage()}
          </ErrorText>
          <CloseButton
            onClick={() => {
              resetCreateBooking();
              setFormErrors((prev) => ({
                ...prev,
                submit: null,
                conflict: null,
              }));
            }}
          >
            ×
          </CloseButton>
        </ErrorBox>
      )}

      {/* Date & Time Selection */}
      <FormSection>
        {/* Loading indicator for bookings refresh */}
        {isBookingsLoading && (
          <LoadingIndicator>
            <LoadingSpinner size="sm" />
            <span>Checking latest availability...</span>
          </LoadingIndicator>
        )}
        {/* Conflicting Dates Warning */}
        {conflictingDates.length > 0 && (
          <ConflictingDatesWarning>
            <WarningIcon>❌</WarningIcon>
            <WarningText>
              <strong>Selected Dates Not Available:</strong>{" "}
              {conflictingDates.join(", ")}
            </WarningText>
          </ConflictingDatesWarning>
        )}

        <DateTimeGrid>
          <FormGroup>
            <Label htmlFor="pickupLocation">Pick-up Location</Label>
            <Select
              id="pickupLocation"
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={handleChange}
              disabled={isCreatingBooking || isBookingsLoading}
            >
              {MISSOURI_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Select>
          </FormGroup>

          {/* DatePicker Section */}
          <DatePickerRow>
            <FormGroup>
              <Label htmlFor="pickupDate">Pick-up Date *</Label>
              <StyledDatePicker
                selected={pickupDate}
                onChange={handlePickupDateChange}
                selectsStart
                startDate={pickupDate}
                endDate={returnDate}
                minDate={new Date()} // Prevents selection of past dates
                maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                excludeDates={disabledDates}
                placeholderText="Select pickup date"
                dateFormat="MMMM d, yyyy"
                className="booking-datepicker"
                wrapperClassName="datepicker-wrapper"
                required
                disabled={isCreatingBooking || isBookingsLoading}
                filterDate={(date) => {
                  // Additional filter to ensure no past dates can be selected
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date >= today;
                }}
              />
              {formErrors.pickupDate && (
                <FieldError>{formErrors.pickupDate}</FieldError>
              )}
              <DateHint>Pickup date must be today or a future date</DateHint>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="returnDate">Return Date *</Label>
              <StyledDatePicker
                selected={returnDate}
                onChange={handleReturnDateChange}
                selectsEnd
                startDate={pickupDate}
                endDate={returnDate}
                minDate={pickupDate || new Date()} // Prevents selection of past dates
                maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                excludeDates={disabledDates}
                placeholderText="Select return date"
                dateFormat="MMMM d, yyyy"
                disabled={!pickupDate || isCreatingBooking || isBookingsLoading}
                className="booking-datepicker"
                wrapperClassName="datepicker-wrapper"
                required
                filterDate={(date) => {
                  // Additional filter to ensure no past dates can be selected
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date >= today;
                }}
              />
              {formErrors.returnDate && (
                <FieldError>{formErrors.returnDate}</FieldError>
              )}
              <DateHint>Return date must be today or a future date</DateHint>
            </FormGroup>
          </DatePickerRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="pickupTime">Pick-up Time *</Label>
              <Select
                id="pickupTime"
                name="pickupTime"
                value={form.pickupTime}
                onChange={handleChange}
                required
                $error={!!formErrors.pickupTime}
                disabled={availableTimes.pickup.length === 0 || isCreatingBooking || isBookingsLoading}
              >
                {availableTimes.pickup.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
                {availableTimes.pickup.length === 0 && (
                  <option disabled>No available times</option>
                )}
              </Select>
              {formErrors.pickupTime && (
                <FieldError>{formErrors.pickupTime}</FieldError>
              )}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="returnTime">Return Time *</Label>
              <Select
                id="returnTime"
                name="returnTime"
                value={form.returnTime}
                onChange={handleChange}
                disabled={
                  !form.returnDate || availableTimes.return.length === 0 || isCreatingBooking || isBookingsLoading
                }
                required
                $error={!!formErrors.returnTime}
              >
                {getAvailableReturnTimes().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
                {getAvailableReturnTimes().length === 0 && (
                  <option disabled>No available times</option>
                )}
              </Select>
              {formErrors.returnTime && (
                <FieldError>{formErrors.returnTime}</FieldError>
              )}
            </FormGroup>
          </FormRow>
        </DateTimeGrid>

        {/* Real-time Availability Status */}
        {form.pickupDate &&
          form.pickupTime &&
          form.returnDate &&
          form.returnTime && (
            <AvailabilityStatus $available={!hasCurrentConflict() && !hasPastDates()}>
              <StatusIcon>
                {isBookingsLoading ? (
                  <LoadingSpinner size="xs" />
                ) : hasCurrentConflict() || hasPastDates() ? (
                  "❌"
                ) : (
                  "✅"
                )}
              </StatusIcon>
              <StatusText>
                {isBookingsLoading
                  ? "Checking availability..."
                  : hasPastDates()
                  ? "Cannot book past dates"
                  : hasCurrentConflict()
                  ? `Dates not available: ${
                      conflictingDates.join(", ") || "Time conflict"
                    }`
                  : "These dates/times are available"}
              </StatusText>
            </AvailabilityStatus>
          )}

        {/* Price Summary */}
        {totalDays > 0 && !hasPastDates() && (
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
          <SectionTitle> Select Verified Driver  {" "}  <DriverBadge> Verified</DriverBadge></SectionTitle>
          <CardsContainer>
            {verifiedDrivers.map((driver) => (
              <DriverCard
                key={driver._id}
                selected={form.selectedDriver === driver._id}
                onClick={() => !isCreatingBooking && handleDriverSelection(driver._id)}
                $disabled={isCreatingBooking || isBookingsLoading}
              >
                <DriverInfo>
                  <DriverDetails>
                    <DriverName>{driver.name}</DriverName>
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
                onClick={() => !isCreatingBooking && handleLicenseSelection(license._id)}
                $disabled={isCreatingBooking || isBookingsLoading}
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
                disabled={isCreatingBooking || isBookingsLoading}
              />
              {formErrors.driverName && (
                <FieldError>{formErrors.driverName}</FieldError>
              )}
              <DriverNameHint>
                Please enter the name exactly as it appears on the driver&apos;s
                license
              </DriverNameHint>
            </FormGroup>
          </DriverNameSection>

          <FileUploadGrid>
            <FileUploadGroup>
              <FileLabel>
                <FileInput
                  type="file"
                  name="insurance"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  disabled={isCreatingBooking || isBookingsLoading}
                />
                <FileUploadBox $error={!!formErrors.insurance} $disabled={isCreatingBooking || isBookingsLoading}>
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
                  disabled={isCreatingBooking || isBookingsLoading}
                />
                <FileUploadBox $error={!!formErrors.driverLicense} $disabled={isCreatingBooking || isBookingsLoading}>
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

      {/* Terms and Conditions Acceptance */}
      <FormSection>
        <TermsContainer>
          <CheckboxGroup $error={!!formErrors.terms}>
            <CheckboxInput
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={handleTermsChange}
              disabled={isCreatingBooking || isBookingsLoading}
            />
            <CheckboxLabel htmlFor="terms">
              I agree to the{" "}
              <TermsLink 
                href="/terms" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Terms and Conditions
              </TermsLink>{" "}
              and{" "}
              <TermsLink 
                href="/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </TermsLink>
              <RequiredAsterisk>*</RequiredAsterisk>
            </CheckboxLabel>
          </CheckboxGroup>
          {formErrors.terms && (
            <FieldError>{formErrors.terms}</FieldError>
          )}

        </TermsContainer>
      </FormSection>
      {/* Submit Button */}
      <SubmitButton
        type="submit"
        disabled={
          !isFormValid || 
          isCreatingBooking || 
          hasCurrentConflict() || 
          hasPastDates() || 
          isBookingsLoading ||
          !acceptedTerms
        }
        $isValid={isFormValid && !hasCurrentConflict() && !hasPastDates() && acceptedTerms}
        $submitting={isCreatingBooking}
        $hasConflict={hasCurrentConflict() || hasPastDates()}
        $loading={isBookingsLoading}
      >
        {isCreatingBooking ? (
          <>
            <Spinner />
            Processing...
          </>
        ) : isBookingsLoading ? (
          <>
            <Spinner />
            Checking Availability...
          </>
        ) : hasCurrentConflict() || hasPastDates() || !acceptedTerms ? (
          <>❌ {!acceptedTerms ? "Accept Terms to Continue" : "Dates Not Available"}</>
        ) : (
          <>
            Reserve Now - $
            {grandTotal > serviceFee
              ? grandTotal.toFixed(2)
              : (car.pricePerDay + serviceFee).toFixed(2)}
          </>
        )}
      </SubmitButton>

     
    
    </FormContainer>
  );
};

export default BookingForm;

// Styled Components
const FormContainer = styled.form`
  width: 100%;
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-lg);
  animation: ${slideUp} 0.6s ease-out;
  border: 1px solid var(--gray-200);
  position: relative;
 

  @media ${devices.sm} {
    padding: var(--space-sm);
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const DriverNameSection = styled.div`
  margin-bottom: var(--space-xs);
`;

const DriverNameHint = styled.div`
  font-size: var(--text-sm);
  color: var(--text-primary);
  padding: 0 0 0 var(--space-md);
  font-style: italic;
`;

const DateTimeGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

// DatePicker Styled Components
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: var(--space-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: var(--font-body);
  background: var(--white);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(92, 206, 251, 0.1);
  }

  &:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
  }
`;

const DatePickerRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  padding: var(--space-sm);
  border: 2px solid
    ${(props) => (props.$error ? "var(--error)" : "var(--gray-300)")};
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  transition: all var(--transition-normal);
  background: var(--white);
  font-family: var(--font-body);
  width: 100%;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$error ? "var(--error)" : "var(--primary)"};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$error ? "rgba(239, 68, 68, 0.1)" : "rgba(92, 206, 251, 0.1)"};
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
    ${(props) => {
      if (props.$error) return "var(--error)";
      if (props.$unavailable) return "var(--warning)";
      return "var(--gray-300)";
    }};
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all var(--transition-normal);
  background: var(--white);
  font-family: var(--font-body);
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${(props) => {
      if (props.$error) return "var(--error)";
      if (props.$unavailable) return "var(--warning)";
      return "var(--primary)";
    }};
    box-shadow: 0 0 0 3px
      ${(props) => {
        if (props.$error) return "rgba(239, 68, 68, 0.1)";
        if (props.$unavailable) return "rgba(245, 158, 11, 0.1)";
        return "rgba(92, 206, 251, 0.1)";
      }};
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
  color: ${(props) => (props.$warning ? "var(--warning)" : "var(--error)")};
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
  gap: var(--space-sm);
`;

const DriverCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  border: 2px solid
    ${(props) => {
      if (props.$disabled) return "var(--gray-300)";
      return props.selected ? "var(--primary)" : "var(--gray-300)";
    }};
  border-radius: var(--radius-lg);
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-normal);
  animation: ${slideUp} 0.4s ease-out;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) => (props.$disabled ? "var(--gray-300)" : "var(--primary)")};
    transform: ${(props) => (props.$disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) => (props.$disabled ? "none" : "var(--shadow-md)")};
  }
`;

const DriverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const DriverDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const DriverName = styled.strong`
  font-size: var(--text-lg);
  color: var(--text-primary);
  font-family: var(--font-body);
  text-transform: capitalize;
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
`;

const LicenseNumber = styled.strong`
  font-size: var(--text-lg);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const LicenseDetails = styled.div`
  display: flex;
  gap: var(--space-md);
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-family: var(--font-body);

  @media (max-width: 480px) {
    flex-direction: column;
    gap: var(--space-xs);
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
    ${(props) => {
      if (props.$disabled) return "var(--gray-300)";
      return props.$error ? "var(--error)" : "var(--gray-400)";
    }};
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all var(--transition-normal);
  background: var(--white);
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) => {
      if (props.$disabled) return "var(--gray-300)";
      return props.$error ? "var(--error)" : "var(--primary)";
    }};
    background: ${(props) => (props.$disabled ? "var(--white)" : "var(--gray-50)")};
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

const SubmitButton = styled(PrimaryButton)`
  width: 100%;
  padding: var(--space-lg) var(--space-2xl);
  background: ${(props) => {
    if (props.$submitting || props.$loading) return "var(--gray-400)";
    if (props.$hasConflict) return "var(--error)";
    if (!props.$isValid) return "var(--gray-300)";
    return "var(--gradient-primary)";
  }};
  color: var(--white);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  cursor: ${(props) =>
    props.$submitting || !props.$isValid || props.$hasConflict || props.$loading
      ? "not-allowed"
      : "pointer"};
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  animation: ${(props) =>
      props.$isValid && !props.$submitting && !props.$hasConflict && !props.$loading
        ? pulse
        : "none"}
    2s infinite;

  &:hover:not(:disabled) {
    transform: ${(props) =>
      props.$isValid && !props.$submitting && !props.$hasConflict && !props.$loading
        ? "translateY(-2px)"
        : "none"};
    box-shadow: ${(props) =>
      props.$isValid && !props.$submitting && !props.$hasConflict && !props.$loading
        ? "var(--shadow-lg)"
        : "none"};
  }
`;

const Spinner = styled(LoadingSpinner)`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid var(--white);
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConflictingDatesWarning = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--error-light);
  border: 1px solid var(--error);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
`;

const WarningIcon = styled.div`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const WarningText = styled.span`
  font-weight: var(--font-medium);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
`;

const AvailabilityStatus = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: ${(props) =>
    props.$available ? "var(--success-light)" : "var(--error-light)"};
  border: 1px solid
    ${(props) => (props.$available ? "var(--success)" : "var(--error)")};
  border-radius: var(--radius-lg);
  margin-top: var(--space-md);
`;

const StatusIcon = styled.div`
  font-size: 1.25rem;
`;

const StatusText = styled.span`
  font-weight: var(--font-medium);
  color: ${(props) => (props.$available ? "var(--success)" : "var(--error)")};
  font-family: var(--font-body);
`;

// New styled components for loading states
const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: var(--radius-xl);
`;

const LoadingText = styled.div`
  margin-top: var(--space-md);
  color: var(--text-secondary);
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-md);
  font-size: var(--text-sm);
  color: var(--text-muted);
`;

const DateHint = styled.div`
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-top: var(--space-xs);
  font-style: italic;
`;

// Terms and Conditions Styled Components
const TermsContainer = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-sm);
  padding: 0 0 0 var(--space-sm);
  border: 2px solid ${props => props.$error ? 'var(--error)' : 'transparent'};
  border-radius: var(--radius-md);
  background: ${props => props.$error ? 'var(--error-light)' : 'transparent'};
  transition: all var(--transition-normal);
`;

const CheckboxInput = styled.input`
  margin-top: 2px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CheckboxLabel = styled.label`
  font-size: var(--text-base);
  color: var(--text-primary);
  cursor: pointer;
  line-height: 1.5;
  font-family: var(--font-body);
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const TermsLink = styled.a`
  color: var(--primary);
  text-decoration: underline;
  font-weight: var(--font-medium);
  
  &:hover {
    color: var(--primary-dark);
  }
`;

const RequiredAsterisk = styled.span`
  color: var(--error);
  margin-left: 2px;
`;
