/* eslint-disable react/prop-types */
// src/pages/UserPage.jsx
import React, { useMemo, useState, useRef } from "react";
import styled from "styled-components";
import { devices } from "../../styles/GlobalStyles";

// Import reusable components
import Container from "../../components/layout/Container";
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
} from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/feedback/ErrorState";
import { formatDateOfBirth} from '../../utils/helper'
// Icons
import {
  FaUser,
  FaCog,
  FaShieldAlt,
  FaCreditCard,
  FaCar,
  FaBell,
  FaMapMarkerAlt,
  FaLock,
  FaCheckCircle,
  FaUpload,
  FaTrash,
  FaPlus,
  FaCamera,
  FaTimes,
  FaBars,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";
import {
  useCurrentUser,
  useUpdateProfile,
  useChangePassword,
  useUploadAvatar,
} from "../auth/useAuth";

import NotificationsSection from "../../components/ui/NotificationsSection";


const UserPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Hook states with error handling
  const { 
    data: userData, 
    error: userError, 
    isLoading: isUserLoading,
    refetch: refetchUser 
  } = useCurrentUser();

  const { 
    mutate: updateProfile, 
    isPending: isUpdatingProfile, 
    error: updateProfileError,
    reset: resetUpdateProfile 
  } = useUpdateProfile();

  const { 
    mutate: changePassword, 
    isPending: isChangingPassword, 
    error: changePasswordError,
    reset: resetChangePassword 
  } = useChangePassword();


  const { 
    mutate: uploadAvatar, 
    isPending: isUploadingAvatar, 
    error: uploadAvatarError,
    reset: resetUploadAvatar 
  } = useUploadAvatar();

  const user = useMemo(() => userData?.user || null, [userData]);

  // Form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName,
    email: user?.email,
    phone: user?.phone,
    dateOfBirth: user?.dateOfBirth,
    address: user?.address,
    emergencyContact: user?.emergencyContact,
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      bookingConfirmations: true,
      rentalReminders: true,
      specialOffers: false,
      smsAlerts: true,
    },
    rentalPreferences: {
      automaticTransmission: true,
      premiumFuel: false,
      childSeat: false,
      additionalDriver: false,
    },
    communication: "email",
  });

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "mastercard",
      last4: "8888",
      expiry: "08/24",
      isDefault: false,
    },
  ]);

  // Reset errors when changing tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    // Reset errors when switching tabs
    resetUpdateProfile();
    resetChangePassword();
    resetUploadAvatar();
  };

  // Separate avatar upload handler
  const handleAvatarUpload = async (file) => {
   
    if (!file) return;

    resetUploadAvatar(); // Reset previous errors

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      uploadAvatar(formData, {
        onSuccess: () => {
          console.log("Avatar uploaded successfully");
          refetchUser(); // Refresh user data to get new avatar
        },
        onError: (error) => {
          console.error("Avatar upload failed:", error);
          setAvatarPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      setAvatarPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Avatar upload handlers
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target.result);
      handleAvatarUpload(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    // Implementation for removing avatar
    console.log("Remove avatar functionality");
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    resetUpdateProfile(); // Reset error when user starts typing
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm({
      ...securityForm,
      [name]: value,
    });
    resetChangePassword(); // Reset error when user starts typing
  };

  const handlePreferenceChange = (section, key, value) => {
    setPreferences({
      ...preferences,
      [section]: {
        ...preferences[section],
        [key]: value,
      },
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    resetUpdateProfile(); // Reset previous errors
    
    updateProfile(profileForm, {
      onSuccess: () => {
        setIsEditing(false);
        refetchUser(); // Refresh user data
      },
    });
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    resetChangePassword(); // Reset previous errors
    
    if (securityForm.newPassword !== securityForm.newPasswordConfirm) {
      alert("New passwords don't match!");
      return;
    }
    
    changePassword(securityForm, {
      onSuccess: () => {
        setSecurityForm({
          currentPassword: "",
          newPassword: "",
          newPasswordConfirm: "",
        });
      },
    });
  };

  const handleAddPaymentMethod = () => {
    console.log("Add new payment method");
  };

  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDeletePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  // Loading State for user data
  if (isUserLoading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingState>
            <LoadingSpinner />
            <LoadingText>Loading your profile...</LoadingText>
          </LoadingState>
        </Container>
      </PageWrapper>
    );
  }

  // Error State for user data
  if (userError && !user) {
    return (
      <PageWrapper>
        <Container>
          <ErrorState
            icon={FaExclamationTriangle}
            title="Failed to Load Profile"
            message={userError?.message || "Unable to load your profile information. Please try again."}
            actions={[
              {
                text: "Try Again",
                onClick: () => refetchUser(),
                variant: 'primary',
                icon: FaRedo
              }
            ]}
            centered={true}
            size="lg"
          />
        </Container>
      </PageWrapper>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "payment", label: "Payment Methods", icon: FaCreditCard },
    { id: "preferences", label: "Preferences", icon: FaCog },
    { id: "notifications", label: "Notifications", icon: FaBell },
  ];

  // Get current avatar URL
  const currentAvatar = avatarPreview || user?.avatar;

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSection
            isEditing={isEditing}
            profileForm={profileForm}
            user={user}
            error={updateProfileError}
            onEdit={() => setIsEditing(true)}
            onCancel={() => {
              setIsEditing(false);
              resetUpdateProfile();
              // Reset form to original user data
              setProfileForm({
                fullName: user?.fullName,
                phone: user?.phone,
                dateOfBirth: user?.dateOfBirth,
                address: user?.address,
                emergencyContact: user?.emergencyContact,
              });
            }}
            onChange={handleProfileChange}
            onSave={handleSaveProfile}
            isLoading={isUpdatingProfile}
          />
        );
      case "security":
        return (
          <SecuritySection
            securityForm={securityForm}
            error={changePasswordError}
            onChange={handleSecurityChange}
            onSave={handleSaveSecurity}
            isLoading={isChangingPassword}
          />
        );
      case "payment":
        return (
          <PaymentSection
            paymentMethods={paymentMethods}
            onAdd={handleAddPaymentMethod}
            onSetDefault={handleSetDefaultPayment}
            onDelete={handleDeletePaymentMethod}
          />
        );
      case "preferences":
        return (
          <PreferencesSection
            preferences={preferences}
            onChange={handlePreferenceChange}
          />
        );
      case "notifications":
        return (
          <NotificationsSection
            preferences={preferences}
            onChange={handlePreferenceChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageWrapper>
      <Container>
        {/* Mobile Header with Menu Toggle */}
        <MobileHeader>
          <MobileTitle>My Profile</MobileTitle>
          <MobileMenuButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            active={mobileMenuOpen}
          >
            <FaBars />
          </MobileMenuButton>
        </MobileHeader>

        <PageHeader>
          <HeaderContent>
            <AvatarSection>
              <AvatarContainer>
                {currentAvatar ? (
                  <Avatar src={currentAvatar} alt={user?.fullName} />
                ) : (
                  <DefaultAvatar>
                    <FaUser />
                  </DefaultAvatar>
                )}
                <AvatarOverlay
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar || isUpdatingProfile}
                >
                  {isUploadingAvatar ? (
                    <UploadSpinner />
                  ) : currentAvatar ? (
                    <FaCamera />
                  ) : (
                    <FaUpload />
                  )}
                </AvatarOverlay>
                {currentAvatar && (
                  <RemoveAvatarButton
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar || isUpdatingProfile}
                  >
                    <FaTimes />
                  </RemoveAvatarButton>
                )}
              </AvatarContainer>

              <HiddenFileInput
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                disabled={isUploadingAvatar || isUpdatingProfile}
              />

              <AvatarUploadText>
                {isUploadingAvatar
                  ? "Uploading..."
                  : "Click to upload profile picture"}
              </AvatarUploadText>
              <AvatarRequirements>JPG, PNG or GIF • Max 5MB</AvatarRequirements>
              
              {/* Avatar Upload Error */}
              {uploadAvatarError && (
                <AvatarError>
                  <FaExclamationTriangle />
                  {uploadAvatarError.message || "Failed to upload avatar"}
                </AvatarError>
              )}
            </AvatarSection>
            <UserInfo>
              <UserName>{user?.fullName}</UserName>
              <UserBadge>
                <FaCheckCircle />
                {user?.membership || "Premium Member"}
              </UserBadge>
              <UserStats>
                <Stat>
                  <StatNumber>{user?.totalRentals || 12}</StatNumber>
                  <StatLabel>Total Rentals</StatLabel>
                </Stat>
                <Stat>
                  <StatNumber>4.9</StatNumber>
                  <StatLabel>Rating</StatLabel>
                </Stat>
                <Stat>
                  <StatNumber>{user?.favoriteCar || "Toyota Camry"}</StatNumber>
                  <StatLabel>Favorite Car</StatLabel>
                </Stat>
              </UserStats>
            </UserInfo>
          </HeaderContent>
        </PageHeader>

        <ContentGrid>
          <Sidebar $isOpen={mobileMenuOpen}>
            <MobileSidebarHeader>
              <MobileSidebarTitle>Navigation</MobileSidebarTitle>
              <MobileMenuClose onClick={() => setMobileMenuOpen(false)}>
                <FaTimes />
              </MobileMenuClose>
            </MobileSidebarHeader>
            <TabList>
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <TabItem
                    key={tab.id}
                    active={activeTab === tab.id}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <TabIcon />
                    {tab.label}
                  </TabItem>
                );
              })}
            </TabList>
          </Sidebar>

          <MainContent>
            {/* Global Error for user data */}
            {userError && user && (
              <ErrorBanner>
                <FaExclamationTriangle />
                <div>
                  <strong>Profile sync error:</strong> {userError.message || "Unable to sync latest profile data"}
                </div>
                <RetryButton onClick={() => refetchUser()} disabled={isUserLoading}>
                  {isUserLoading ? <LoadingSpinner $size="sm" /> : <FaRedo />}
                  Retry
                </RetryButton>
              </ErrorBanner>
            )}
            {renderTabContent()}
          </MainContent>
        </ContentGrid>
      </Container>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <MobileOverlay onClick={() => setMobileMenuOpen(false)} />
      )}
    </PageWrapper>
  );
};

