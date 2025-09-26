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

export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.sendOtp(payload);
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

// export const useVerifyOtp = () =>
//   useMutation({
//     mutationFn: async (payload) => await authApi.verifyOtp(payload),
//     onSuccess: (data) => {
//       console.log(data);
//       const token = data.token;

//       // token returned from your backend
//       Cookies.set("token", token, { expires: 7 });
//       // then you can close OTP modal and navigate
//     },
//     onError: (err) => console.error("OTP error", err),
//   });
export const useVerifyOtp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await authApi.verifyOtp(payload);
      console.log("response", response);
      return response;
    },
    onSuccess: (data) => {
      const token = data.data.token;
      Cookies.set("token", token, { expires: 7 });
      try {
        const decoded = jwtDecode(token); // { id, role, exp, ... }
        console.log("Decoded token:", decoded);
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
