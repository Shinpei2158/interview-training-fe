import BackButton from "./BackButton";

export default function PageHeader({
  title,
  description,
  badge,
  backUrl,
  children,
  className = "",
}) {
  return (
    <div className={`mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-5 ${className}`}>
      <div className="space-y-1.5 max-w-3xl">
        {/* Back button or Badge */}
        <div className="flex items-center gap-3">
          {backUrl && <BackButton to={backUrl} />}
          {badge && (
            <span className="text-xs font-bold uppercase tracking-wider text-[#0077b6] bg-[#f0f7ff] px-2.5 py-1 rounded-full border border-[#bae6fd]">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-sm text-[#64748b] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Optional action buttons on the right side */}
      {children && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