// Profile Section Component with Error Handling
const ProfileSection = ({
  isEditing,
  profileForm,
  user,
  error,
  onEdit,
  onCancel,
  onChange,
  onSave,
  isLoading,
}) => (
  <SectionCard>
    <SectionHeader>
      <SectionTitle>
        <FaUser />
        Personal Information
      </SectionTitle>
      {!isEditing ? (
        <SecondaryButton onClick={onEdit} $size="sm">
          Edit Profile
        </SecondaryButton>
      ) : (
        <ButtonGroup>
          <GhostButton onClick={onCancel} $size="sm" disabled={isLoading}>
            Cancel
          </GhostButton>
          <PrimaryButton onClick={onSave} $size="sm" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner $size="sm" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </PrimaryButton>
        </ButtonGroup>
      )}
    </SectionHeader>

    <SectionContent>
      {/* Profile Update Error */}
      {error && (
        <FormError>
          <FaExclamationTriangle />
          {error.message || "Failed to update profile. Please try again."}
        </FormError>
      )}

      {!isEditing ? (
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Full Name</InfoLabel>
            <InfoValue>{user?.fullName}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email Address</InfoLabel>
            <InfoValue>{user?.email}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Phone Number</InfoLabel>
            <InfoValue>{user?.phone}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Date of Birth</InfoLabel>
            <InfoValue>{formatDateOfBirth(user?.dateOfBirth)}</InfoValue>
          </InfoItem>
          <InfoItem fullWidth>
            <InfoLabel>Address</InfoLabel>
            <InfoValue>{user?.address}</InfoValue>
          </InfoItem>
          {/* <InfoItem>
            <InfoLabel>Emergency Contact</InfoLabel>
            <InfoValue>+1 (555) 987-6543</InfoValue>
          </InfoItem> */}
        </InfoGrid>
      ) : (
        <Form onSubmit={onSave}>
          <FormGrid>
            <FormGroup fullWidth>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="fullName"
                value={profileForm.fullName}
                onChange={onChange}
                required
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup fullWidth>
              <Label>Email Address</Label>
              <Input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={onChange}
                required
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup fullWidth>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={onChange}
                required
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup fullWidth>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                name="dateOfBirth"
                value={profileForm.dateOfBirth}
                onChange={onChange}
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup fullWidth>
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                value={profileForm.address}
                onChange={onChange}
                placeholder="Enter your full address"
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup fullWidth>
              <Label>Emergency Contact</Label>
              <Input
                type="tel"
                name="emergencyContact"
                value={profileForm.emergencyContact}
                onChange={onChange}
                placeholder="+1 (555) 123-4567"
                disabled={isLoading}
              />
            </FormGroup>
          </FormGrid>
        </Form>
      )}
    </SectionContent>
  </SectionCard>
);

