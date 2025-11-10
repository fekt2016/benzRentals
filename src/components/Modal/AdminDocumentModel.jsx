/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */

import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";

import { DangerButton, SuccessButton, GhostButton } from "../../components/ui/Button";
import { LuxuryCard } from "../../components/Cards/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { FormField, Input, Label, ErrorMessage } from "../../components/forms/Form";

import { FaCheck, FaTimes } from "react-icons/fa";
import { useVerifyDriver } from "../../hooks/useDriver";

function AdminDocumentModal({
  driver,
  onClose,
  activeTab,
  setActiveTab,
}) {
  const user = driver?.user || {};
  const license = driver?.license || {};
  const insurance = driver?.insurance || {};

  // single state object for all fields
  const [form, setForm] = useState({
    // license
    licenseNumber: "",
    licenseIssuedBy: "",
    licenseExpiryDate: "",
    // insurance
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceExpiryDate: "",
  });

  // init with current values
  useEffect(() => {
    setForm({
      licenseNumber: license?.number || "",
      licenseIssuedBy: license?.issuedBy || "",
      licenseExpiryDate: license?.expiryDate
        ? new Date(license.expiryDate).toISOString().slice(0, 10)
        : "",
      insuranceProvider: insurance?.provider || "",
      insurancePolicyNumber: insurance?.policyNumber || "",
      insuranceExpiryDate: insurance?.expiryDate
        ? new Date(insurance.expiryDate).toISOString().slice(0, 10)
        : "",
    });
    
  }, [driver?._id]);

  // hook
  const { mutate: verifyDriver, isPending, error } = useVerifyDriver(driver?._id);

  const tabs = useMemo(
    () => [
      { key: "license", label: "Driver License", entity: license },
      { key: "insurance", label: "Insurance", entity: insurance },
    ],
    [license, insurance]
  );

  const current = activeTab === "license" ? license : insurance;
  const isVerified = !!current?.verified;

  const handleChange = (field) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // verify -> close modal on success
  const handleVerify = () => {
    if (activeTab === "license") {
      verifyDriver(
        {
          action: "verify",
          documentType: "license",
          data: {
            license: {
              number: form.licenseNumber,
              issuedBy: form.licenseIssuedBy,
              expiryDate: form.licenseExpiryDate,
            },
          },
        },
        {
          onSuccess: () => {
            onClose(); // ✅ close on success
          },
        }
      );
      return;
    }

    if (activeTab === "insurance") {
      verifyDriver(
        {
          action: "verify",
          documentType: "insurance",
          data: {
            insurance: {
              provider: form.insuranceProvider,
              policyNumber: form.insurancePolicyNumber,
              expiryDate: form.insuranceExpiryDate,
            },
          },
        },
        {
          onSuccess: () => {
            onClose(); // ✅ close on success
          },
        }
      );
    }
  };

  // reject (keeps modal open; uncomment onClose() if you want to close on reject too)
  const handleReject = () => {
    verifyDriver(
      {
        action: "reject",
        documentType: activeTab,
      },
      {
        // onSuccess: () => onClose(), // <- enable if you want to close after reject
      }
    );
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="doc-modal-title"
      >
        <ModalHeader>
          <ModalTitle id="doc-modal-title">
            Documents — {user.fullName || driver.name || "Driver"}
          </ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close modal">
            ×
          </CloseButton>
        </ModalHeader>

        <TabsBar role="tablist">
          {tabs.map((t) => (
            <TabButton
              key={t.key}
              role="tab"
              aria-selected={activeTab === t.key}
              $active={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
              <TabBadge $verified={!!t.entity?.verified}>
                {t.entity?.verified ? "Verified" : "Pending"}
              </TabBadge>
            </TabButton>
          ))}
        </TabsBar>

        <ModalBody>
          {/* Preview */}
          {current?.fileUrl ? (
            <DocumentImage
              src={current.fileUrl}
              alt={`${activeTab} document`}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <NoDocument>No {activeTab} document uploaded</NoDocument>
          )}

          {/* Form fields */}
          <DocumentDetails>
            {activeTab === "license" ? (
              <>
                <FormField label="License Number" required>
                  <Input
                    value={form.licenseNumber}
                    onChange={handleChange("licenseNumber")}
                    placeholder="A1234567"
                  />
                </FormField>

                <FormField label="Issued By" required>
                  <Input
                    value={form.licenseIssuedBy}
                    onChange={handleChange("licenseIssuedBy")}
                    placeholder="California DMV"
                  />
                </FormField>

                <FormField label="Expiry Date" required>
                  <Input
                    type="date"
                    value={form.licenseExpiryDate}
                    onChange={handleChange("licenseExpiryDate")}
                  />
                </FormField>
              </>
            ) : (
              <>
                <FormField label="Provider" required>
                  <Input
                    value={form.insuranceProvider}
                    onChange={handleChange("insuranceProvider")}
                    placeholder="Allianz"
                  />
                </FormField>

                <FormField label="Policy Number" required>
                  <Input
                    value={form.insurancePolicyNumber}
                    onChange={handleChange("insurancePolicyNumber")}
                    placeholder="ALZ-7788-99"
                  />
                </FormField>

                <FormField label="Expiry Date" required>
                  <Input
                    type="date"
                    value={form.insuranceExpiryDate}
                    onChange={handleChange("insuranceExpiryDate")}
                  />
                </FormField>
              </>
            )}

            {/* Status row */}
            <DetailItem>
              <DetailLabel>Verification Status:</DetailLabel>
              <DetailValue>
                <StatusBadge $status={isVerified ? "verified" : "pending"}>
                  {isVerified ? "Verified" : "Pending Verification"}
                </StatusBadge>
              </DetailValue>
            </DetailItem>
          </DocumentDetails>
        </ModalBody>

        <ModalActions>
          {!isVerified ? (
            <>
              <RejectButton onClick={handleReject} disabled={isPending} title="Reject Document">
                <FaTimes style={{ marginRight: "var(--space-xs)" }} />
                Reject {activeTab === "license" ? "License" : "Insurance"}
              </RejectButton>

              <VerifyButtonModal
                onClick={handleVerify}
                disabled={isPending}
                title="Verify Document"
              >
                {isPending ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <FaCheck style={{ marginRight: "var(--space-xs)" }} />
                    Verify {activeTab === "license" ? "License" : "Insurance"}
                  </>
                )}
              </VerifyButtonModal>
            </>
          ) : (
            <SuccessButton onClick={onClose}>Document Verified</SuccessButton>
          )}

          <GhostButton onClick={onClose} disabled={isPending}>
            Close
          </GhostButton>
        </ModalActions>

        {/* Hook error surface */}
        {error && (
          <ErrorBox role="alert">
            <ErrorMessage>
              {error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while updating the document."}
            </ErrorMessage>
          </ErrorBox>
        )}
      </ModalContent>
    </ModalOverlay>
  );
}

export default AdminDocumentModal;

/* ---------------- Styled ---------------- */

const ModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: var(--space-lg);
`;

const ModalContent = styled(LuxuryCard)`
  background: var(--white);
  border-radius: var(--radius-2xl);
  width: 90%; max-width: 800px; max-height: 90vh;
  overflow: hidden; display: flex; flex-direction: column;
  /* no animation */
`;

const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--space-xl); border-bottom: 1px solid var(--gray-200); background: var(--white);
`;

const ModalTitle = styled.h3`
  font-size: var(--text-xl); font-weight: var(--font-semibold);
  color: var(--text-primary); margin: 0; font-family: var(--font-heading);
`;

const CloseButton = styled.button`
  background: none; border: none; font-size: var(--text-2xl);
  color: var(--text-muted); cursor: pointer; padding: var(--space-xs);
  border-radius: var(--radius-md); transition: all var(--transition-fast);
  &:hover { background: var(--gray-100); color: var(--text-primary); }
`;

const TabsBar = styled.div`
  display: flex; gap: var(--space-sm);
  border-bottom: 1px solid var(--gray-200);
  padding: 0 var(--space-xl) var(--space-sm) var(--space-xl);
  background: var(--white);
`;

const TabButton = styled.button`
  border: none; background: transparent; padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full); cursor: pointer;
  font-family: var(--font-body); font-size: var(--text-sm); font-weight: var(--font-semibold);
  color: ${({ $active }) => ($active ? "var(--text-primary)" : "var(--text-secondary)")};
  transition: background var(--transition-fast), color var(--transition-fast);
  &:hover { background: var(--gray-100); }
`;

const TabBadge = styled.span`
  margin-left: var(--space-sm); padding: 0.1rem 0.6rem;
  border-radius: var(--radius-full); font-size: var(--text-xs);
  font-weight: var(--font-semibold); color: var(--white);
  background: ${({ $verified }) => ($verified ? "var(--success)" : "var(--warning)")};
`;

const ModalBody = styled.div`
  padding: var(--space-xl); flex: 1; overflow-y: auto;
  display: flex; flex-direction: column; gap: var(--space-lg);
`;

const DocumentImage = styled.img`
  width: 100%; max-height: 400px; object-fit: contain;
  border-radius: var(--radius-lg); border: 1px solid var(--gray-200);
  background: var(--gray-50);
`;

const NoDocument = styled.div`
  display: flex; align-items: center; justify-content: center;
  height: 200px; background: var(--gray-50); border-radius: var(--radius-lg);
  color: var(--text-muted); font-style: italic;
`;

const DocumentDetails = styled.div`
  display: flex; flex-direction: column; gap: var(--space-md);
  background: var(--gray-50); padding: var(--space-lg); border-radius: var(--radius-lg);
`;

const DetailItem = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: var(--space-sm); border-bottom: 1px solid var(--gray-200);
  &:last-child { border-bottom: none; padding-bottom: 0; }
`;

const StatusBadge = styled.span`
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block; text-align: center; min-width: 80px;
  background: ${({ $status }) => {
    switch ($status) {
      case "verified": return "var(--success)";
      case "pending": return "var(--warning)";
      case "suspended": return "var(--error)";
      default: return "var(--gray-300)";
    }
  }};
  color: var(--white);
`;

const DetailLabel = styled(Label)`
  margin: 0; font-weight: var(--font-semibold); color: var(--text-secondary);
`;

const DetailValue = styled.span`
  color: var(--text-primary); font-size: var(--text-base);
`;

const ModalActions = styled.div`
  display: flex; gap: var(--space-md); justify-content: flex-end;
  padding: var(--space-xl); border-top: 1px solid var(--gray-200); background: var(--white);
  @media (max-width: 480px) { flex-direction: column; }
`;

const RejectButton = styled(DangerButton)`
  font-size: var(--text-sm);
`;

const VerifyButtonModal = styled(SuccessButton)`
  font-size: var(--text-sm);
  display: inline-flex; align-items: center; gap: var(--space-sm);
`;

const ErrorBox = styled.div`
  padding: var(--space-md) var(--space-xl);
  background: #fef2f2;
  border-top: 1px solid var(--gray-200);
`;
