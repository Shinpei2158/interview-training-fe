import { Tag } from "lucide-react";

export default function SubCategoryTag({
  name,
  showIcon = false,
  size = "md",
  className = "",
  onClick,
}) {
  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[11px]"
      : "px-2.5 py-1 text-xs";

  const Component = onClick ? "button" : "span";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-lg bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd] transition-all hover:bg-[#e0f2fe] hover:border-[#7dd3fc] ${sizeClasses} ${className}`}
    >
      {showIcon && <Tag size={size === "sm" ? 10 : 12} className="text-[#0077b6]" />}
      <span>{name}</span>
    </Component>
  );
}
