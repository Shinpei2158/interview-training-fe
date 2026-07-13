import { useQuery } from "@tanstack/react-query";
import { fetchCategoryBrowse } from "../api/categories";

export function useCategoryBrowse({ enabled = true } = {}) {
  return useQuery({
    queryKey: ["categories", "browse"],
    queryFn: fetchCategoryBrowse,
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
