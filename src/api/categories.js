import apiClient from "../config/apiClient";

export function fetchCategoryBrowse() {
  return apiClient.get("/api/categories/browse");
}
