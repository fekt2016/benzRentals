import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import userApi from "../services/userApi";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await userApi.getUsers();
      return response;
    },
  });
};
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await userApi.createUser(payload);
      return response.data;
    },

    onSuccess: (data) => {
      console.log(data)
      // Refresh users list immediately
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      console.error("Create user failed:", error);
      // const message =
      //   error?.response?.data?.message ||
      //   error?.message ||
      //   "Failed to create user.";
    
    },
  });
};
export const useGetUserById = () => {
  return useQuery({
    queryKey: ["users"],
     queryFn: async (id) => {
      const response = await userApi.getUsers(id);
      return response;
    },

  })
}

export const useToggleRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await userApi.toggleRole();
      return response;
    },
    onSuccess: (data) => {
      console.log("Role toggled successfully:", data);
      
      // Update the token cookie with the new token
      // Backend returns: { status: "success", message: "...", token: "...", data: { user } }
      // userApi.toggleRole returns response.data, so data is the backend response
      const newToken = data?.token;
      if (newToken) {
        Cookies.set("token", newToken, { expires: 7, sameSite: "Strict" });
        
        // Invalidate auth queries to refresh user data
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        
        // Reload the page to apply role changes immediately
        // This ensures navigation and protected routes update
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        console.error("No token received from role toggle response");
      }
    },
    onError: (error) => {
      console.error("Toggle role failed:", error);
    },
  });
};