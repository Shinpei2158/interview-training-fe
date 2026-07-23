import { useMemo, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDeleteVerificationImage,
  useDeleteVerificationDocument,
} from "@/hooks/interview/useInterviewApi";
import {
  saveMyInterviewProfile,
  uploadVerificationImage,
  uploadInterviewerDocuments,
} from "@/api/interviews";
import { useCategoryBrowse } from "@/hooks/useCategoryBrowse";
import { useToast } from "@/context/ToastContext";
import { defaultAvailability } from "@/components/interview/common/interviewUtils";
import AvailabilityGrid from "./AvailabilityGrid";
import SkillGroupSelector from "./SkillGroupSelector";
import {
  FileText,
  Upload,
  Loader2,
  Briefcase,
  Clock,
  UserCheck,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  X,
  ImageIcon,
  Trash2,
  ExternalLink,
  Plus,
} from "lucide-react";

function flattenSubcategories(categories = []) {
  return categories.flatMap((category) =>
    (category.subCategories || []).map((subCategory) => ({
      ...subCategory,
      categoryName: category.name,
    })),
  );
}

const isImageUrl = (url) => {
  if (!url) return false;
  const cleanUrl = url.toLowerCase().split("?")[0];
  return (
    cleanUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/) != null ||
    cleanUrl.includes("/image/upload/")
  );
};
const isImageFile = (file) => file && file.type.startsWith("image/");

