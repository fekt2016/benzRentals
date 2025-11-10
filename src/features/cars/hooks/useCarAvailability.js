import { useQuery } from "@tanstack/react-query";
import carApi from "../carService";

export const useCarAvailability = (carId, startDate, endDate, enabled = true) => {
  return useQuery({
    queryKey: ["carAvailability", carId, startDate, endDate],
    queryFn: () => carApi.getCarAvailability(carId, startDate, endDate),
    enabled: enabled && !!carId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

