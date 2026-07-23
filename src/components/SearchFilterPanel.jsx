import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X, Filter } from "lucide-react";
import { useCategoryBrowse } from "../hooks/useCategoryBrowse";

export default function SearchFilterPanel({ onSearch, placeholder }) {
  const { data: categories = [] } = useCategoryBrowse();

  const [keyword, setKeyword] = useState("");
  const [openSkills, setOpenSkills] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const dropdownRef = useRef(null);

  // Đóng bộ lọc khi nhấn ra ngoài (chỉ áp dụng trên desktop)
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        window.innerWidth >= 768 &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenSkills(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Khóa cuộn trang khi mở bộ lọc dạng full-screen trên mobile
  useEffect(() => {
    if (openSkills && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openSkills]);

  const toggleSubCategory = (subId) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subId)
        ? prev.filter((id) => id !== subId)
        : [...prev, subId],
    );
  };

  const toggleCategory = (category) => {
    const subIds = category.subCategories?.map((s) => s.id) || [];
    const allSelected =
      subIds.length > 0 &&
      subIds.every((id) => selectedSubCategories.includes(id));

    if (allSelected) {
      setSelectedSubCategories((prev) =>
        prev.filter((id) => !subIds.includes(id)),
      );
    } else {
      setSelectedSubCategories((prev) => [...new Set([...prev, ...subIds])]);
    }
  };

  const selectedSubObjects = categories.flatMap(
    (category) =>
      category.subCategories?.filter((sub) =>
        selectedSubCategories.includes(sub.id),
      ) || [],
  );

  const handleSearch = () => {
    onSearch({ keyword, subCategoryIds: selectedSubCategories });
    setOpenSkills(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 md:py-8">
      {/* Vùng Tìm Kiếm Chính */}
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] hover:shadow-md focus-within:shadow-md focus-within:border-[#0077b6] transition-all duration-300 p-1.5 md:p-2">
          {/* Nút lọc Kỹ năng */}
          <button
            type="button"
            onClick={() => setOpenSkills(!openSkills)}
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              openSkills
                ? "bg-[#f0f7ff] text-[#0077b6]"
                : "text-[#64748b] hover:bg-[#f0f7ff] hover:text-[#0077b6]"
            }`}
          >
            <Filter
              size={18}
              className={
                selectedSubCategories.length > 0
                  ? "text-[#0077b6]"
                  : "text-[#94a3b8]"
              }
            />
            <span className="hidden md:inline">Kỹ năng</span>
            {selectedSubCategories.length > 0 && (
              <span className="flex items-center justify-center min-w-4.5 h-4 md:h-5 px-1 md:px-1.5 text-[10px] md:text-xs font-bold text-white bg-[#0077b6] rounded-full">
                {selectedSubCategories.length}
              </span>
            )}
            <ChevronDown
              size={14}
              className={`hidden md:block transition-transform duration-200 ${openSkills ? "rotate-180" : ""}`}
            />
          </button>

          {/* Ô nhập từ khóa */}
          <input
            type="text"
            placeholder={
              window.innerWidth < 640
                ? "Tìm bộ câu hỏi phỏng vấn..."
                : `${placeholder}`
            }
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 px-2 md:px-4 py-2 text-[#0f172a] placeholder-[#94a3b8] outline-none text-sm bg-transparent"
          />

          {/* Nút Tìm Kiếm */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 p-2.5 md:px-5 md:py-2.5 bg-[#0077b6] hover:bg-[#0096c7] text-white font-medium text-sm rounded-xl transition-all shadow-xs active:scale-[0.98]"
          >
            <Search size={18} />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </button>
        </div>

        {/* Dropdown Bộ lọc thông minh */}
        {openSkills && (
          <div
            className="
            fixed inset-0 z-50 flex flex-col bg-white
            md:absolute md:inset-auto md:top-full md:left-0 md:w-full md:mt-3 md:border md:border-slate-200/80 md:rounded-2xl md:shadow-xl md:max-h-120 md:overflow-hidden
            animate-slide-up md:animate-slide-down
          "
          >
            {/* Header của bộ lọc */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0] md:hidden bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2 font-semibold text-[#0f172a] text-base">
                <Filter size={18} className="text-[#0077b6]" />
                Chọn kỹ năng ôn luyện
              </div>
              <button
                type="button"
                onClick={() => setOpenSkills(false)}
                className="p-1.5 text-[#94a3b8] hover:bg-[#f0f7ff] rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Vùng cuộn chứa nội dung */}
            <div className="p-5 md:p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar bg-white">
              {categories.map((category) => {
                const subIds = category.subCategories?.map((s) => s.id) || [];
                const allSelected =
                  subIds.length > 0 &&
                  subIds.every((id) => selectedSubCategories.includes(id));

                return (
                  <div key={category.id} className="space-y-3">
                    <label className="inline-flex items-center gap-2.5 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 rounded border-[#e2e8f0] text-[#0077b6] focus:ring-[#0077b6]/20 accent-[#0077b6]"
                      />
                      <span className="text-sm font-semibold text-[#0f172a] group-hover:text-[#0077b6] transition-colors">
                        {category.name}
                      </span>
                    </label>

                    {/* Danh sách Tag con */}
                    <div className="flex flex-wrap gap-2 pl-6">
                      {category.subCategories?.map((sub) => {
                        const selected = selectedSubCategories.includes(sub.id);

                        return (
                          <button
                            type="button"
                            key={sub.id}
                            onClick={() => toggleSubCategory(sub.id)}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                              selected
                                ? "bg-[#0077b6] border-[#0077b6] text-white shadow-xs"
                                : "bg-[#f0f7ff] border-[#bae6fd] text-[#0077b6] hover:bg-[#e0f2fe]"
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Footer hành động */}
            <div className="flex items-center justify-between gap-3 p-4 bg-[#f8fafc] border-t border-[#e2e8f0] backdrop-blur-sm sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => setSelectedSubCategories([])}
                className="px-4 py-2.5 text-xs font-medium text-[#64748b] rounded-xl hover:bg-[#f0f7ff] hover:text-[#0077b6] transition"
              >
                Xóa bộ lọc
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    handleSearch();
                  } else {
                    setOpenSkills(false);
                  }
                }}
                className="flex-1 md:flex-none text-center px-6 py-2.5 text-xs font-semibold text-white bg-[#0077b6] hover:bg-[#0096c7] rounded-xl shadow-xs transition"
              >
                {window.innerWidth < 768
                  ? `Xem kết quả (${selectedSubCategories.length})`
                  : "Áp dụng"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách các kỹ năng đã chọn nhanh ngoài màn hình chính */}
      {selectedSubObjects.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          <span className="text-xs text-[#64748b] font-medium mr-1 hidden sm:inline">
            Đang lọc theo:
          </span>
          {selectedSubObjects.map((sub) => (
            <button
              type="button"
              key={sub.id}
              onClick={() => toggleSubCategory(sub.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0077b6] bg-[#f0f7ff] border border-[#bae6fd] rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all group"
            >
              {sub.name}
              <X size={12} className="text-[#0077b6] group-hover:text-rose-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
