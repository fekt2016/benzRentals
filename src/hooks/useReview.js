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
export const useGetCarReviews = (carId) => {
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
export const useGetUserReviews = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      console.log("hook reviews");
      const response = await reviewApi.getUserReviews();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await reviewApi.deleteReview(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await reviewApi.updateReview(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
