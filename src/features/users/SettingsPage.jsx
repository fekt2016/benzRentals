import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiSettings, FiUser, FiTrash2, FiSave, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { PrimaryButton, SecondaryButton, GhostButton } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import ErrorState from "../../components/feedback/ErrorState";
import ErrorBoundary from "../../app/providers/ErrorBoundary";
import DeleteAccountModal from "../../components/ui/DeleteAccountModal";
import NotificationSettings from "./components/NotificationSettings";
import Container from "../../components/layout/Container";
import {
  SettingsContainer,
  SettingsHeader,
  SettingsSection,
  SectionHeader,
  SettingItem,
  SettingLabel,
  DangerZone,
  ButtonGroup,
  ErrorBanner,
  UnsavedBanner,
} from "./SettingsPage.styles";
import usePageTitle from "../../app/hooks/usePageTitle";
import { PATHS } from "../../config/constants";
import { useUserSettings } from "./hooks/useUserSettings";
import { useUpdateSettings } from "./hooks/useUpdateSettings";
import { useDeleteAccount } from "./hooks/useDeleteAccount";
import { useCurrentUser } from "../auth/useAuth";

// Default settings structure
const defaultSettings = {
  emailNotifications: true,
  smsNotifications: false,
  bookingReminders: true,
  promotionalEmails: false,
  marketingEmails: false,
};

