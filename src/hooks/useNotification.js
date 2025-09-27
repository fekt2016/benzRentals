// hooks/useNotifications.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";
import { useCurrentUser } from "./useAuth";
import { useEffect } from "react";

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  BOOKING_CREATED: "booking_created",
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",
  CAR_AVAILABLE: "car_available",
  SYSTEM_ALERT: "system_alert",
};

// Main notifications hook
export const useNotifications = (options = {}) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const {
    enabled = true,
    refetchInterval = 30000, // Poll every 30 seconds
    staleTime = 1000 * 60 * 5, // 5 minutes
  } = options;

  // Get notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications", user?.id, user?.role],
    queryFn: () =>
      notificationService.getNotifications(
        user?.id,
        user?.role === "admin" ? "admin" : "user"
      ),
    enabled: enabled && !!user,
    refetchInterval,
    staleTime,
  });

  // Get unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count", user?.id],
    queryFn: () =>
      notificationService.getUnreadCount(
        user?.id,
        user?.role === "admin" ? "admin" : "user"
      ),
    enabled: enabled && !!user,
    refetchInterval,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      // Invalidate both notifications and unread count
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notifications", "unread-count"]);
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      notificationService.markAllAsRead(
        user?.id,
        user?.role === "admin" ? "admin" : "user"
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notifications", "unread-count"]);
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: notificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      queryClient.invalidateQueries(["notifications", "unread-count"]);
    },
  });

  // Clear all mutations
  const clearAllMutation = useMutation({
    mutationFn: () =>
      notificationService.clearAll(
        user?.id,
        user?.role === "admin" ? "admin" : "user"
      ),
    onSuccess: () => {
      queryClient.setQueryData(["notifications", user?.id, user?.role], []);
      queryClient.setQueryData(["notifications", "unread-count", user?.id], 0);
    },
  });

  // Real-time updates with WebSocket
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = notificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        // Update the notifications list optimistically
        queryClient.setQueryData(
          ["notifications", user?.id, user?.role],
          (oldNotifications = []) => [newNotification, ...oldNotifications]
        );

        // Update unread count
        queryClient.setQueryData(
          ["notifications", "unread-count", user?.id],
          (oldCount = 0) => oldCount + 1
        );
      }
    );

    return unsubscribe;
  }, [user, queryClient]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,

    // Mutations
    markAsRead: markAsReadMutation.mutate,
    markAsReadAsync: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutate,
    markAllAsReadAsync: markAllAsReadMutation.mutateAsync,
    deleteNotification: deleteNotificationMutation.mutate,
    deleteNotificationAsync: deleteNotificationMutation.mutateAsync,
    clearAll: clearAllMutation.mutate,
    clearAllAsync: clearAllMutation.mutateAsync,

    // Mutation states
    isMarkingAsRead: markAsReadMutation.isLoading,
    isMarkingAllAsRead: markAllAsReadMutation.isLoading,
    isDeleting: deleteNotificationMutation.isLoading,
    isClearingAll: clearAllMutation.isLoading,
  };
};

// Hook for user-facing notifications
export const useUserNotifications = () => {
  const queryClient = useQueryClient();

  // Send booking confirmation to user
  const sendBookingConfirmation = useMutation({
    mutationFn: (bookingData) =>
      notificationService.createNotification({
        userId: bookingData.userId,
        type: NOTIFICATION_TYPES.BOOKING_CONFIRMED,
        title: "Booking Confirmed! 🎉",
        message: `Your booking for ${bookingData.carModel} from ${bookingData.startDate} to ${bookingData.endDate} has been confirmed.`,
        actionUrl: `/bookings/${bookingData.bookingId}`,
        metadata: {
          bookingId: bookingData.bookingId,
          carModel: bookingData.carModel,
          totalAmount: bookingData.totalAmount,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  // Send payment receipt
  const sendPaymentReceipt = useMutation({
    mutationFn: (paymentData) =>
      notificationService.createNotification({
        userId: paymentData.userId,
        type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
        title: "Payment Successful 💳",
        message: `Payment of $${paymentData.amount} for your ${paymentData.carModel} rental has been processed successfully.`,
        actionUrl: `/bookings/${paymentData.bookingId}`,
        metadata: paymentData,
      }),
  });

  // Send reminder notification
  const sendReminder = useMutation({
    mutationFn: (reminderData) =>
      notificationService.createNotification({
        userId: reminderData.userId,
        type: NOTIFICATION_TYPES.INFO,
        title: "Upcoming Rental Reminder ⏰",
        message: `Don't forget your ${reminderData.carModel} rental is scheduled for ${reminderData.pickupDate}.`,
        actionUrl: `/bookings/${reminderData.bookingId}`,
        metadata: reminderData,
      }),
  });

  return {
    sendBookingConfirmation,
    sendPaymentReceipt,
    sendReminder,
  };
};

// Hook for admin notifications
export const useAdminNotifications = () => {
  const queryClient = useQueryClient();

  // Notify admin about new booking
  const notifyNewBooking = useMutation({
    mutationFn: (bookingData) =>
      notificationService.createNotification({
        userId: "admin", // or specific admin IDs
        type: NOTIFICATION_TYPES.BOOKING_CREATED,
        title: "New Booking Request 📋",
        message: `New booking request for ${bookingData.carModel} from ${bookingData.userName}.`,
        actionUrl: `/admin/bookings/${bookingData.bookingId}`,
        priority: "high",
        metadata: bookingData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", "admin"]);
    },
  });

  // Notify admin about cancellation
  const notifyCancellation = useMutation({
    mutationFn: (cancellationData) =>
      notificationService.createNotification({
        userId: "admin",
        type: NOTIFICATION_TYPES.BOOKING_CANCELLED,
        title: "Booking Cancelled ❌",
        message: `${cancellationData.userName} cancelled booking for ${cancellationData.carModel}.`,
        actionUrl: `/admin/bookings/${cancellationData.bookingId}`,
        priority: "medium",
        metadata: cancellationData,
      }),
  });

  // System alerts for admin
  const sendSystemAlert = useMutation({
    mutationFn: (alertData) =>
      notificationService.createNotification({
        userId: "admin",
        type: NOTIFICATION_TYPES.SYSTEM_ALERT,
        title: "System Alert ⚠️",
        message: alertData.message,
        actionUrl: "/admin/system",
        priority: "high",
        metadata: alertData,
      }),
  });

  return {
    notifyNewBooking,
    notifyCancellation,
    sendSystemAlert,
  };
};

// Hook for toast notifications (UI feedback)
export const useToastNotifications = () => {
  const showSuccess = (message, title = "Success!") => {
    // Implementation using your toast library (react-toastify, etc.)
    console.log("Success:", title, message);
  };

  const showError = (message, title = "Error!") => {
    console.error("Error:", title, message);
  };

  const showInfo = (message, title = "Info") => {
    console.log("Info:", title, message);
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
};
