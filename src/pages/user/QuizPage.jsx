import { useState } from "react";

import { useQuiz } from "@/hooks/quiz/useQuiz";
import SearchFilterPanel from "@/components/SearchFilterPanel";
import QuizList from "@/components/QuizList";
import QuizPagination from "@/components/QuizPagination";

export default function QuizPage() {
  const [page, setPage] = useState(0);

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
    setFilters({
      keyword,
      subCategoryIds,
    });

    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <SearchFilterPanel onSearch={handleSearch} />

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
