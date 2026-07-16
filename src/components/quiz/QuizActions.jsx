import { useState, useRef, useEffect } from "react";
import { Heart, Star, Award } from "lucide-react";
import { likeQuiz, rateQuiz } from "@/api/quiz";
import { useToast } from "@/context/ToastContext";

export default function QuizActions({ quiz, onChange, compact = false }) {
  const { toast } = useToast();

  const [isBusy, setIsBusy] = useState(false);
  const [openRatePopover, setOpenRatePopover] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpenRatePopover(false);
      }
    }
    if (openRatePopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openRatePopover]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBusy) return;
    setIsBusy(true);

    try {
      const result = await likeQuiz(quiz.id);

      onChange?.({
        ...quiz,
        liked: result.active,
        totalLike: result.totalLike,
      });
    } catch (err) {
      toast.error(err.message || "Không thể cập nhật trạng thái yêu thích");
    } finally {
      setIsBusy(false);
    }
  };

  const handleRateClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (compact) {
      setOpenRatePopover(!openRatePopover);
    }
  };

  const submitRate = async (ratingValue, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isBusy) return;
    setIsBusy(true);

    try {
      const result = await rateQuiz(quiz.id, ratingValue);
      onChange?.({
        ...quiz,
        averageRate: result.averageRate,
        userRating: ratingValue,
        totalRate: result.totalRate,
      });
      toast.success(`Đã đánh giá ${ratingValue} sao!`);
      setOpenRatePopover(false);
    } catch (error) {
      toast.error(error.message || "Không thể lưu đánh giá");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2 relative">
      {/* NÚT LIKE */}
      <button
        type="button"
        disabled={isBusy}
        onClick={handleLike}
        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
          quiz.liked
            ? "bg-rose-50 text-rose-600 shadow-sm shadow-rose-500/10"
            : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        }`}
      >
        <Heart
          size={14}
          className={`transition-transform duration-200 active:scale-125 ${quiz.liked ? "fill-rose-500 text-rose-500" : ""}`}
        />
        <span>{quiz.totalLike}</span>
      </button>

      {/* KHỐI HIỂN THỊ ĐIỂM RATING TRUNG BÌNH */}
      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          onClick={handleRateClick}
          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
            quiz.userRating > 0
              ? "bg-amber-50 text-amber-700 border border-amber-100"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-amber-600"
          }`}
          title={
            quiz.userRating > 0
              ? `Bạn đã đánh giá ${quiz.userRating} sao. Click để đổi.`
              : "Click để đánh giá bộ câu hỏi"
          }
        >
          <Star
            size={14}
            className={`text-amber-500 ${quiz.userRating > 0 ? "fill-amber-400" : ""}`}
          />
          {/* HIỂN THỊ ĐIỂM TRUNG BÌNH CỦA BỘ QUIZ */}
          <span className="font-bold text-gray-700">
            {Number(quiz.userRating)}
          </span>
        </button>

        {/* POPUP ĐÁNH GIÁ */}
        {openRatePopover && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 bg-slate-900 text-white rounded-xl p-3 shadow-xl border border-slate-800 flex flex-col items-center gap-2 min-w-37.5">
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />

            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
              <Award size={10} className="text-amber-400" /> Đánh giá của bạn
            </span>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const isSelected = star <= quiz.userRating;
                return (
                  <button
                    key={star}
                    type="button"
                    disabled={isBusy}
                    onClick={(e) => submitRate(star, e)}
                    className="p-0.5 hover:scale-110 transition-transform text-amber-400 focus:outline-none"
                  >
                    <Star
                      size={16}
                      className={
                        isSelected
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-500"
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