const SettingsPage = () => {
  usePageTitle("Settings - BenzFlex", "Manage your account settings and preferences");
  const navigate = useNavigate();

  // Fetch current user for validation
  const { data: userData } = useCurrentUser();
  const user = useMemo(() => userData?.user || null, [userData]);

  // Fetch settings
  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    error: settingsError,
    refetch: refetchSettings,
  } = useUserSettings();

  // Update settings mutation
  const {
    mutate: updateSettings,
    isPending: isSaving,
    error: updateError,
  } = useUpdateSettings();

  // Delete account mutation
  const {
    mutate: deleteAccount,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteAccount();

  // Local state for settings (for optimistic updates)
  const [localSettings, setLocalSettings] = useState(defaultSettings);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Initialize settings from API or use defaults
  useEffect(() => {
    if (settingsData?.data?.settings) {
      setLocalSettings(settingsData.data.settings);
      setHasUnsavedChanges(false);
    } else if (settingsData && !settingsData.data?.settings) {
      // API returned but no settings, use defaults
      setLocalSettings(defaultSettings);
    }
  }, [settingsData]);

  // Track unsaved changes
  useEffect(() => {
    if (settingsData?.data?.settings) {
      const hasChanges = JSON.stringify(localSettings) !== JSON.stringify(settingsData.data.settings);
      setHasUnsavedChanges(hasChanges);
    }
  }, [localSettings, settingsData]);

  // Handle toggle with optimistic update
  const handleToggle = (key) => {
    const newSettings = {
      ...localSettings,
      [key]: !localSettings[key],
    };
    setLocalSettings(newSettings);
    setHasUnsavedChanges(true);

    // Optimistic update via mutation
    updateSettings(newSettings, {
      onSuccess: () => {
        toast.success("Setting updated");
        setHasUnsavedChanges(false);
      },
      onError: (error) => {
        // Rollback on error
        setLocalSettings(settingsData?.data?.settings || defaultSettings);
        toast.error(error?.response?.data?.message || "Failed to update setting");
        setHasUnsavedChanges(false);
      },
    });
  };

  // Handle manual save (if needed)
  const handleSave = () => {
    updateSettings(localSettings, {
      onSuccess: () => {
        toast.success("Settings saved successfully");
        setHasUnsavedChanges(false);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to save settings");
      },
    });
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    deleteAccount(undefined, {
      onSuccess: () => {
        toast.success("Account deleted successfully");
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to delete account");
        setShowDeleteModal(false);
      },
    });
  };

  // Validation: Check if email/phone required for notifications
  const validateSettings = (settings) => {
    const errors = [];

    if (settings.emailNotifications && !user?.email) {
      errors.push("Email address is required for email notifications");
    }

    if (settings.smsNotifications && !user?.phone) {
      errors.push("Phone number is required for SMS notifications");
    }

    return errors;
  };

  // Loading state
  if (isLoadingSettings) {
    return (
      <Container>
        <SettingsContainer>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
            <LoadingSpinner size="lg" />
            <div style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              Loading your settings...
            </div>
          </div>
        </SettingsContainer>
      </Container>
    );
  }

  // Error state
  if (settingsError && !settingsData) {
    return (
      <Container>
        <SettingsContainer>
          <ErrorState
            title="Failed to Load Settings"
            message={settingsError?.response?.data?.message || "Unable to load your settings. Please try again."}
            actions={[
              {
                text: "Try Again",
                onClick: () => refetchSettings(),
                variant: "primary",
                icon: FiArrowLeft,
              },
              {
                text: "Go Back",
                onClick: () => navigate(-1),
                variant: "secondary",
              },
            ]}
          />
        </SettingsContainer>
      </Container>
    );
  }

  // Get current settings (use local for optimistic updates, fallback to API data)
  const currentSettings = localSettings;

  // Validate settings
  const validationErrors = validateSettings(currentSettings);

  return (
    <ErrorBoundary>
      <Container>
        <SettingsContainer>

        <SettingsHeader>
          <GhostButton onClick={() => navigate(-1)} aria-label="Go back">
            <FiArrowLeft />
          </GhostButton>
          <FiSettings size={28} />
          <h1>Settings</h1>
        </SettingsHeader>

        {/* Error Banner */}
        {(updateError || deleteError) && (
          <ErrorBanner role="alert" aria-live="assertive">
            <FiAlertCircle />
            <div>
              <strong>Error:</strong>{" "}
              {updateError?.response?.data?.message ||
                deleteError?.response?.data?.message ||
                "An error occurred. Please try again."}
            </div>
          </ErrorBanner>
        )}

        {/* Unsaved Changes Banner */}
        {hasUnsavedChanges && !isSaving && (
          <UnsavedBanner role="status" aria-live="polite">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FiAlertCircle />
              <span>You have unsaved changes</span>
            </div>
            <PrimaryButton onClick={handleSave} $size="sm" aria-label="Save unsaved changes">
              <FiSave style={{ marginRight: "0.5rem" }} />
              Save Now
            </PrimaryButton>
          </UnsavedBanner>
        )}

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <ErrorBanner role="alert" aria-live="assertive">
            <FiAlertCircle />
            <div>
              <strong>Validation Error:</strong>
              <ul style={{ margin: "0.5rem 0 0 1.5rem", padding: 0 }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </ErrorBanner>
        )}

        {/* Notification Settings */}
        <NotificationSettings
          settings={currentSettings}
          onToggle={handleToggle}
          isLoading={isSaving}
        />

        {/* Account Settings */}
        <SettingsSection>
          <SectionHeader>
            <FiUser size={20} />
            <h2>Account</h2>
          </SectionHeader>

          <SettingItem>
            <SettingLabel>
              <h3>Theme Preference</h3>
              <p>Choose your preferred theme (coming soon)</p>
            </SettingLabel>
            <SecondaryButton disabled aria-label="Theme preference (coming soon)">
              Light Mode
            </SecondaryButton>
          </SettingItem>
        </SettingsSection>

        {/* Danger Zone */}
        <DangerZone>
          <SectionHeader>
            <FiTrash2 size={20} color="#ef4444" />
            <h2 style={{ color: "#ef4444" }}>Danger Zone</h2>
          </SectionHeader>

          <SettingItem>
            <SettingLabel>
              <h3>Delete Account</h3>
              <p>Permanently delete your account and all associated data</p>
            </SettingLabel>
            <PrimaryButton
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              style={{ background: "#ef4444", borderColor: "#ef4444" }}
              aria-label="Open delete account confirmation"
            >
              <FiTrash2 style={{ marginRight: "0.5rem" }} />
              Delete Account
            </PrimaryButton>
          </SettingItem>
        </DangerZone>

        {/* Delete Account Modal */}
        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          isDeleting={isDeleting}
        />

        {/* Save/Cancel Buttons */}
        {hasUnsavedChanges && (
          <ButtonGroup>
            <SecondaryButton
              onClick={() => {
                setLocalSettings(settingsData?.data?.settings || defaultSettings);
                setHasUnsavedChanges(false);
                toast.success("Changes discarded");
              }}
              aria-label="Discard changes"
            >
              Discard Changes
            </SecondaryButton>
            <PrimaryButton
              onClick={handleSave}
              disabled={isSaving || validationErrors.length > 0}
              aria-label="Save settings"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave style={{ marginRight: "0.5rem" }} />
                  Save Changes
                </>
              )}
            </PrimaryButton>
          </ButtonGroup>
        )}
        </SettingsContainer>
      </Container>
    </ErrorBoundary>
  );
};

export default SettingsPage;
