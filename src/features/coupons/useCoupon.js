import { useMutation } from "@tanstack/react-query";
import couponApi from "./couponService";
import { toast } from "react-hot-toast";

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: ({ code, bookingTotal }) =>
      couponApi.validateCoupon(code, bookingTotal),
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Invalid coupon code";
      toast.error(message);
    },
  });
};

