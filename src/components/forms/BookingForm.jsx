/* eslint-disable react/prop-types */
// src/components/booking/BookingForm.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useCreateBooking, useGetCarBookings } from "../../hooks/useBooking";
import { useNavigate } from "react-router-dom";
import { devices } from "../../styles/GlobalStyles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { pulse, slideUp, shake } from '../../styles/animations';

// Import UI Components
import {
  FormGroup,
  Label,
  ErrorMessage as ErrorMessageBase,
} from "../forms/Form";
import { PrimaryButton } from "../ui/Button";
import { Card } from "../Cards/Card";
import { 
  LoadingSpinner, 
  ButtonSpinner, 
  LoadingState,
  ErrorState 
} from "../ui/LoadingSpinner";

// USA Date/Time Configuration
const USA_CONFIG = {
  // Central Time for St. Louis
  timeZone: 'America/Chicago',
  timeZoneDisplay: 'Central Time (CT)',
  
  // Business hours (8 AM - 8 PM Central Time)
  businessHours: {
    start: 8,   // 8 AM
    end: 20     // 8 PM
  },
  
  // Minimum rental period (4 hours)
  minRentalHours: 4,
  
  // Maximum rental period (30 days)
  maxRentalDays: 30,
  
  // Available locations
  cities: ["St. Louis"]
};

// Helper function to check if a date is today
const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear();
};