// Security Section Component with Error Handling
const SecuritySection = ({ securityForm, error, onChange, onSave, isLoading }) => (
  <SectionCard>
    <SectionHeader>
      <SectionTitle>
        <FaLock />
        Security Settings
      </SectionTitle>
    </SectionHeader>

    <SectionContent>
      {/* Password Change Error */}
      {error && (
        <FormError>
          <FaExclamationTriangle />
          {error.message || "Failed to change password. Please try again."}
        </FormError>
      )}

      <Form onSubmit={onSave}>
        <FormGroup fullWidth>
          <Label>Current Password</Label>
          <Input
            type="password"
            name="currentPassword"
            value={securityForm.currentPassword}
            onChange={onChange}
            placeholder="Enter current password"
            required
            disabled={isLoading}
          />
        </FormGroup>

        <FormGroup fullWidth>
          <Label>New Password</Label>
          <Input
            type="password"
            name="newPassword"
            value={securityForm.newPassword}
            onChange={onChange}
            placeholder="Enter new password"
            required
            disabled={isLoading}
          />
        </FormGroup>

        <FormGroup fullWidth>
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            name="newPasswordConfirm"
            value={securityForm.newPasswordConfirm}
            onChange={onChange}
            placeholder="Confirm new password"
            required
            disabled={isLoading}
          />
        </FormGroup>

        <PrimaryButton type="submit" $size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoadingSpinner $size="sm" />
              Updating Password...
            </>
          ) : (
            "Update Password"
          )}
        </PrimaryButton>
      </Form>
    </SectionContent>
  </SectionCard>
);

