import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import authApi from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        // The cookie is sent automatically
        return await authApi.getCurrentUser();
      } catch (err) {
        if (err.response?.status === 401) {
          console.log("Session expired, please login");
        }
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
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
      Cookies.set("token", token, { expires: 7 });
      try {
        const decoded = jwtDecode(token); // { id, role, exp, ... }
        if (decoded.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
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
  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      Cookies.remove("token");
      window.location.href = "/";
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
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.updateProfile(payload);
      return response;
    },
    onSuccess: (data) => {
      console.log("Profile updated successfully:", data);
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
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.uploadAvatar(payload);
      return response;
    },
    onSuccess: (data) => {
      console.log("Avatar uploaded successfully:", data);
    },
  });
};
