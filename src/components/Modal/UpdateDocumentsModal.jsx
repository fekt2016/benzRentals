import React, { useState } from "react";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import styled from "styled-components";

const UpdateDocumentsModal = ({ show, onClose, drivers = [], onSubmit }) => {
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [addingNewDriver, setAddingNewDriver] = useState(false);
  const [newLicenseFile, setNewLicenseFile] = useState(null);
  const [newInsuranceFile, setNewInsuranceFile] = useState(null);
  const [fullName, setFullName] = useState("");
  console.log("drivers", drivers);
  const verifiedDrivers = drivers.filter(
    (driver) =>
      driver.license?.verified === true && driver.insurance?.verified === true
  );
  console.log("verifiedDrivers", verifiedDrivers);
  if (!show) return null;

  const handleSubmit = () => {
    if (selectedDriverId) {
      onSubmit({ driverId: selectedDriverId });
    } else if (newLicenseFile && newInsuranceFile) {
      const formData = new FormData();
      formData.append("driverLicense", newLicenseFile);
      formData.append("insurance", newInsuranceFile);
      formData.append("fullName", fullName); // optional
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // } // debug
      onSubmit(formData); // send FormData instead of plain object
    } else {
      alert("Please select a driver or upload new documents.");
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {addingNewDriver ? "Add New Driver" : "Select Driver"}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {!addingNewDriver && verifiedDrivers.length > 0 && (
            <div>
              <UploadLabel>Select a Driver</UploadLabel>
              <select
                value={selectedDriverId || ""}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                }}
              >
                <option value="">-- Choose a driver --</option>
                {verifiedDrivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.firstName} {driver.lastName}
                    {driver.isDefault ? "(Default)" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!addingNewDriver && (
            <CtaButton
              style={{ marginTop: "1rem", background: "#10b981" }}
              onClick={() => setAddingNewDriver(true)}
            >
              + Add New Driver
            </CtaButton>
          )}

          {addingNewDriver && (
            <>
              <UploadSection>
                <UploadLabel htmlFor="name">Driver's Full Name </UploadLabel>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  id="fullName"
                  placeholder="full name of the driver"
                />
              </UploadSection>
              <UploadSection>
                <UploadLabel>Driver's License</UploadLabel>
                <FileInput
                  type="file"
                  onChange={(e) => setNewLicenseFile(e.target.files[0])}
                  id="license-upload"
                />
                <FileLabel htmlFor="license-upload">
                  <UploadIcon>
                    <FaCloudUploadAlt />
                  </UploadIcon>
                  <div>
                    <div>Choose license file</div>
                    <FileHint>PNG, JPG, or PDF (max 5MB)</FileHint>
                  </div>
                  {newLicenseFile && <FileName>{newLicenseFile.name}</FileName>}
                </FileLabel>
              </UploadSection>

              <UploadSection>
                <UploadLabel>Insurance Document</UploadLabel>
                <FileInput
                  type="file"
                  onChange={(e) => setNewInsuranceFile(e.target.files[0])}
                  id="insurance-upload"
                />
                <FileLabel htmlFor="insurance-upload">
                  <UploadIcon>
                    <FaCloudUploadAlt />
                  </UploadIcon>
                  <div>
                    <div>Choose insurance file</div>
                    <FileHint>PNG, JPG, or PDF (max 5MB)</FileHint>
                  </div>
                  {newInsuranceFile && (
                    <FileName>{newInsuranceFile.name}</FileName>
                  )}
                </FileLabel>
              </UploadSection>
            </>
          )}
        </ModalBody>

        <ModalActions>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <SubmitButton
            onClick={handleSubmit}
            disabled={
              (!addingNewDriver && !selectedDriverId) ||
              (addingNewDriver && !newLicenseFile && !newInsuranceFile)
            }
          >
            {addingNewDriver ? "Save Driver & Update" : "Update Booking"}
          </SubmitButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UpdateDocumentsModal;

//
// 💅 Styled Components
//
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
`;

const ModalBody = styled.div`
  margin-top: 1rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: #e5e7eb;
  border: none;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
`;

const CtaButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  border: none;
`;

const UploadSection = styled.div`
  margin-bottom: 1rem;
`;

const UploadLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px dashed #d1d5db;
  border-radius: 8px;
  cursor: pointer;
`;

const UploadIcon = styled.div`
  font-size: 1.5rem;
  color: #6b7280;
`;

const FileHint = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const FileName = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
`;
const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #f8fafc;
`;
