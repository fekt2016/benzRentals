import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import driverApi from "./driverService";

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
      // Response structure: { status: "success", data: updatedDriver }
      // Return the full response so we can access both status and data
      return response;
    },
    onSuccess: (response, variables) => {
      console.log("Verification success:", response);
      
      // Response structure from API: { status: "success", data: updatedDriver }
      // driverApi.verifyDriver returns response.data, so response = { status: "success", data: updatedDriver }
      const updatedDriver = response?.data || response;
      
      if (!updatedDriver || !driverId) {
        console.warn("Missing driverId or updatedDriver data");
        // Still invalidate to trigger refetch
        queryClient.invalidateQueries({ queryKey: ["professionalDriver", driverId] });
        return;
      }
      
      // Update cache immediately for instant UI update
      // Update professional driver cache - handle different response structures
      queryClient.setQueryData(["professionalDriver", driverId], (oldData) => {
        if (!oldData) {
          // If no cache exists, create a basic structure
          return {
            data: {
              data: updatedDriver,
            },
          };
        }
        
        // Handle different response structures from useGetProfessionalDriver
        // Structure can be: { data: { data: driver } } or { data: driver }
        if (oldData.data?.data) {
          // Nested structure: { data: { data: driver } }
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: {
                ...oldData.data.data,
                ...updatedDriver,
                // Ensure license verification status is updated
                license: {
                  ...oldData.data.data.license,
                  ...updatedDriver.license,
                  verified: updatedDriver.license?.verified ?? updatedDriver.verified ?? false,
                },
                verified: updatedDriver.verified ?? updatedDriver.license?.verified ?? false,
              },
            },
          };
        } else if (oldData.data) {
          // Flat structure: { data: driver }
          return {
            ...oldData,
            data: {
              ...oldData.data,
              ...updatedDriver,
              license: {
                ...oldData.data.license,
                ...updatedDriver.license,
                verified: updatedDriver.license?.verified ?? updatedDriver.verified ?? false,
              },
              verified: updatedDriver.verified ?? updatedDriver.license?.verified ?? false,
            },
          };
        } else {
          // Direct driver object
          return {
            ...oldData,
            ...updatedDriver,
            license: {
              ...oldData.license,
              ...updatedDriver.license,
              verified: updatedDriver.license?.verified ?? updatedDriver.verified ?? false,
            },
            verified: updatedDriver.verified ?? updatedDriver.license?.verified ?? false,
          };
        }
      });
      
      // Update driver profile cache for instant UI update on driver dashboard
      queryClient.setQueryData(["driverProfile"], (oldData) => {
        if (!oldData) return oldData;
        
        // Structure: { status: "success", data: { driver: {...} } }
        // Or: { data: { driver: {...} } }
        const driverData = oldData.data?.driver || oldData.driver;
        if (driverData) {
          const currentDriverId = driverData._id?.toString();
          const updatedDriverId = updatedDriver._id?.toString() || driverId?.toString();
          
          // Update if it's the same driver (match by _id or check if user matches)
          if (currentDriverId === updatedDriverId || 
              driverData.user?.toString() === updatedDriverId ||
              driverData.user?._id?.toString() === updatedDriverId) {
            
            const updatedDriverData = {
              ...driverData,
              ...updatedDriver,
              verified: updatedDriver.verified ?? updatedDriver.license?.verified ?? driverData.verified,
              license: {
                ...driverData.license,
                ...updatedDriver.license,
                verified: updatedDriver.license?.verified ?? updatedDriver.verified ?? driverData.license?.verified,
              },
            };
            
            // Return updated structure based on original structure
            if (oldData.data?.driver) {
              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  driver: updatedDriverData,
                },
              };
            } else if (oldData.driver) {
              return {
                ...oldData,
                driver: updatedDriverData,
              };
            }
          }
        }
        return oldData;
      });
      
      // Update drivers cache if it exists
      queryClient.setQueryData(["drivers", driverId], updatedDriver);
      
      // Invalidate all related queries to ensure consistency and trigger refetch
      // This ensures any other components using this data also update
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["myDrivers"] });
      queryClient.invalidateQueries({ queryKey: ["professionalDrivers"] });
      queryClient.invalidateQueries({ queryKey: ["professionalDriver", driverId] });
      queryClient.invalidateQueries({ queryKey: ["driverProfile"] }); // Invalidate driver profile so driver sees updated verification status
    },
    onError: (error) => {
      console.error("Driver verification failed:", error);
      // You can add toast notification here
    },
  });
};

export const useGetDrivers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["drivers", params],
    queryFn: async () => {
      const response = await driverApi.getAllDrivers(params);
      return response;
    },
    onSuccess: (data) => {
      console.log("driver got successfully", data);
    },
    ...options, // Allow passing additional query options like enabled
  });
};
// export const useVerifyDriver = ()=>{
//   return useMutation({
//     mutationFn: async()=>
//   })
// }