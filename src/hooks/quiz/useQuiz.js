import { fetchQuiz } from "@/api/quiz";
import { useQuery } from "@tanstack/react-query";

export function useQuiz({ keyword, subCategoryIds, page, size = 12 }) {
  return useQuery({
    queryKey: ["quizzes", keyword, subCategoryIds, page, size],
    queryFn: () =>
      fetchQuiz({
        keyword,
        subCategoryIds,
        page,
        size,
      }),
    keepPreviousData: true,
    placeholderData: (previousData) => previousData,
  });
}
