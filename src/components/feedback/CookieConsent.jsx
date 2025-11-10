// src/components/CookieConsent.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useCookieConsent } from "../../app/hooks/useCookieConsent";

// Import button components
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
} from "../ui/Button";

// Icons
import {
  FaCog,
  FaTimes,
  FaCheck,
  FaChartBar,
  FaBullhorn,
  FaUserCog,
  FaCar,
  FaCreditCard,
} from "react-icons/fa";

const CookieConsent = () => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [localPreferences, setLocalPreferences] = useState({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const {
    shouldShowBanner,
    consent,
    acceptAll,
    acceptEssential,
    savePreferences,
    dismissBanner, // We'll add this function to the hook
  } = useCookieConsent();

  // Initialize local preferences when consent changes
  useEffect(() => {
    if (consent) {
      setLocalPreferences({
        analytics: consent.analytics,
        marketing: consent.marketing,
        preferences: consent.preferences,
      });
    }
  }, [consent]);

  const handlePreferenceChange = (type) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSavePreferences = () => {
    savePreferences(localPreferences);
    setPreferencesOpen(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    setPreferencesOpen(false);
  };

  const handleAcceptEssential = () => {
    acceptEssential();
    setPreferencesOpen(false);
  };

  const handleDismiss = () => {
    // This will hide the banner without setting any consent
    dismissBanner();
  };

  // Don't show anything if banner shouldn't be shown and preferences aren't open
  if (!shouldShowBanner && !preferencesOpen) return null;

  return (
    <AnimatePresence>
      {/* Main Banner */}
      {shouldShowBanner && !preferencesOpen && (
        <BannerContainer
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <CloseBannerButton onClick={handleDismiss} $size="sm">
            <FaTimes />
          </CloseBannerButton>

          <BannerContent>
            <BannerHeader>
              <CookieIcon>
                <FaCar />
              </CookieIcon>
              <BannerText>
                <BannerTitle>Enhanced Car Rental Experience</BannerTitle>
                <BannerDescription>
                  We use cookies to provide you with the best rental
                  experience—showing you relevant vehicles, remembering your
                  preferences, and improving our service. You can accept all,
                  choose essentials only, or customize your preferences.
                </BannerDescription>
              </BannerText>
            </BannerHeader>

            <BannerActions>
              <PreferencesButton
                onClick={() => setPreferencesOpen(true)}
                $size="sm"
              >
                <FaCog />
                Customize
              </PreferencesButton>
              <EssentialButton onClick={handleAcceptEssential} $size="sm">
                Essentials Only
              </EssentialButton>
              <AcceptButton onClick={handleAcceptAll} $size="sm">
                Accept All
              </AcceptButton>
            </BannerActions>
          </BannerContent>
        </BannerContainer>
      )}

      {/* Preferences Modal - Only this gets the overlay when open */}
      {preferencesOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPreferencesOpen(false)}
        >
          <PreferencesContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <PreferencesModal>
              <ModalHeader>
                <ModalTitle>
                  <FaCog />
                  Cookie Preferences
                </ModalTitle>
                <CloseButton
                  onClick={() => setPreferencesOpen(false)}
                  $size="sm"
                >
                  <FaTimes />
                </CloseButton>
              </ModalHeader>

              <ModalContent>
                <PreferencesDescription>
                  We use cookies to enhance your car rental experience. Manage
                  your preferences to control how we use your data for improving
                  our services and showing you relevant vehicle options and
                  deals.
                </PreferencesDescription>

                <PreferencesList>
                  <PreferenceItem $required={true}>
                    <PreferenceInfo>
                      <PreferenceTitle>
                        <FaCreditCard />
                        Essential Operation Cookies
                        <RequiredBadge>Required</RequiredBadge>
                      </PreferenceTitle>
                      <PreferenceDescription>
                        Necessary for booking vehicles, processing payments, and
                        secure site operation. These cannot be disabled as they
                        are required for rental reservations.
                      </PreferenceDescription>
                    </PreferenceInfo>
                    <PreferenceToggle $disabled={true}>
                      <FaCheck />
                    </PreferenceToggle>
                  </PreferenceItem>

                  <PreferenceItem>
                    <PreferenceInfo>
                      <PreferenceTitle>
                        <FaChartBar />
                        Analytics & Performance Cookies
                      </PreferenceTitle>
                      <PreferenceDescription>
                        Help us understand how customers use our rental
                        platform—which vehicles are most viewed, booking funnel
                        drop-offs, and site performance. This helps us improve
                        our fleet and customer experience.
                      </PreferenceDescription>
                    </PreferenceInfo>
                    <PreferenceToggle
                      $active={localPreferences.analytics}
                      onClick={() => handlePreferenceChange("analytics")}
                    >
                      {localPreferences.analytics && <FaCheck />}
                    </PreferenceToggle>
                  </PreferenceItem>

                  <PreferenceItem>
                    <PreferenceInfo>
                      <PreferenceTitle>
                        <FaBullhorn />
                        Marketing & Personalization Cookies
                      </PreferenceTitle>
                      <PreferenceDescription>
                        Used to show you relevant vehicle recommendations,
                        special rental deals, and retarget ads for vehicles
                        you&apos;ve viewed. Helps us reach you with offers on your
                        preferred car types and rental locations.
                      </PreferenceDescription>
                    </PreferenceInfo>
                    <PreferenceToggle
                      $active={localPreferences.marketing}
                      onClick={() => handlePreferenceChange("marketing")}
                    >
                      {localPreferences.marketing && <FaCheck />}
                    </PreferenceToggle>
                  </PreferenceItem>

                  <PreferenceItem>
                    <PreferenceInfo>
                      <PreferenceTitle>
                        <FaUserCog />
                        Preference & Convenience Cookies
                      </PreferenceTitle>
                      <PreferenceDescription>
                        Remember your rental preferences—favorite locations,
                        vehicle types, insurance choices, and payment methods.
                        Makes repeat bookings faster and more convenient.
                      </PreferenceDescription>
                    </PreferenceInfo>
                    <PreferenceToggle
                      $active={localPreferences.preferences}
                      onClick={() => handlePreferenceChange("preferences")}
                    >
                      {localPreferences.preferences && <FaCheck />}
                    </PreferenceToggle>
                  </PreferenceItem>
                </PreferencesList>
              </ModalContent>

              <ModalActions>
                <SecondaryButton
                  onClick={() => setPreferencesOpen(false)}
                  $size="md"
                >
                  Cancel
                </SecondaryButton>
                <PrimaryButton onClick={handleSavePreferences} $size="md">
                  Save Preferences
                </PrimaryButton>
              </ModalActions>
            </PreferencesModal>
          </PreferencesContainer>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

// Styled Components
const BannerContainer = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  width: 90%;
  position: fixed;
  bottom: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  border: 1px solid var(--gray-200);
  margin: 0 auto;

  @media (min-width: 1024px) {
    max-width: 700px;
    width: 95%;
  }
`;


const CloseBannerButton = styled(GhostButton)`
  && {
    position: absolute;
    top: var(--space-sm);
    right: var(--space-sm);
    padding: var(--space-xs);
    min-width: auto;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;

    @media (min-width: 768px) {
      top: var(--space-md);
      right: var(--space-md);
      width: 36px;
      height: 36px;
    }
  }
`;

const BannerContent = styled.div`
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);

  @media (min-width: 640px) {
    padding: var(--space-xl);
    flex-direction: row;
    align-items: center;
    gap: var(--space-xl);
  }
`;

const BannerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);

  @media (max-width: 639px) {
    text-align: center;
  }
`;

const CookieIcon = styled.div`
  width: 48px;
  height: 48px;
  background: var(--gradient-accent);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary);
  font-size: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 639px) {
    align-self: center;
  }
`;

const BannerText = styled.div`
  flex: 1;
`;

const BannerTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-sm) 0;
  font-family: var(--font-heading);
`;

const BannerDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  font-size: var(--text-sm);
  font-family: var(--font-body);
`;

const BannerActions = styled.div`
  display: flex;
  gap: var(--space-sm);
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;

  @media (max-width: 639px) {
    flex-direction: column;
    width: 100%;
  }

  @media (min-width: 640px) {
    flex-shrink: 0;
    justify-content: center;
  }
`;

const PreferencesButton = styled(SecondaryButton)`
  && {
    @media (max-width: 639px) {
      width: 100%;
      justify-content: center;
    }
  }
`;

const EssentialButton = styled(SecondaryButton)`
  && {
    @media (max-width: 639px) {
      width: 100%;
      justify-content: center;
    }
  }
`;

const AcceptButton = styled(PrimaryButton)`
  && {
    @media (max-width: 639px) {
      width: 100%;
      justify-content: center;
    }
  }
`;

// Modal Overlay (only for preferences modal)
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  padding: var(--space-lg);
`;

const PreferencesContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;

  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

const PreferencesModal = styled.div`
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--gray-200);

  @media (max-width: 640px) {
    padding: var(--space-md) var(--space-lg);
  }
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-heading);
`;

const CloseButton = styled(GhostButton)`
  && {
    padding: var(--space-sm);
    min-width: auto;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-xl);

  @media (max-width: 640px) {
    padding: var(--space-lg);
  }
