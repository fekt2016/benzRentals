import { useQuery } from "@tanstack/react-query";
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
