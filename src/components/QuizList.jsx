import QuizCard from "./QuizCard";

export default function QuizList({ quizzes = [], isLoading, isError }) {
  if (isLoading) {
    return (
      <div className="py-16 text-center text-gray-500">Loading quizzes...</div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center text-red-500">
        Failed to load quizzes.
      </div>
    );
  }

  if (!quizzes.length) {
    return (
      <div className="py-16 text-center text-gray-500">No quizzes found.</div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
}
