// src/hooks/useCookieConsent.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query keys
export const cookieConsentKeys = {
  all: ["cookieConsent"],
  consent: () => [...cookieConsentKeys.all, "consent"],
  preferences: () => [...cookieConsentKeys.all, "preferences"],
};

// Get cookie consent from localStorage
const getCookieConsent = () => {
  if (typeof window === "undefined") return null;

  const consent = localStorage.getItem("cookieConsent");
  return consent ? JSON.parse(consent) : null;
};

// Set cookie consent in localStorage
const setCookieConsent = (consent) => {
  if (typeof window === "undefined") return;

  if (consent === null) {
    localStorage.removeItem("cookieConsent");
  } else {
    localStorage.setItem("cookieConsent", JSON.stringify(consent));
  }
};

// Initialize cookies based on consent
const initializeCookies = (consent) => {
  if (!consent) return;

  // Initialize Google Analytics if analytics cookies are accepted
  if (consent.analytics) {
    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
    console.log("Analytics cookies initialized");
  }

  // Initialize marketing cookies if accepted
  if (consent.marketing) {
    console.log("Marketing cookies initialized");
  }

  // Initialize preference cookies if accepted
  if (consent.preferences) {
    console.log("Preference cookies initialized");
  }
};

// React Query functions
export const useCookieConsent = () => {
  const queryClient = useQueryClient();

  // Query to get current consent
  const { data: consent } = useQuery({
    queryKey: cookieConsentKeys.consent(),
    queryFn: getCookieConsent,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Mutation to update consent
  const { mutate: updateConsent } = useMutation({
    mutationFn: async (newConsent) => {
      setCookieConsent(newConsent);
      initializeCookies(newConsent);
      return newConsent;
    },
    onSuccess: (newConsent) => {
      queryClient.setQueryData(cookieConsentKeys.consent(), newConsent);
      queryClient.invalidateQueries({
        queryKey: cookieConsentKeys.preferences(),
      });
    },
  });

  // Check if banner should be shown
  const shouldShowBanner = !consent;

  // Accept all cookies
  const acceptAll = () => {
    const newConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };
    updateConsent(newConsent);
  };

  // Accept essential cookies only
  const acceptEssential = () => {
    const newConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };
    updateConsent(newConsent);
  };

  // Save custom preferences
  const savePreferences = (preferences) => {
    const newConsent = {
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      preferences: preferences.preferences,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };
    updateConsent(newConsent);
  };

  // Update specific consent category
  const updateCategory = (category, value) => {
    if (!consent) return;

    const newConsent = {
      ...consent,
      [category]: value,
      timestamp: new Date().toISOString(),
    };
    updateConsent(newConsent);
  };

  // Revoke consent (delete all cookies)
  const revokeConsent = () => {
    updateConsent(null);

    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  };

  // Check if specific category is allowed
  const isAllowed = (category) => {
    return consent ? consent[category] : false;
  };

  return {
    // State
    consent,
    shouldShowBanner,

    // Actions
    acceptAll,
    acceptEssential,
    savePreferences,
    updateCategory,
    revokeConsent,
    isAllowed,

    // Derived state
    hasConsent: !!consent,
    analyticsEnabled: isAllowed("analytics"),
    marketingEnabled: isAllowed("marketing"),
    preferencesEnabled: isAllowed("preferences"),
  };
};
