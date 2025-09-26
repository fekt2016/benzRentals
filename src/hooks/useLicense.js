import { useQuery } from "@tanstack/react-query";
import licenseApi from "../services/LicenseApi";
export const useGetUserLicenses = () => {
  return useQuery({
    queryKey: ["userLicenses"],
    queryFn: async () => {
      const response = await licenseApi.getUserLicenses();
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Fetched user licenses:", data);
    },
  });
};
