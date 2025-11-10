import { useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "../userService";

/**
 * Hook to update user settings with optimistic updates
 * @returns {Object} Mutation object with mutate function
 */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings) => {
      try {
        const response = await userService.updateSettings(settings);
        return response;
      } catch (error) {
        console.error("[useUpdateSettings] Error updating settings:", error);
        throw error;
      }
    },
    // Optimistic update
    onMutate: async (newSettings) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["userSettings"] });

      // Snapshot previous value
      const previousSettings = queryClient.getQueryData(["userSettings"]);

      // Optimistically update
      queryClient.setQueryData(["userSettings"], (old) => ({
        ...old,
        data: {
          ...old?.data,
          settings: newSettings,
        },
      }));

      return { previousSettings };
    },
    // On error, rollback
    onError: (err, newSettings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(["userSettings"], context.previousSettings);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    },
  });
};

