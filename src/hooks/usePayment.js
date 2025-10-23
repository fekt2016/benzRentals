import { useQuery, useMutation } from "@tanstack/react-query";
import paymentApi from "../services/paymentApi";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const useStripePayment = () => {
  //   const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData) => {
      const response = await paymentApi.stripePayment(bookingData);

      return response;
    },
    onSuccess: async (response) => {
      console.log("response",response.data.sessionId)
console.log(response)
      const sessionId = response?.data?.sessionId
      console.log(sessionId)
       if (!sessionId) {
    throw new Error('No session ID received from the server');
  }
      const stripe = await stripePromise;

      const result = await stripe.redirectToCheckout({
        sessionId: response?.data?.sessionId,
      });
console.log(result)
      
      if (result.error) {
        throw new Error(result.error);
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
      return response.data;
    },
    onSuccess:(data)=>{
console.log("booking confirmed",data)
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
