import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaStar,
  FaCheck,
  FaTimes,
  FaCalendar,
  FaMapMarkerAlt,
  FaEye,
} from "react-icons/fa";
import { FiPhone, FiMail, FiShield, FiDollarSign } from "react-icons/fi";
import {
  useGetProfessionalDriver,
  useUpdateProfessionalDriver,
  useDeleteProfessionalDriver,
} from "../../features/drivers/hooks/useProfessionalDrivers";
import { useVerifyDriver } from "../../features/drivers/useDriver";
import { PrimaryButton, SecondaryButton, GhostButton, SuccessButton } from "../../components/ui/Button";
import { LoadingState, EmptyState } from "../../components/ui/LoadingSpinner";
import ProfessionalDriverForm from "../../features/drivers/components/ProfessionalDriverForm";
import { toast } from "react-hot-toast";
import { FormField, Input, Label } from "../../components/forms/Form";

/**
 * ProfessionalDriverDetailPage Component
 * 
 * Admin page for viewing and managing a single professional driver
 * - View driver details
 * - Edit driver information
 * - Deactivate/Delete driver
 */
const ProfessionalDriverDetailPage = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { data, isLoading, error, refetch } = useGetProfessionalDriver(driverId);
  const { mutate: updateDriver, isPending: isUpdating } = useUpdateProfessionalDriver();
  const { mutate: deleteDriver, isPending: isDeleting } = useDeleteProfessionalDriver();
  const { mutate: verifyDriver, isPending: isVerifying } = useVerifyDriver(driverId);

  const driver = data?.data?.data || data?.data || null;
  
  // License verification form state
  const [licenseForm, setLicenseForm] = useState({
    licenseNumber: "",
    licenseIssuedBy: "",
    licenseExpiryDate: "",
  });
  
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  
  // Initialize form with driver's license data
  useEffect(() => {
    if (driver) {
      setLicenseForm({
        licenseNumber: driver.licenseNumber || driver.license?.number || "",
        licenseIssuedBy: driver.license?.issuedBy || "",
        licenseExpiryDate: driver.license?.expiryDate
          ? new Date(driver.license.expiryDate).toISOString().slice(0, 10)
          : "",
      });
    }
  }, [driver]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };
  
  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    refetch(); // Refetch to get updated data including updateHistory
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to deactivate this professional driver? This action cannot be undone.")) {
      deleteDriver(driverId, {
        onSuccess: () => {
          // Navigate after successful deletion
          setTimeout(() => {
            navigate("/admin/drivers");
          }, 1000);
        },
      });
    }
  };

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate this driver? They will no longer be available for bookings.")) {
      updateDriver(
        {
          id: driverId,
          data: { status: "suspended" },
        },
        {
          onSuccess: (data) => {
            toast.success("Driver deactivated successfully");
            // Refetch to ensure UI is updated
            refetch();
          },
          onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to deactivate driver");
          },
        }
      );
    }
  };

  const handleActivate = () => {
    updateDriver(
      {
        id: driverId,
        data: { status: "active" },
      },
      {
        onSuccess: (data) => {
          toast.success("Driver activated successfully");
          // Refetch to ensure UI is updated
          refetch();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to activate driver");
        },
      }
    );
  };
  
  const handleVerifyLicense = () => {
    if (!licenseForm.licenseNumber || !licenseForm.licenseIssuedBy || !licenseForm.licenseExpiryDate) {
      toast.error("Please fill in all license fields");
      return;
    }
    
    verifyDriver(
      {
        action: "verify",
        documentType: "license",
        data: {
          license: {
            number: licenseForm.licenseNumber,
            issuedBy: licenseForm.licenseIssuedBy,
            expiryDate: licenseForm.licenseExpiryDate,
          },
        },
      },
      {
        onSuccess: (data) => {
          toast.success("License verified successfully");
          setShowLicenseModal(false);
          // Refetch to ensure UI is updated
          refetch();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to verify license");
        },
      }
    );
  };
  
  const handleRejectLicense = () => {
    verifyDriver(
      {
        action: "reject",
        documentType: "license",
      },
      {
        onSuccess: (data) => {
          toast.success("License rejected");
          // Refetch to ensure UI is updated
          refetch();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to reject license");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingState message="Loading driver details..." size="lg" />
      </Container>
    );
  }

  if (error || !driver) {
    return (
      <Container>
        <EmptyState
          title="Driver Not Found"
          message={error?.message || "Unable to load driver details."}
          action={
            <PrimaryButton onClick={() => navigate("/admin/drivers")}>
              Go Back to Drivers
            </PrimaryButton>
          }
        />
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <PageHeader>
        <HeaderContent>
          <HeaderLeft>
            <GhostButton onClick={() => navigate("/admin/drivers")}>
              <FaArrowLeft /> Back
            </GhostButton>
            <Title>Professional Driver Details</Title>
          </HeaderLeft>
          <HeaderActions>
            {driver.status === "active" ? (
              <SecondaryButton onClick={handleDeactivate} disabled={isUpdating}>
                <FaTimes /> Deactivate
              </SecondaryButton>
            ) : (
              <SecondaryButton onClick={handleActivate} disabled={isUpdating}>
                <FaCheck /> Activate
              </SecondaryButton>
            )}
            <SecondaryButton onClick={handleEdit}>
              <FaEdit /> Edit
            </SecondaryButton>
            <GhostButton
              $variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <FaTrash /> Delete
            </GhostButton>
          </HeaderActions>
        </HeaderContent>
      </PageHeader>

      {/* Content */}
      <ContentGrid>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              <FaUser /> Basic Information
            </CardTitle>
          </CardHeader>
          <CardBody>
            <ProfileSection>
              <Avatar>
                {driver.name?.charAt(0).toUpperCase() || <FaUser />}
              </Avatar>
              <ProfileInfo>
                <DriverName>{driver.name || "Unknown Driver"}</DriverName>
                <DriverEmail>
                  <FiMail style={{ marginRight: "var(--space-xs)" }} />
                  {driver.email || "No email"}
                </DriverEmail>
                <StatusBadge $active={driver.status === "active"} $status={driver.status}>
                  {driver.status === "active" ? "Active" : driver.status === "suspended" ? "Suspended" : "Inactive"} • {driver.status || "offline"}
                </StatusBadge>
              </ProfileInfo>
            </ProfileSection>

            <InfoGrid>
              <InfoItem>
                <InfoLabel>
                  <FiPhone /> Phone
                </InfoLabel>
                <InfoValue>{driver.phone || "N/A"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <FaMapMarkerAlt /> Address
                </InfoLabel>
                <InfoValue>{driver.address || "N/A"}</InfoValue>
              </InfoItem>
              {driver.dateOfBirth && (
                <InfoItem>
                  <InfoLabel>
                    <FaCalendar /> Date of Birth
                  </InfoLabel>
                  <InfoValue>
                    {new Date(driver.dateOfBirth).toLocaleDateString()}
                  </InfoValue>
                </InfoItem>
              )}
              {driver.sex && (
                <InfoItem>
                  <InfoLabel>Gender</InfoLabel>
                  <InfoValue>{driver.sex}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </CardBody>
        </Card>

        {/* License Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              <FaIdCard /> License Information
            </CardTitle>
          </CardHeader>
          <CardBody>
            {/* License Image */}
            {driver.license?.fileUrl && (
              <LicenseImageSection>
                <LicenseImageLabel>License Image</LicenseImageLabel>
                <LicenseImageContainer>
                  <LicenseImage
                    src={driver.license.fileUrl}
                    alt="Driver License"
                    onClick={() => window.open(driver.license.fileUrl, "_blank")}
                  />
                  <ImageOverlay>
                    <FaEye /> Click to view full size
                  </ImageOverlay>
                </LicenseImageContainer>
              </LicenseImageSection>
            )}
            
            <InfoGrid>
              <InfoItem>
                <InfoLabel>License Number</InfoLabel>
                <InfoValue>{driver.licenseNumber || driver.license?.number || "N/A"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Issued By</InfoLabel>
                <InfoValue>{driver.license?.issuedBy || "N/A"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>License Expiry</InfoLabel>
                <InfoValue>
                  {driver.license?.expiryDate
                    ? new Date(driver.license.expiryDate).toLocaleDateString()
                    : driver.licenseExpiry
                    ? new Date(driver.licenseExpiry).toLocaleDateString()
                    : "N/A"}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Verification Status</InfoLabel>
                <VerificationBadge $verified={driver.license?.verified || driver.verified}>
                  {driver.license?.verified || driver.verified ? (
                    <>
                      <FaCheck /> Verified
                    </>
                  ) : (
                    <>
                      <FaTimes /> Pending
                    </>
                  )}
                </VerificationBadge>
              </InfoItem>
            </InfoGrid>
            
            {/* Verification Actions */}
            {!(driver.license?.verified || driver.verified) && (
              <LicenseActions>
                <SecondaryButton onClick={() => setShowLicenseModal(true)}>
                  <FaCheck /> Verify License
                </SecondaryButton>
                <GhostButton $variant="danger" onClick={handleRejectLicense} disabled={isVerifying}>
                  <FaTimes /> Reject
                </GhostButton>
              </LicenseActions>
            )}
          </CardBody>
        </Card>

        {/* Performance & Ratings */}
        <Card>
          <CardHeader>
            <CardTitle>
              <FaStar /> Performance & Ratings
            </CardTitle>
          </CardHeader>
          <CardBody>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>
                  <FaStar /> Rating
                </InfoLabel>
                <RatingDisplay>
                  <RatingStars>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        $filled={driver.rating >= star}
                      >
                        ★
                      </Star>
                    ))}
                  </RatingStars>
                  <RatingValue>
                    {driver.rating?.toFixed(1) || "0.0"} / 5.0
                  </RatingValue>
                </RatingDisplay>
              </InfoItem>
              <InfoItem>
                <InfoLabel>
                  <FiDollarSign /> Total Rides
                </InfoLabel>
                <InfoValue>{driver.totalRides || 0} rides</InfoValue>
              </InfoItem>
              {driver.ratings && driver.ratings.length > 0 && (
                <InfoItem>
                  <InfoLabel>Total Reviews</InfoLabel>
                  <InfoValue>{driver.ratings.length} reviews</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </CardBody>
        </Card>

        {/* Rates & Availability */}
        <Card>
          <CardHeader>
            <CardTitle>
              <FiDollarSign /> Rates & Availability
            </CardTitle>
          </CardHeader>
          <CardBody>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Hourly Rate</InfoLabel>
                <InfoValue>${driver.hourlyRate || "0.00"}/hr</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Daily Rate</InfoLabel>
                <InfoValue>${driver.dailyRate || "0.00"}/day</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Current Status</InfoLabel>
                <StatusBadge $active={driver.status === "active"} $status={driver.status}>
                  {driver.status || "offline"}
                </StatusBadge>
              </InfoItem>
            </InfoGrid>
          </CardBody>
        </Card>

        {/* Additional Information */}
        {(driver.bio || driver.languages?.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardBody>
              {driver.bio && (
                <InfoItem>
                  <InfoLabel>Bio</InfoLabel>
                  <InfoValue>{driver.bio}</InfoValue>
                </InfoItem>
              )}
              {driver.languages && driver.languages.length > 0 && (
                <InfoItem>
                  <InfoLabel>Languages</InfoLabel>
                  <LanguagesList>
                    {driver.languages.map((lang, idx) => (
                      <LanguageTag key={idx}>{lang}</LanguageTag>
                    ))}
                  </LanguagesList>
                </InfoItem>
              )}
            </CardBody>
          </Card>
        )}

        {/* Update History */}
        {driver.updateHistory && driver.updateHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Update History</CardTitle>
            </CardHeader>
            <CardBody>
              <HistoryList>
                {driver.updateHistory.slice().reverse().map((update, index) => (
                  <HistoryItem key={index}>
                    <HistoryHeader>
                      <HistoryDate>
                        {new Date(update.updatedAt).toLocaleString()}
                      </HistoryDate>
                      <HistoryBy>
                        Updated by: {update.updatedBy?.fullName || update.updatedBy?.email || "Admin"}
                      </HistoryBy>
                    </HistoryHeader>
                    {update.notes && (
                      <HistoryNotes>{update.notes}</HistoryNotes>
                    )}
                    {update.changes && Object.keys(update.changes).length > 0 && (
                      <HistoryChanges>
                        {Object.entries(update.changes).map(([field, change]) => (
                          <ChangeItem key={field}>
                            <ChangeField>{field}:</ChangeField>
                            <ChangeValue>
                              {change.from !== undefined && change.from !== null ? String(change.from) : "N/A"} → {change.to !== undefined && change.to !== null ? String(change.to) : "N/A"}
                            </ChangeValue>
                          </ChangeItem>
                        ))}
                      </HistoryChanges>
                    )}
                  </HistoryItem>
                ))}
              </HistoryList>
            </CardBody>
          </Card>
        )}

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardBody>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Created At</InfoLabel>
                <InfoValue>
                  {driver.createdAt
                    ? new Date(driver.createdAt).toLocaleString()
                    : "N/A"}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Last Updated</InfoLabel>
                <InfoValue>
                  {driver.updatedAt
                    ? new Date(driver.updatedAt).toLocaleString()
                    : "N/A"}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </CardBody>
        </Card>
      </ContentGrid>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ProfessionalDriverForm
          isOpen={isEditModalOpen}
          driver={driver}
          onClose={handleCloseEdit}
        />
      )}
      
      {/* License Verification Modal */}
      {showLicenseModal && (
        <ModalOverlay onClick={() => setShowLicenseModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Verify License</ModalTitle>
              <CloseButton onClick={() => setShowLicenseModal(false)}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <FormField label="License Number" required>
                <Input
                  value={licenseForm.licenseNumber}
                  onChange={(e) => setLicenseForm({ ...licenseForm, licenseNumber: e.target.value })}
                  placeholder="A1234567"
                />
              </FormField>
              <FormField label="Issued By" required>
                <Input
                  value={licenseForm.licenseIssuedBy}
                  onChange={(e) => setLicenseForm({ ...licenseForm, licenseIssuedBy: e.target.value })}
                  placeholder="California DMV"
                />
              </FormField>
              <FormField label="Expiry Date" required>
                <Input
                  type="date"
                  value={licenseForm.licenseExpiryDate}
                  onChange={(e) => setLicenseForm({ ...licenseForm, licenseExpiryDate: e.target.value })}
                />
              </FormField>
            </ModalBody>
            <ModalActions>
              <SuccessButton onClick={handleVerifyLicense} disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Verify License"}
              </SuccessButton>
              <SecondaryButton onClick={() => setShowLicenseModal(false)} disabled={isVerifying}>
                Cancel
              </SecondaryButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ProfessionalDriverDetailPage;

/* ======================= Styles ======================= */

const Container = styled.div`
  padding: var(--space-xl);
  background: var(--background);
  min-height: 100vh;
`;

const PageHeader = styled.div`
  background: var(--white);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const HeaderActions = styled.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: var(--space-lg);
  border-bottom: 1px solid var(--gray-200);
  background: var(--surface);
`;

const CardTitle = styled.h2`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-heading);

  svg {
    color: var(--primary);
  }
`;

const CardBody = styled.div`
  padding: var(--space-lg);
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--gray-200);
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-bold);
  font-size: var(--text-2xl);
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  flex: 1;
`;

const DriverName = styled.h3`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const DriverEmail = styled.div`
  color: var(--text-secondary);
  font-size: var(--text-base);
  display: flex;
  align-items: center;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  width: fit-content;
  background: ${({ $active, $status }) => {
    if (!$active) return "var(--gray-400)";
    switch ($status) {
      case "available":
        return "var(--success)";
      case "busy":
        return "var(--warning)";
      case "suspended":
        return "var(--error)";
      case "offline":
        return "var(--gray-400)";
      default:
        return "var(--gray-400)";
    }
  }};
  color: var(--white);
`;

const VerificationBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  background: ${({ $verified }) =>
    $verified ? "var(--success)" : "var(--warning)"};
  color: var(--white);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const InfoLabel = styled.label`
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-body);
`;

const InfoValue = styled.div`
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  font-family: var(--font-body);
`;

const RatingDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const RatingStars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.span`
  font-size: var(--text-lg);
  color: ${({ $filled }) =>
    $filled ? "var(--warning)" : "var(--gray-300)"};
`;

const RatingValue = styled.span`
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const LanguagesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
`;

const LanguageTag = styled.span`
  padding: var(--space-xs) var(--space-sm);
  background: var(--primary-light);
  color: var(--primary-dark);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
`;

const LicenseImageSection = styled.div`
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--gray-200);
`;

const LicenseImageLabel = styled(InfoLabel)`
  margin-bottom: var(--space-sm);
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-weight: var(--font-semibold);
  gap: var(--space-sm);
  opacity: 0;
  transition: opacity var(--transition-normal);
  
  svg {
    font-size: 1.25rem;
  }
`;

const LicenseImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--gray-200);
  cursor: pointer;
  transition: transform var(--transition-normal);
  
  &:hover {
    transform: scale(1.02);
    
    ${ImageOverlay} {
      opacity: 1;
    }
  }
`;

const LicenseImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  background: var(--gray-50);
  min-height: 200px;
`;

const LicenseActions = styled.div`
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--gray-200);
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
`;

const ModalContent = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--gray-200);
`;

const ModalTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: var(--text-2xl);
  color: var(--text-muted);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--gray-100);
    color: var(--text-primary);
  }
`;

const ModalBody = styled.div`
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const ModalActions = styled.div`
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  padding: var(--space-xl);
  border-top: 1px solid var(--gray-200);
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const HistoryItem = styled.div`
  padding: var(--space-md);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--primary);
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
  flex-wrap: wrap;
  gap: var(--space-xs);
`;

const HistoryDate = styled.div`
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const HistoryBy = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const HistoryNotes = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-style: italic;
  margin-top: var(--space-xs);
`;

const HistoryChanges = styled.div`
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const ChangeItem = styled.div`
  display: flex;
  gap: var(--space-sm);
  font-size: var(--text-sm);
`;

const ChangeField = styled.span`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  min-width: 120px;
`;

const ChangeValue = styled.span`
  color: var(--text-secondary);
  flex: 1;
`;

