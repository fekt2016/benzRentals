import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import paymentApi from "../services/paymentApi";
import { loadStripe } from "@stripe/stripe-js";

// ==========================================
// ✅ Detect environment (web vs mobile)
// ==========================================
const detectMobileApp = () => {
  try {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    return (
      /ReactNative|Expo|Android|iPhone|iPad/i.test(ua) ||
      localStorage.getItem("forceMobile") === "true"
    );
  } catch {
    return false;
  }
};
const isMobileApp = detectMobileApp();

// ==========================================
// ✅ Stripe initialization
// ==========================================
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!STRIPE_PUBLIC_KEY) {
  console.error("[usePayment] ❌ VITE_STRIPE_PUBLIC_KEY is missing");
}

let stripePromise = null;
async function getStripePromise() {
  if (!STRIPE_PUBLIC_KEY)
    throw new Error("Stripe public key missing in environment variables");

  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
      .then((stripe) => {
        return stripe;
      })
      .catch((error) => {
        console.error("[usePayment] ❌ Failed to load Stripe.js:", error);
        stripePromise = null; // Reset so we can retry later
        throw error;
      });
  }
  return stripePromise;
}

// ==========================================
// ✅ Stripe payment mutation
// ==========================================
export const useStripePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      console.log("==========================================");
      console.log("[usePayment] 🚀 mutationFn STARTED");
      console.log("==========================================");

      const payload = {
        ...bookingData,
        metadata: {
          ...(bookingData?.metadata || {}),
          platform: isMobileApp ? "mobile" : "web",
        },
        mobile: isMobileApp,
      };

      try {
        const response = await paymentApi.stripePayment(payload);
        return response;
      } catch (error) {
        console.error("[usePayment] ❌ Error in mutationFn:", error);
        throw error;
      }
    },

    onSuccess: async (response) => {
      try {
        const sessionId = response?.data?.sessionId;
        const sessionUrl = response?.data?.url;

        if (!sessionId) throw new Error("No session ID received from backend");

        // ✅ MOBILE FLOW
        if (isMobileApp) {
          if (sessionUrl) {
            window.location.href = sessionUrl;
          }
          return;
        }

        // ✅ WEB FLOW
        if (!STRIPE_PUBLIC_KEY)
          throw new Error("Missing Stripe public key in .env");

        const stripe = await getStripePromise();
        if (!stripe) throw new Error("Failed to initialize Stripe");

        const result = await stripe.redirectToCheckout({ sessionId });

        // Fallback redirect if Stripe fails
        if (result?.error && sessionUrl) {
          window.location.href = sessionUrl;
        }
      } catch (err) {
        console.error("[usePayment] ❌ Error in onSuccess:", err);
        throw err;
      }
    },

    onError: (error) => {
      // Only log critical errors
      if (error?.response) {
        console.error("[usePayment] Payment error:", error.response.status, error.response.data);
      } else {
        console.error("[usePayment] Payment error:", error.message);
      }
    },
  });
};

// ==========================================
// ✅ Verify Payment (backend confirmation)
// ==========================================
export const useVerifyPayment = (sessionId, bookingId) => {
  return useQuery({
    queryKey: ["payment", "verification", sessionId, bookingId],
    queryFn: async () => {
      const res = await paymentApi.verifyPayment(sessionId, bookingId);
      return res.data;
    },
    enabled: !!sessionId && !!bookingId,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
};

// ==========================================
// ✅ Booking confirmation (after success)
// ==========================================
export const useGetBookingConfirmation = (bookingId) => {
  return useQuery({
    queryKey: ["payment", "confirmation", bookingId],
    queryFn: async () => {
      const res = await paymentApi.getBookingConfirmation(bookingId);
      // Backend returns: { success: true, data: { booking, session } }
      // We return the full response structure so component can access response.data.booking
      return res.data; // This returns { success: true, data: { booking, session } }
    },
    enabled: !!bookingId,
    retry: 2,
    staleTime: 10 * 60 * 1000,
  });
};

// ==========================================
// ✅ Combined Payment Confirmation Hook
// ==========================================
export const usePaymentConfirmation = (sessionId, bookingId) => {
  const {
    data: verificationData,
    isLoading: verifying,
    error: verifyError,
  } = useVerifyPayment(sessionId, bookingId);

  const {
    data: confirmationData,
    isLoading: confirming,
    error: confirmError,
  } = useGetBookingConfirmation(bookingId);

  return {
    data: verificationData || confirmationData,
    isLoading: verifying || confirming,
    error: verifyError || confirmError,
    isVerified: !!verificationData?.success,
    isConfirmed: !!confirmationData?.success,
  };
};
