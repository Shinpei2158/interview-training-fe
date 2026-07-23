import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
  to,
  url,
  fallbackUrl = "/quiz",
  label = "Quay lại",
  className = "",
}) {
  const navigate = useNavigate();
  const targetUrl = to || url;

  const handleBack = () => {
    if (targetUrl) {
      navigate(targetUrl);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 hover:text-[#0077b6] border border-slate-200/80 shadow-2xs transition active:scale-95 cursor-pointer ${className}`}
    >
      <ArrowLeft size={15} />
      <span>{label}</span>
    </button>
  );
}
