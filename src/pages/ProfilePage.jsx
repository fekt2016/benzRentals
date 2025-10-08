// src/pages/UserPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { devices } from "../styles/GlobalStyles";

// Import reusable components
import Container from "../Layout/Container";
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
} from "../components/ui/Button";

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
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaUpload,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const UserPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Mock user data
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    joined: "March 15, 2023",
    avatar:
      "https://images.unsplash.com/photo-1603415526960-f7e0328d7a23?auto=format&fit=crop&w=300&q=80",
    membership: "Premium Member",
    totalRentals: 12,
    favoriteCar: "Mercedes-Benz S-Class",
  };

  // Form state
  const [profileForm, setProfileForm] = useState({
    firstName: "John",
    lastName: "Smith",
    email: user.email,
    phone: user.phone,
    dateOfBirth: "1985-06-15",
    address: "123 Main Street, New York, NY 10001",
    emergencyContact: "+1 (555) 987-6543",
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
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
    communication: "email", // email, sms, both
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

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurityForm({
      ...securityForm,
      [name]: type === "checkbox" ? checked : value,
    });
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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log("Saving profile:", profileForm);
    setIsEditing(false);
    // Add API call here
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    console.log("Updating security:", securityForm);
    // Add API call here
  };

  const handleAddPaymentMethod = () => {
    // Add payment method logic
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

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "payment", label: "Payment Methods", icon: FaCreditCard },
    { id: "preferences", label: "Preferences", icon: FaCog },
    { id: "notifications", label: "Notifications", icon: FaBell },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSection
            isEditing={isEditing}
            profileForm={profileForm}
            user={user}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
            onChange={handleProfileChange}
            onSave={handleSaveProfile}
          />
        );
      case "security":
        return (
          <SecuritySection
            securityForm={securityForm}
            onChange={handleSecurityChange}
            onSave={handleSaveSecurity}
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
        <PageHeader>
          <HeaderContent>
            <AvatarSection>
              <Avatar src={user.avatar} alt={user.name} />
              <AvatarOverlay>
                <FaUpload />
              </AvatarOverlay>
            </AvatarSection>
            <UserInfo>
              <UserName>{user.name}</UserName>
              <UserBadge>
                <FaCheckCircle />
                {user.membership}
              </UserBadge>
              <UserStats>
                <Stat>
                  <StatNumber>{user.totalRentals}</StatNumber>
                  <StatLabel>Total Rentals</StatLabel>
                </Stat>
                <Stat>
                  <StatNumber>4.9</StatNumber>
                  <StatLabel>Rating</StatLabel>
                </Stat>
                <Stat>
                  <StatNumber>{user.favoriteCar}</StatNumber>
                  <StatLabel>Favorite Car</StatLabel>
                </Stat>
              </UserStats>
            </UserInfo>
          </HeaderContent>
        </PageHeader>

        <ContentGrid>
          <Sidebar>
            <TabList>
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <TabItem
                    key={tab.id}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <TabIcon />
                    {tab.label}
                  </TabItem>
                );
              })}
            </TabList>
          </Sidebar>

          <MainContent>{renderTabContent()}</MainContent>
        </ContentGrid>
      </Container>
    </PageWrapper>
  );
};

