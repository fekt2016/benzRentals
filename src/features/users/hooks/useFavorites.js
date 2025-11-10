import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userApi from "../userService";
import { toast } from "react-hot-toast";

export const useFavorites = () => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: userApi.getFavorites,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (carId) => userApi.toggleFavorite(carId),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["favorites"]);
      toast.success(
        data.isFavorite
          ? "Added to favorites"
          : "Removed from favorites"
      );
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update favorites"
      );
    },
  });
};

