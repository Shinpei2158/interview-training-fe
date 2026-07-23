import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLikedQuizzes } from "@/api/quiz";
import QuizList from "@/components/QuizList";
import PageHeader from "@/components/common/PageHeader";

export default function LikedQuizzesPage() {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["liked-quizzes"],
    queryFn: fetchLikedQuizzes,
  });

  const handleQuizChange = (updatedQuiz) => {
    queryClient.setQueryData(["liked-quizzes"], (oldData) => {
      if (!oldData) return [];

      if (!updatedQuiz.liked) {
        return oldData.filter((q) => q.id !== updatedQuiz.id);
      }

      return oldData.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q));
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        badge="Yêu thích"
        title="Bộ Câu Hỏi Đã Yêu Thích"
        description="Danh sách các bộ câu hỏi phỏng vấn bạn đã đánh dấu yêu thích để ôn luyện thường xuyên."
      />

      <QuizList
        quizzes={data}
        isLoading={isLoading}
        isError={isError}
        onQuizChange={handleQuizChange}
      />
    </div>
  );
}
