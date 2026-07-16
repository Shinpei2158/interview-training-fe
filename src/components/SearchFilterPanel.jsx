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
        <div className="flex items-center bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-blue-500/50 transition-all duration-300 p-1.5 md:p-2">
          {/* Nút lọc Kỹ năng (Thu gọn icon trên mobile, hiện chữ trên desktop) */}
          <button
            type="button"
            onClick={() => setOpenSkills(!openSkills)}
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              openSkills
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter
              size={18}
              className={
                selectedSubCategories.length > 0
                  ? "text-blue-600"
                  : "text-gray-400"
              }
            />
            <span className="hidden md:inline">Kỹ năng</span>
            {selectedSubCategories.length > 0 && (
              <span className="flex items-center justify-center min-w-4.5 h-4 md:h-5 px-1 md:px-1.5 text-[10px] md:text-xs font-bold text-white bg-blue-600 rounded-full">
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
            className="flex-1 min-w-0 px-2 md:px-4 py-2 text-gray-800 placeholder-gray-400 outline-none text-sm bg-transparent"
          />

          {/* Nút Tìm Kiếm (Dạng nút tròn nhỏ trên mobile, thanh dài chữ lớn trên desktop) */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 p-2.5 md:px-5 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm active:scale-[0.95]"
          >
            <Search size={18} />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </button>
        </div>

        {/* Dropdown Bộ lọc thông minh cho mọi kích thước màn hình */}
        {openSkills && (
          <div
            className="
            fixed inset-0 z-50 flex flex-col bg-white
            md:absolute md:inset-auto md:top-full md:left-0 md:w-full md:mt-3 md:border md:border-gray-100 md:rounded-2xl md:shadow-xl md:max-h-120 md:overflow-hidden
            animate-slide-up md:animate-slide-down
          "
          >
            {/* Header của bộ lọc - Chỉ hiển thị trên Mobile */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 md:hidden bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2 font-semibold text-gray-800 text-base">
                <Filter size={18} className="text-blue-600" />
                Chọn kỹ năng ôn luyện
              </div>
              <button
                type="button"
                onClick={() => setOpenSkills(false)}
                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Vùng cuộn chứa nội dung các Kỹ năng */}
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
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 accent-blue-600"
                      />
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
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
                            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                              selected
                                ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20"
                                : "bg-gray-50/60 border-gray-100 text-gray-600 hover:bg-blue-50/50"
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

            {/* Bottom Footer hành động (Cố định ở đáy trên cả Mobile và Desktop) */}
            <div className="flex items-center justify-between gap-3 p-4 bg-gray-50 border-t border-gray-100 backdrop-blur-sm sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => setSelectedSubCategories([])}
                className="px-4 py-2.5 text-xs font-medium text-gray-500 rounded-xl hover:bg-gray-100 transition"
              >
                Xóa bộ lọc
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    handleSearch(); // Trên mobile, bấm áp dụng sẽ kích hoạt tìm kiếm luôn để đỡ tốn thao tác
                  } else {
                    setOpenSkills(false);
                  }
                }}
                className="flex-1 md:flex-none text-center px-6 py-2.5 text-xs font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-sm transition"
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
          <span className="text-xs text-gray-400 font-medium mr-1 hidden sm:inline">
            Đang lọc theo:
          </span>
          {selectedSubObjects.map((sub) => (
            <button
              type="button"
              key={sub.id}
              onClick={() => toggleSubCategory(sub.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all group"
            >
              {sub.name}
              <X size={12} className="text-blue-400 group-hover:text-red-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
