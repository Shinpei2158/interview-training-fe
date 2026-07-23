import React from "react";

export default function QuizPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Hàm sinh danh sách các trang hiển thị (Ví dụ: [0, 1, '...', 4, 5])
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; 

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      // Luôn hiển thị trang đầu
      pages.push(0);

      // Tính toán khoảng giữa
      let start = Math.max(1, page - 1);
      let end = Math.min(totalPages - 2, page + 1);

      // Điều chỉnh khoảng để luôn mượt mà khi ở gần đầu/cuối
      if (page <= 2) {
        end = 2;
      } else if (page >= totalPages - 3) {
        start = totalPages - 3;
      }

      if (start > 1) pages.push("..._left");

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 2) pages.push("..._right");

      // Luôn hiển thị trang cuối
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-8 select-none">
      {/* Nút về Đầu Trang (<<) */}
      <button
        disabled={page === 0}
        onClick={() => onPageChange(0)}
        title="Trang đầu"
        className="flex items-center justify-center w-9 h-9 border rounded-lg border-[#e2e8f0] text-[#64748b] transition-colors hover:bg-[#f0f7ff] hover:text-[#0077b6] active:bg-[#e0f2fe] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 19l-7-7 7-7M18 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Nút Trước (<) */}
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        title="Trang trước"
        className="flex items-center justify-center w-9 h-9 border rounded-lg border-[#e2e8f0] text-[#64748b] transition-colors hover:bg-[#f0f7ff] hover:text-[#0077b6] active:bg-[#e0f2fe] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed mr-1"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Danh sách số trang */}
      {getPageNumbers().map((p, index) => {
        if (typeof p === "string") {
          return (
            <span
              key={index}
              className="w-9 h-9 flex items-center justify-center text-[#94a3b8] font-medium"
            >
              ...
            </span>
          );
        }

        const isActive = p === page;
        return (
          <button
            key={index}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 flex items-center justify-center font-medium rounded-lg border text-sm transition-all
              ${
                isActive
                  ? "bg-[#0077b6] border-[#0077b6] text-white shadow-2xs font-bold"
                  : "border-[#e2e8f0] text-[#64748b] hover:bg-[#f0f7ff] hover:text-[#0077b6] hover:border-[#bae6fd]"
              }`}
          >
            {p + 1}
          </button>
        );
      })}

      {/* Nút Tiếp (>) */}
      <button
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
        title="Trang tiếp"
        className="flex items-center justify-center w-9 h-9 border rounded-lg border-[#e2e8f0] text-[#64748b] transition-colors hover:bg-[#f0f7ff] hover:text-[#0077b6] active:bg-[#e0f2fe] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed ml-1"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Nút về Cuối Trang (>>) */}
      <button
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(totalPages - 1)}
        title="Trang cuối"
        className="flex items-center justify-center w-9 h-9 border rounded-lg border-[#e2e8f0] text-[#64748b] transition-colors hover:bg-[#f0f7ff] hover:text-[#0077b6] active:bg-[#e0f2fe] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 5l7 7-7 7M6 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );

}
