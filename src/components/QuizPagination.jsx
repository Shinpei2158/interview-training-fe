export default function QuizPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 border rounded-lg disabled:opacity-50"
      >
        Previous
      </button>

      <span className="font-medium">
        Page {page + 1} / {totalPages}
      </span>

      <button
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 border rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
