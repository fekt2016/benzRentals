import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import driverApi from "../driverService";
import { toast } from "react-hot-toast";

/**
 * Hook to fetch all professional drivers (chauffeurs)
 * @param {Object} params - Query parameters (status, available, etc.)
 * @param {Object} options - React Query options (enabled, staleTime, etc.)
 */
export const useGetProfessionalDrivers = (params = {}, options = {}) => {
  // Determine refetch interval: use options if provided, otherwise default based on admin route
  const refetchInterval = options.refetchInterval !== undefined 
    ? options.refetchInterval 
    : (params.useAdminRoute ? 1000 * 15 : false); // Poll every 15 seconds for admin, no polling for public
  
  return useQuery({
    queryKey: ["professionalDrivers", params],
    queryFn: async () => {
      const response = await driverApi.getAllProfessionalDrivers(params);
      return response;
    },
    staleTime: 1000 * 30, // 30 seconds - shorter for admin to see real-time updates
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval, // Poll every 15 seconds for admin, no polling for public
    ...options, // Allow passing additional query options like enabled (will override refetchInterval if provided)
  });
};

/**
 * Hook to fetch a single professional driver by ID
 */
export const useGetProfessionalDriver = (id) => {
  return useQuery({
    queryKey: ["professionalDriver", id],
    queryFn: async () => {
      const response = await driverApi.getProfessionalDriverById(id);
      return response;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook to create a new professional driver
 */
export const useCreateProfessionalDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await driverApi.createProfessionalDriver(data);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["professionalDrivers"] });
      toast.success("Professional driver created successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create professional driver"
      );
    },
  });
};

/**
 * Hook to update a professional driver
 */
export const useUpdateProfessionalDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await driverApi.updateProfessionalDriver(id, data);
      return response;
    },
    onSuccess: (response, variables) => {
      console.log("Update success:", response);
      
      // Response structure: { status: "success", data: { driver: updatedDriver } } or { data: updatedDriver }
      const updatedDriver = response?.data?.driver || response?.data || response;
      const driverId = variables.id;
      
      if (!driverId) {
        console.warn("Missing driverId in update");
        queryClient.invalidateQueries({ queryKey: ["professionalDrivers"] });
        return;
      }
      
      // Update cache immediately for instant UI update
      queryClient.setQueryData(["professionalDriver", driverId], (oldData) => {
        if (!oldData) {
          // If no cache exists, create a basic structure
          return {
            data: {
              data: updatedDriver,
            },
          };
        }
        
        // Handle different response structures
        if (oldData.data?.data) {
          // Nested structure: { data: { data: driver } }
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: {
                ...oldData.data.data,
                ...updatedDriver,
                // Ensure status is updated
                status: updatedDriver.status || oldData.data.data.status,
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
              status: updatedDriver.status || oldData.data.status,
            },
          };
        } else {
          // Direct driver object
          return {
            ...oldData,
            ...updatedDriver,
            status: updatedDriver.status || oldData.status,
          };
        }
      });
      
      // Invalidate queries to ensure consistency and trigger refetch
      queryClient.invalidateQueries({ queryKey: ["professionalDrivers"] });
      queryClient.invalidateQueries({ queryKey: ["professionalDriver", driverId] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      
      toast.success("Professional driver updated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update professional driver"
      );
    },
  });
};

/**
 * Hook to delete/deactivate a professional driver
 */
export const useDeleteProfessionalDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await driverApi.deleteProfessionalDriver(id);
      return response;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["professionalDrivers"] });
      queryClient.invalidateQueries({ queryKey: ["professionalDriver", variables] });
      toast.success("Professional driver deactivated successfully");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to delete professional driver"
      );
    },
  });
};

