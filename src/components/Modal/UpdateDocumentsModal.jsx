// src/components/booking/UpdateDocumentsModal.jsx
import React, { useState, useCallback } from "react";
import {
  FaTimes,
  FaCloudUploadAlt,
  FaUserPlus,
  FaUserCheck,
  FaCheckCircle,
  FaIdCard,
  FaFileContract,
} from "react-icons/fa";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { LuxuryCard, GlassCard } from "../Cards/Card";
import { PrimaryButton, SecondaryButton, GhostButton } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";

const UpdateDocumentsModal = ({
  show,
  onClose,
  drivers = [],
  onSubmit,
  isLoading = false,
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [activeTab, setActiveTab] = useState("existing"); // "existing" or "new"
  const [formData, setFormData] = useState({
    fullName: "",
    licenseFile: null,
    insuranceFile: null,
  });

  const verifiedDrivers = drivers.filter(
    (driver) =>
      driver.license?.verified === true && driver.insurance?.verified === true
  );

  const hasExistingDrivers = verifiedDrivers.length > 0;

  // Set default tab based on available drivers
  React.useEffect(() => {
    if (hasExistingDrivers) {
      setActiveTab("existing");
    } else {
      setActiveTab("new");
    }
  }, [hasExistingDrivers]);

  const handleFileSelect = useCallback((fileType, file) => {
    setFormData((prev) => ({
      ...prev,
      [fileType]: file,
    }));
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = () => {
    if (activeTab === "existing" && selectedDriverId) {
      onSubmit({ driverId: selectedDriverId });
    } else if (
      activeTab === "new" &&
      formData.licenseFile &&
      formData.insuranceFile
    ) {
      const submitData = new FormData();
      submitData.append("driverLicense", formData.licenseFile);
      submitData.append("insurance", formData.insuranceFile);
      submitData.append("fullName", formData.fullName);
      onSubmit(submitData);
    }
  };

  const resetForm = () => {
    setSelectedDriverId("");
    setFormData({
      fullName: "",
      licenseFile: null,
      insuranceFile: null,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isSubmitDisabled = () => {
    if (isLoading) return true;
    if (activeTab === "existing" && !selectedDriverId) return true;
    if (
      activeTab === "new" &&
      (!formData.licenseFile || !formData.insuranceFile)
    )
      return true;
    return false;
  };

  const getSubmitButtonText = () => {
    if (isLoading) return "Processing...";
    if (activeTab === "existing") return "Confirm Driver Selection";
    return "Add Driver & Continue";
  };

  return (
    <AnimatePresence>
      {show && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContainer>
            <ModalContent
              as={motion.div}
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <ModalHeader>
                <HeaderContent>
                  <ModalTitle>Update Driver Information</ModalTitle>
                  <ModalSubtitle>
                    {activeTab === "existing"
                      ? "Select from your verified drivers"
                      : "Add a new driver to your account"}
                  </ModalSubtitle>
                </HeaderContent>
                <CloseButton
                  as={motion.button}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                >
                  <FaTimes />
                </CloseButton>
              </ModalHeader>

              {/* Tab Navigation */}
              {hasExistingDrivers && (
                <TabContainer>
                  <TabNav>
                    <TabItem
                      $active={activeTab === "existing"}
                      onClick={() => setActiveTab("existing")}
                    >
                      <FaUserCheck />
                      Select Driver
                    </TabItem>
                    <TabItem
                      $active={activeTab === "new"}
                      onClick={() => setActiveTab("new")}
                    >
                      <FaUserPlus />
                      Add New
                    </TabItem>
                  </TabNav>
                </TabContainer>
              )}

              {/* Content */}
              <ModalBody>
                <AnimatePresence mode="wait">
                  {activeTab === "existing" && hasExistingDrivers ? (
                    <motion.div
                      key="existing"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DriverSelection
                        drivers={verifiedDrivers}
                        selectedDriverId={selectedDriverId}
                        onSelectDriver={setSelectedDriverId}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="new"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <NewDriverForm
                        formData={formData}
                        onFileSelect={handleFileSelect}
                        onInputChange={handleInputChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </ModalBody>

              {/* Actions */}
              <ModalActions>
                <ActionButtons>
                  <SecondaryButton onClick={handleClose} $size="lg">
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled()}
                    $size="lg"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Processing...
                      </>
                    ) : (
                      getSubmitButtonText()
                    )}
                  </PrimaryButton>
                </ActionButtons>
              </ModalActions>
            </ModalContent>
          </ModalContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

// Driver Selection Component
const DriverSelection = ({ drivers, selectedDriverId, onSelectDriver }) => (
  <SelectionContainer>
    <SectionHeader>
      <SectionTitle>Verified Drivers</SectionTitle>
      <SectionDescription>
        Choose from your previously verified drivers
      </SectionDescription>
    </SectionHeader>

    <DriverGrid>
      {drivers.map((driver) => (
        <DriverCard
          key={driver._id}
          $selected={selectedDriverId === driver._id}
          onClick={() => onSelectDriver(driver._id)}
          as={motion.div}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <CardContent>
            <DriverAvatar $gradient={driver.isDefault ? "accent" : "primary"}>
              {driver.firstName?.charAt(0)}
              {driver.lastName?.charAt(0)}
            </DriverAvatar>
            <DriverDetails>
              <DriverName>
                {driver.firstName} {driver.lastName}
              </DriverName>
              <DriverMeta>
                <VerificationBadge>
                  <FaCheckCircle />
                  Verified
                </VerificationBadge>
                {driver.isDefault && <DefaultTag>Default</DefaultTag>}
              </DriverMeta>
            </DriverDetails>
            <SelectionIndicator $selected={selectedDriverId === driver._id}>
              <div className="check" />
            </SelectionIndicator>
          </CardContent>
        </DriverCard>
      ))}
    </DriverGrid>
  </SelectionContainer>
);

// New Driver Form Component
const NewDriverForm = ({ formData, onFileSelect, onInputChange }) => (
  <FormContainer>
    <SectionHeader>
      <SectionTitle>Add New Driver</SectionTitle>
      <SectionDescription>
        Upload required documents for verification
      </SectionDescription>
    </SectionHeader>

    <FormGrid>
      {/* Name Input */}
      <InputGroup>
        <InputLabel>Full Name</InputLabel>
        <ModernInput
          type="text"
          value={formData.fullName}
          onChange={(e) => onInputChange("fullName", e.target.value)}
          placeholder="Enter driver's full name"
        />
      </InputGroup>

      {/* File Uploads */}
      <UploadCard>
        <UploadIcon>
          <FaIdCard />
        </UploadIcon>
        <UploadContent>
          <UploadTitle>Driver's License</UploadTitle>
          <UploadDescription>
            Upload a clear photo of the driver's license
          </UploadDescription>
          <FileUpload
            file={formData.licenseFile}
            onFileSelect={(file) => onFileSelect("licenseFile", file)}
            accept=".jpg,.jpeg,.png,.pdf"
            id="license-upload"
          />
        </UploadContent>
      </UploadCard>

      <UploadCard>
        <UploadIcon>
          <FaFileContract />
        </UploadIcon>
        <UploadContent>
          <UploadTitle>Insurance Document</UploadTitle>
          <UploadDescription>
            Upload the current insurance certificate
          </UploadDescription>
          <FileUpload
            file={formData.insuranceFile}
            onFileSelect={(file) => onFileSelect("insuranceFile", file)}
            accept=".jpg,.jpeg,.png,.pdf"
            id="insurance-upload"
          />
        </UploadContent>
      </UploadCard>
    </FormGrid>

    <Requirements>
      <RequirementTitle>Document Requirements:</RequirementTitle>
      <RequirementList>
        <li>Clear, readable documents</li>
        <li>File types: JPG, PNG, PDF</li>
        <li>Maximum file size: 5MB each</li>
        <li>All fields must be clearly visible</li>
      </RequirementList>
    </Requirements>
  </FormContainer>
);

// File Upload Component
const FileUpload = ({ file, onFileSelect, accept, id }) => (
  <FileUploadContainer>
    <HiddenFileInput
      type="file"
      id={id}
      accept={accept}
      onChange={(e) => onFileSelect(e.target.files[0])}
    />
    <FileUploadLabel htmlFor={id}>
      <FileUploadContent>
        <CloudIcon>
          <FaCloudUploadAlt />
        </CloudIcon>
        <FileUploadText>
          <div>{file ? "Change File" : "Choose File"}</div>
          <FileHint>Click to browse</FileHint>
        </FileUploadText>
      </FileUploadContent>
      {file && (
        <FilePreview>
          <FileName>{file.name}</FileName>
          <FileSize>{(file.size / (1024 * 1024)).toFixed(2)} MB</FileSize>
        </FilePreview>
      )}
    </FileUploadLabel>
  </FileUploadContainer>
);

//
// 💅 Styled Components - Modern Redesign
//
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: var(--space-md);
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  justify-content: center;
`;

const ModalContent = styled(LuxuryCard)`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--white);
  border: 1px solid var(--gray-100);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--space-2xl);
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%);
  border-bottom: 1px solid var(--gray-200);
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const ModalTitle = styled.h2`
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  font-family: var(--font-heading);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ModalSubtitle = styled.p`
  color: var(--text-muted);
  margin: 0;
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
`;

const CloseButton = styled(GhostButton)`
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);

  &:hover {
    color: var(--error);
    background: var(--gray-100);
  }
`;

const TabContainer = styled.div`
  padding: 0 var(--space-2xl);
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
`;

const TabNav = styled.div`
  display: inline-flex;
  background: var(--gray-100);
  border-radius: var(--radius-lg);
  padding: var(--space-xs);
  gap: var(--space-xs);
`;

const TabItem = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border: none;
  border-radius: var(--radius-md);
  background: ${(props) => (props.$active ? "var(--white)" : "transparent")};
  color: ${(props) => (props.$active ? "var(--primary)" : "var(--text-muted)")};
  font-weight: ${(props) =>
    props.$active ? "var(--font-semibold)" : "var(--font-normal)"};
  box-shadow: ${(props) => (props.$active ? "var(--shadow-sm)" : "none")};
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: var(--font-body);
  white-space: nowrap;

  &:hover {
    background: var(--white);
    color: var(--primary);
  }
`;

const ModalBody = styled.div`
  flex: 1;
  padding: var(--space-2xl);
  overflow-y: auto;
`;

const ModalActions = styled.div`
  padding: var(--space-xl) var(--space-2xl);
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

// Driver Selection Styles
const SelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: var(--space-lg);
`;

const SectionTitle = styled.h3`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-xs) 0;
  font-family: var(--font-heading);
`;

const SectionDescription = styled.p`
  color: var(--text-muted);
  margin: 0;
  font-size: var(--text-base);
`;

const DriverGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
`;

const DriverCard = styled.div`
  background: var(--white);
  border: 2px solid
    ${(props) => (props.$selected ? "var(--primary)" : "var(--gray-200)")};
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(props) =>
      props.$selected ? "var(--gradient-primary)" : "transparent"};
    transition: all var(--transition-normal);
  }

  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const DriverAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: ${(props) =>
    props.$gradient === "accent"
      ? "var(--gradient-accent)"
      : "var(--gradient-primary)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  flex-shrink: 0;
`;

const DriverDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const DriverName = styled.span`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-size: var(--text-lg);
  font-family: var(--font-heading);
`;

const DriverMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
`;

const VerificationBadge = styled.span`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  background: var(--success);
  color: var(--white);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
`;

const DefaultTag = styled.span`
  background: var(--gradient-accent);
  color: var(--white);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
`;

const SelectionIndicator = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid
    ${(props) => (props.$selected ? "var(--primary)" : "var(--gray-300)")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(props) =>
    props.$selected ? "var(--primary)" : "transparent"};
  transition: all var(--transition-normal);

  .check {
    width: 12px;
    height: 12px;
    background: var(--white);
    border-radius: 50%;
    opacity: ${(props) => (props.$selected ? 1 : 0)};
    transition: opacity var(--transition-normal);
  }
`;

// Form Styles
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;

    /* Make name input span full width */
    & > :first-child {
      grid-column: 1 / -1;
    }
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const InputLabel = styled.label`
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const ModernInput = styled.input`
  padding: var(--space-lg);
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  background: var(--white);
  font-family: var(--font-body);
  font-size: var(--text-base);
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-light);
  }

  &::placeholder {
    color: var(--text-light);
  }
`;

const UploadCard = styled(LuxuryCard)`
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-xl);
  border: 2px dashed var(--gray-200);
  background: var(--gray-50);

  &:hover {
    border-color: var(--primary);
    background: var(--gray-100);
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  color: var(--primary);
  flex-shrink: 0;
`;

const UploadContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const UploadTitle = styled.h4`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-size: var(--text-lg);
`;

const UploadDescription = styled.p`
  color: var(--text-muted);
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.5;
`;

const FileUploadContainer = styled.div`
  margin-top: var(--space-sm);
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileUploadLabel = styled.label`
  display: block;
  cursor: pointer;
`;

const FileUploadContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--white);
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);

  ${FileUploadLabel}:hover & {
    border-color: var(--primary);
    background: var(--primary-light);
  }
`;

const CloudIcon = styled.div`
  font-size: 1.5rem;
  color: var(--primary);
`;

const FileUploadText = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const FileHint = styled.span`
  color: var(--text-muted);
  font-size: var(--text-sm);
`;

const FilePreview = styled.div`
  margin-top: var(--space-sm);
  padding: var(--space-md);
  background: var(--success);
  color: var(--white);
  border-radius: var(--radius-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FileName = styled.span`
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
`;

const FileSize = styled.span`
  font-size: var(--text-xs);
  opacity: 0.9;
`;

const Requirements = styled.div`
  background: var(--gray-50);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--primary);
`;

const RequirementTitle = styled.h5`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-size: var(--text-sm);
`;

const RequirementList = styled.ul`
  color: var(--text-muted);
  margin: 0;
  padding-left: var(--space-md);
  font-size: var(--text-sm);
  line-height: 1.6;

  li {
    margin-bottom: var(--space-xs);
  }
`;

export default UpdateDocumentsModal;
