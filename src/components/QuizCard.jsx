import { Link } from "react-router-dom";
import QuizActions from "@/components/quiz/QuizActions";

export default function QuizCard({ quiz }) {
  return (
    <Link
      to={`/quizzes/${quiz.id}/study`}
      className="block rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          src={quiz.avatarUrl || "/default-avatar.png"}
          alt={quiz.username}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <p className="font-medium">{quiz.username}</p>

          <p className="text-xs text-gray-500">
            {new Date(quiz.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h3 className="font-semibold text-lg line-clamp-2 mb-2">{quiz.title}</h3>

      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
        {quiz.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {quiz.subCategories?.map((sub) => (
          <span
            key={sub.id}
            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
          >
            {sub.name}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{quiz.totalQuestion} Questions</span>

        <QuizActions quiz={quiz} compact />
      </div>
    </Link>
  );
}