// Profile Section Component
const ProfileSection = ({
  isEditing,
  profileForm,
  user,
  onEdit,
  onCancel,
  onChange,
  onSave,
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
          <GhostButton onClick={onCancel} $size="sm">
            Cancel
          </GhostButton>
          <PrimaryButton onClick={onSave} $size="sm">
            Save Changes
          </PrimaryButton>
        </ButtonGroup>
      )}
    </SectionHeader>

    <SectionContent>
      {!isEditing ? (
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Full Name</InfoLabel>
            <InfoValue>{user.name}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email Address</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Phone Number</InfoLabel>
            <InfoValue>{user.phone}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Date of Birth</InfoLabel>
            <InfoValue>June 15, 1985</InfoValue>
          </InfoItem>
          <InfoItem fullWidth>
            <InfoLabel>Address</InfoLabel>
            <InfoValue>123 Main Street, New York, NY 10001</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Emergency Contact</InfoLabel>
            <InfoValue>+1 (555) 987-6543</InfoValue>
          </InfoItem>
        </InfoGrid>
      ) : (
        <Form onSubmit={onSave}>
          <FormGrid>
            <FormGroup>
              <Label>First Name</Label>
              <Input
                type="text"
                name="firstName"
                value={profileForm.firstName}
                onChange={onChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Last Name</Label>
              <Input
                type="text"
                name="lastName"
                value={profileForm.lastName}
                onChange={onChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={onChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={onChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                name="dateOfBirth"
                value={profileForm.dateOfBirth}
                onChange={onChange}
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
              />
            </FormGroup>
            <FormGroup>
              <Label>Emergency Contact</Label>
              <Input
                type="tel"
                name="emergencyContact"
                value={profileForm.emergencyContact}
                onChange={onChange}
                placeholder="+1 (555) 123-4567"
              />
            </FormGroup>
          </FormGrid>
        </Form>
      )}
    </SectionContent>
  </SectionCard>
);

// Security Section Component
const SecuritySection = ({ securityForm, onChange, onSave }) => (
  <SectionCard>
    <SectionHeader>
      <SectionTitle>
        <FaLock />
        Security Settings
      </SectionTitle>
    </SectionHeader>

    <SectionContent>
      <Form onSubmit={onSave}>
        <FormGroup>
          <Label>Current Password</Label>
          <Input
            type="password"
            name="currentPassword"
            value={securityForm.currentPassword}
            onChange={onChange}
            placeholder="Enter current password"
          />
        </FormGroup>

        <FormGroup>
          <Label>New Password</Label>
          <Input
            type="password"
            name="newPassword"
            value={securityForm.newPassword}
            onChange={onChange}
            placeholder="Enter new password"
          />
        </FormGroup>

        <FormGroup>
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={securityForm.confirmPassword}
            onChange={onChange}
            placeholder="Confirm new password"
          />
        </FormGroup>

        <CheckboxGroup>
          <CheckboxLabel>
            <Checkbox
              type="checkbox"
              name="twoFactorEnabled"
              checked={securityForm.twoFactorEnabled}
              onChange={onChange}
            />
            <CheckboxText>
              <FaShieldAlt />
              Enable Two-Factor Authentication
            </CheckboxText>
          </CheckboxLabel>
          <CheckboxDescription>
            Add an extra layer of security to your account
          </CheckboxDescription>
        </CheckboxGroup>

        <PrimaryButton type="submit" $size="lg">
          Update Security Settings
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
const NotificationsSection = ({ preferences, onChange }) => (
  <SectionCard>
    <SectionHeader>
      <SectionTitle>
        <FaBell />
        Notification Preferences
      </SectionTitle>
    </SectionHeader>

    <SectionContent>
      <NotificationGroup>
        <NotificationTitle>Booking Notifications</NotificationTitle>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={preferences.notifications.bookingConfirmations}
            onChange={(e) =>
              onChange(
                "notifications",
                "bookingConfirmations",
                e.target.checked
              )
            }
          />
          <CheckboxText>Booking Confirmations</CheckboxText>
        </CheckboxLabel>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={preferences.notifications.rentalReminders}
            onChange={(e) =>
              onChange("notifications", "rentalReminders", e.target.checked)
            }
          />
          <CheckboxText>Rental Reminders</CheckboxText>
        </CheckboxLabel>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={preferences.notifications.specialOffers}
            onChange={(e) =>
              onChange("notifications", "specialOffers", e.target.checked)
            }
          />
          <CheckboxText>Special Offers & Promotions</CheckboxText>
        </CheckboxLabel>
        <CheckboxLabel>
          <Checkbox
            type="checkbox"
            checked={preferences.notifications.smsAlerts}
            onChange={(e) =>
              onChange("notifications", "smsAlerts", e.target.checked)
            }
          />
          <CheckboxText>SMS Alerts</CheckboxText>
        </CheckboxLabel>
      </NotificationGroup>
    </SectionContent>
  </SectionCard>
);

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: var(--surface);
  padding: var(--space-xl) 0;
`;

const PageHeader = styled.div`
  background: var(--white);
  border-radius: var(--radius-2xl);
  padding: var(--space-2xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
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
  position: relative;
  display: inline-block;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  object-fit: cover;
  border: 4px solid var(--primary-light);
`;

const AvatarOverlay = styled.div`
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

  &:hover {
    background: var(--primary-dark);
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h1`
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-heading);
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
`;

const UserStats = styled.div`
  display: flex;
  gap: var(--space-xl);
  flex-wrap: wrap;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
`;

const StatLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
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
    order: 2;
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
    display: flex;
    overflow-x: auto;
    padding: var(--space-sm);
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
    white-space: nowrap;
    margin-bottom: 0;
    margin-right: var(--space-xs);
    flex-shrink: 0;
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
`;

const SectionContent = styled.div`
  padding: var(--space-xl);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
`;

const Form = styled.form``;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);

  @media ${devices.sm} {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const FormGroup = styled.div`
  grid-column: ${(props) => (props.fullWidth ? "1 / -1" : "auto")};
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
`;

const CheckboxGroup = styled.div`
  margin: var(--space-xl) 0;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) 0;
  cursor: pointer;
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

const CheckboxDescription = styled.p`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: var(--space-xs);
  margin-left: calc(18px + var(--space-md));
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

const PaymentDetails = styled.div``;

const PaymentType = styled.div`
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
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
`;

const NotificationGroup = styled.div``;

const NotificationTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  font-family: var(--font-heading);
`;

export default UserPage;
