import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationApi from "../services/notificationApi";
import { useCurrentUser } from "../hooks/useAuth";

// Get notifications
export const useGetUserNotification = (options = {}) => {
  const { data: userData } = useCurrentUser();

  return useQuery({
    queryKey: ["notifications", options], // Include options in query key for caching
    queryFn: async () => {
      const response = await notificationApi.getNotifications(options);
      return response;
    },
    enabled: !!userData?.user?._id,
    refetchInterval: 30000,
  });
};

// Get unread count
export const useUnreadCountData = () => {
  const { data: userData } = useCurrentUser();

  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const response = await notificationApi.getUnreadCount();
      return response;
    },
    enabled: !!userData?.user?._id,
    // select: (data) => data.count || 0,
    refetchInterval: 30000,
  });
};

// Mark as read mutation
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      const response = await notificationApi.markAsRead(notificationId);
      return response;
    },
    onSuccess: () => {
      // Invalidate both queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
};

// Mark all as read mutation
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await notificationApi.markAllAsRead();
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
};

// Delete notification mutation
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId) => {
      await notificationApi.deleteNotification(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unread-count"],
      });
    },
  });
};
