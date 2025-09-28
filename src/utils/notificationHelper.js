// utils/notificationHelpers.js
import { notificationApi } from "../services/notificationApi";

// Notification types
export const NOTIFICATION_TYPES = {
  BOOKING_CREATED: "booking_created",
  BOOKING_CONFIRMED: "booking_confirmed",
  BOOKING_CANCELLED: "booking_cancelled",
  PAYMENT_SUCCESS: "payment_success",
  PAYMENT_FAILED: "payment_failed",
  CAR_AVAILABLE: "car_available",
  SYSTEM_ALERT: "system_alert",
};

// Create notification for user
export const createUserNotification = async (userId, notificationData) => {
  try {
    const notification = {
      userId,
      userType: "user",
      ...notificationData,
    };

    await notificationApi.createNotification(notification);
    return true;
  } catch (error) {
    console.error("Error creating user notification:", error);
    return false;
  }
};

// Create notification for admin
export const createAdminNotification = async (notificationData) => {
  try {
    // In a real app, you might have multiple admins
    // For now, we'll create for a generic admin user or all admins
    const notification = {
      userId: "admin", // or get from admin users list
      userType: "admin",
      ...notificationData,
    };

    await notificationApi.createNotification(notification);
    return true;
  } catch (error) {
    console.error("Error creating admin notification:", error);
    return false;
  }
};

// Specific notification creators
export const notifyBookingCreated = async (bookingData) => {
  const { userId, userName, carName, bookingId, carId } = bookingData;

  // User notification
  await createUserNotification(userId, {
    type: NOTIFICATION_TYPES.BOOKING_CREATED,
    title: "Booking Request Submitted 🚗",
    message: `Your booking request for ${carName} has been received. Please complete payment to confirm.`,
    actionUrl: `/bookings/${bookingId}/payment`,
    priority: "high",
    metadata: {
      bookingId,
      carId,
      carName,
      status: "pending_payment",
    },
  });

  // Admin notification
  await createAdminNotification({
    type: NOTIFICATION_TYPES.BOOKING_CREATED,
    title: "New Booking Request 📋",
    message: `${userName} has requested to book ${carName}. Waiting for payment.`,
    actionUrl: `/admin/bookings/${bookingId}`,
    priority: "medium",
    metadata: {
      bookingId,
      carId,
      carName,
      userName,
      userId,
      status: "pending_payment",
    },
  });
};

export const notifyPaymentSuccess = async (paymentData) => {
  const { userId, userName, carName, bookingId, amount } = paymentData;

  // User notification
  await createUserNotification(userId, {
    type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
    title: "Payment Successful! ✅",
    message: `Your payment of $${amount} for ${carName} has been processed successfully.`,
    actionUrl: `/bookings/${bookingId}`,
    priority: "high",
    metadata: {
      bookingId,
      carName,
      amount,
      status: "confirmed",
    },
  });

  // Admin notification
  await createAdminNotification({
    type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
    title: "Payment Received 💳",
    message: `${userName} has completed payment for ${carName} booking.`,
    actionUrl: `/admin/bookings/${bookingId}`,
    priority: "medium",
    metadata: {
      bookingId,
      carName,
      userName,
      amount,
      status: "confirmed",
    },
  });
};
