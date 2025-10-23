/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { 
  FaCheck, 
  FaUser, 
  FaSpinner,
  FaCloudUploadAlt,
  FaTimes
} from "react-icons/fa";
import styled from "styled-components";
import {
  FormField,
  Input,
  FileInput,
  Label,
  ErrorMessage,
  FormGroup,
  Radio
} from "../components/forms/Form";
import { PrimaryButton } from "../components/ui/Button";
import { useMyDrivers } from "../hooks/useDriver";
import { useAddBookingDriver } from "../hooks/useBooking";

const DriverDocument = ({ 
  onDriverSelect,
  onDocumentUpload,
  selectedDriver: propSelectedDriver,
  bookingId, // Add bookingId prop to identify which booking to add driver to
  onClose // Add onClose prop to close the modal
}) => {
  // Use the useMyDrivers hook to fetch existing drivers
  const { data: myDrivers, isLoading: isLoadingDrivers, error: driversError } = useMyDrivers();
  
  // Use the useAddBookingDriver hook for adding driver to booking
  const { 
    mutate: addBookingDriver, 
    isLoading: isAddingDriver, 
    error: addDriverError,
    isSuccess: isDriverAdded
  } = useAddBookingDriver(bookingId);
  
  const [activeTab, setActiveTab] = useState('select'); // 'select' or 'add'
  const [selectedDriver, setSelectedDriver] = useState(propSelectedDriver || null);

  // New driver form state
  const [newDriverForm, setNewDriverForm] = useState({
    driverName: '',
    driverLicense: null,
    insurance: null
  });
  
  const [uploadStatus, setUploadStatus] = useState({
    driverLicense: false,
    insurance: false
  });

  const [errors, setErrors] = useState({});

  // Get drivers from the hook response
  const existingDrivers = myDrivers?.data || [];

  // Initialize with prop selected driver
  useEffect(() => {
    if (propSelectedDriver) {
      setSelectedDriver(propSelectedDriver);
      setActiveTab('select');
    }
  }, [propSelectedDriver]);

  // Close modal when driver is successfully added
  useEffect(() => {
    if (isDriverAdded && onClose) {
      // Add a small delay to show the success message before closing
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isDriverAdded, onClose]);

  // Handle existing driver selection
  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);

    // Call the addBookingDriver mutation with bookingId and driverId
    addBookingDriver(
      { 
        bookingId: bookingId, 
        driverId: driver._id 
      },
      {
        onSuccess: () => {
          // Call the onDriverSelect callback if provided
          if (onDriverSelect) {
            onDriverSelect(driver._id);
          }
          // Note: The modal will be closed by the useEffect above when isDriverAdded becomes true
        },
        onError: (error) => {
          console.error('Failed to add driver to booking:', error);
          setErrors({ 
            submit: addDriverError?.message || 'Failed to add driver to booking. Please try again.' 
          });
        }
      }
    );
  };

  // Handle new driver form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriverForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file uploads for new driver
  const handleFileUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [documentType]: 'Please upload a JPEG, PNG, or PDF file'
        }));
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [documentType]: 'File size must be less than 5MB'
        }));
        return;
      }

      setNewDriverForm(prev => ({
        ...prev,
        [documentType]: file
      }));

      setUploadStatus(prev => ({
        ...prev,
        [documentType]: true
      }));

      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        [documentType]: ''
      }));
    }
  };

  // Remove uploaded file
  const handleRemoveFile = (documentType) => {
    setNewDriverForm(prev => ({
      ...prev,
      [documentType]: null
    }));

    setUploadStatus(prev => ({
      ...prev,
      [documentType]: false
    }));
  };

  // Handle new driver form submission
  const handleNewDriverSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!newDriverForm.driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }
    
    if (!newDriverForm.driverLicense) {
      newErrors.driverLicense = 'Driver license is required';
    }
    
    if (!newDriverForm.insurance) {
      newErrors.insurance = 'Insurance document is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Prepare submission data
      const submissionData = new FormData();
      submissionData.append('driverName', newDriverForm.driverName);
      submissionData.append('driverLicense', newDriverForm.driverLicense);
      submissionData.append('insurance', newDriverForm.insurance);

      // Call the document upload handler
      if (onDocumentUpload) {
        await onDocumentUpload(submissionData);
      }

      // Reset form after successful submission
      setNewDriverForm({
        driverName: '',
        driverLicense: null,
        insurance: null
      });
      
      setUploadStatus({
        driverLicense: false,
        insurance: false
      });
      
      setErrors({});

    } catch (error) {
      console.error('Failed to upload documents:', error);
      setErrors({ submit: 'Failed to upload documents. Please try again.' });
    }
  };

  // Check if driver has required documents
  const hasRequiredDocuments = (driver) => {
    return driver?.verified;
  };

  // Format driver name - Fixed the implementation
  const formatDriverName = (driver) => {
    return driver.name || driver.driverName || 'Unknown Driver';
  };

  // Combine errors from different sources
  const displayError = errors.submit || addDriverError?.message;

  // Loading state for drivers
  if (isLoadingDrivers) {
    return (
      <DriverManagementWrapper>
        <LoadingState>
          <LoadingSpinner>
            <FaSpinner />
          </LoadingSpinner>
          <LoadingText>Loading your drivers...</LoadingText>
        </LoadingState>
      </DriverManagementWrapper>
    );
  }

  return (
    <DriverManagementWrapper>
      <ActionSectionTitle>Driver Management</ActionSectionTitle>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'select'} 
          onClick={() => setActiveTab('select')}
        >
          <FaUser />
          Select Existing Driver
        </Tab>
        <Tab 
          active={activeTab === 'add'} 
          onClick={() => setActiveTab('add')}
        >
          <FaCloudUploadAlt />
          Add New Driver
        </Tab>
      </TabContainer>

      {activeTab === 'select' ? (
        /* Select Existing Driver Tab */
        <SelectDriverSection>
          <SectionTitle>Select from Your Drivers</SectionTitle>
          <SectionDescription>
            Choose a driver from your existing drivers. The selected driver will be immediately added to this booking.
          </SectionDescription>

          {driversError && (
            <ErrorState>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorText>Failed to load existing drivers. Please try again later.</ErrorText>
            </ErrorState>
          )}

          {existingDrivers.length === 0 && !driversError && (
            <EmptyState>
              <EmptyIcon>👥</EmptyIcon>
              <EmptyTitle>No Drivers Found</EmptyTitle>
              <EmptyMessage>
                You haven&apos;t added any drivers yet. Switch to the &quot;Add New Driver&quot; tab to create one.
              </EmptyMessage>
            </EmptyState>
          )}

          {existingDrivers.length > 0 && (
            <DriversList>
              {existingDrivers.map((driver) => (
                <DriverOption key={driver._id}>
                  <Radio
                    name="driverSelection"
                    checked={selectedDriver?._id === driver._id}
                    onChange={() => handleDriverSelect(driver)}
                    disabled={isAddingDriver}
                    label={
                      <DriverLabel>
                        <DriverInfo>
                          <DriverName>{formatDriverName(driver)}</DriverName>
                        </DriverInfo>
                        <DriverStatus>
                          {hasRequiredDocuments(driver) ? (
                            <VerifiedBadge>
                              <FaCheck />
                              Ready to Drive
                            </VerifiedBadge>
                          ) : (
                            <WarningBadge>
                              Documents Required
                            </WarningBadge>
                          )}
                          {selectedDriver?._id === driver._id && isAddingDriver && (
                            <SubmittingBadge>
                              <FaSpinner />
                              Adding...
                            </SubmittingBadge>
                          )}
                        </DriverStatus>
                      </DriverLabel>
                    }
                  />
                </DriverOption>
              ))}
            </DriversList>
          )}

          {displayError && (
            <ErrorState>
              <ErrorIcon>⚠️</ErrorIcon>
              <ErrorText>{displayError}</ErrorText>
            </ErrorState>
          )}

          {selectedDriver && isDriverAdded && !isAddingDriver && (
            <SelectedDriverInfo>
              <SelectedDriverHeader>
                <FaCheck />
                Driver Added Successfully! Closing...
              </SelectedDriverHeader>
              <SuccessMessage>
                {formatDriverName(selectedDriver)} has been added to your booking.
              </SuccessMessage>
            </SelectedDriverInfo>
          )}
        </SelectDriverSection>
      ) : (
        /* Add New Driver Tab */
        <AddDriverSection>
          <SectionTitle>Add New Driver & Upload Documents</SectionTitle>
          <SectionDescription>
            Create a new driver profile and upload required documents. The driver will be added to your account and this booking.
          </SectionDescription>

          <Form onSubmit={handleNewDriverSubmit}>
            {/* Driver Name Field */}
            <FormField
              label="Driver Full Name"
              error={errors.driverName}
              required={true}
              htmlFor="driver-name"
            >
              <Input
                type="text"
                id="driver-name"
                name="driverName"
                value={newDriverForm.driverName}
                onChange={handleInputChange}
                placeholder="Enter driver's full name"
                error={!!errors.driverName}
              />
            </FormField>

            {/* Document Upload Section */}
            <DocumentsSection>
              <SubSectionTitle>Upload Required Documents</SubSectionTitle>
              
              {/* Driver's License Upload */}
              <DocumentUploadGroup>
                <Label htmlFor="driver-license-upload">
                  Driver&apos;s License *
                  {uploadStatus.driverLicense && (
                    <SuccessBadge>
                      <FaCheck />
                      Uploaded
                    </SuccessBadge>
                  )}
                </Label>
                
                {!uploadStatus.driverLicense ? (
                  <FileInput
                    id="driver-license-upload"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileUpload(e, 'driverLicense')}
                  />
                ) : (
                  <UploadedFile>
                    <FileInfo>
                      <FileName>{newDriverForm.driverLicense?.name}</FileName>
                      <FileSize>
                        {((newDriverForm.driverLicense?.size || 0) / 1024 / 1024).toFixed(2)} MB
                      </FileSize>
                    </FileInfo>
                    <RemoveButton
                      type="button"
                      onClick={() => handleRemoveFile('driverLicense')}
                    >
                      <FaTimes />
                    </RemoveButton>
                  </UploadedFile>
                )}
                {errors.driverLicense && (
                  <ErrorMessage>{errors.driverLicense}</ErrorMessage>
                )}
              </DocumentUploadGroup>

              {/* Insurance Upload */}
              <DocumentUploadGroup>
                <Label htmlFor="insurance-upload">
                  Insurance Document *
                  {uploadStatus.insurance && (
                    <SuccessBadge>
                      <FaCheck />
                      Uploaded
                    </SuccessBadge>
                  )}
                </Label>
                
                {!uploadStatus.insurance ? (
                  <FileInput
                    id="insurance-upload"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileUpload(e, 'insurance')}
                  />
                ) : (
                  <UploadedFile>
                    <FileInfo>
                      <FileName>{newDriverForm.insurance?.name}</FileName>
                      <FileSize>
                        {((newDriverForm.insurance?.size || 0) / 1024 / 1024).toFixed(2)} MB
                      </FileSize>
                    </FileInfo>
                    <RemoveButton
                      type="button"
                      onClick={() => handleRemoveFile('insurance')}
                    >
                      <FaTimes />
                    </RemoveButton>
                  </UploadedFile>
                )}
                {errors.insurance && (
                  <ErrorMessage>{errors.insurance}</ErrorMessage>
                )}
              </DocumentUploadGroup>

              {/* Upload Requirements */}
              <UploadRequirements>
                <RequirementTitle>File Requirements:</RequirementTitle>
                <RequirementList>
                  <li>Accepted formats: JPG, PNG, PDF</li>
                  <li>Maximum file size: 5MB per file</li>
                  <li>Documents must be clear and readable</li>
                  <li>All fields marked with * are required</li>
                </RequirementList>
              </UploadRequirements>
            </DocumentsSection>

            {errors.submit && (
              <ErrorMessage style={{ textAlign: 'center' }}>
                {errors.submit}
              </ErrorMessage>
            )}

            {/* Submit Button */}
            <SubmitButton type="submit" disabled={isAddingDriver}>
              {isAddingDriver ? (
                <>
                  <FaSpinner />
                  Adding Driver...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt />
                  Add Driver & Upload Documents
                </>
              )}
            </SubmitButton>
          </Form>
        </AddDriverSection>
      )}
    </DriverManagementWrapper>
  );
};

