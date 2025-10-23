import { useQuery, useMutation } from "@tanstack/react-query";
import carApi from "../services/carApi";

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
      const response = await carApi.getCars();
      return response;
    },
  });
};

export const useGetCarById = (id) => {
  return useQuery({
    queryKey: ["car", id],
    queryFn: async () => {
      const { data } = await carApi.getCarById(id);
      return data;
    },
  });
};

export const useCreateCar = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await carApi.createCar(formData);
      return response;
    },
    onSuccess: (data) => {
      console.log("Car created:", data);
    },
  });
};
export const useUpdateCar = (id) => {
  return useMutation({
    mutationKey: ["updateCar", id],
    mutationFn: async (formData) => {
      const response = await carApi.updateCar(id, formData);
      return response;
    },
    onSuccess: (data) => {
      console.log("Car updated:", data);
    },
  });
};

export const useDeleteCar = (id) => {
  return useMutation({
    mutationKey: ["deleteCar", id],
    mutationFn: async (id) => {
      const response = await carApi.deleteCar(id);
      return response;
    },
    onSuccess: (data) => {
      console.log("Car deleted:", data);
    },
  });
};
