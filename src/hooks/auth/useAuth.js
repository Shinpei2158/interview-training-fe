import { useQuery } from "@tanstack/react-query";
import { me } from "../../api/auth";

export function useAuth() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        return await me();
      } catch (error) {
        if (error.status === 401) {
          return null;
        }

        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
