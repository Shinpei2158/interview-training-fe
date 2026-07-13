import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  onRate,
  disabled = false,
  size = 18,
}) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`Rating ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((rating) => {
        const active = rating <= Math.round(value || 0);
        return (
          <button
            key={rating}
            type="button"
            disabled={disabled || !onRate}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRate?.(rating);
            }}
            className="rounded p-0.5 text-amber-400 disabled:cursor-default"
            aria-label={`Rate ${rating} stars`}
          >
            <Star
              size={size}
              className={active ? "fill-amber-400" : "fill-none text-slate-300"}
            />
          </button>
        );
      })}
    </div>
  );
}
