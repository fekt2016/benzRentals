import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authApi from "../service/authApi";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading: isUserLoading,
    error: authError,
    refetch: refetchAuth,
  } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      // Get token from cookies instead of localStorage
      const token = Cookies.get("token");

      if (!token) return null;

      try {
        const response = await authApi.getCurrentUser();
        return response;
      } catch (error) {
        if (error.response?.status === 401) {
          // Remove token from cookies on 401 error
          Cookies.remove("token");
        }
        console.error("Error fetching user data:", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) =>
      error.response?.status !== 401 && failureCount < 2,
    refetchOnWindowFocus: true,
  });

  // Profile data management
  // const {
  //   data: profileData,
  //   isLoading: isProfileLoading,
  //   error: profileError,
  // } = useQuery({
  //   queryKey: ["profile"],
  //   queryFn: async () => {
  //     try {
  //       const response = await authApi.getProfile();
  //       return response?.data?.data;
  //     } catch (error) {
  //       console.error("Error fetching profile:", error);
  //       throw error; // Propagate error to React Query
  //     }
  //   },
  //   enabled: !!userData?.id,
  //   staleTime: 1000 * 60 * 5,
  // });

  // Common auth success handler
  const handleAuthSuccess = (data) => {
    const user = data.data?.data || null;
    const token = data.data?.token || null;

    if (token) {
      // Set token in cookies instead of localStorage
      Cookies.set("token", token, {
        expires: 7, // Token expires in 7 days
        // eslint-disable-next-line no-undef
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      queryClient.setQueryData(["auth"], user);
    }

    return user;
  };

  // Auth operations
  const sendOtp = useMutation({
    mutationFn: (loginId) => authApi.sendOtp(loginId),
    onSuccess: handleAuthSuccess,
  });

  const verifyOtp = useMutation({
    mutationFn: ({ loginId, otp, password }) =>
      authApi.verifyOtp(loginId, otp, password),
    onSuccess: handleAuthSuccess,
  });

  const register = useMutation({
    mutationFn: async (registerData) => {
      const response = await authApi.register(registerData);
      return response;
    },
    onSuccess: handleAuthSuccess,
    onError: (error) => {
      console.log(error);
    },
  });
  const emailVerification = useMutation({
    mutationFn: async (email) => {
      const response = await authApi.emailVerification(email);
      return response;
    },
    onSuccess: (data) => {
      console.log("Email verification sent:", data);
      // Optionally, you can handle UI updates or state changes here
    },
    onError: (error) => {
      console.log("Error sending email verification:", error);
      // Optionally, you can handle UI updates or state changes here
    },
  });
  const resendVerification = useMutation({
    mutationFn: async ({ email }) =>
      await authApi.resendVerification({ email }),
    onSuccess: (data) => {
      console.log("Email verification sent:", data);
      // Optionally, you can handle UI updates or state changes here
    },
    onError: (error) => {
      console.error("Error sending email verification:", error);
      // Optionally, you can handle UI updates or state changes here
    },
  });
  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear auth state
      queryClient.removeQueries(["auth"]);
      queryClient.removeQueries(["profile"]);

      // Remove token from cookies
      Cookies.remove("token");

      // Reset cart state
      queryClient.setQueryData(["cart", true], { products: [] });
      queryClient.setQueryData(["cart", false], { products: [] });
      Cookies.remove("cart");

      navigate("/");
    },
  });

  // Profile operations
  const updateProfile = useMutation({
    mutationFn: (profileData) => authApi.updateProfile(profileData),
    onSuccess: (data) => {
      console.log("Profile updated:", data);
    },
  });

  const changePassword = useMutation({
    mutationFn: async (passwords) => {
      try {
        const response = await authApi.changePassword(passwords);
        return response;
      } catch (error) {
        console.error("Error changing password:", error);
        throw error; // Propagate error to React Query
      }
    },
    onSuccess: () => {
      console.log("Password changed successfully");
    },
  });

  const deactivateAccount = useMutation({
    mutationFn: async () => {
      try {
        const response = await authApi.deactivateAccount();
        return response;
      } catch (error) {
        console.error("Error deactivating account:", error);
        throw error; // Propagate error to React Query
      }
    },
    onSuccess: () => {
      queryClient.removeQueries(["auth"]);
      queryClient.removeQueries(["profile"]);
      Cookies.remove("resetToken");
      navigate("/");
    },
  });

  // Session management
  const useSessionManagement = () => {
    const {
      data: sessions,
      isLoading,
      error,
    } = useQuery({
      queryKey: ["sessions"],
      queryFn: async () => await authApi.getActiveSessions(),
      enabled: !!userData,
      staleTime: 1000 * 60 * 2, // 2 minutes
    });

    const revokeSession = useMutation({
      mutationFn: async (sessionId) => await authApi.revokeSession(sessionId),
      onSuccess: () => {
        queryClient.invalidateQueries(["sessions"]);
      },
    });

    return {
      sessions,
      isLoading,
      error,
      revokeSession,
    };
  };

  // Seller operations
  const becomeSeller = useMutation({
    mutationFn: async (sellerData) => await authApi.becomeSeller(sellerData),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth"], (old) => ({
        ...old,
        role: "seller",
        ...data.data?.data,
      }));
      queryClient.setQueryData(["profile", userData.id], (old) => ({
        ...old,
        userInfo: {
          ...old.userInfo,
          role: "seller",
          ...data.data?.data,
        },
      }));
    },
  });

  // Social account connections
  const connectSocialAccount = useMutation({
    mutationFn: async (provider) => await authApi.connectSocial(provider),
    onSuccess: (data, provider) => {
      queryClient.setQueryData(["profile", userData.id], (old) => ({
        ...old,
        connectedAccounts: {
          ...old.connectedAccounts,
          [provider]: true,
        },
      }));
    },
  });

  const disconnectSocialAccount = useMutation({
    mutationFn: async (provider) => await authApi.disconnectSocial(provider),
    onSuccess: (data, provider) => {
      queryClient.setQueryData(["profile", userData.id], (old) => ({
        ...old,
        connectedAccounts: {
          ...old.connectedAccounts,
          [provider]: false,
        },
      }));
    },
  });
  const uploadAvatar = useMutation({
    mutationFn: async (avatar) => {
      const response = await authApi.uploadAvatar(avatar);
      return response;
    },
    onSuccess: (data) => {
      console.log("photo successfully uploaded", data);
    },
  });
  const sendPasswordResetOtp = useMutation({
    mutationFn: async (loginId) => {
      const response = await authApi.sendPasswordResetOtp(loginId);
      return response;
    },
    onSuccess: (data) => {
      console.log("Password reset OTP sent:", data);
      // You can handle UI updates or state changes here
    },
    onError: (error) => {
      console.error("Error sending password reset OTP:", error);
      // Handle error UI updates
    },
  });
  // Password reset mutations - modified to use cookies
  const verifyPasswordResetOtp = useMutation({
    mutationFn: async ({ loginId, otp }) => {
      const response = await authApi.verifyPasswordResetOtp(loginId, otp);
      return response;
    },
    onSuccess: (data) => {
      console.log("Password reset OTP verified:", data);
      // Store reset token in cookies if provided by the API
      if (data.data?.resetToken) {
        Cookies.set("resetToken", data.data.resetToken, {
          expires: 1 / 24, // Expires in 1 hour
          // eslint-disable-next-line no-undef
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }
    },
    onError: (error) => {
      console.error("Error verifying password reset OTP:", error);
    },
  });
  const resetPassword = useMutation({
    mutationFn: async ({ loginId, newPassword, resetToken }) => {
      const response = await authApi.resetPassword(
        loginId,
        newPassword,
        resetToken
      );
      return response;
    },
    onSuccess: (data) => {
      console.log("Password reset successful:", data);
      // Clear reset token from storage
      Cookies.remove("resetToken");
      // Navigate to login page with success message
      navigate("/login", {
        state: {
          message:
            "Password reset successfully. Please login with your new password.",
        },
      });
    },
    onError: (error) => {
      console.error("Error resetting password:", error);
    },
  });

  return {
    // Auth state
    userData,

    authError,

    uploadAvatar,
    isAuthenticated: !!userData,
    isAdmin: userData?.role === "admin",
    isSeller: userData?.role === "seller",
    isBuyer: !userData?.role || userData?.role === "buyer",

    // Auth operations
    sendOtp,
    verifyOtp,
    register,
    emailVerification,
    resendVerification,
    logout,
    refetchAuth,
    // refetchProfile,

    //password reset
    sendPasswordResetOtp,
    resetPassword,
    verifyPasswordResetOtp,

    // Profile operations
    updateProfile,
    changePassword,
    deactivateAccount,

    // Two-Factor Authentication
    // enableTwoFactor,
    // verifyTwoFactor,
    // disableTwoFactor,

    // Seller operations
    becomeSeller,

    // Social accounts
    connectSocialAccount,
    disconnectSocialAccount,

    // Session management
    useSessionManagement,

    // Loading states
    isLoading: isUserLoading,
    isAuthLoading: isUserLoading,

    // Granular loading states
    isUpdatingProfile: updateProfile.isLoading,
    isChangingPassword: changePassword.isLoading,
    isDeactivatingAccount: deactivateAccount.isLoading,
    // isEnabling2FA: enableTwoFactor.isLoading,
    // isVerifying2FA: verifyTwoFactor.isLoading,
    // isDisabling2FA: disableTwoFactor.isLoading,
    isBecomingSeller: becomeSeller.isLoading,

    // Error states
    updateProfileError: updateProfile.error,
    passwordError: changePassword.error,
    deactivationError: deactivateAccount.error,

    sellerError: becomeSeller.error,
    socialError: connectSocialAccount.error || disconnectSocialAccount.error,
  };
};

export default useAuth;
