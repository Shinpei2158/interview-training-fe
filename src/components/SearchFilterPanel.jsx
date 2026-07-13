import { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { useCategoryBrowse } from "../hooks/useCategoryBrowse";

export default function SearchFilterPanel({ onSearch }) {
  const { data: categories = [] } = useCategoryBrowse();

  const [keyword, setKeyword] = useState("");
  const [openSkills, setOpenSkills] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

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
    onSearch({
      keyword,
      subCategoryIds: selectedSubCategories,
    });

    setOpenSkills(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search */}
      <div className="relative">
        <div className="flex items-center overflow-hidden bg-white border rounded-xl shadow-sm">
          <button
            onClick={() => setOpenSkills(!openSkills)}
            className="flex items-center gap-2 px-4 py-3 border-r hover:bg-gray-50 whitespace-nowrap"
          >
            Skills
            {selectedSubCategories.length > 0 && (
              <span className="px-2 py-0.5 text-xs text-white bg-blue-600 rounded-full">
                {selectedSubCategories.length}
              </span>
            )}
            <ChevronDown size={18} />
          </button>

          <input
            type="text"
            placeholder="Search interview quiz..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 px-4 py-3 outline-none"
          />

          <button
            onClick={handleSearch}
            className="px-5 py-3 border-l hover:bg-gray-50"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Skills Dropdown */}
        {openSkills && (
          <div className="absolute z-50 w-full mt-2 overflow-y-auto bg-white border rounded-xl shadow-lg max-h-[500px]">
            <div className="p-5 space-y-6">
              {categories.map((category) => {
                const subIds = category.subCategories?.map((s) => s.id) || [];

                const allSelected =
                  subIds.length > 0 &&
                  subIds.every((id) => selectedSubCategories.includes(id));

                return (
                  <div key={category.id}>
                    <label className="flex items-center gap-2 mb-3 font-semibold">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={() => toggleCategory(category)}
                      />

                      <span>{category.name}</span>
                    </label>

                    <div className="flex flex-wrap gap-2 ml-6">
                      {category.subCategories?.map((sub) => {
                        const selected = selectedSubCategories.includes(sub.id);

                        return (
                          <button
                            key={sub.id}
                            onClick={() => toggleSubCategory(sub.id)}
                            className={`px-3 py-1.5 rounded-full border text-sm transition ${
                              selected
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white hover:bg-blue-50"
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

            <div className="sticky bottom-0 flex justify-end gap-3 p-4 bg-white border-t">
              <button
                onClick={() => setSelectedSubCategories([])}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Clear
              </button>

              <button
                onClick={() => setOpenSkills(false)}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Skills */}
      {selectedSubObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedSubObjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => toggleSubCategory(sub.id)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200"
            >
              {sub.name}
              <X size={14} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
