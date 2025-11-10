import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FiUpload,
  FiCheck,
  FiAlertCircle,
  FiFile,
  FiX,
  FiShield,
} from "react-icons/fi";
import { useDriverProfile } from "../hooks/useDriverProfile";
import { PrimaryButton, SecondaryButton } from "../../../components/ui/Button";
import { toast } from "react-hot-toast";
import apiClient from "../../../services/apiClient";

const DriverDocumentUpload = () => {
  const { driver, refetch } = useDriverProfile();
  const [licenseFile, setLicenseFile] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  
  // Get license data from unified Driver model (license.fileUrl, license.number) or legacy (licenseImage, licenseNumber)
  const getLicenseImage = () => driver?.license?.fileUrl || driver?.licenseImage;
  const getLicenseNumber = () => driver?.licenseNumber || driver?.license?.number || "";
  const getLicenseExpiry = () => {
    const expiry = driver?.license?.expiryDate || driver?.licenseExpiry;
    return expiry ? new Date(expiry).toISOString().split("T")[0] : "";
  };
  
  const [licenseNumber, setLicenseNumber] = useState(getLicenseNumber());
  const [licenseExpiry, setLicenseExpiry] = useState(getLicenseExpiry());
  const [isUploading, setIsUploading] = useState(false);
  const licenseInputRef = useRef(null);
  
  // Update state when driver data changes
  useEffect(() => {
    if (driver) {
      setLicenseNumber(getLicenseNumber());
      setLicenseExpiry(getLicenseExpiry());
    }
  }, [driver]);

  const handleLicenseFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setLicenseFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLicense = () => {
    setLicenseFile(null);
    setLicensePreview(null);
    if (licenseInputRef.current) {
      licenseInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!licenseFile && !licenseNumber) {
      toast.error("Please upload a license image or enter license details");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      
      if (licenseFile) {
        formData.append("licenseImage", licenseFile);
      }
      
      if (licenseNumber) {
        formData.append("licenseNumber", licenseNumber);
      }
      
      if (licenseExpiry) {
        formData.append("licenseExpiry", licenseExpiry);
      }

      const response = await apiClient.patch("/driver/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Driver license uploaded successfully!");
      // Clear only the file preview, keep form fields if they were filled
      setLicenseFile(null);
      setLicensePreview(null);
      if (licenseInputRef.current) {
        licenseInputRef.current.value = "";
      }
      // Refetch to get updated driver data with license image
      await refetch();
      // After refetch, update form fields from driver data (in case backend updated them)
      // The useEffect will handle this automatically when driver data changes
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || "Failed to upload license. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Check for license in both unified Driver model and legacy DriverProfile format
  const hasLicense = getLicenseImage() || getLicenseNumber();

  return (
    <DocumentUploadContainer>
      <SectionHeader>
        <SectionTitle>
          <FiShield />
          Driver License Verification
        </SectionTitle>
        {(driver?.verified || driver?.license?.verified) && (
          <VerifiedBadge>
            <FiCheck />
            Verified
          </VerifiedBadge>
        )}
      </SectionHeader>

      {!(driver?.verified || driver?.license?.verified) && (
        <WarningBanner>
          <FiAlertCircle />
          <div>
            <strong>Verification Required</strong>
            <p>Please upload your driver's license to start accepting ride requests.</p>
          </div>
        </WarningBanner>
      )}

      <UploadSection>
        <UploadLabel>Driver's License</UploadLabel>
        
        {licensePreview ? (
          <PreviewContainer>
            <PreviewImage src={licensePreview} alt="License preview" />
            <RemoveButton onClick={handleRemoveLicense} type="button">
              <FiX />
              Remove
            </RemoveButton>
          </PreviewContainer>
        ) : getLicenseImage() ? (
          <ExistingImageContainer>
            <ExistingImage src={getLicenseImage()} alt="Current license" />
            <ImageLabel>
              {(driver?.license?.verified || driver?.verified) ? "Verified License" : "Current License Image (Pending Verification)"}
            </ImageLabel>
            {!(driver?.license?.verified || driver?.verified) && (
              <VerificationStatus>
                <FiAlertCircle />
                Awaiting Admin Verification
              </VerificationStatus>
            )}
            {/* Option to replace image if needed */}
            <ReplaceButton
              onClick={() => licenseInputRef.current?.click()}
              type="button"
            >
              <FiUpload />
              Replace Image
            </ReplaceButton>
            <HiddenInput
              ref={licenseInputRef}
              type="file"
              accept="image/*"
              onChange={handleLicenseFileChange}
              style={{ display: "none" }}
            />
          </ExistingImageContainer>
        ) : (
          <UploadArea
            onClick={() => licenseInputRef.current?.click()}
            $hasFile={!!licenseFile}
          >
            <UploadIcon>
              <FiUpload />
            </UploadIcon>
            <UploadText>
              {licenseFile ? "File selected" : "Click to upload license image"}
            </UploadText>
            <UploadHint>PNG, JPG up to 5MB</UploadHint>
            <HiddenInput
              ref={licenseInputRef}
              type="file"
              accept="image/*"
              onChange={handleLicenseFileChange}
            />
          </UploadArea>
        )}

        <FormFields>
          <FormField>
            <FieldLabel>License Number (Optional)</FieldLabel>
            <FieldInput
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="Enter license number"
              disabled={isUploading}
            />
          </FormField>

          <FormField>
            <FieldLabel>License Expiry Date (Optional)</FieldLabel>
            <FieldInput
              type="date"
              value={licenseExpiry}
              onChange={(e) => setLicenseExpiry(e.target.value)}
              disabled={isUploading}
            />
          </FormField>
        </FormFields>

        <ActionButtons>
          <UploadButton
            onClick={handleUpload}
            disabled={isUploading || (!licenseFile && !licenseNumber && !hasLicense)}
            $loading={isUploading}
          >
            {isUploading ? (
              <>
                <LoadingSpinner />
                Uploading...
              </>
            ) : hasLicense ? (
              <>
                <FiCheck />
                Update License
              </>
            ) : (
              <>
                <FiUpload />
                Upload License
              </>
            )}
          </UploadButton>
        </ActionButtons>

        {hasLicense && !(driver?.verified || driver?.license?.verified) && (
          <InfoMessage>
            <FiAlertCircle />
            <div>
              <strong>Pending Verification</strong>
              <p>Your license has been uploaded and is awaiting admin verification.</p>
            </div>
          </InfoMessage>
        )}
      </UploadSection>
    </DocumentUploadContainer>
  );
};

const DocumentUploadContainer = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-200);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--gray-200);
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  background: var(--success-light);
  color: var(--success-dark);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