// Styled Components (updated with SuccessMessage)
const DriverManagementWrapper = styled.div`
  padding: var(--space-lg);
  max-width: 600px;
  margin: 0 auto;
`;

const ActionSectionTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-xl);
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  background: var(--gray-100);
  border-radius: var(--radius-lg);
  padding: var(--space-xs);
  margin-bottom: var(--space-xl);
`;

const Tab = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border: none;
  background: ${props => props.active ? 'var(--white)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-muted)'};
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: ${props => props.active ? 'var(--shadow-sm)' : 'none'};

  &:hover:not(:disabled) {
    color: var(--primary);
  }
`;

const SelectDriverSection = styled.div`
  background: var(--gray-50);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
`;

const AddDriverSection = styled.div`
  background: var(--gray-50);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
`;

const SectionTitle = styled.h4`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
`;

const SubSectionTitle = styled.h5`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
`;

const SectionDescription = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-lg);
  line-height: 1.5;
`;

const DriversList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
`;

const DriverOption = styled.div`
  padding: var(--space-lg);
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
  transition: all var(--transition-normal);

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-sm);
  }
`;

const DriverLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  cursor: pointer;
`;

const DriverInfo = styled.div`
  flex: 1;
`;

const DriverName = styled.div`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
`;

const DriverStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-sm);
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--success-light);
  color: var(--success);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
`;