`;

const PreferencesDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-xl);
  text-align: center;
  font-family: var(--font-body);
`;

const PreferencesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const PreferenceItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: ${(props) => (props.$required ? "#f0f9ff" : "var(--surface)")};
  border: 1px solid
    ${(props) => (props.$required ? "#bae6fd" : "var(--gray-200)")};
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);

  &:hover {
    border-color: var(--gray-300);
  }
`;

const PreferenceInfo = styled.div`
  flex: 1;
`;

const PreferenceTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  font-family: var(--font-body);
  gap: var(--space-sm);
`;

const RequiredBadge = styled.span`
  background: var(--primary);
  color: var(--white);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  font-family: var(--font-body);
`;

const PreferenceDescription = styled.p`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 1.5;
  margin: 0;
  font-family: var(--font-body);
`;

const PreferenceToggle = styled.button`
  width: 44px;
  height: 24px;
  background: ${(props) =>
    props.$active
      ? "var(--success)"
      : props.$disabled
      ? "var(--gray-400)"
      : "var(--gray-300)"};
  border: none;
  border-radius: var(--radius-full);
  position: relative;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  font-size: var(--text-xs);

  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background: var(--white);
    border-radius: 50%;
    top: 4px;
    left: ${(props) => (props.$active ? "24px" : "4px")};
    transition: left var(--transition-normal);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg) var(--space-xl);
  border-top: 1px solid var(--gray-200);
  background: var(--surface);

  @media (max-width: 640px) {
    flex-direction: column;
    padding: var(--space-md) var(--space-lg);
  }
`;