`;

const WarningBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--warning-light);
  border: 1px solid var(--warning);
  border-radius: var(--radius-lg);
  color: var(--warning-dark);
  margin-bottom: var(--space-xl);

  svg {
    font-size: var(--text-xl);
    flex-shrink: 0;
    margin-top: 2px;
  }

  strong {
    display: block;
    margin-bottom: var(--space-xs);
  }

  p {
    margin: 0;
    font-size: var(--text-sm);
    opacity: 0.9;
  }
`;

const UploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const UploadLabel = styled.label`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const UploadArea = styled.div`
  border: 2px dashed ${(props) => 
    props.$hasFile ? "var(--primary)" : "var(--gray-300)"};
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  background: ${(props) => 
    props.$hasFile ? "var(--primary-light)" : "var(--gray-50)"};

  &:hover {
    border-color: var(--primary);
    background: var(--primary-light);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: var(--space-md);
`;

const UploadText = styled.div`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
`;

const UploadHint = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 2px solid var(--primary);
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  background: var(--gray-50);
`;

const RemoveButton = styled(SecondaryButton)`
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
`;

const ExistingImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const ExistingImage = styled.img`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: var(--radius-lg);
  border: 2px solid var(--gray-200);
  background: var(--gray-50);
`;

const ImageLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-align: center;
  font-weight: var(--font-medium);
`;

const VerificationStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm);
  background: var(--warning-light);
  color: var(--warning-dark);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  margin-top: var(--space-sm);
`;

const ReplaceButton = styled(SecondaryButton)`
  margin-top: var(--space-md);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
`;

const FormFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const FieldLabel = styled.label`
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
`;

const FieldInput = styled.input`
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-family: var(--font-body);
  transition: all var(--transition-normal);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }

  &:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-md);
`;

const UploadButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex: 1;
`;

const InfoMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--info-light);
  border: 1px solid var(--info);
  border-radius: var(--radius-lg);
  color: var(--info-dark);

  svg {
    font-size: var(--text-xl);
    flex-shrink: 0;
    margin-top: 2px;
  }

  strong {
    display: block;
    margin-bottom: var(--space-xs);
  }

  p {
    margin: 0;
    font-size: var(--text-sm);
    opacity: 0.9;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default DriverDocumentUpload;

