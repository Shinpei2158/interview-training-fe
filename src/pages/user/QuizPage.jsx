import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useQuiz } from "@/hooks/quiz/useQuiz";
import SearchFilterPanel from "@/components/SearchFilterPanel";
import QuizList from "@/components/QuizList";
import QuizPagination from "@/components/QuizPagination";
import PageHeader from "@/components/common/PageHeader";

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
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader
        badge="Ngân hàng đề"
        title="Bộ Câu Hỏi Ôn Luyện Phỏng Vấn"
        description="Khám phá và tìm kiếm các bộ câu hỏi ôn kiểm tra kỹ thuật chất lượng cao từ cộng đồng và chuyên gia."
      />

      <SearchFilterPanel
        onSearch={handleSearch}
        placeholder="Tìm kiếm bộ câu hỏi phỏng vấn theo tiêu đề hoặc tên người dùng"
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          {!isLoading && (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tìm thấy {data?.totalElements || 0} bộ câu hỏi
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
