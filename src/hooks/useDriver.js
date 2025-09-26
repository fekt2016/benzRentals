import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import driverApi from "../services/driverApi";

export const useMyDrivers = () => {
  return useQuery({
    queryKey: ["myDrivers"],
    queryFn: async () => {
      const response = await driverApi.getUserDrivers();
      return response;
    },
    onSuccess: (data) => {
      console.log("Fetched user drivers:", data);
    },
  });
};

export const useVerifyDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ driverId, verificationData }) => {
      const response = await driverApi.verifyDriver(driverId, {
        license: {
          number: verificationData.license.number,
          issuedBy: verificationData.license.issuedBy,
          expiryDate: verificationData.license.expiryDate,
          verified: verificationData.license.verified,
        },
        insurance: {
          provider: verificationData.insurance.provider,
          policyNumber: verificationData.insurance.policyNumber,
          expiryDate: verificationData.insurance.expiryDate,
          verified: verificationData.insurance.verified,
        },
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch bookings to update the UI
      queryClient.invalidateQueries(["bookings"]);
      queryClient.invalidateQueries(["drivers"]);

      // You can also update the cache directly for immediate UI update
      queryClient.setQueryData(["drivers", variables.driverId], data);
    },
    onError: (error) => {
      console.error("Driver verification failed:", error);
      // You can add toast notification here
    },
  });
};