// Payment Methods Section Component
const PaymentSection = ({ paymentMethods, onAdd, onSetDefault, onDelete }) => (
  <SectionCard>
    <SectionHeader>
      <SectionTitle>
        <FaCreditCard />
        Payment Methods
      </SectionTitle>
      <PrimaryButton onClick={onAdd} $size="sm">
        <FaPlus />
        Add Payment Method
      </PrimaryButton>
    </SectionHeader>

    <SectionContent>
      <PaymentMethodsList>
        {paymentMethods.map((method) => (
          <PaymentMethod key={method.id}>
            <PaymentInfo>
              <PaymentIcon>{method.type === "visa" ? "💳" : "🔷"}</PaymentIcon>
              <PaymentDetails>
                <PaymentType>
                  {method.type.charAt(0).toUpperCase() + method.type.slice(1)}{" "}
                  •••• {method.last4}
                </PaymentType>
                <PaymentExpiry>Expires {method.expiry}</PaymentExpiry>
              </PaymentDetails>
            </PaymentInfo>
            <PaymentActions>
              {method.isDefault ? (
                <DefaultBadge>Default</DefaultBadge>
              ) : (
                <SecondaryButton
                  onClick={() => onSetDefault(method.id)}
                  $size="sm"
                >
                  Set as Default
                </SecondaryButton>
              )}
              <GhostButton onClick={() => onDelete(method.id)} $size="sm">
                <FaTrash />
              </GhostButton>
            </PaymentActions>
          </PaymentMethod>
        ))}
      </PaymentMethodsList>

      <SecurityNote>
        <FaShieldAlt />
        Your payment information is secure and encrypted
      </SecurityNote>
    </SectionContent>
  </SectionCard>
);

