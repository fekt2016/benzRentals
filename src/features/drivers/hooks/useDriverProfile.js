import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDriverProfile,
  updateDriverStatus,
  updateDriverDocuments,
  registerDriver,
} from "../services/driverService";
import { toast } from "react-hot-toast";

/**
 * Hook for driver profile management
 */
export const useDriverProfile = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["driverProfile"],
    queryFn: async () => {
      const response = await getDriverProfile();
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status) => {
      const response = await updateDriverStatus(status);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["driverProfile"], data);
      toast.success(`Status updated to ${data.driver.status}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  const updateDocumentsMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await updateDriverDocuments(formData);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["driverProfile"], data);
      toast.success("Documents updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update documents");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const response = await registerDriver(data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["driverProfile"], data);
      toast.success("Driver registration successful");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to register as driver");
    },
  });

  return {
    driver: data?.driver || null,
    isLoading,
    error,
    refetch,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    updateDocuments: updateDocumentsMutation.mutate,
    isUpdatingDocuments: updateDocumentsMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  };
};

