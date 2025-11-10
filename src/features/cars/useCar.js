import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import carApi from "./carService";

function removeCarFromCache(oldData, id) {
  if (!oldData) return oldData;

  // 1) Array directly
  if (Array.isArray(oldData)) {
    return oldData.filter((c) => c?._id !== id);
  }

  // 2) { data: Car[] }
  if (Array.isArray(oldData?.data)) {
    return { ...oldData, data: oldData.data.filter((c) => c?._id !== id) };
  }

  // 3) Axios-style: { data: { data: Car[] } }
  if (Array.isArray(oldData?.data?.data)) {
    return {
      ...oldData,
      data: {
        ...oldData.data,
        data: oldData.data.data.filter((c) => c?._id !== id),
      },
    };
  }

  return oldData;
}

// export const useGetCarById = () => {
//   return useQuery({
//     queryKey: ["car"],
//     queryFn: async () => {
//       const { data } = await carApi.getCarById();
//       return data;
//     },
//   });
// };

export const useGetCars = () => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      try {
        const response = await carApi.getCars();
        return response;
      } catch (error) {
        console.error('[useGetCars] Error fetching cars:', error);
        console.error('[useGetCars] Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useGetCarById = (id) => {
  return useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      if (!id) throw new Error('Car ID is required');
      try {
        const { data } = await carApi.getCarById(id);
        return data;
      } catch (error) {
        console.error('[useGetCarById] Error fetching car:', error);
        console.error('[useGetCarById] Error details:', {
          carId: id,
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        throw error;
      }
    },
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: async (formData) => {
      try {
        const response = await carApi.createCar(formData);
        return response;
      } catch (error) {
        console.error('[useCreateCar] Error creating car:', error);
        console.error('[useCreateCar] Error details:', {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Car created:", data);
      // 🔥 Refresh cars list immediately
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
    onError: (error) => {
      console.error('[useCreateCar] Mutation failed:', error);
    },
  });
};
export const useUpdateCar = (id) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["updateCar", id],
    mutationFn: async (formData) => {
      if (!id) throw new Error('Car ID is required for update');
      try {
        const response = await carApi.updateCar(id, formData);
        return response;
      } catch (error) {
        console.error('[useUpdateCar] Error updating car:', error);
        console.error('[useUpdateCar] Error details:', {
          carId: id,
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Car updated:", data);
      // 🔥 Update specific car cache immediately
      if (data?.data) {
        queryClient.setQueryData(["car", id], data.data);
      }
      // 🔥 Refresh cars list
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      // 🔥 Refresh specific car query
      queryClient.invalidateQueries({ queryKey: ["car", id] });
    },
    onError: (error) => {
      console.error('[useUpdateCar] Mutation failed:', error);
    },
  });
};

export const useDeleteCar = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cars", id],
    mutationFn: async (carId) => {
      const targetId = carId || id;
      if (!targetId) throw new Error('Car ID is required for deletion');
      try {
        const response = await carApi.deleteCar(targetId);
        return response;
      } catch (error) {
        console.error('[useDeleteCar] Error deleting car:', error);
        console.error('[useDeleteCar] Error details:', {
          carId: targetId,
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        throw error;
      }
    },
    onMutate: async (carId) => {
      const targetId = carId || id;
      await queryClient.cancelQueries({ queryKey: ["cars"] });
      const previous = queryClient.getQueryData(["cars"]);

      queryClient.setQueryData(["cars"], (old) => removeCarFromCache(old, targetId));

      return { previous };
    },
    onSuccess: (data) => {
      console.log("Car deleted:", data);
    },
    onError: (_err, carId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["cars"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cars"] });
    },
  });
};
// export const useDeleteCar = () => {
  

//   return useMutation({
//     // Return the id so we can use it in onSuccess/onError
    

//     // Optimistic update
//     onMutate: async (id) => {
//       await queryClient.cancelQueries({ queryKey: ["cars"] });
//       const previous = queryClient.getQueryData(["cars"]);

//       queryClient.setQueryData(["cars"], (old) => removeCarFromCache(old, id));

//       return { previous };
//     },

//     // Rollback on error
//     onError: (_err, _id, context) => {
//       if (context?.previous) {
//         queryClient.setQueryData(["cars"], context.previous);
//       }
//     },

//     // Always refetch to be sure cache is fresh
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["cars"] });
//     },
//   });
// };