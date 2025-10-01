// src/components/CookieConsent.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useCookieConsent } from "../hooks/useCookieConsent";

// Import button components
import {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
} from "../components/ui/Button";

// Using only basic icons that should be available
import {
  FaCookie,
  FaCog,
  FaTimes,
  FaCheck,
  FaChartBar,
  FaBullhorn,
  FaUserCog,
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

  // Don't show anything if banner shouldn't be shown and preferences aren't open
  if (!shouldShowBanner && !preferencesOpen) return null;

  return (
    <AnimatePresence>
      {(shouldShowBanner || preferencesOpen) && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <BannerContainer
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {preferencesOpen ? (
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
                    We use cookies to enhance your experience on our luxury
                    Mercedes-Benz platform. Choose which types of cookies you
                    allow us to use.
                  </PreferencesDescription>

                  <PreferencesList>
                    <PreferenceItem $required={true}>
                      <PreferenceInfo>
                        <PreferenceTitle>
                          Necessary Cookies
                          <RequiredBadge>Required</RequiredBadge>
                        </PreferenceTitle>
                        <PreferenceDescription>
                          Essential for the website to function properly. Cannot
                          be disabled.
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
                          Analytics Cookies
                        </PreferenceTitle>
                        <PreferenceDescription>
                          Help us understand how visitors interact with our
                          luxury platform.
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
                          Marketing Cookies
                        </PreferenceTitle>
                        <PreferenceDescription>
                          Used to provide personalized luxury vehicle
                          recommendations.
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
                          Preference Cookies
                        </PreferenceTitle>
                        <PreferenceDescription>
                          Allow the platform to remember your luxury
                          preferences.
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
            ) : (
              <BannerContent>
                <BannerHeader>
                  <CookieIcon>
                    <FaCookie />
                  </CookieIcon>
                  <BannerText>
                    <BannerTitle>We Value Your Privacy</BannerTitle>
                    <BannerDescription>
                      At Mercedes-Benz Rentals, we use cookies to enhance your
                      luxury experience, serve personalized content, and analyze
                      our traffic. By clicking "Accept All", you consent to our
                      use of cookies.
                    </BannerDescription>
                  </BannerText>
                </BannerHeader>

                <BannerActions>
                  <PreferencesButton
                    onClick={() => setPreferencesOpen(true)}
                    $size="sm"
                  >
                    <FaCog />
                    Preferences
                  </PreferencesButton>
                  <EssentialButton onClick={handleAcceptEssential} $size="sm">
                    Essential Only
                  </EssentialButton>
                  <AcceptButton onClick={handleAcceptAll} $size="sm">
                    Accept All
                  </AcceptButton>
                </BannerActions>
              </BannerContent>
            )}
          </BannerContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

// Styled Components - Updated to use global CSS variables
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
  padding: 0;

  @media (min-width: 768px) {
    align-items: flex-end;
    padding-bottom: var(--space-lg);
  }
`;

const BannerContainer = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: var(--shadow-lg);
  max-width: 100%;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;

  @media (min-width: 768px) {
    max-width: 600px;
    border-radius: var(--radius-xl);
    margin: 0 auto;
  }

  @media (min-width: 1024px) {
    max-width: 700px;
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

const PreferencesModal = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 80vh;
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
