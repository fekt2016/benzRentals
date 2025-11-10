import { useQuery } from "@tanstack/react-query";
import professionalDriverApi from "./professionalDriverService";

/**
 * Get all professional drivers
 */
export const useProfessionalDrivers = (params = {}) => {
  return useQuery({
    queryKey: ["professionalDrivers", params],
    queryFn: async () => {
      const response = await professionalDriverApi.getAllProfessionalDrivers(params);
      return response;
    },
  });
};

/**
 * Get available professional drivers for a specific date/time range
 */
export const useAvailableProfessionalDrivers = (params, enabled = true) => {
  return useQuery({
    queryKey: ["availableProfessionalDrivers", params],
    queryFn: async () => {
      if (!params?.pickupDate || !params?.returnDate) {
        return { status: "success", results: 0, data: [] };
      }
      const response = await professionalDriverApi.getAvailableDrivers(params);
      return response;
    },
    enabled: enabled && !!params?.pickupDate && !!params?.returnDate,
  });
};

/**
 * Get professional driver by ID
 */
export const useProfessionalDriverById = (id, enabled = true) => {
  return useQuery({
    queryKey: ["professionalDriver", id],
    queryFn: async () => {
      const response = await professionalDriverApi.getProfessionalDriverById(id);
      return response;
    },
    enabled: enabled && !!id,
  });
};

