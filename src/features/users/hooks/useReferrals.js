import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userApi from "../userService";
import { toast } from "react-hot-toast";

export const useReferrals = () => {
  return useQuery({
    queryKey: ["referrals"],
    queryFn: userApi.getReferrals,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useRedeemReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount) => userApi.redeemReferralReward(amount),
    onSuccess: () => {
      queryClient.invalidateQueries(["referrals"]);
      toast.success("Reward redeemed successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to redeem reward"
      );
    },
  });
};

