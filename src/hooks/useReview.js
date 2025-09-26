import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import reviewApi from "../services/reviewApi";
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      console.log("data", data);
      const response = await reviewApi.createReview(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
export const useGetCarReview = (carId) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await reviewApi.getCarReview(carId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
