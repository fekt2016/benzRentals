// src/hooks/useCookieConsent.js
import { useState, useEffect } from "react";

export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);
  const [shouldShowBanner, setShouldShowBanner] = useState(false);

  // Cookie names
  const COOKIE_CONSENT_NAME = "car_rental_cookie_consent";
  const COOKIE_DISMISS_NAME = "car_rental_banner_dismissed";
  const COOKIE_EXPIRY_DAYS = 365;

  useEffect(() => {
    const savedConsent = getCookieConsent();
    const bannerDismissed = getBannerDismissed();

    if (savedConsent) {
      setConsent(savedConsent);
      setShouldShowBanner(false);
      applyConsentToScripts(savedConsent);
    } else if (bannerDismissed) {
      // User previously dismissed the banner without making a choice
      setShouldShowBanner(false);
    } else {
      setShouldShowBanner(true);
    }
  }, []); // Empty dependency array is correct - runs only on mount

  const getCookieConsent = () => {
    if (typeof window === "undefined") return null;

    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_CONSENT_NAME}=`));

    if (cookie) {
      const cookieValue = cookie.split("=")[1];
      try {
        return JSON.parse(decodeURIComponent(cookieValue));
      } catch {
        return null;
      }
    }
    return null;
  };

  const getBannerDismissed = () => {
    if (typeof window === "undefined") return false;

    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_DISMISS_NAME}=`));

    return !!cookie;
  };

  const setCookieConsent = (consentData) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

    const cookieValue = encodeURIComponent(
      JSON.stringify({
        ...consentData,
        timestamp: new Date().toISOString(),
        version: "1.0",
      })
    );

    document.cookie = `${COOKIE_CONSENT_NAME}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

    setConsent(consentData);
    setShouldShowBanner(false);
    applyConsentToScripts(consentData);
  };

  const dismissBanner = () => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // Remember dismissal for 30 days

    document.cookie = `${COOKIE_DISMISS_NAME}=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

    setShouldShowBanner(false);

    console.log("Cookie banner dismissed without making a choice");
  };

  const applyConsentToScripts = (consentData) => {
    // Analytics
    if (consentData.analytics) {
      enableAnalyticsScripts();
    } else {
      disableAnalyticsScripts();
    }

    // Marketing
    if (consentData.marketing) {
      enableMarketingScripts();
    } else {
      disableMarketingScripts();
    }

    // Preferences
    if (consentData.preferences) {
      enablePreferenceScripts();
    } else {
      disablePreferenceScripts();
    }

    // Notify other components
    window.dispatchEvent(
      new CustomEvent("cookieConsentUpdated", {
        detail: consentData,
      })
    );
  };

  // Analytics Scripts - Replace with your actual IDs
  const enableAnalyticsScripts = () => {
    console.log("🚗 Enabling car rental analytics scripts");

    // Google Analytics 4
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", "GA_MEASUREMENT_ID"); // Replace with your GA4 ID

    if (
      !document.querySelector('script[src*="googletagmanager.com/gtag/js"]')
    ) {
      const gaScript = document.createElement("script");
      gaScript.src =
        "https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID";
      gaScript.async = true;
      document.head.appendChild(gaScript);
    }
  };

  const disableAnalyticsScripts = () => {
    console.log("🔕 Analytics scripts disabled");
    window["ga-disable-GA_MEASUREMENT_ID"] = true;
  };

  // Marketing Scripts - Replace with your actual IDs
  const enableMarketingScripts = () => {
    console.log("📢 Enabling car rental marketing scripts");

    // Meta (Facebook) Pixel
    if (!window.fbq) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );
    }
    window.fbq("init", "FB_PIXEL_ID");
    window.fbq("track", "PageView");
  };

  const disableMarketingScripts = () => {
    console.log("🔕 Marketing scripts disabled");
    window.fbq && window.fbq("consent", "revoke");
  };

  // Preference Scripts
  const enablePreferenceScripts = () => {
    console.log("⭐ Enabling rental preference features");
    localStorage.setItem("rental_preferences_enabled", "true");
  };

  const disablePreferenceScripts = () => {
    console.log("🔕 Preference features disabled");
    localStorage.setItem("rental_preferences_enabled", "false");
  };

  // ============================================================================
  // CAR RENTAL SPECIFIC TRACKING EVENTS
  // ============================================================================

  const trackCarRentalEvents = {
    // Track vehicle views
    trackVehicleView: (vehicleId, vehicleType, dailyRate) => {
      if (window.gtag && consent?.analytics) {
        window.gtag("event", "view_item", {
          item_id: vehicleId,
          item_name: vehicleType,
          value: dailyRate,
          currency: "USD",
        });
      }
      if (window.fbq && consent?.marketing) {
        window.fbq("track", "ViewContent", {
          content_name: vehicleType,
          content_category: "vehicle",
          content_ids: [vehicleId],
          value: dailyRate,
          currency: "USD",
        });
      }

      // Save to recent vehicles if preferences enabled
      if (consent?.preferences) {
        const recentVehicles = JSON.parse(
          localStorage.getItem("recent_vehicles") || "[]"
        );
        const updatedVehicles = recentVehicles.filter(
          (v) => v.id !== vehicleId
        );
        updatedVehicles.unshift({
          id: vehicleId,
          type: vehicleType,
          rate: dailyRate,
          viewedAt: new Date().toISOString(),
        });
        localStorage.setItem(
          "recent_vehicles",
          JSON.stringify(updatedVehicles.slice(0, 10))
        );
      }
    },

    // Track booking initiation
    trackBookingStart: (vehicleType, location, dates, totalAmount) => {
      if (window.gtag && consent?.analytics) {
        window.gtag("event", "begin_checkout", {
          currency: "USD",
          value: totalAmount,
          items: [
            {
              item_id: vehicleType,
              item_name: vehicleType,
              category: "vehicle_rental",
              location: location,
            },
          ],
        });
      }
      if (window.fbq && consent?.marketing) {
        window.fbq("track", "InitiateCheckout", {
          value: totalAmount,
          currency: "USD",
          content_name: vehicleType,
          content_category: "vehicle_rental",
        });
      }
    },

    // Track completed booking
    trackBookingComplete: (bookingId, totalAmount, vehicleType, rentalDays) => {
      if (window.gtag && consent?.analytics) {
        window.gtag("event", "purchase", {
          transaction_id: bookingId,
          value: totalAmount,
          currency: "USD",
          items: [
            {
              item_id: vehicleType,
              item_name: vehicleType,
              quantity: rentalDays,
            },
          ],
        });
      }
      if (window.fbq && consent?.marketing) {
        window.fbq("track", "Purchase", {
          value: totalAmount,
          currency: "USD",
          content_ids: [vehicleType],
          content_name: vehicleType,
          num_items: rentalDays,
        });
      }
    },

    // Track location searches
    trackLocationSearch: (location) => {
      if (window.gtag && consent?.analytics) {
        window.gtag("event", "search", {
          search_term: location,
        });
      }

      // Save preferred location if preferences enabled
      if (consent?.preferences) {
        const preferredLocations = JSON.parse(
          localStorage.getItem("preferred_locations") || "[]"
        );
        const updatedLocations = preferredLocations.filter(
          (l) => l.location !== location
        );
        updatedLocations.unshift({
          location: location,
          searchedAt: new Date().toISOString(),
        });
        localStorage.setItem(
          "preferred_locations",
          JSON.stringify(updatedLocations.slice(0, 5))
        );
      }
    },

    // Track contact form submission
    trackContactForm: (formType, vehicleInterest = null) => {
      if (window.gtag && consent?.analytics) {
        window.gtag("event", "generate_lead", {
          form_type: formType,
          vehicle_interest: vehicleInterest,
        });
      }
      if (window.fbq && consent?.marketing) {
        window.fbq("track", "Lead", {
          form_type: formType,
          vehicle_interest: vehicleInterest,
        });
      }
    },

    // Save vehicle preferences
    saveVehiclePreference: (vehicleType, features, priceRange) => {
      if (consent?.preferences) {
        const preferences = JSON.parse(
          localStorage.getItem("vehicle_preferences") || "{}"
        );
        preferences.vehicleTypes = [
          ...new Set([...preferences.vehicleTypes, vehicleType]),
        ];
        preferences.features = [
          ...new Set([...preferences.features, ...features]),
        ];
        preferences.priceRange = priceRange;
        localStorage.setItem(
          "vehicle_preferences",
          JSON.stringify(preferences)
        );
      }
    },
  };

  // Consent actions
  const acceptAll = () => {
    setCookieConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const acceptEssential = () => {
    setCookieConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const savePreferences = (preferences) => {
    setCookieConsent({
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      preferences: preferences.preferences,
    });
  };

  return {
    consent,
    shouldShowBanner,
    acceptAll,
    acceptEssential,
    savePreferences,
    dismissBanner,
    trackCarRentalEvents, // This was missing - now it's included!
  };
};
