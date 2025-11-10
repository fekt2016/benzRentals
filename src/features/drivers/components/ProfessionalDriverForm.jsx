// src/features/drivers/components/ProfessionalDriverForm.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiPhone, FiMail, FiCreditCard, FiDollarSign } from "react-icons/fi";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/Button";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import {
  useCreateProfessionalDriver,
  useUpdateProfessionalDriver,
} from "../hooks/useProfessionalDrivers";

/**
 * ProfessionalDriverForm Component
 * 
 * Modal form for creating or editing professional drivers.
 * - Uses global design system styles
 * - Handles both create and edit modes
 * - Validates required fields
 */

const ProfessionalDriverForm = ({ isOpen, onClose, driver = null }) => {
  const isEditMode = !!driver;
  const { mutate: createDriver, isPending: isCreating } = useCreateProfessionalDriver();
  const { mutate: updateDriver, isPending: isUpdating } = useUpdateProfessionalDriver();
  const isSubmitting = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    licenseNumber: "",
    licenseExpiry: "",
    hourlyRate: "",
    status: "pending",
    verified: false,
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (driver) {
      setFormData({
        fullName: driver.fullName || driver.name || "",
        email: driver.email || "",
        phone: driver.phone || "",
        dateOfBirth: driver.dateOfBirth
          ? new Date(driver.dateOfBirth).toISOString().split("T")[0]
          : "",
        licenseNumber: driver.licenseNumber || driver.license?.number || "",
        licenseExpiry: driver.license?.expiryDate
          ? new Date(driver.license.expiryDate).toISOString().split("T")[0]
          : driver.licenseExpiry
          ? new Date(driver.licenseExpiry).toISOString().split("T")[0]
          : "",
        hourlyRate: driver.hourlyRate || "",
        status: driver.status || "pending",
        verified: driver.verified || driver.license?.verified || false,
      });
    } else {
      // Reset form for new driver
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        licenseNumber: "",
        licenseExpiry: "",
        hourlyRate: "",
        status: "pending",
        verified: false,
      });
    }
    setErrors({});
  }, [driver, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required";
    if (!formData.licenseExpiry) newErrors.licenseExpiry = "License expiry is required";
    if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0)
      newErrors.hourlyRate = "Valid hourly rate is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const submitData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
      licenseNumber: formData.licenseNumber,
      hourlyRate: parseFloat(formData.hourlyRate),
      status: formData.status,
      verified: formData.verified,
    };
    
    // Add license object if license fields are provided
    if (formData.licenseNumber || formData.licenseExpiry) {
      submitData.license = {};
      if (formData.licenseNumber) {
        submitData.license.number = formData.licenseNumber;
      }
      if (formData.licenseExpiry) {
        submitData.license.expiryDate = new Date(formData.licenseExpiry);
      }
    }

    if (isEditMode) {
      updateDriver(
        { id: driver._id, data: submitData },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createDriver(submitData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Modal
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
        <ModalHeader>
          <ModalTitle>
            {isEditMode ? "Edit Professional Driver" : "Add Professional Driver"}
          </ModalTitle>
          <CloseButton onClick={onClose} disabled={isSubmitting}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <FormGroup>
              <Label>
                <FiUser />
                Full Name *
              </Label>
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Driver full name"
                $error={errors.fullName}
              />
              {errors.fullName && <ErrorText>{errors.fullName}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>
                <FiMail />
                Email *
              </Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="driver@example.com"
                $error={errors.email}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>
                <FiPhone />
                Phone *
              </Label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                $error={errors.phone}
              />
              {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>
                <FiUser />
                Date of Birth
              </Label>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                placeholder="Date of birth"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FiCreditCard />
                License Number *
              </Label>
              <Input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="DL123456789"
                $error={errors.licenseNumber}
              />
              {errors.licenseNumber && <ErrorText>{errors.licenseNumber}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>License Expiry *</Label>
              <Input
                type="date"
                name="licenseExpiry"
                value={formData.licenseExpiry}
                onChange={handleChange}
                $error={errors.licenseExpiry}
              />
              {errors.licenseExpiry && <ErrorText>{errors.licenseExpiry}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>
                <FiDollarSign />
                Hourly Rate ($) *
              </Label>
              <Input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="25.00"
                min="0"
                step="0.01"
                $error={errors.hourlyRate}
              />
              {errors.hourlyRate && <ErrorText>{errors.hourlyRate}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="offline">Offline</option>
                <option value="suspended">Suspended</option>
                <option value="verified">Verified</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <CheckboxGroup>
                <Checkbox
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                />
                <CheckboxLabel>Verified</CheckboxLabel>
              </CheckboxGroup>
            </FormGroup>
          </FormGrid>

          <FormActions>
            <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Driver"
              ) : (
                "Create Driver"
              )}
            </PrimaryButton>
          </FormActions>
        </Form>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
};

export default ProfessionalDriverForm;

/* ======================= Styles ======================= */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  overflow-y: auto;
`;

const Modal = styled(motion.div)`
  position: relative;
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1001;
  margin: auto;

  @media (max-width: 768px) {
    width: 95%;
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 0;
  background: var(--white);
  z-index: 1;
`;

const ModalTitle = styled.h2`
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);

  &:hover:not(:disabled) {
    background: var(--gray-100);
    color: var(--text-primary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Form = styled.form`
  padding: var(--space-xl);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const Label = styled.label`
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-xs);

  svg {
    width: 1rem;
    height: 1rem;
    color: var(--text-secondary);
  }
`;

const Input = styled.input`
  padding: var(--space-sm) var(--space-md);
  border: 1px solid ${({ $error }) => ($error ? "var(--error)" : "var(--gray-300)")};
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: var(--font-body);
  transition: all var(--transition-normal);
  background: var(--white);

  &:focus {
    outline: none;
    border-color: ${({ $error }) => ($error ? "var(--error)" : "var(--primary)")};
    box-shadow: 0 0 0 2px
      ${({ $error }) => ($error ? "var(--error-light)" : "var(--primary-light)")};
  }

  &::placeholder {
    color: var(--text-muted);
  }
`;

const Select = styled.select`
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: var(--font-body);
  background: var(--white);
  cursor: pointer;
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary);
`;

const CheckboxLabel = styled.label`
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-primary);
  cursor: pointer;
  margin: 0;
`;

const ErrorText = styled.span`
  font-size: var(--text-xs);
  color: var(--error);
  font-family: var(--font-body);
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--gray-200);
`;