// Preferences Section Component
const PreferencesSection = ({ preferences, onChange }) => (
  <SectionCard>
    <SectionHeader>
      <SectionTitle>
        <FaCog />
        Rental Preferences
      </SectionTitle>
    </SectionHeader>

    <SectionContent>
      <PreferencesGrid>
        <PreferenceGroup>
          <PreferenceTitle>
            <FaCar />
            Vehicle Preferences
          </PreferenceTitle>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={preferences.rentalPreferences.automaticTransmission}
              onChange={(e) =>
                onChange(
                  "rentalPreferences",
                  "automaticTransmission",
                  e.target.checked
                )
              }
            />
            <CheckboxText>Automatic Transmission</CheckboxText>
          </CheckboxLabel>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={preferences.rentalPreferences.premiumFuel}
              onChange={(e) =>
                onChange("rentalPreferences", "premiumFuel", e.target.checked)
              }
            />
            <CheckboxText>Premium Fuel Preference</CheckboxText>
          </CheckboxLabel>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={preferences.rentalPreferences.childSeat}
              onChange={(e) =>
                onChange("rentalPreferences", "childSeat", e.target.checked)
              }
            />
            <CheckboxText>Include Child Seat by Default</CheckboxText>
          </CheckboxLabel>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              checked={preferences.rentalPreferences.additionalDriver}
              onChange={(e) =>
                onChange(
                  "rentalPreferences",
                  "additionalDriver",
                  e.target.checked
                )
              }
            />
            <CheckboxText>Add Additional Driver Option</CheckboxText>
          </CheckboxLabel>
        </PreferenceGroup>

        <PreferenceGroup>
          <PreferenceTitle>
            <FaMapMarkerAlt />
            Location Preferences
          </PreferenceTitle>
          <RadioGroup>
            <RadioLabel>
              <Radio
                type="radio"
                name="communication"
                value="email"
                checked={preferences.communication === "email"}
                onChange={(e) =>
                  onChange("communication", "communication", e.target.value)
                }
              />
              <RadioText>Airport Locations Only</RadioText>
            </RadioLabel>
            <RadioLabel>
              <Radio
                type="radio"
                name="communication"
                value="sms"
                checked={preferences.communication === "sms"}
                onChange={(e) =>
                  onChange("communication", "communication", e.target.value)
                }
              />
              <RadioText>City Center Locations</RadioText>
            </RadioLabel>
            <RadioLabel>
              <Radio
                type="radio"
                name="communication"
                value="both"
                checked={preferences.communication === "both"}
                onChange={(e) =>
                  onChange("communication", "communication", e.target.value)
                }
              />
              <RadioText>Any Available Location</RadioText>
            </RadioLabel>
          </RadioGroup>
        </PreferenceGroup>
      </PreferencesGrid>
    </SectionContent>
  </SectionCard>
);

// Notifications Section Component
// const NotificationsSection = ({ preferences, onChange }) => (
//   <SectionCard>
//     <SectionHeader>
//       <SectionTitle>
//         <FaBell />
//         Notification Preferences
//       </SectionTitle>
//     </SectionHeader>

//     <SectionContent>
//       <NotificationGroup>
//         <NotificationTitle>Booking Notifications</NotificationTitle>
//         <CheckboxLabel>
//           <Checkbox
//             type="checkbox"
//             checked={preferences.notifications.bookingConfirmations}
//             onChange={(e) =>
//               onChange(
//                 "notifications",
//                 "bookingConfirmations",
//                 e.target.checked
//               )
//             }
//           />
//           <CheckboxText>Booking Confirmations</CheckboxText>
//         </CheckboxLabel>
//         <CheckboxLabel>
//           <Checkbox
//             type="checkbox"
//             checked={preferences.notifications.rentalReminders}
//             onChange={(e) =>
//               onChange("notifications", "rentalReminders", e.target.checked)
//             }
//           />
//           <CheckboxText>Rental Reminders</CheckboxText>
//         </CheckboxLabel>
//         <CheckboxLabel>
//           <Checkbox
//             type="checkbox"
//             checked={preferences.notifications.specialOffers}
//             onChange={(e) =>
//               onChange("notifications", "specialOffers", e.target.checked)
//             }
//           />
//           <CheckboxText>Special Offers & Promotions</CheckboxText>
//         </CheckboxLabel>
//         <CheckboxLabel>
//           <Checkbox
//             type="checkbox"
//             checked={preferences.notifications.smsAlerts}
//             onChange={(e) =>
//               onChange("notifications", "smsAlerts", e.target.checked)
//             }
//           />
//           <CheckboxText>SMS Alerts</CheckboxText>
//         </CheckboxLabel>
//       </NotificationGroup>
//     </SectionContent>
//   </SectionCard>
// );

// ==================== STYLED COMPONENTS ====================

