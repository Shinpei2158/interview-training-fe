import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useQuiz } from "@/hooks/quiz/useQuiz";
import SearchFilterPanel from "@/components/SearchFilterPanel";
import QuizList from "@/components/QuizList";
import QuizPagination from "@/components/QuizPagination";

export default function QuizPage() {
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    keyword: "",
    subCategoryIds: [],
  });

  const { data, isLoading, isError } = useQuiz({
    keyword: filters.keyword,
    subCategoryIds: filters.subCategoryIds,
    page,
  });

  const handleSearch = ({ keyword, subCategoryIds }) => {
    setFilters({ keyword, subCategoryIds });
    setPage(0);
  };

  // Hàm xử lý khi một item trong danh sách thay đổi trạng thái Like/Rate
  const handleQuizChange = (updatedQuiz) => {
    const size = 12;

    const currentQueryKey = [
      "quizzes",
      filters.keyword,
      filters.subCategoryIds,
      page,
      size,
    ];

    queryClient.setQueryData(currentQueryKey, (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        content: oldData.content.map((q) =>
          q.id === updatedQuiz.id ? updatedQuiz : q,
        ),
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <SearchFilterPanel
        onSearch={handleSearch}
        placeholder="Tìm kiếm bộ câu hỏi phỏng vấn theo tiêu đề hoặc tên người dùng"
      />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Interview Quizzes</h2>
          {!isLoading && (
            <span className="text-sm text-gray-500">
              {data?.totalElements || 0} quizzes
            </span>
          )}
        </div>

        <QuizList
          quizzes={data?.content || []}
          isLoading={isLoading}
          isError={isError}
          onQuizChange={handleQuizChange}
        />

        <QuizPagination
          page={page}
          totalPages={data?.totalPages || 0}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
