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

export const useVerifyDriver = (driverId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (verificationData) => {

      const response = await driverApi.verifyDriver(driverId, verificationData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log(data)
      // Invalidate and refetch bookings to update the UI
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["myDrivers"] });

      // You can also update the cache directly for immediate UI update
      queryClient.setQueryData(["drivers", variables.driverId], data);
    },
    onError: (error) => {
      console.error("Driver verification failed:", error);
      // You can add toast notification here
    },
  });
};

export const useGetDrivers = ()=>{
  return useQuery({
    queryKey: ['drivers'],
    queryFn: async ()=> {
      const response = await driverApi.getAllDrivers()
      return response
    },
    onSuccess: (data)=> {
      console.log("driver got successfully", data)
    }
  })
}
// export const useVerifyDriver = ()=>{
//   return useMutation({
//     mutationFn: async()=>
//   })
// }