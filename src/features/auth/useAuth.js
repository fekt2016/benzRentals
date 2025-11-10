import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import authApi from "./authService";
import {useNavigate} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const useCurrentUser = (options= {}) => {
   const { enabled = true, queryKey = ["auth", "me"] } = options;
   
   // Check if token exists - if not, disable the query
   const token = Cookies.get("token");
   const shouldEnable = enabled && !!token;
   
  return useQuery({
    queryKey,
    enabled: shouldEnable,
    queryFn: async () => {
      try {
        // The cookie is sent automatically
        const data = await authApi.getCurrentUser();
        console.log('[useCurrentUser] Received data:', {
          hasData: !!data,
          hasUser: !!data?.user,
          executive: data?.user?.executive,
          role: data?.user?.role,
        });
        return data;
      } catch (err) {
        if (err.response?.status === 401) {
          console.log("Session expired, please login");
          // Clear token cookie if we get 401
          Cookies.remove("token");
          // Don't retry on 401 - user is not authenticated
          throw err;
        }
        throw err;
      }
    },
    staleTime: 0, // Always consider data stale to force refetch (was 5 minutes)
    refetchOnWindowFocus: shouldEnable, // Only refetch on window focus if query is enabled
    // Add cacheTime to control how long unused data stays in cache
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.login(payload);
      return response;
    },
    onSuccess: (data) => {
      console.log("OTP sent successfully:", data);
    },
    onError: (error) => {
      console.error("Error sending OTP:", error);
    },
  });
};

export const useVerifyOtp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.verifyOtp(payload);

      return response;
    },
 onSuccess: (data) => {
  const token = data.data.token;
  const isProduction = process.env.NODE_ENV === "production";
  Cookies.set("token", token, { 
    expires: 7, 
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax" 
  });

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);

    // Sync authentication to mobile app via deep link (optional, non-blocking)
    // This allows mobile app to automatically log in when user logs in on web
    setTimeout(() => {
      try {
        const mobileSyncUrl = `benzflex://auth/sync?token=${encodeURIComponent(token)}`;
        console.log('[useAuth] 🌐 Syncing auth to mobile app (optional)...');
        
        // Try multiple methods to trigger mobile app deep link
        // This will only work if user has mobile app installed and open
        // Method 1: Create and click anchor tag (most reliable)
        try {
          const link = document.createElement('a');
          link.href = mobileSyncUrl;
          link.style.display = 'none';
          link.setAttribute('target', '_self');
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            try {
              document.body.removeChild(link);
            } catch (e) {}
          }, 100);
        } catch (e) {
          // Silently fail - sync is optional
          console.log('[useAuth] Mobile sync unavailable (this is OK)');
        }
        
        // Method 2: window.location (fallback)
        setTimeout(() => {
          try {
            window.location.href = mobileSyncUrl;
          } catch (e) {
            // Silently fail - sync is optional
          }
        }, 100);
      } catch (syncError) {
        // Silently fail - sync is optional and shouldn't block login
        console.log('[useAuth] Mobile sync error (non-critical, ignoring)');
      }
    }, 500); // Small delay to not interfere with navigation

    // Wrap navigate in setTimeout to ensure React Router context is stable
    setTimeout(() => {
      if (decoded.role === "admin") {
        navigate("/admin");
      } else if (decoded.role === "driver") {
        navigate("/driver/dashboard");
      } else {
        navigate("/");
      }
    }, 0);
  } catch (error) {
    console.error("Error decoding token:", error);
    navigate("/"); // fallback
  }
},
    onError: (err) => {
      console.error("OTP error", err);
    },
  });
};
export const useResendOtp = () => {
  return useMutation({
    mutationFn: async (phone) => {
      const response = await authApi.resendOtp(phone);
      return response;
    },
    onSuccess: (data) => {
      console.log("otp resend successfully!!", data);
    },
  });
};
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      // Clear all cookies first
      Cookies.remove("token");
      
      // Clear all React Query cache to prevent stale data
      queryClient.clear();
      
      // Remove all queries from cache
      queryClient.removeQueries();
      
      // Cancel all in-flight queries
      queryClient.cancelQueries();
      
      // Reset all queries to their initial state
      queryClient.resetQueries();
      
      // Use replace instead of href to prevent adding to history
      // Small delay to ensure cache is cleared before redirect
      setTimeout(() => {
        window.location.replace("/");
      }, 100);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.register(payload);
      return response;
    },
  });
};
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.updateProfile(payload);
      return response;
    },
    onSuccess: (data) => {
      console.log("Profile updated successfully:", data);
      // 🔥 Refresh current user data immediately
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.forgotPassword(payload);
      return response;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.resetPassword(payload);
      return response;
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.changePassword(payload);
      return response;
    },
    onSuccess: (data) => {
      console.log("Password changed successfully:", data);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.uploadAvatar(payload);
      return response;
    },
    onSuccess: (data) => {
      console.log("Avatar uploaded successfully:", data);
      // 🔥 Refresh current user data to show new avatar
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};
