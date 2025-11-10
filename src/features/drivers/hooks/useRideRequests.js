import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useSocket } from "../../../app/providers/SocketProvider";
import { useDriverProfile } from "./useDriverProfile";
import { acceptBookingRequest } from "../services/driverService";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../config/constants";

/**
 * Hook for managing real-time ride requests
 * 
 * Features:
 * - Automatically connects to socket when driver goes online
 * - Listens for new ride requests in real-time
 * - Handles request cancellation and assignment
 * - Provides accept/reject functionality
 * - Shows connection status
 */
export const useRideRequests = () => {
  const { socket, isConnected } = useSocket();
  const { driver } = useDriverProfile();
  const navigate = useNavigate();
  
  const [requests, setRequests] = useState([]);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const requestsRef = useRef([]);
  const acceptingRef = useRef(new Set());
  const declinedRef = useRef(new Set()); // Track declined request IDs
  const [declinedRequestIds, setDeclinedRequestIds] = useState([]); // State to trigger re-renders

  // Keep refs in sync
  useEffect(() => {
    requestsRef.current = requests;
  }, [requests]);

  // Check if driver is online (available or busy)
  const isDriverOnline = driver?.status === "available" || driver?.status === "busy" || driver?.status === "active";
  
  // Check if driver license is verified
  const isLicenseVerified = useMemo(() => {
    if (!driver) return false;
    // Check both unified Driver model and legacy DriverProfile structure
    return driver.license?.verified === true || driver.verified === true;
  }, [driver]);

  // Register driver when socket connects, driver is online, AND license is verified
  useEffect(() => {
    if (!socket || !isConnected || !isDriverOnline || !isLicenseVerified) {
      if (socket && isConnected && !isLicenseVerified) {
        console.log("[useRideRequests] Driver license not verified. Cannot receive requests.");
      }
      if (socket && isConnected && !isDriverOnline) {
        console.log("[useRideRequests] Driver is not online. Cannot receive requests.");
      }
      return;
    }

    // Register driver to receive requests
    const registerDriver = () => {
      if (driver?._id) {
        socket.emit("driver:register", { driverId: driver._id });
        console.log("[useRideRequests] Registering driver:", driver._id);
      }
    };

    // Handle registration confirmation
    const handleRegistered = (data) => {
      console.log("[useRideRequests] Driver registered:", data);
    };

    // Handle registration error
    const handleRegisterError = (error) => {
      console.error("[useRideRequests] Registration error:", error);
      toast.error(error.message || "Failed to register as driver");
    };

    // Handle new ride request (backend emits "driver_request")
    const handleRideRequest = (data) => {
      console.log("[useRideRequests] New ride request:", data);
      
      // Avoid duplicates
      const bookingId = data.bookingId || data._id;
      if (!bookingId) {
        console.warn("[useRideRequests] Request missing bookingId:", data);
        return;
      }

      // Check for duplicates using string comparison
      const bookingIdStr = String(bookingId);
      if (requestsRef.current.some((r) => {
        const rId = r.bookingId || r._id;
        return String(rId) === bookingIdStr;
      })) {
        console.log("[useRideRequests] Duplicate request ignored:", bookingId);
        return;
      }

      // Check if already accepting this request
      if (acceptingRef.current.has(bookingIdStr)) {
        console.log("[useRideRequests] Already processing accept for:", bookingId);
        return;
      }

      const newRequest = {
        ...data,
        bookingId: bookingIdStr, // Use string version for consistency
        receivedAt: new Date(),
      };

      // Use functional update to ensure we check against current state
      setRequests((prev) => {
        // Double-check for duplicates in current state
        const exists = prev.some((r) => {
          const rId = r.bookingId || r._id;
          return String(rId) === bookingIdStr;
        });
        if (exists) {
          console.log("[useRideRequests] Duplicate detected in state update, skipping");
          return prev;
        }
        return [...prev, newRequest];
      });
      
      // Show notification
      toast.info(`New ride request: ${data.car?.model || data.car?.name || "Car rental"}`, {
        duration: 5000,
        icon: "🚗",
      });
    };

    // Handle ride cancelled (user cancelled or request expired)
    const handleRideCancelled = (data) => {
      console.log("[useRideRequests] Ride cancelled:", data);
      const bookingId = data.bookingId || data._id;
      if (bookingId) {
        setRequests((prev) => prev.filter((r) => {
          const rId = r.bookingId || r._id;
          return rId !== bookingId;
        }));
        toast.info("Ride request was cancelled");
      }
    };

    // Handle ride assigned to another driver
    const handleRideAssigned = (data) => {
      console.log("[useRideRequests] Ride assigned to another driver:", data);
      const bookingId = data.bookingId || data._id;
      if (bookingId) {
        setRequests((prev) => prev.filter((r) => {
          const rId = r.bookingId || r._id;
          return rId !== bookingId;
        }));
        toast.info("This request was accepted by another driver");
      }
    };

    // Handle request closed (generic handler for driver:closed event)
    const handleRequestClosed = (data) => {
      console.log("[useRideRequests] Request closed:", data);
      const bookingId = data.bookingId || data._id;
      if (bookingId) {
        setRequests((prev) => prev.filter((r) => {
          const rId = r.bookingId || r._id;
          return rId !== bookingId;
        }));
        
        if (data.reason === "accepted_by_another") {
          toast.info("This request was accepted by another driver");
        } else if (data.reason === "cancelled") {
          toast.info("Ride request was cancelled");
        }
      }
    };

    // Register event listeners
    socket.on("driver:registered", handleRegistered);
    socket.on("driver:register_error", handleRegisterError);
    socket.on("driver_request", handleRideRequest); // Backend emits "driver_request"
    socket.on("driver:closed", handleRequestClosed); // Generic handler for closed requests
    socket.on("ride_cancelled", handleRideCancelled); // Alternative event name
    socket.on("ride_assigned", handleRideAssigned); // Alternative event name

    // Register driver
    registerDriver();

    // Cleanup
    return () => {
      socket.off("driver:registered", handleRegistered);
      socket.off("driver:register_error", handleRegisterError);
      socket.off("driver_request", handleRideRequest);
      socket.off("driver:closed", handleRequestClosed);
      socket.off("ride_cancelled", handleRideCancelled);
      socket.off("ride_assigned", handleRideAssigned);
    };
  }, [socket, isConnected, isDriverOnline, isLicenseVerified, driver?._id]);

  // Accept a ride request
  const acceptRequest = useCallback(async (requestId) => {
    // Note: Accept uses HTTP API, not socket, so we don't need to check isConnected
    // Socket is only for receiving real-time updates
    const requestIdStr = String(requestId);
    if (acceptingRef.current.has(requestIdStr)) {
      console.log("[useRideRequests] Already accepting request:", requestId);
      return;
    }

    setIsAccepting(true);
    acceptingRef.current.add(requestIdStr);

    try {
      // Call backend API to accept the request (HTTP request, not socket)
      const response = await acceptBookingRequest(requestId);
      
      // Remove from local state
      setRequests((prev) => prev.filter((r) => {
        const rId = r.bookingId || r._id;
        // Compare as strings to handle ObjectId vs string mismatches
        return String(rId) !== String(requestId);
      }));
      acceptingRef.current.delete(String(requestId));

      toast.success("Ride request accepted successfully!");
      
      // Navigate to trip details page
      // Use booking detail path since that's where trip/booking details are shown
      const tripId = response.data?.booking?._id || response.data?._id || requestId;
      const bookingDetailPath = PATHS.BOOKING_DETAIL.replace(':bookingId', tripId);
      navigate(bookingDetailPath);
    } catch (error) {
      console.error("[useRideRequests] Accept error:", error);
      acceptingRef.current.delete(requestIdStr);
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to accept request";
      toast.error(errorMessage);
      
      // If request was already accepted or expired, remove it
      if (error.response?.status === 400) {
        setRequests((prev) => prev.filter((r) => {
          const rId = r.bookingId || r._id;
          return String(rId) !== requestIdStr;
        }));
      }
    } finally {
      setIsAccepting(false);
    }
  }, [navigate]);

  // Reject a ride request
  const rejectRequest = useCallback(async (requestId) => {
    if (!requestId) {
      console.error("[useRideRequests] Reject called without requestId");
      toast.error("Invalid request ID");
      return;
    }

    const requestIdStr = String(requestId);
    
    // Check if already declined
    if (declinedRef.current.has(requestIdStr)) {
      console.log("[useRideRequests] Request already declined:", requestId);
      return;
    }

    console.log("[useRideRequests] Rejecting request:", requestId);
    setIsRejecting(true);

    try {
      // Mark as declined immediately to prevent duplicate declines
      declinedRef.current.add(requestIdStr);
      setDeclinedRequestIds((prev) => {
        if (!prev.includes(requestIdStr)) {
          return [...prev, requestIdStr];
        }
        return prev;
      }); // Update state to trigger re-render

      // Emit decline event via socket if connected (optional, non-blocking)
      if (socket && isConnected) {
        try {
          socket.emit("driver:decline", { bookingId: requestId });
        } catch (socketError) {
          console.warn("[useRideRequests] Socket emit error (non-critical):", socketError);
          // Continue even if socket emit fails
        }
      }

      // Remove from local state (always remove, even if socket not connected)
      setRequests((prev) => {
        const filtered = prev.filter((r) => {
          const rId = r.bookingId || r._id;
          // Compare as strings to handle ObjectId vs string mismatches
          return String(rId) !== requestIdStr;
        });
        console.log(`[useRideRequests] Removed request ${requestId}, remaining: ${filtered.length}`);
        return filtered;
      });

      toast.success("Request declined");
    } catch (error) {
      console.error("[useRideRequests] Reject error:", error);
      // Still remove from local state even on error
      setRequests((prev) => prev.filter((r) => {
        const rId = r.bookingId || r._id;
        return String(rId) !== requestIdStr;
      }));
      toast.error("Failed to decline request");
    } finally {
      setIsRejecting(false);
    }
  }, [socket, isConnected]);

  // Remove expired requests (older than 5 minutes) and deduplicate
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setRequests((prev) => {
        // First, remove expired requests
        const validRequests = prev.filter((request) => {
          if (!request.receivedAt && !request.requestedAt) return false;
          const requestTime = request.receivedAt || request.requestedAt;
          const age = now - new Date(requestTime);
          return age < 5 * 60 * 1000; // 5 minutes
        });
        
        // Then, deduplicate by bookingId
        const uniqueRequests = [];
        const seenIds = new Set();
        validRequests.forEach((request) => {
          const reqId = String(request.bookingId || request._id);
          if (reqId && !seenIds.has(reqId)) {
            seenIds.add(reqId);
            uniqueRequests.push(request);
          }
        });
        
        return uniqueRequests;
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    requests,
    acceptRequest,
    rejectRequest,
    isAccepting,
    isRejecting,
    isConnected,
    isDriverOnline,
    declinedRequestIds, // Export declined IDs for filtering
  };
};