const WarningBadge = styled.div`
  background: var(--warning-light);
  color: var(--warning);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
`;

const SubmittingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--info-light);
  color: var(--info);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const SelectedDriverInfo = styled.div`
  background: var(--success-light);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border: 2px solid var(--success);
  text-align: center;
`;

const SelectedDriverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--success);
  margin-bottom: var(--space-sm);
`;

const SuccessMessage = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
`;

const DocumentsSection = styled.div`
  background: var(--white);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid var(--gray-200);
`;

const DocumentUploadGroup = styled(FormGroup)`
  margin-bottom: var(--space-lg);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SuccessBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--success-light);
  color: var(--success);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  margin-left: var(--space-sm);
  
  svg {
    font-size: var(--text-xs);
  }
`;

const UploadedFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--white);
  padding: var(--space-md);
  border: 1px solid var(--success);
  border-radius: var(--radius-lg);
  margin-top: var(--space-xs);
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const FileName = styled.span`
  font-weight: var(--font-medium);
  color: var(--text-primary);
`;

const FileSize = styled.span`
  font-size: var(--text-sm);
  color: var(--text-muted);
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--error);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-normal);
  
  &:hover {
    background: var(--error-light);
  }
  
  svg {
    font-size: var(--text-base);
  }
`;

const UploadRequirements = styled.div`
  background: var(--gray-100);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  margin-top: var(--space-xl);
`;

const RequirementTitle = styled.h6`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
`;

const RequirementList = styled.ul`
  margin: 0;
  padding-left: var(--space-lg);
  color: var(--text-muted);
  font-size: var(--text-sm);
  
  li {
    margin-bottom: var(--space-xs);
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const SubmitButton = styled(PrimaryButton)`
  align-self: flex-start;
  margin-top: var(--space-lg);
`;

// Loading and Error States
const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  gap: var(--space-lg);
`;

const LoadingSpinner = styled.div`
  color: var(--primary);
  font-size: var(--text-2xl);
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-lg);
  text-align: center;
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--error-light);
  border-radius: var(--radius-lg);
  border: 1px solid var(--error);
  margin-bottom: var(--space-lg);
`;

const ErrorIcon = styled.span`
  font-size: var(--text-lg);
`;

const ErrorText = styled.span`
  color: var(--error);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-xl);
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--gray-300);
  margin-bottom: var(--space-lg);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--space-md);
`;

const EmptyTitle = styled.h5`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
`;

const EmptyMessage = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.5;
`;

export default DriverDocument;