export default function ProfileEditor({ profile }) {
  const { toast } = useToast();
  const { data: categories = [] } = useCategoryBrowse();
  const skills = useMemo(() => flattenSubcategories(categories), [categories]);

  const [form, setForm] = useState(() => ({
    title: profile?.title || "",
    company: profile?.company || "",
    yearsExperience: profile?.yearsExperience ?? "",
    pointsRequired: profile?.pointsRequired ?? 10,
    subcategoryIds: profile?.subcategories?.map((item) => item.id) || [],
    description: profile?.description || "",
    availabilities: profile?.availabilities?.length
      ? profile.availabilities
      : defaultAvailability(),
  }));

  // Pending uploads — shown locally only, NOT sent until Save
  const [pendingDocs, setPendingDocs] = useState([]);
  const [pendingImage, setPendingImage] = useState(null); // { file, previewUrl }
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();
  const deleteImageMutation = useDeleteVerificationImage();
  const deleteDocMutation = useDeleteVerificationDocument();

  const docInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const toggleSkill = (id) => {
    setForm((current) => {
      const exists = current.subcategoryIds.includes(id);
      if (!exists && current.subcategoryIds.length >= 5) {
        toast.error("Bạn chỉ được chọn tối đa 5 kỹ năng");
        return current;
      }
      return {
        ...current,
        subcategoryIds: exists
          ? current.subcategoryIds.filter((item) => item !== id)
          : [...current.subcategoryIds, id],
      };
    });
  };

  // ---- Verification Image ----
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ chấp nhận file hình ảnh cho ảnh bằng cấp / chứng chỉ");
      return;
    }
    if (pendingImage?.previewUrl) URL.revokeObjectURL(pendingImage.previewUrl);
    setPendingImage({ file, previewUrl: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const removePendingImage = () => {
    if (pendingImage?.previewUrl) URL.revokeObjectURL(pendingImage.previewUrl);
    setPendingImage(null);
  };

  const handleDeleteSavedImage = () => {
    deleteImageMutation.mutate();
  };

  // ---- Verification Documents ----
  const handleDocSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const savedCount = (profile?.verificationDocuments || []).length;
    const pendingCount = pendingDocs.length;
    const totalAfter = savedCount + pendingCount + selectedFiles.length;

    if (totalAfter > 3) {
      toast.error(
        `Tối đa 3 tài liệu xác minh. Còn lại ${3 - savedCount - pendingCount} vị trí.`,
      );
      e.target.value = "";
      return;
    }

    const newItems = selectedFiles.map((f) => ({
      file: f,
      previewUrl: isImageFile(f) ? URL.createObjectURL(f) : null,
      name: f.name,
    }));
    setPendingDocs((prev) => [...prev, ...newItems]);
    e.target.value = "";
  };

  const removePendingDoc = (idx) => {
    setPendingDocs((prev) => {
      if (prev[idx]?.previewUrl) URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleDeleteSavedDoc = (idx) => {
    deleteDocMutation.mutate(idx);
  };

  // ---- Save ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (form.subcategoryIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất một kỹ năng chuyên môn");
      return;
    }

    const requiredPts = Number(form.pointsRequired);
    if (isNaN(requiredPts) || requiredPts < 10) {
      toast.error(
        "Yêu cầu điểm số cho mỗi buổi phỏng vấn tối thiểu là 10 điểm (Min 10 pts)",
      );
      return;
    }

    setIsSaving(true);
    try {
      // 1. Save profile information
      await saveMyInterviewProfile({
        title: form.title.trim(),
        company: form.company.trim(),
        yearsExperience:
          form.yearsExperience === "" ? null : Number(form.yearsExperience),
        pointsRequired: requiredPts,
        subcategoryIds: form.subcategoryIds,
        description: form.description,
        availabilities: form.availabilities,
      });

      // 2. Upload verification image if present
      if (pendingImage) {
        await uploadVerificationImage(pendingImage.file);
        URL.revokeObjectURL(pendingImage.previewUrl);
        setPendingImage(null);
      }

      // 3. Upload verification documents if present
      if (pendingDocs.length > 0) {
        await uploadInterviewerDocuments(pendingDocs.map((p) => p.file));
        pendingDocs.forEach((p) => {
          if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
        });
        setPendingDocs([]);
      }

      // 4. Invalidate query cache once to reload all data together
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["interview-profile", "me"] }),
        queryClient.invalidateQueries({ queryKey: ["interview-profiles"] }),
      ]);

      toast.success("Hồ sơ chuyên gia đã được lưu thành công!");
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi lưu hồ sơ");
    } finally {
      setIsSaving(false);
    }
  };

  const savedDocs = profile?.verificationDocuments || [];
  const savedImage = profile?.verificationImageUrl || null;
  const canUploadMoreDocs = savedDocs.length + pendingDocs.length < 3;
  const hasImage = savedImage || pendingImage;
  const pendingCount = (pendingImage ? 1 : 0) + pendingDocs.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Row 1: Credentials (left) + Professional Experience (right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 shadow-2xs space-y-6 h-full">
              <h3 className="text-base font-bold text-[#0f172a] border-b border-[#e2e8f0] pb-3 flex items-center gap-2">
                <Briefcase size={18} className="text-[#0077b6]" />
                Kinh Nghiệm & Trình Độ Chuyên Môn
              </h3>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f172a] block">
                  Chức Danh Chuyên Môn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] font-medium focus:outline-none focus:ring-2 focus:ring-[#0077b6]/20 focus:border-[#0077b6] transition bg-white"
                  placeholder="Ví dụ: Senior Fullstack Engineer, Tech Lead"
                  value={form.title}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* Company */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0f172a] block">
                    Công Ty Hiện Tại
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] font-medium focus:outline-none focus:ring-2 focus:ring-[#0077b6]/20 focus:border-[#0077b6] transition bg-white"
                    placeholder="Ví dụ: Google, FPT Software"
                    value={form.company}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        company: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Years of Experience */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0f172a] block">
                    Số Năm Kinh Nghiệm
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] font-medium focus:outline-none focus:ring-2 focus:ring-[#0077b6]/20 focus:border-[#0077b6] transition bg-white"
                    placeholder="Ví dụ: 5"
                    value={form.yearsExperience}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        yearsExperience: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Points Required for Booking */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#0f172a] block flex items-center justify-between">
                    <span>Điểm Yêu Cầu</span>
                    <span className="text-[11px] font-bold text-[#d97706] bg-[#fef3c7] px-1.5 py-0.5 rounded border border-[#fde68a]">
                      Min 10 pts
                    </span>
                  </label>
                  <input
                    type="number"
                    min="10"
                    required
                    className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm font-bold text-[#0077b6] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/20 focus:border-[#0077b6] transition bg-white"
                    placeholder="Min 10"
                    value={form.pointsRequired}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        pointsRequired: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#0f172a] block">
                  Tiểu Sử & Lĩnh Vực Chuyên Môn Sâu
                </label>
                <textarea
                  rows={7}
                  className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/20 focus:border-[#0077b6] transition resize-none bg-white"
                  placeholder="Mô tả kinh nghiệm, các chủ đề bạn hỗ trợ phỏng vấn thử và lời khuyên cho ứng viên..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          {/* RIGHT */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 shadow-2xs space-y-5">
              <h3 className="text-base font-bold text-[#0f172a] border-b border-[#e2e8f0] pb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#10b981]" />
                Bằng Cấp & Chứng Chỉ Xác Minh
              </h3>

              {/* ── Verification Image (single) ── */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#0f172a] flex items-center gap-1.5">
                  <ImageIcon size={13} className="text-[#0077b6]" />
                  Ảnh Bằng Cấp / Thẻ Nhân Viên
                  <span className="font-normal text-[#64748b]">
                    (1 ảnh đại diện)
                  </span>
                </p>

                {/* Saved image */}
                {savedImage && !pendingImage && (
                  <div className="relative group w-full rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#f8fafc] shadow-2xs">
                    <a
                      href={savedImage}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={savedImage}
                        alt="Verification"
                        className="w-full h-36 object-cover"
                      />
                      <div className="absolute inset-0 bg-[#0f172a]/0 group-hover:bg-[#0f172a]/30 transition flex items-center justify-center">
                        <ExternalLink
                          size={18}
                          className="text-white opacity-0 group-hover:opacity-100 transition"
                        />
                      </div>
                    </a>
                    <button
                      type="button"
                      onClick={handleDeleteSavedImage}
                      disabled={deleteImageMutation.isPending}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 border border-red-200 text-red-500 rounded-lg p-1.5 shadow-sm transition opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      {deleteImageMutation.isPending ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                    <span className="absolute bottom-0 inset-x-0 bg-[#10b981] text-white text-[10px] font-bold text-center py-0.5">
                      ĐÃ XÁC MINH ✓
                    </span>
                  </div>
                )}

                {/* Pending image preview */}
                {pendingImage && (
                  <div className="relative group w-full rounded-xl overflow-hidden border-2 border-[#fde68a] bg-[#fef3c7]/30 shadow-2xs">
                    <img
                      src={pendingImage.previewUrl}
                      alt="Preview"
                      className="w-full h-36 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removePendingImage}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 border border-red-200 text-red-500 rounded-lg p-1.5 shadow transition"
                      title="Remove"
                    >
                      <X size={13} />
                    </button>
                    <span className="absolute bottom-0 inset-x-0 bg-[#d97706] text-white text-[10px] font-bold text-center py-0.5">
                      ĐANG CHỜ TẢI LÊN
                    </span>
                  </div>
                )}

                {/* No image: upload button */}
                {!hasImage && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full h-28 rounded-xl border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] hover:border-[#bae6fd] hover:bg-[#f0f7ff] text-[#64748b] hover:text-[#0077b6] flex flex-col items-center justify-center gap-2 transition text-xs font-semibold"
                  >
                    <ImageIcon size={22} />
                    Bấm để tải lên ảnh xác minh bằng cấp
                  </button>
                )}

                {/* Change image if already has one */}
                {hasImage && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-[#e2e8f0] rounded-xl text-xs font-bold text-[#0f172a] bg-white hover:bg-[#f8fafc] hover:border-[#bae6fd] transition"
                  >
                    <Upload size={12} />
                    Thay Đổi Ảnh
                  </button>
                )}

                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>

              {/* Divider */}
              <div className="border-t border-[#e2e8f0]" />

              {/* ── Verification Documents (up to 3) ── */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#0f172a] flex items-center gap-1.5">
                  <FileText size={13} className="text-[#0077b6]" />
                  Tài Liệu & Chứng Chỉ Khác
                  <span className="ml-auto text-[10px] font-semibold text-[#64748b]">
                    {savedDocs.length + pendingDocs.length}/3
                  </span>
                </p>

                {/* Saved documents */}
                {savedDocs.length > 0 && (
                  <div className="space-y-1.5">
                    {savedDocs.map((docUrl, idx) => {
                      const isImg = isImageUrl(docUrl);
                      return (
                        <div
                          key={idx}
                          className="group flex items-center gap-3 p-2.5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#f0f7ff] hover:border-[#bae6fd] transition"
                        >
                          {isImg ? (
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-[#e2e8f0] shrink-0">
                              <img
                                src={docUrl}
                                alt="Credential"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd] flex items-center justify-center shrink-0">
                              <FileText size={16} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#0f172a] truncate">
                              Chứng chỉ #{idx + 1}
                            </p>
                            <p className="text-[10px] text-[#64748b] uppercase font-bold tracking-wider">
                              {isImg ? "Hình ảnh" : "Tài liệu / PDF"}
                            </p>
                          </div>
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#64748b] hover:text-[#0077b6] transition p-1"
                            title="Xem chi tiết"
                          >
                            <ExternalLink size={13} />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteSavedDoc(idx)}
                            disabled={deleteDocMutation.isPending}
                            className="text-[#64748b] hover:text-red-500 hover:bg-red-50 transition p-1 rounded-lg"
                            title="Xóa"
                          >
                            {deleteDocMutation.isPending ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pending docs */}
                {pendingDocs.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-[#d97706] uppercase tracking-wider flex items-center gap-1 mt-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                      Đang chờ — sẽ tải lên khi bấm Lưu
                    </p>
                    {pendingDocs.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-[#fde68a] bg-[#fef3c7]/40"
                      >
                        {item.previewUrl ? (
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-white border border-[#e2e8f0] shrink-0">
                            <img
                              src={item.previewUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-white text-[#64748b] border border-[#e2e8f0] flex items-center justify-center shrink-0">
                            <FileText size={16} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#0f172a] truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-[#d97706] font-bold uppercase tracking-wider">
                            Chờ lưu
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePendingDoc(idx)}
                          className="text-[#64748b] hover:text-red-500 transition shrink-0 p-1 rounded-lg hover:bg-red-50"
                          title="Hủy"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {savedDocs.length === 0 && pendingDocs.length === 0 && (
                  <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-4 text-center text-[#64748b] text-xs bg-[#f8fafc]">
                    <AlertCircle
                      className="mx-auto text-[#0077b6] mb-1.5"
                      size={18}
                    />
                    Chưa có tài liệu xác minh nào được tải lên.
                  </div>
                )}

                {/* Upload button */}
                {canUploadMoreDocs && (
                  <>
                    <input
                      type="file"
                      ref={docInputRef}
                      onChange={handleDocSelect}
                      accept="image/*,application/pdf"
                      multiple
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-xs font-bold text-[#0f172a] hover:bg-[#f0f7ff] hover:border-[#bae6fd] hover:text-[#0077b6] transition shadow-2xs active:scale-95 bg-white"
                    >
                      <Plus size={13} />
                      {pendingDocs.length > 0
                        ? "Thêm Tài Liệu Khác"
                        : "Tải Bằng Cấp / Chứng Chỉ"}
                    </button>
                    <p className="text-[10px] text-[#64748b] text-center font-medium">
                      Còn {3 - savedDocs.length - pendingDocs.length} vị trí ·
                      chấp nhận file Ảnh hoặc PDF
                    </p>
                  </>
                )}
                {!canUploadMoreDocs && (
                  <p className="text-[10px] text-[#64748b] text-center font-medium">
                    Đã đạt tối đa 3 tài liệu.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Expertise & Skills — full width ── */}
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
              <UserCheck size={18} className="text-[#0077b6]" />
              Kỹ Năng & Lĩnh Vực Đánh Giá
            </h3>
            <p className="text-xs text-[#64748b] mt-1 font-medium">
              Chọn tối đa 5 kỹ năng chuyên môn bạn sẵn sàng đánh giá và phỏng
              vấn ứng viên.
            </p>
          </div>
          <SkillGroupSelector
            skills={skills}
            selectedIds={form.subcategoryIds}
            onToggle={toggleSkill}
          />
        </div>

        {/* ── Row 3: Availability Calendar — full width ── */}
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
            <Clock size={18} className="text-[#0077b6]" />
            Cấu Hình Lịch Rảnh Theo Tuần
          </h3>
          <AvailabilityGrid
            value={form.availabilities}
            onChange={(availabilities) =>
              setForm((current) => ({ ...current, availabilities }))
            }
          />
        </div>

        {/* ── Submit Bar ── */}
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-5 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-[#10b981]" />
            <span className="text-xs text-[#64748b] font-bold">
              {pendingCount > 0
                ? `${pendingCount} file sẽ tự động tải lên khi bạn nhấn Lưu`
                : "Kiểm tra lại thông tin trước khi lưu hồ sơ"}
            </span>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-xs font-bold text-white bg-[#ff6b35] hover:bg-[#e85d04] shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu Hồ Sơ"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
