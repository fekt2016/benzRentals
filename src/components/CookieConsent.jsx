// src/components/CookieConsent.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useCookieConsent } from "../hooks/useCookieConsent";

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
                  <CloseButton onClick={() => setPreferencesOpen(false)}>
                    <FaTimes />
                  </CloseButton>
                </ModalHeader>

                <ModalContent>
                  <PreferencesDescription>
                    We use cookies to enhance your experience on our website.
                    Choose which types of cookies you allow us to use.
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
                          <FaChartBar style={{ marginRight: "8px" }} />
                          Analytics Cookies
                        </PreferenceTitle>
                        <PreferenceDescription>
                          Help us understand how visitors interact with our
                          website.
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
                          <FaBullhorn style={{ marginRight: "8px" }} />
                          Marketing Cookies
                        </PreferenceTitle>
                        <PreferenceDescription>
                          Used to track visitors across websites for advertising
                          purposes.
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
                          <FaUserCog style={{ marginRight: "8px" }} />
                          Preference Cookies
                        </PreferenceTitle>
                        <PreferenceDescription>
                          Allow the website to remember choices you make.
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
                  <SecondaryButton onClick={() => setPreferencesOpen(false)}>
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handleSavePreferences}>
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
                      We use cookies to enhance your browsing experience, serve
                      personalized content, and analyze our traffic. By clicking
                      "Accept All", you consent to our use of cookies.
                    </BannerDescription>
                  </BannerText>
                </BannerHeader>

                <BannerActions>
                  <PreferencesButton onClick={() => setPreferencesOpen(true)}>
                    <FaCog />
                    Preferences
                  </PreferencesButton>
                  <EssentialButton onClick={handleAcceptEssential}>
                    Essential Only
                  </EssentialButton>
                  <AcceptButton onClick={handleAcceptAll}>
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

// Styled Components - Updated for bottom positioning
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
    padding-bottom: 2rem;
  }
`;

const BannerContainer = styled(motion.div)`
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;

  @media (min-width: 768px) {
    max-width: 600px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    margin: 0 auto;
  }

  @media (min-width: 1024px) {
    max-width: 700px;
  }
`;

const BannerContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 640px) {
    padding: 2rem;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
`;

const BannerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 639px) {
    text-align: center;
  }
`;

const CookieIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
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
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const BannerDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
`;

const BannerActions = styled.div`
  display: flex;
  gap: 0.75rem;
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

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 639px) {
    width: 100%;
    justify-content: center;
  }
`;

const PreferencesButton = styled(Button)`
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const EssentialButton = styled(Button)`
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const AcceptButton = styled(Button)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;

  &:hover {
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
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
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;

  @media (max-width: 640px) {
    padding: 1.25rem 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #374151;
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

const PreferencesDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
`;

const PreferencesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PreferenceItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: ${(props) => (props.$required ? "#f0f9ff" : "#f8fafc")};
  border: 1px solid ${(props) => (props.$required ? "#bae6fd" : "#e2e8f0")};
  border-radius: 12px;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e1;
  }
`;

const PreferenceInfo = styled.div`
  flex: 1;
`;

const PreferenceTitle = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const RequiredBadge = styled.span`
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.75rem;
`;

const PreferenceDescription = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
`;

const PreferenceToggle = styled.button`
  width: 44px;
  height: 24px;
  background: ${(props) =>
    props.$active ? "#10b981" : props.$disabled ? "#9ca3af" : "#d1d5db"};
  border: none;
  border-radius: 12px;
  position: relative;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;

  &::after {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    top: 4px;
    left: ${(props) => (props.$active ? "24px" : "4px")};
    transition: left 0.2s;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;

  @media (max-width: 640px) {
    flex-direction: column;
    padding: 1.25rem 1.5rem;
  }
`;

const PrimaryButton = styled(Button)`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;

  &:hover {
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 640px) {
    order: -1;
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;