// Helper function to get current time in St. Louis (Central Time)
const getCurrentTimeInStLouis = () => {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/Chicago',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Generate time slots that include current time for today
const generateTimeSlots = (forDate = null) => {
  const slots = [];
  
  // If it's for today, start from current time rounded up to next 30-minute interval
  if (forDate && isToday(new Date(forDate))) {
    const stLouisTime = getCurrentTimeInStLouis();
    const [currentHourStr, currentMinuteStr] = stLouisTime.split(':');
    const currentHour = parseInt(currentHourStr, 10);
    const currentMinute = parseInt(currentMinuteStr, 10);
    
    console.log('Current St. Louis time:', { currentHour, currentMinute, stLouisTime });
    
    // Round up to next 30-minute interval
    let startHour = currentHour;
    let startMinute = currentMinute < 30 ? 30 : 0;
    
    if (currentMinute >= 30) {
      startHour += 1;
      startMinute = 0;
    }
    
    // Ensure we don't start before business hours
    startHour = Math.max(startHour, USA_CONFIG.businessHours.start);
    
    // If we're past business hours for today, return empty array
    if (startHour > USA_CONFIG.businessHours.end) {
      console.log('Past business hours, no slots available');
      return [];
    }
    
    console.log('Generating slots starting from:', { startHour, startMinute });
    
    for (let hour = startHour; hour <= USA_CONFIG.businessHours.end; hour++) {
      for (let minute of ['00', '30']) {
        // Skip the last 30-minute slot if it would go past business hours
        if (hour === USA_CONFIG.businessHours.end && minute === '30') continue;
        
        // For the starting hour, only include minutes that are after current rounded time
        if (hour === startHour) {
          if (minute === '00' && startMinute > 0) continue;
          if (minute === '30' && startMinute > 30) continue;
        }
        
        const time24h = `${hour.toString().padStart(2, '0')}:${minute}`;
        slots.push(time24h);
      }
    }
  } else {
    // For future dates, use all business hours
    for (let hour = USA_CONFIG.businessHours.start; hour <= USA_CONFIG.businessHours.end; hour++) {
      for (let minute of ['00', '30']) {
        if (hour === USA_CONFIG.businessHours.end && minute === '30') continue;
        const time24h = `${hour.toString().padStart(2, '0')}:${minute}`;
        slots.push(time24h);
      }
    }
  }
  
  console.log('Generated slots for', forDate, ':', slots);
  return slots;
};

// Default time slots for non-today dates
const DEFAULT_TIME_SLOTS = (() => {
  const slots = [];
  for (let hour = USA_CONFIG.businessHours.start; hour <= USA_CONFIG.businessHours.end; hour++) {
    for (let minute of ['00', '30']) {
      if (hour === USA_CONFIG.businessHours.end && minute === '30') continue;
      const time24h = `${hour.toString().padStart(2, '0')}:${minute}`;
      slots.push(time24h);
    }
  }
  return slots;
})();

const BookingForm = ({ car, licenses, drivers }) => {
  // Hook states
  const { 
    mutateAsync: createBooking, 
    error: createBookingError, 
    isError: isCreateBookingError, 
    reset: resetCreateBooking,
    isPending: isCreatingBooking 
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

  // Form state
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
    pickup: DEFAULT_TIME_SLOTS,
    return: DEFAULT_TIME_SLOTS,
  });
  const [conflictingDates, setConflictingDates] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

  // Date utilities
  const getToday = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split("T")[0];
  }, []);

  const getYesterday = useCallback(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return yesterday.toISOString().split("T")[0];
  }, []);

  // Error handling
  const getErrorMessage = useCallback((error) => {
    if (!error) return null;
    
    if (error.response?.data) {
      const { data } = error.response;
      if (typeof data === 'string') return data;
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.errors && Array.isArray(data.errors)) return data.errors.join(', ');
      if (typeof data === 'object') {
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError)) return firstError[0];
        return firstError || 'An error occurred';
      }
    }
    
    return error.message || 'An unexpected error occurred. Please try again.';
  }, []);

  const getBookingErrorMessage = useCallback(() => {
    return getErrorMessage(createBookingError) || getErrorMessage(bookingsError);
  }, [createBookingError, bookingsError, getErrorMessage]);

  // Booking conflict detection
  const getBookedDates = useCallback(() => {
    const bookedDates = new Set();

    carBookings.forEach((booking) => {
      if (["cancelled", "rejected"].includes(booking.status)) return;

      const start = new Date(booking.pickupDate);
      const end = new Date(booking.returnDate);

      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        bookedDates.add(date.toISOString().split("T")[0]);
      }
    });

    return Array.from(bookedDates);
  }, [carBookings]);

  const hasBookingConflict = useCallback(
    (pickupDate, pickupTime, returnDate, returnTime) => {
      if (!carBookings.length) return false;

      const requestedPickup = new Date(`${pickupDate}T${pickupTime}`);
      const requestedReturn = new Date(`${returnDate}T${returnTime}`);

      // Check date conflicts
      const bookedDates = getBookedDates();
      const start = new Date(pickupDate);
      const end = new Date(returnDate);

      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split("T")[0];
        if (bookedDates.includes(dateString)) return true;
      }

      // Check time conflicts
      return carBookings.some((booking) => {
        if (["cancelled", "rejected", "completed"].includes(booking.status)) return false;

        const existingPickup = new Date(`${booking.pickupDate}T${booking.pickupTime}`);
        const existingReturn = new Date(`${booking.returnDate}T${booking.returnTime}`);

        return (
          (requestedPickup >= existingPickup && requestedPickup < existingReturn) ||
          (requestedReturn > existingPickup && requestedReturn <= existingReturn) ||
          (requestedPickup <= existingPickup && requestedReturn >= existingReturn)
        );
      });
    },
    [carBookings, getBookedDates]
  );

  const getConflictingDates = useCallback(() => {
    if (!form.pickupDate || !form.returnDate) return [];

    const bookedDates = getBookedDates();
    const start = new Date(form.pickupDate);
    const end = new Date(form.returnDate);
    const conflicts = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split("T")[0];
      if (bookedDates.includes(dateString)) conflicts.push(dateString);
    }

    return conflicts;
  }, [form.pickupDate, form.returnDate, getBookedDates]);

  // Time availability
  const getAvailableTimes = useCallback(
    (date) => {
      if (!date) return DEFAULT_TIME_SLOTS;

      // If date is fully booked
      if (getBookedDates().includes(date)) return [];

      const today = getToday();
      const yesterday = getYesterday();
      
      // Prevent booking on past dates
      if (date < yesterday) return [];

      // If today, generate time slots starting from current time
      if (date === today) {
        const times = generateTimeSlots(date);
        console.log('Available times for today:', times);
        return times;
      }

      return DEFAULT_TIME_SLOTS;
    },
    [getBookedDates, getToday, getYesterday]
  );

  const getDisabledDates = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const disabledDates = [];

    // Add booked dates
    const bookedDates = getBookedDates();
    bookedDates.forEach((dateStr) => {
      const date = new Date(dateStr);
      if (date >= today) disabledDates.push(date);
    });

    return disabledDates;
  }, [getBookedDates]);

  // Form validation
  const validateForm = useCallback(() => {
    const errors = {};
    const yesterday = getYesterday();
    const today = getToday();

    // Date validation
    if (form.pickupDate && form.returnDate) {
      // Past date prevention
      if (form.pickupDate < yesterday) {
        errors.pickupDate = "Pickup date cannot be in the past. Please select today or a future date.";
      }
      if (form.returnDate < yesterday) {
        errors.returnDate = "Return date cannot be in the past. Please select today or a future date.";
      }

      // Same day validation with minimum rental period
      if (form.pickupDate === form.returnDate) {
        if (form.returnTime <= form.pickupTime) {
          errors.returnTime = "Return time must be after pickup time";
        } else if (form.pickupTime && form.returnTime) {
          const start = new Date(`${form.pickupDate}T${form.pickupTime}`);
          const end = new Date(`${form.returnDate}T${form.returnTime}`);
          const hoursDiff = (end - start) / (1000 * 60 * 60);
          
          if (hoursDiff < USA_CONFIG.minRentalHours) {
            errors.returnTime = `Minimum rental period is ${USA_CONFIG.minRentalHours} hours for same-day returns`;
          }
        }
      } else if (form.returnDate < form.pickupDate) {
        errors.returnDate = "Return date must be after pickup date";
      }

      // Maximum rental period
      const pickup = new Date(`${form.pickupDate}T${form.pickupTime}`);
      const returnDt = new Date(`${form.returnDate}T${form.returnTime}`);
      const daysDifference = (returnDt - pickup) / (1000 * 60 * 60 * 24);

      if (daysDifference > USA_CONFIG.maxRentalDays) {
        errors.returnDate = `Maximum rental period is ${USA_CONFIG.maxRentalDays} days`;
      }

      // Booking conflicts
      if (form.pickupDate && form.pickupTime && form.returnDate && form.returnTime) {
        const hasConflict = hasBookingConflict(
          form.pickupDate,
          form.pickupTime,
          form.returnDate,
          form.returnTime
        );

        if (hasConflict) {
          const conflicts = getConflictingDates();
          if (conflicts.length > 0) {
            errors.conflict = `The following dates are already booked: ${conflicts.join(", ")}. Please choose different dates.`;
          } else {
            errors.conflict = "Selected dates/times are not available. Please choose different dates or times.";
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
        errors.driverName = "Driver name is required when uploading a new license";
      }
    }

    // Terms acceptance
    if (!acceptedTerms) {
      errors.terms = "You must accept the terms and conditions to proceed";
    }

    setFormErrors(errors);
    setConflictingDates(getConflictingDates());

    // Form validity check
    const hasValidDates = Boolean(
      form.pickupDate &&
      form.returnDate &&
      form.pickupTime &&
      form.returnTime &&
      form.pickupDate >= today &&
      form.returnDate >= today &&
      (form.returnDate > form.pickupDate ||
        (form.returnDate === form.pickupDate && form.returnTime > form.pickupTime)) &&
      !errors.conflict
    );

    setIsFormValid(hasValidDates && acceptedTerms);
  }, [form, licenseFile, hasBookingConflict, licenses, getConflictingDates, getYesterday, getToday, acceptedTerms]);

  // Effects
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  useEffect(() => {
    if (form.pickupDate) {
      const pickupTimes = getAvailableTimes(form.pickupDate, 'pickup');
      setAvailableTimes(prev => ({ ...prev, pickup: pickupTimes }));

      // Auto-select first available time if current selection is invalid
      if (!form.pickupTime || !pickupTimes.includes(form.pickupTime)) {
        setForm(prev => ({ ...prev, pickupTime: pickupTimes[0] || "" }));
      }
    }

    if (form.returnDate) {
      const returnTimes = getAvailableTimes(form.returnDate, 'return');
      setAvailableTimes(prev => ({ ...prev, return: returnTimes }));

      // Auto-select first available time if current selection is invalid
      if (!form.returnTime || !returnTimes.includes(form.returnTime)) {
        setForm(prev => ({ ...prev, returnTime: returnTimes[0] || "" }));
      }
    }
  }, [form.pickupDate, form.returnDate, form.pickupTime, form.returnTime, getAvailableTimes]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchBookings();
    }, 15000);

    return () => clearInterval(interval);
  }, [refetchBookings]);

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      setFormErrors({});
    }
    if (isCreateBookingError) {
      resetCreateBooking();
    }
  }, [form.pickupDate, form.returnDate, formErrors, isCreateBookingError, resetCreateBooking]);

  // Event handlers
  const handlePickupDateChange = (date) => {
    if (!date) {
      setPickupDate(null);
      setForm(prev => ({ ...prev, pickupDate: "" }));
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Allow today's date
    if (date < today) {
      setFormErrors(prev => ({
        ...prev,
        pickupDate: "Cannot select past dates. Please choose today or a future date."
      }));
      return;
    }

    setPickupDate(date);
    const dateString = date ? date.toISOString().split("T")[0] : "";
    setForm(prev => ({
      ...prev,
      pickupDate: dateString,
      ...(returnDate && date && returnDate < date && { returnDate: "" }),
    }));

    if (returnDate && date && returnDate < date) {
      setReturnDate(null);
    }
  };

  const handleReturnDateChange = (date) => {
    if (!date) {
      setReturnDate(null);
      setForm(prev => ({ ...prev, returnDate: "" }));
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Allow today's date
    if (date < today) {
      setFormErrors(prev => ({
        ...prev,
        returnDate: "Cannot select past dates. Please choose today or a future date."
      }));
      return;
    }

    setReturnDate(date);
    const dateString = date ? date.toISOString().split("T")[0] : "";
    setForm(prev => ({ ...prev, returnDate: dateString }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        setFormErrors(prev => ({ ...prev, [name]: "Please upload a JPEG, PNG, or PDF file" }));
        return;
      }

      if (file.size > maxSize) {
        setFormErrors(prev => ({ ...prev, [name]: "File size must be less than 5MB" }));
        return;
      }

      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }

    if (name === "insurance") setInsuranceFile(file);
    if (name === "driverLicense") setLicenseFile(file);
  };

  const handleLicenseSelection = (licenseId) => {
    setForm(prev => ({
      ...prev,
      selectedLicense: prev.selectedLicense === licenseId ? null : licenseId,
      selectedDriver: null,
      driverName: "",
    }));
    setLicenseFile(null);
  };

  const handleDriverSelection = (driverId) => {
    setForm(prev => ({
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

  // Enhanced submit handler with single-click protection
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isCreatingBooking || isBookingsLoading || hasBeenSubmitted) {
      return;
    }

    // Immediately set submission state to prevent multiple clicks
    setHasBeenSubmitted(true);

    // Check terms acceptance
    if (!acceptedTerms) {
      setFormErrors(prev => ({ ...prev, terms: "You must accept the terms and conditions to proceed" }));
      setHasBeenSubmitted(false);
      return;
    }

    // Refresh bookings data
    await refetchBookings();

    const yesterday = getYesterday();
    const today = getToday();

    // Final validation
    if (form.pickupDate < yesterday || form.returnDate < yesterday) {
      setFormErrors(prev => ({ ...prev, submit: "Cannot book for past dates. Please select today or future dates." }));
      setHasBeenSubmitted(false);
      return;
    }

    // Conflict check
    if (form.pickupDate && form.pickupTime && form.returnDate && form.returnTime) {
      const hasConflict = hasBookingConflict(form.pickupDate, form.pickupTime, form.returnDate, form.returnTime);

      if (hasConflict) {
        const conflicts = getConflictingDates();
        setFormErrors(prev => ({
          ...prev,
          submit: conflicts.length > 0 
            ? `Sorry, the dates ${conflicts.join(", ")} are already booked. Please select different dates.`
            : "Sorry, this time slot was just booked by someone else. Please select different dates/times."
        }));
        setHasBeenSubmitted(false);
        return;
      }
    }

    const hasValidDates = Boolean(
      form.pickupDate &&
      form.returnDate &&
      form.pickupTime &&
      form.returnTime &&
      form.pickupDate >= today &&
      form.returnDate >= today &&
      (form.returnDate > form.pickupDate || (form.returnDate === form.pickupDate && form.returnTime > form.pickupTime))
    );

    if (!hasValidDates) {
      setFormErrors(prev => ({ ...prev, submit: "Please select valid pickup and return dates/times (today or future dates only)" }));
      setHasBeenSubmitted(false);
      return;
    }

    setFormErrors({});

    // Submit booking
    try {
      const formData = new FormData();
      formData.append("car", car._id);
      formData.append("pickupLocation", form.pickupLocation);
      formData.append("pickupDate", form.pickupDate);
      formData.append("returnDate", form.returnDate);
      formData.append("pickupTime", form.pickupTime);
      formData.append("returnTime", form.returnTime);
      formData.append("timeZone", USA_CONFIG.timeZone);

      if (form.selectedDriver) {
        formData.append("driverId", form.selectedDriver);
      } else {
        if (form.selectedLicense) formData.append("license", form.selectedLicense);
        if (insuranceFile) formData.append("insurance", insuranceFile);
        if (licenseFile) formData.append("driverLicense", licenseFile);
        if (form.driverName.trim() && !form.selectedLicense) {
          formData.append("driverName", form.driverName.trim());
        }
      }

      const booking = await createBooking(formData);
      const bookingData = JSON.parse(JSON.stringify(booking));
      const bookingId = bookingData.data.data._id;

      navigate("/checkout", { state: { bookingId } });
    } catch (error) {
      console.error("Booking failed:", error);
      setHasBeenSubmitted(false);
      
      const backendError = getErrorMessage(error);
      if (backendError?.includes("already booked") || backendError?.includes("conflict") || 
          backendError?.includes("available") || backendError?.includes("overlap")) {
        setFormErrors(prev => ({ ...prev, submit: backendError || "This time slot is no longer available. Please select different dates/times." }));
        await refetchBookings();
      } else {
        setFormErrors(prev => ({ ...prev, submit: backendError || "Booking failed. Please try again." }));
      }
    }
  };

  // Calculations
  const calculateTotal = useCallback(() => {
    if (!form.pickupDate || !form.returnDate) return 0;

    const start = new Date(`${form.pickupDate}T${form.pickupTime}`);
    const end = new Date(`${form.returnDate}T${form.returnTime}`);

    const hoursDifference = (end - start) / (1000 * 60 * 60);
    const effectiveHours = Math.max(hoursDifference, USA_CONFIG.minRentalHours);
    const days = Math.ceil(effectiveHours / 24);

    return days > 0 ? days * car.pricePerDay : 0;
  }, [form.pickupDate, form.returnDate, form.pickupTime, form.returnTime, car.pricePerDay]);

  const totalPrice = calculateTotal();
  const totalDays = totalPrice / car.pricePerDay;
  const serviceFee = 29.99;
  const grandTotal = totalPrice + serviceFee;

  const getAvailableReturnTimes = useCallback(() => {
    return availableTimes.return;
  }, [availableTimes.return]);

  const hasCurrentConflict = useCallback(() => {
    if (!form.pickupDate || !form.pickupTime || !form.returnDate || !form.returnTime) return false;
    return hasBookingConflict(form.pickupDate, form.pickupTime, form.returnDate, form.returnTime);
  }, [form.pickupDate, form.pickupTime, form.returnDate, form.returnTime, hasBookingConflict]);

  const hasPastDates = useCallback(() => {
    const yesterday = getYesterday();
    return form.pickupDate < yesterday || form.returnDate < yesterday;
  }, [form.pickupDate, form.returnDate, getYesterday]);

  const disabledDates = getDisabledDates();

  // Button disabled state
  const isButtonDisabled = useMemo(() => {
    return !isFormValid || isCreatingBooking || hasCurrentConflict() || 
           hasPastDates() || isBookingsLoading || !acceptedTerms || hasBeenSubmitted;
  }, [isFormValid, isCreatingBooking, hasCurrentConflict, hasPastDates, isBookingsLoading, acceptedTerms, hasBeenSubmitted]);

  const hasExistingLicenses = licenses && licenses.length > 0;
  const verifiedDrivers = useMemo(() => 
    drivers?.filter(d => d.license?.verified === true && d.insurance?.verified === true) || [], 
    [drivers]
  );

  // Get current St. Louis time for display
  const currentStLouisTime = getCurrentTimeInStLouis();
  const currentStLouisTimeDisplay = formatTimeForDisplay(currentStLouisTime);
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  console.log('Today:', todayString);
  console.log('Current form pickupDate:', form.pickupDate);
  console.log('Available pickup times:', availableTimes.pickup);

  // Loading states
  if (isBookingsLoading) {
    return (
      <FormContainer>
        <LoadingState message="Loading available dates and times..." size="lg" />
      </FormContainer>
    );
  }

  if (isBookingsError) {
    const errorMessage = getErrorMessage(bookingsError);
    return (
      <FormContainer>
        <ErrorState
          title="Failed to load availability"
          message={errorMessage || "We couldn't load the available dates. Please try refreshing the page."}
          action={<PrimaryButton onClick={() => refetchBookings()}>Try Again</PrimaryButton>}
        />
      </FormContainer>
    );
  }

  return (
    <FormContainer onSubmit={handleSubmit}>
      {/* Loading overlay */}
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

      {/* Time Zone Notice */}
      <TimeZoneNotice>
        <TimeZoneIcon>🕐</TimeZoneIcon>
        <TimeZoneText>
          All times are displayed in {USA_CONFIG.timeZoneDisplay} • Current St. Louis Time: {currentStLouisTimeDisplay}
        </TimeZoneText>
      </TimeZoneNotice>

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
              setFormErrors(prev => ({ ...prev, submit: null, conflict: null }));
            }}
          >
            ×
          </CloseButton>
        </ErrorBox>
      )}

      {/* Date & Time Selection */}
      <FormSection>
        {/* Loading indicator */}
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
              <strong>Selected Dates Not Available:</strong> {conflictingDates.join(", ")}
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
              {USA_CONFIG.cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Select>
          </FormGroup>

          {/* Date Selection */}
          <DatePickerRow>
            <FormGroup>
              <Label htmlFor="pickupDate">Pick-up Date *</Label>
              <StyledDatePicker
                selected={pickupDate}
                onChange={handlePickupDateChange}
                selectsStart
                startDate={pickupDate}
                endDate={returnDate}
                minDate={new Date()} // This allows today
                maxDate={new Date(Date.now() + USA_CONFIG.maxRentalDays * 24 * 60 * 60 * 1000)}
                excludeDates={disabledDates}
                placeholderText="Select pickup date"
                dateFormat="MMMM d, yyyy"
                disabled={isCreatingBooking || isBookingsLoading}
              />
              {formErrors.pickupDate && <FieldError>{formErrors.pickupDate}</FieldError>}
              <DateHint>
                {form.pickupDate === todayString ? 
                  "Today is selected! Available times start from current St. Louis time" : 
                  "Pickup date must be today or a future date"
                }
              </DateHint>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="returnDate">Return Date *</Label>
              <StyledDatePicker
                selected={returnDate}
                onChange={handleReturnDateChange}
                selectsEnd
                startDate={pickupDate}
                endDate={returnDate}
                minDate={pickupDate || new Date()} // This allows today
                maxDate={new Date(Date.now() + USA_CONFIG.maxRentalDays * 24 * 60 * 60 * 1000)}
                excludeDates={disabledDates}
                placeholderText="Select return date"
                dateFormat="MMMM d, yyyy"
                disabled={!pickupDate || isCreatingBooking || isBookingsLoading}
              />
              {formErrors.returnDate && <FieldError>{formErrors.returnDate}</FieldError>}
              <DateHint>Return date must be today or a future date</DateHint>
            </FormGroup>
          </DatePickerRow>

          {/* Time Selection */}
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
                {availableTimes.pickup.length > 0 ? (
                  availableTimes.pickup.map((time) => (
                    <option key={time} value={time}>{formatTimeForDisplay(time)}</option>
                  ))
                ) : (
                  <option value="" disabled>No available times for selected date</option>
                )}
              </Select>
              {formErrors.pickupTime && <FieldError>{formErrors.pickupTime}</FieldError>}
              {form.pickupDate === todayString && availableTimes.pickup.length > 0 && (
                <TimeHint>Available times start from current St. Louis time</TimeHint>
              )}
              {form.pickupDate === todayString && availableTimes.pickup.length === 0 && (
                <TimeHint $error>No more available times for today in St. Louis</TimeHint>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="returnTime">Return Time *</Label>
              <Select
                id="returnTime"
                name="returnTime"
                value={form.returnTime}
                onChange={handleChange}
                disabled={!form.returnDate || availableTimes.return.length === 0 || isCreatingBooking || isBookingsLoading}
                required
                $error={!!formErrors.returnTime}
              >
                {getAvailableReturnTimes().length > 0 ? (
                  getAvailableReturnTimes().map((time) => (
                    <option key={time} value={time}>{formatTimeForDisplay(time)}</option>
                  ))
                ) : (
                  <option value="" disabled>No available times for selected date</option>
                )}
              </Select>
              {formErrors.returnTime && <FieldError>{formErrors.returnTime}</FieldError>}
            </FormGroup>
          </FormRow>
        </DateTimeGrid>

        {/* Business Hours Notice */}
        <BusinessHoursNotice>
          <BusinessHoursIcon>🕒</BusinessHoursIcon>
          <BusinessHoursText>
            Business Hours: {formatTimeForDisplay(DEFAULT_TIME_SLOTS[0])} - {formatTimeForDisplay(DEFAULT_TIME_SLOTS[DEFAULT_TIME_SLOTS.length - 1])} • 
            Minimum Rental: {USA_CONFIG.minRentalHours} hours
          </BusinessHoursText>
        </BusinessHoursNotice>

        {/* Availability Status */}
        {form.pickupDate && form.pickupTime && form.returnDate && form.returnTime && (
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
                ? `Dates not available: ${conflictingDates.join(", ") || "Time conflict"}`
                : "These dates/times are available"}
            </StatusText>
          </AvailabilityStatus>
        )}

        {/* Price Summary */}
        {totalDays > 0 && !hasPastDates() && (
          <PriceSummary>
            <SummaryItem>
              <span>${car.pricePerDay} × {Math.ceil(totalDays)} {Math.ceil(totalDays) === 1 ? "day" : "days"}</span>
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
          <SectionTitle>Select Verified Driver <DriverBadge>Verified</DriverBadge></SectionTitle>
          <CardsContainer>
            {verifiedDrivers.map((driver) => (
              <DriverCard
                key={driver._id}
                selected={form.selectedDriver === driver._id}
                onClick={() => !isCreatingBooking && handleDriverSelection(driver._id)}
                $disabled={isCreatingBooking || isBookingsLoading}
              >
                <DriverInfo>
                  <DriverName>{driver.name}</DriverName>
                </DriverInfo>
                <Radio selected={form.selectedDriver === driver._id}>
                  {form.selectedDriver === driver._id && <RadioDot />}
                </Radio>
              </DriverCard>
            ))}
          </CardsContainer>
          {formErrors.license && !form.selectedDriver && <FieldError>{formErrors.license}</FieldError>}
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
                    <span>{new Date(license.expiryDate).toLocaleDateString()}</span>
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
          <SectionTitle>Upload Documents</SectionTitle>

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
              {formErrors.driverName && <FieldError>{formErrors.driverName}</FieldError>}
              <DriverNameHint>Please enter the name exactly as it appears on the driver&apos;s license</DriverNameHint>
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
                  <FileText>{insuranceFile ? insuranceFile.name : "Upload Insurance"}</FileText>
                  <FileHint>Optional</FileHint>
                </FileUploadBox>
              </FileLabel>
              {formErrors.insurance && <FieldError>{formErrors.insurance}</FieldError>}
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
                  <FileText>{licenseFile ? licenseFile.name : "Upload Driver License"}</FileText>
                  <FileHint>
                    {hasExistingLicenses && !form.selectedLicense ? "Required if no license selected" : "Optional"}
                  </FileHint>
                </FileUploadBox>
              </FileLabel>
              {formErrors.driverLicense && <FieldError>{formErrors.driverLicense}</FieldError>}
            </FileUploadGroup>
          </FileUploadGrid>
        </FormSection>
      )}

      {/* Terms and Conditions */}
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
              <TermsLink href="/terms" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                Terms and Conditions
              </TermsLink>{" "}
              and{" "}
              <TermsLink href="/privacy" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                Privacy Policy
              </TermsLink>
              <RequiredAsterisk>*</RequiredAsterisk>
            </CheckboxLabel>
          </CheckboxGroup>
          {formErrors.terms && <FieldError>{formErrors.terms}</FieldError>}
        </TermsContainer>
      </FormSection>

      {/* Submit Button */}
      <SubmitButton
        type="submit"
        disabled={isButtonDisabled}
        $size="lg"
        $isValid={isFormValid && !hasCurrentConflict() && !hasPastDates() && acceptedTerms}
        $submitting={isCreatingBooking || hasBeenSubmitted}
        $hasConflict={hasCurrentConflict() || hasPastDates()}
        $loading={isBookingsLoading}
      >
        {isCreatingBooking || hasBeenSubmitted ? (
          <>
            <ButtonSpinner size="sm" />
            Processing...
          </>
        ) : isBookingsLoading ? (
          <>
            <ButtonSpinner size="sm" />
            Checking Availability...
          </>
        ) : hasCurrentConflict() || hasPastDates() || !acceptedTerms ? (
          <>❌ {!acceptedTerms ? "Accept Terms to Continue" : "Dates Not Available"}</>
        ) : (
          <>
            Reserve Now - $
            {grandTotal > serviceFee ? grandTotal.toFixed(2) : (car.pricePerDay + serviceFee).toFixed(2)}
          </>
        )}
      </SubmitButton>
    </FormContainer>
  );
};

export default BookingForm;

// Helper function to format time for display (24h to 12h)
const formatTimeForDisplay = (time24h) => {
  const [hour, minute] = time24h.split(':');
  const hourNum = parseInt(hour, 10);
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${period}`;
};

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

const TimeZoneNotice = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--blue-50);
  border: 1px solid var(--blue-200);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  margin-bottom: var(--space-md);
  font-size: var(--text-sm);
  color: var(--blue-700);
`;

const TimeZoneIcon = styled.span`
  font-size: var(--text-lg);
`;

const TimeZoneText = styled.span`
  font-weight: var(--font-medium);
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
    opacity: 0.6;
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
  border: 2px solid ${props => props.$error ? "var(--error)" : "var(--gray-300)"};
  border-radius: var(--radius-lg);
  font-size: var(--text-lg);
  transition: all var(--transition-normal);
  background: var(--white);
  font-family: var(--font-body);
  width: 100%;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.$error ? "var(--error)" : "var(--primary)"};
    box-shadow: 0 0 0 3px ${props => props.$error ? "rgba(239, 68, 68, 0.1)" : "rgba(92, 206, 251, 0.1)"};
  }

  &:disabled {
    background: var(--gray-100);
    color: var(--text-muted);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Input = styled.input`
  padding: var(--space-md);
  border: 2px solid ${props => {
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
    border-color: ${props => {
      if (props.$error) return "var(--error)";
      if (props.$unavailable) return "var(--warning)";
      return "var(--primary)";
    }};
    box-shadow: 0 0 0 3px ${props => {
      if (props.$error) return "rgba(239, 68, 68, 0.1)";
      if (props.$unavailable) return "rgba(245, 158, 11, 0.1)";
      return "rgba(92, 206, 251, 0.1)";
    }};
  }

  &:disabled {
    background: var(--gray-100);
    color: var(--text-muted);
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const FieldError = styled(ErrorMessageBase)`
  margin-top: var(--space-xs);
  font-size: var(--text-sm);
  color: ${props => props.$warning ? "var(--warning)" : "var(--error)"};
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
  border: 2px solid ${props => {
    if (props.$disabled) return "var(--gray-300)";
    return props.selected ? "var(--primary)" : "var(--gray-300)";
  }};
  border-radius: var(--radius-lg);
  cursor: ${props => props.$disabled ? "not-allowed" : "pointer"};
  transition: all var(--transition-normal);
  animation: ${slideUp} 0.4s ease-out;
  opacity: ${props => props.$disabled ? 0.6 : 1};

  &:hover {
    border-color: ${props => props.$disabled ? "var(--gray-300)" : "var(--primary)"};
    transform: ${props => props.$disabled ? "none" : "translateY(-2px)"};
    box-shadow: ${props => props.$disabled ? "none" : "var(--shadow-md)"};
  }
`;

const DriverInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
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
  border: 2px solid ${props => props.selected ? "var(--primary)" : "var(--gray-400)"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.selected ? "var(--primary)" : "var(--white)"};
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
  border: 2px dashed ${props => {
    if (props.$disabled) return "var(--gray-300)";
    return props.$error ? "var(--error)" : "var(--gray-400)";
  }};
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all var(--transition-normal);
  background: var(--white);
  cursor: ${props => props.$disabled ? "not-allowed" : "pointer"};
  opacity: ${props => props.$disabled ? 0.6 : 1};

  &:hover {
    border-color: ${props => {
      if (props.$disabled) return "var(--gray-300)";
      return props.$error ? "var(--error)" : "var(--primary)";
    }};
    background: ${props => props.$disabled ? "var(--white)" : "var(--gray-50)"};
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

const SubmitButton = styled(PrimaryButton).attrs(props => ({
  disabled: props.disabled
}))`
  width: 100%;
  position: relative;
  overflow: hidden;
  
  background: ${props => {
    if (props.disabled) {
      if (props.$hasConflict) return "var(--error)";
      if (!props.$isValid) return "var(--gray-300)";
      return "var(--gray-400)";
    }
    if (props.$submitting || props.$loading) return "var(--gray-400)";
    if (props.$hasConflict) return "var(--error)";
    if (!props.$isValid) return "var(--gray-300)";
    return "var(--gradient-primary)";
  }} !important;
  
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};

  animation: ${props => 
    props.$isValid && 
    !props.$submitting && 
    !props.$hasConflict && 
    !props.$loading &&
    !props.disabled ? pulse : "none"
  } 2s infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    opacity: ${props => (props.$submitting || props.$loading) ? 1 : 0};
    transition: opacity var(--transition-normal);
  }

  &:hover:not(:disabled) {
    transform: ${props => 
      props.$isValid && 
      !props.$submitting && 
      !props.$hasConflict && 
      !props.$loading &&
      !props.disabled ? "translateY(-2px)" : "none"
    };
    box-shadow: ${props => 
      props.$isValid && 
      !props.$submitting && 
      !props.$hasConflict && 
      !props.$loading &&
      !props.disabled ? "var(--shadow-lg)" : "none"
    };
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }
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
  animation: ${props => props.$shake ? shake : "none"} 0.5s ease-in-out;
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

const BusinessHoursNotice = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--green-50);
  border: 1px solid var(--green-200);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
  margin-top: var(--space-sm);
  font-size: var(--text-sm);
  color: var(--green-700);
`;

const BusinessHoursIcon = styled.span`
  font-size: var(--text-lg);
`;

const BusinessHoursText = styled.span`
  font-weight: var(--font-medium);
`;

const AvailabilityStatus = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: ${props => props.$available ? "var(--success-light)" : "var(--error-light)"};
  border: 1px solid ${props => props.$available ? "var(--success)" : "var(--error)"};
  border-radius: var(--radius-lg);
  margin-top: var(--space-md);
`;

const StatusIcon = styled.div`
  font-size: 1.25rem;
`;

const StatusText = styled.span`
  font-weight: var(--font-medium);
  color: ${props => props.$available ? "var(--success)" : "var(--error)"};
  font-family: var(--font-body);
`;

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

const TimeHint = styled.div`
  font-size: var(--text-xs);
  color: ${props => props.$error ? "var(--error)" : "var(--primary)"};
  margin-top: var(--space-xs);
  font-style: italic;
`;

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