const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--surface);
  padding: var(--space-lg) 0;

  @media ${devices.sm} {
    padding: var(--space-md) 0;
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: var(--space-lg);
`;

const LoadingText = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-lg);
  font-family: var(--font-body);
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--error-light);
  color: var(--error-dark);
  border: 1px solid var(--error);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  font-size: var(--text-sm);

  @media ${devices.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
`;

const RetryButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  background: var(--error);
  color: var(--white);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: var(--transition-normal);
  margin-left: auto;

  &:hover:not(:disabled) {
    background: var(--error-dark);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media ${devices.sm} {
    margin-left: 0;
    align-self: flex-end;
  }
`;

const FormError = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--error-light);
  color: var(--error-dark);
  border: 1px solid var(--error);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  font-size: var(--text-sm);
`;

const AvatarError = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--error-light);
  color: var(--error-dark);
  border: 1px solid var(--error);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  margin-top: var(--space-sm);
`;

const MobileHeader = styled.div`
  display: none;

  @media ${devices.lg} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-lg);
    padding: 0 var(--space-md);
  }
`;

const MobileTitle = styled.h1`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: ${(props) => (props.active ? "var(--primary)" : "var(--white)")};
  color: ${(props) => (props.active ? "var(--white)" : "var(--text-primary)")};
  border: 1px solid var(--gray-200);
  font-size: var(--text-lg);
  cursor: pointer;
  transition: var(--transition-normal);

  &:hover {
    background: var(--primary);
    color: var(--white);
  }
`;

const MobileOverlay = styled.div`
  display: none;

  @media ${devices.lg} {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
`;

const PageHeader = styled.div`
  background: var(--white);
  border-radius: var(--radius-2xl);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);

  @media ${devices.sm} {
    padding: var(--space-lg);
    margin-bottom: var(--space-lg);
    border-radius: var(--radius-xl);
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xl);

  @media ${devices.md} {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
`;

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
  border-radius: var(--radius-full);
  overflow: visible;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 4px solid var(--primary-light);
  transition: var(--transition-normal);

  @media ${devices.sm} {
    width: 100px;
    height: 100px;
  }
`;

const DefaultAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: var(--text-3xl);
  border: 4px solid var(--primary-light);

  @media ${devices.sm} {
    width: 100px;
    height: 100px;
    font-size: var(--text-2xl);
  }
`;

const AvatarOverlay = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: var(--primary);
  color: var(--white);
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-normal);
  border: none;
  z-index: 2;

  &:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media ${devices.sm} {
    width: 32px;
    height: 32px;
    bottom: 6px;
    right: 6px;
  }
`;

const RemoveAvatarButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--error);
  color: var(--white);
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-normal);
  border: none;
  font-size: var(--text-xs);
  z-index: 3;

  &:hover {
    background: var(--error-dark);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media ${devices.sm} {
    width: 20px;
    height: 20px;
    top: -6px;
    right: -6px;
  }
`;

const UploadSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const AvatarUploadText = styled.p`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  text-align: center;
  margin: 0;
  font-weight: var(--font-medium);
`;

const AvatarRequirements = styled.p`
  font-size: var(--text-xs);
  color: var(--text-light);
  text-align: center;
  margin: 0;
`;

const UserInfo = styled.div`
  flex: 1;

  @media ${devices.md} {
    width: 100%;
  }
`;

const UserName = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
  text-transform: capitalize;

  @media ${devices.md} {
    font-size: var(--text-3xl);
  }

  @media ${devices.sm} {
    font-size: var(--text-2xl);
  }
`;

const UserBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--gradient-primary);
  color: var(--white);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-lg);

  @media ${devices.sm} {
    padding: var(--space-xs) var(--space-md);
    font-size: var(--text-sm);
  }
`;

const UserStats = styled.div`
  display: flex;
  gap: var(--space-xl);
  flex-wrap: wrap;
  justify-content: center;

  @media ${devices.sm} {
    gap: var(--space-lg);
  }
`;

const Stat = styled.div`
  text-align: center;
  min-width: 80px;
`;

const StatNumber = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);

  @media ${devices.sm} {
    font-size: var(--text-xl);
  }
`;

const StatLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);

  @media ${devices.sm} {
    font-size: var(--text-xs);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-xl);

  @media ${devices.lg} {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
`;

const Sidebar = styled.div`
  @media ${devices.lg} {
    position: fixed;
    top: 0;
    left: ${(props) => (props.$isOpen ? "0" : "-100%")};
    width: 320px;
    height: 100vh;
    background: var(--white);
    z-index: 999;
    transition: left 0.3s ease;
    box-shadow: var(--shadow-lg);
    overflow-y: auto;
  }

  @media ${devices.sm} {
    width: 100%;
  }
`;

const MobileSidebarHeader = styled.div`
  display: none;

  @media ${devices.lg} {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-lg);
    border-bottom: 1px solid var(--gray-200);
  }
