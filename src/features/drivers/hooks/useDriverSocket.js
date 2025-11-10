import { useEffect, useState, useRef } from "react";
import { useSocket } from "../../../app/providers/SocketProvider";
import { toast } from "react-hot-toast";

/**
 * Hook for driver socket functionality
 * Handles real-time driver requests and notifications
 */
export const useDriverSocket = (driverId) => {
  const { socket, isConnected } = useSocket();
  const [requests, setRequests] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const requestsRef = useRef([]);

  // Keep ref in sync
  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Register driver when socket connects
    const registerDriver = () => {
      if (driverId) {
        socket.emit("driver:register", { driverId });
        console.log("[useDriverSocket] Registering driver:", driverId);
      }
    };

    // Handle registration confirmation
    const handleRegistered = (data) => {
      console.log("[useDriverSocket] Driver registered:", data);
      setIsRegistered(true);
    };

    // Handle registration error
    const handleRegisterError = (error) => {
      console.error("[useDriverSocket] Registration error:", error);
      toast.error(error.message || "Failed to register as driver");
    };

    // Handle new driver request
    const handleDriverRequest = (data) => {
      console.log("[useDriverSocket] New driver request:", data);
      
      // Avoid duplicates
      if (requestsRef.current.some((r) => r.bookingId === data.bookingId)) {
        return;
      }

      const newRequest = {
        ...data,
        receivedAt: new Date(),
      };

      setRequests((prev) => [...prev, newRequest]);
      
      // Show notification
      toast.info(`New ride request: ${data.car?.model || "Car rental"}`, {
        duration: 5000,
        icon: "🚗",
      });
    };

    // Handle request closed (accepted by another driver or expired)
    const handleDriverClosed = (data) => {
      console.log("[useDriverSocket] Request closed:", data);
      setRequests((prev) =>
        prev.filter((r) => r.bookingId !== data.bookingId)
      );
      
      if (data.reason === "accepted_by_another") {
        toast.info("This request was accepted by another driver");
      }
    };

    // Handle accepted confirmation
    const handleAccepted = (data) => {
      console.log("[useDriverSocket] Request accepted:", data);
      setRequests((prev) =>
        prev.filter((r) => r.bookingId !== data.bookingId)
      );
      toast.success("Booking request accepted successfully!");
    };

    // Handle accept error
    const handleAcceptError = (error) => {
      console.error("[useDriverSocket] Accept error:", error);
      toast.error(error.message || "Failed to accept request");
    };

    // Register event listeners
    socket.on("driver:registered", handleRegistered);
    socket.on("driver:register_error", handleRegisterError);
    socket.on("driver:request", handleDriverRequest);
    socket.on("driver:closed", handleDriverClosed);
    socket.on("driver:accepted", handleAccepted);
    socket.on("driver:accept_error", handleAcceptError);

    // Register driver
    registerDriver();

    // Cleanup
    return () => {
      socket.off("driver:registered", handleRegistered);
      socket.off("driver:register_error", handleRegisterError);
      socket.off("driver:request", handleDriverRequest);
      socket.off("driver:closed", handleDriverClosed);
      socket.off("driver:accepted", handleAccepted);
      socket.off("driver:accept_error", handleAcceptError);
    };
  }, [socket, isConnected, driverId]);

  // Accept a booking request via socket
  const acceptRequest = (bookingId) => {
    if (!socket || !isConnected) {
      toast.error("Not connected to server");
      return;
    }

    socket.emit("driver:accept", {
      bookingId,
      driverId,
    });
  };

  // Remove expired requests (older than 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setRequests((prev) =>
        prev.filter((request) => {
          if (!request.receivedAt) return false;
          const age = now - new Date(request.receivedAt);
          return age < 5 * 60 * 1000; // 5 minutes
        })
      );
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    requests,
    acceptRequest,
    isRegistered,
    isConnected,
  };
};

