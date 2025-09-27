import { useQuery, useMutation } from "@tanstack/react-query";
import paymentApi from "../services/paymentApi";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SAuoMLIgC1tNQyvfyFJu4A8dyVPzLUlMDVAclXeCXRV5CWEItfCHFisgrgWF7okHex1Nv5FoUldgzXu0Y4faMVj00bdq5i8EJ"
);

export const useStripePayment = () => {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingData) => {
      const response = await paymentApi.stripePayment(bookingData);

      return response;
    },
    onSuccess: async (response) => {
      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
    },
    onError: (error) => {
      console.error("Stripe payment error", error);
    },
  });
};
// hooks/usePayment.js
export const useVerifyPayment = (sessionId, bookingId) => {
  return useQuery({
    queryKey: ["payment", "verification", sessionId, bookingId],
    queryFn: async () => {
      const response = await paymentApi.verifyPayment(sessionId, bookingId);
      return response.data;
    },
    enabled: !!sessionId && !!bookingId, // Only run when both IDs are available
    retry: 2, // Retry failed requests twice
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useGetBookingConfirmation = (bookingId) => {
  return useQuery({
    queryKey: ["payment", "confirmation", bookingId],
    queryFn: async () => {
      const response = await paymentApi.getBookingConfirmation(bookingId);
      console.log("response", response);
      return response.data;
    },
    enabled: !!bookingId, // Only run when bookingId is available
    retry: 2,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};

// Combined hook for the success page
export const usePaymentConfirmation = (sessionId, bookingId) => {
  const {
    data: verificationData,
    isLoading: verificationLoading,
    error: verificationError,
  } = useVerifyPayment(sessionId, bookingId);

  const {
    data: confirmationData,
    isLoading: confirmationLoading,
    error: confirmationError,
  } = useGetBookingConfirmation(bookingId);

  return {
    data: verificationData || confirmationData,
    isLoading: verificationLoading || confirmationLoading,
    error: verificationError || confirmationError,
    isVerified: !!verificationData?.success,
    isConfirmed: !!confirmationData?.success,
  };
};
