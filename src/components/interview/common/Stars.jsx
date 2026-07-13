import { Star } from "lucide-react";

export default function Stars({ value = 0, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`rounded p-1 ${star <= value ? "text-amber-500" : "text-slate-300"}`}
          aria-label={`${star} star`}
        >
          <Star size={18} fill={star <= value ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
}