`;

const MobileSidebarTitle = styled.h2`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
`;

const MobileMenuClose = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-lg);
  background: var(--gray-100);
  color: var(--text-primary);
  border: none;
  font-size: var(--text-lg);
  cursor: pointer;
  transition: var(--transition-normal);

  &:hover {
    background: var(--primary);
    color: var(--white);
  }
`;

const TabList = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  position: sticky;
  top: var(--space-xl);

  @media ${devices.lg} {
    position: static;
    border-radius: 0;
    box-shadow: none;
    border: none;
    padding: var(--space-lg);
  }

  @media ${devices.sm} {
    padding: var(--space-md);
  }
`;

const TabItem = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  border: none;
  background: ${(props) => (props.active ? "var(--primary)" : "transparent")};
  color: ${(props) =>
    props.active ? "var(--white)" : "var(--text-secondary)"};
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: var(--transition-normal);
  margin-bottom: var(--space-xs);
  font-size: var(--text-base);

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: ${(props) =>
      props.active ? "var(--primary)" : "var(--gray-100)"};
    color: ${(props) =>
      props.active ? "var(--white)" : "var(--text-primary)"};
  }

  @media ${devices.lg} {
    margin-bottom: var(--space-sm);
    padding: var(--space-lg);
    font-size: var(--text-lg);
  }
`;

const MainContent = styled.div``;

const SectionCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  overflow: hidden;
  margin-bottom: var(--space-lg);

  &:last-child {
    margin-bottom: 0;
  }

  @media ${devices.sm} {
    border-radius: var(--radius-xl);
    margin-bottom: var(--space-md);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--gray-200);

  @media ${devices.sm} {
    flex-direction: column;
    gap: var(--space-md);
    align-items: stretch;
    padding: var(--space-lg);
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-xl);
    gap: var(--space-sm);
  }
`;

const SectionContent = styled.div`
  padding: var(--space-xl);

  @media ${devices.sm} {
    padding: var(--space-lg);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-sm);

  @media ${devices.sm} {
    width: 100%;

    button {
      flex: 1;
    }
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);

  @media ${devices.sm} {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const InfoItem = styled.div`
  grid-column: ${(props) => (props.fullWidth ? "1 / -1" : "auto")};
`;

const InfoLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  margin-bottom: var(--space-xs);
`;

const InfoValue = styled.div`
  font-size: var(--text-base);
  color: var(--text-primary);
  font-weight: var(--font-semibold);
  text-transform: capitalize;
`;

const Form = styled.form``;

const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const FormGroup = styled.div`
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
`;

const Input = styled.input`
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: var(--transition-normal);
  background: var(--white);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(92, 206, 251, 0.1);
  }

  &::placeholder {
    color: var(--text-light);
  }

  &:disabled {
    background: var(--gray-100);
    cursor: not-allowed;
  }
`;

const PaymentMethodsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const PaymentMethod = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  background: var(--surface);

  @media ${devices.sm} {
    flex-direction: column;
    gap: var(--space-md);
    align-items: stretch;
    padding: var(--space-md);
  }
`;

const PaymentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const PaymentIcon = styled.div`
  font-size: 2rem;
`;

const PaymentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const PaymentType = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
`;

const PaymentExpiry = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const PaymentActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);

  @media ${devices.sm} {
    justify-content: space-between;

    button {
      flex: 1;
    }
  }
`;

const DefaultBadge = styled.span`
  background: var(--success);
  color: var(--white);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background: var(--surface);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  margin-top: var(--space-xl);

  @media ${devices.sm} {
    padding: var(--space-md);
    margin-top: var(--space-lg);
    font-size: var(--text-sm);
  }
`;

const PreferencesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);

  @media ${devices.lg} {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
`;

const PreferenceGroup = styled.div``;

const PreferenceTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  font-family: var(--font-heading);

  @media ${devices.sm} {
    font-size: var(--text-lg);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) 0;
  cursor: pointer;
  font-size: var(--text-base);
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
`;

const CheckboxText = styled.span`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-normal);
  font-size: var(--text-base);

  &:hover {
    border-color: var(--primary);
    background: var(--surface);
  }
`;

const Radio = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
`;

const RadioText = styled.span`
  font-weight: var(--font-medium);
  color: var(--text-primary);
`;


export default UserPage;