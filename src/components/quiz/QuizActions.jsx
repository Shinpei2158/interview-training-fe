import { Heart } from "lucide-react";
import { useState } from "react";

import { likeQuiz, rateQuiz } from "@/api/quiz";
import { useToast } from "@/context/ToastContext";
import StarRating from "./StarRating";

export default function QuizActions({ quiz, compact = false }) {
  const { toast } = useToast();
  const [liked, setLiked] = useState(Boolean(quiz?.liked));
  const [totalLike, setTotalLike] = useState(quiz?.totalLike ?? 0);
  const [averageRate, setAverageRate] = useState(quiz?.averageRate ?? 0);
  const [isBusy, setIsBusy] = useState(false);

  const handleLike = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsBusy(true);
    try {
      const result = await likeQuiz(quiz.id);
      setLiked(result.active);
      setTotalLike(result.totalLike);
    } catch (error) {
      toast.error(error.message || "Unable to update favorite");
    } finally {
      setIsBusy(false);
    }
  };

  const handleRate = async (rating) => {
    setIsBusy(true);
    try {
      const result = await rateQuiz(quiz.id, rating);
      setAverageRate(result.averageRate);
      toast.success("Rating saved");
    } catch (error) {
      toast.error(error.message || "Unable to save rating");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-4"}`}>
      <button
        type="button"
        disabled={isBusy}
        onClick={handleLike}
        className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold transition ${
          liked ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
        }`}
        aria-label={liked ? "Remove from liked quizzes" : "Add to liked quizzes"}
      >
        <Heart size={16} className={liked ? "fill-rose-500" : ""} />
        {totalLike}
      </button>
      <div className="inline-flex items-center gap-2 text-sm text-slate-600">
        <StarRating value={averageRate} onRate={handleRate} disabled={isBusy} />
        <span className="font-medium">{Number(averageRate || 0).toFixed(1)}</span>
      </div>
    </div>
  );
}
