import { useMemo, useState, useRef } from "react";
import {
  useSaveMyInterviewProfile,
  useUploadInterviewerDocuments,
  useUploadVerificationImage,
  useDeleteVerificationImage,
  useDeleteVerificationDocument,
} from "@/hooks/interview/useInterviewApi";
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

  const saveProfileMutation = useSaveMyInterviewProfile();
  const uploadDocsMutation = useUploadInterviewerDocuments();
  const uploadImageMutation = useUploadVerificationImage();
  const deleteImageMutation = useDeleteVerificationImage();
  const deleteDocMutation = useDeleteVerificationDocument();

  const docInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const toggleSkill = (id) => {
    setForm((current) => {
      const exists = current.subcategoryIds.includes(id);
      if (!exists && current.subcategoryIds.length >= 5) {
        toast.error("Choose up to 5 skills");
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
      toast.error("Only image files are allowed for verification image");
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
        `Max 3 documents total. ${3 - savedCount - pendingCount} slot(s) remaining.`,
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
      toast.error("Please select at least one skill");
      return;
    }

    setIsSaving(true);
    try {
      await saveProfileMutation.mutateAsync({
        title: form.title.trim(),
        company: form.company.trim(),
        yearsExperience:
          form.yearsExperience === "" ? null : Number(form.yearsExperience),
        subcategoryIds: form.subcategoryIds,
        description: form.description,
        availabilities: form.availabilities,
      });

      if (pendingImage) {
        await uploadImageMutation.mutateAsync(pendingImage.file);
        URL.revokeObjectURL(pendingImage.previewUrl);
        setPendingImage(null);
      }

      if (pendingDocs.length > 0) {
        await uploadDocsMutation.mutateAsync(pendingDocs.map((p) => p.file));
        pendingDocs.forEach((p) => {
          if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
        });
        setPendingDocs([]);
      }
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
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6 h-full">
              <h3 className="text-base font-bold text-slate-800 border-b pb-3 flex items-center gap-2">
                <Briefcase size={18} className="text-indigo-500" />
                Professional Experience
              </h3>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">
                  Professional Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  placeholder="e.g. Senior Fullstack Engineer, Tech Lead"
                  value={form.title}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Company */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Current Company
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    placeholder="e.g. Google, FPT Software"
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
                  <label className="text-sm font-semibold text-slate-700 block">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="80"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    placeholder="e.g. 5"
                    value={form.yearsExperience}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        yearsExperience: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">
                  Detailed Biography &amp; Expertise
                </label>
                <textarea
                  rows={7}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                  placeholder="Describe your background, what topics you can interview candidates on, and tips for interviewees..."
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
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-800 border-b pb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                Credentials &amp; Certificates
              </h3>

              {/* ── Verification Image (single) ── */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <ImageIcon size={13} className="text-indigo-500" />
                  Verification Image
                  <span className="font-normal text-slate-400">
                    (1 ảnh đại diện bằng cấp)
                  </span>
                </p>

                {/* Saved image */}
                {savedImage && !pendingImage && (
                  <div className="relative group w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
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
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition flex items-center justify-center">
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
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 border border-red-200 text-red-500 rounded-lg p-1.5 shadow transition opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      {deleteImageMutation.isPending ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                    <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[10px] font-bold text-center py-0.5">
                      VERIFIED ✓
                    </span>
                  </div>
                )}

                {/* Pending image preview */}
                {pendingImage && (
                  <div className="relative group w-full rounded-xl overflow-hidden border-2 border-amber-300 bg-amber-50 shadow-sm">
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
                    <span className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-white text-[10px] font-bold text-center py-0.5">
                      PENDING UPLOAD
                    </span>
                  </div>
                )}

                {/* No image: upload button */}
                {!hasImage && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full h-28 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40 text-slate-400 hover:text-indigo-500 flex flex-col items-center justify-center gap-2 transition text-xs font-medium"
                  >
                    <ImageIcon size={22} />
                    Click to upload verification image
                  </button>
                )}

                {/* Change image if already has one */}
                {hasImage && (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition"
                  >
                    <Upload size={12} />
                    Replace Image
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
              <div className="border-t border-slate-100" />

              {/* ── Verification Documents (up to 3) ── */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <FileText size={13} className="text-indigo-500" />
                  Documents &amp; Certificates
                  <span className="ml-auto text-[10px] font-normal text-slate-400">
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
                          className="group flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition"
                        >
                          {isImg ? (
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border shrink-0">
                              <img
                                src={docUrl}
                                alt="Credential"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-500 border border-indigo-100 flex items-center justify-center shrink-0">
                              <FileText size={16} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-700 truncate">
                              Credential #{idx + 1}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                              {isImg ? "Image" : "Document / PDF"}
                            </p>
                          </div>
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-300 hover:text-indigo-500 transition p-1"
                            title="View"
                          >
                            <ExternalLink size={13} />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteSavedDoc(idx)}
                            disabled={deleteDocMutation.isPending}
                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition p-1 rounded-lg"
                            title="Delete"
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
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1 mt-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Pending — uploads on Save
                    </p>
                    {pendingDocs.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-amber-100 bg-amber-50/50"
                      >
                        {item.previewUrl ? (
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border shrink-0">
                            <img
                              src={item.previewUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center shrink-0">
                            <FileText size={16} />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                            Pending upload
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePendingDoc(idx)}
                          className="text-slate-400 hover:text-red-500 transition shrink-0 p-1 rounded-lg hover:bg-red-50"
                          title="Remove"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {savedDocs.length === 0 && pendingDocs.length === 0 && (
                  <div className="border-2 border-dashed border-slate-100 rounded-xl p-4 text-center text-slate-400 text-xs bg-slate-50/50">
                    <AlertCircle
                      className="mx-auto text-slate-300 mb-1.5"
                      size={18}
                    />
                    No documents uploaded yet.
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
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm active:scale-95"
                    >
                      <Plus size={13} />
                      {pendingDocs.length > 0
                        ? "Add More Documents"
                        : "Upload Documents / Certificates"}
                    </button>
                    <p className="text-[10px] text-slate-400 text-center">
                      {3 - savedDocs.length - pendingDocs.length} slot(s)
                      remaining · images or PDFs
                    </p>
                  </>
                )}
                {!canUploadMoreDocs && (
                  <p className="text-[10px] text-slate-400 text-center font-medium">
                    Maximum 3 documents reached.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Expertise & Skills — full width ── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <UserCheck size={18} className="text-indigo-500" />
              Expertise &amp; Skills
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select up to 5 categories you are comfortable interviewing
              candidates on.
            </p>
          </div>
          <SkillGroupSelector
            skills={skills}
            selectedIds={form.subcategoryIds}
            onToggle={toggleSkill}
          />
        </div>

        {/* ── Row 3: Availability Calendar — full width ── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" />
            Calendar Settings — Weekly Availability
          </h3>
          <AvailabilityGrid
            value={form.availabilities}
            onChange={(availabilities) =>
              setForm((current) => ({ ...current, availabilities }))
            }
          />
        </div>

        {/* ── Submit Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-500" />
            <span className="text-xs text-slate-500 font-semibold">
              {pendingCount > 0
                ? `${pendingCount} file(s) will upload when you save`
                : "Verify all details before saving"}
            </span>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
