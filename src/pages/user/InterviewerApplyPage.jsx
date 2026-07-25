import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/auth/useAuth";
import {
  fetchMyInterviewProfile,
  saveMyInterviewProfile,
  uploadInterviewerDocuments,
  uploadVerificationImage,
} from "../../api/interviews";
import { fetchCategoryBrowse } from "../../api/categories";
import { useToast } from "../../context/ToastContext";
import {
  Award,
  FileText,
  Check,
  Upload,
  CheckCircle2,
  Building,
  Briefcase,
  Layers,
  Clock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function InterviewerApplyPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: user } = useAuth();

  const [step, setStep] = useState(1); // 1: Info, 2: Skills, 3: Files

  // Form states
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [yearsExperience, setYearsExperience] = useState(3);
  const [description, setDescription] = useState("");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [verificationImage, setVerificationImage] = useState(null);
  const [verificationDocs, setVerificationDocs] = useState([]);

  // Fetch current user's profile to check if already applied
  const { data: profile, error: profileError } = useQuery({
    queryKey: ["my-interview-profile"],
    queryFn: fetchMyInterviewProfile,
    retry: false, // 404 is expected for new applicants
  });

  // Fetch subcategories
  const { data: categoriesData = [] } = useQuery({
    queryKey: ["categories-browse"],
    queryFn: async () => {
      const res = await fetchCategoryBrowse();
      return res?.data || res || [];
    },
  });

  // Mutations
  const submitApplicationMutation = useMutation({
    mutationFn: async () => {
      // 1. Save profile details
      const profilePayload = {
        title,
        company,
        yearsExperience,
        description,
        subcategoryIds: selectedSubcategories,
        pointsRequired: 20, // Default fee
        availabilities: [], // Default slots
      };
      const savedProfile = await saveMyInterviewProfile(profilePayload);
      const profileData = savedProfile?.data || savedProfile;

      // 2. Upload face image if selected
      if (verificationImage) {
        await uploadVerificationImage(verificationImage);
      }

      // 3. Upload CV documents if selected
      if (verificationDocs.length > 0) {
        await uploadInterviewerDocuments(verificationDocs);
      }

      return profileData;
    },
    onSuccess: () => {
      toast.success(
        "Nộp đơn ứng tuyển thành công! Vui lòng chờ Admin xét duyệt.",
      );
      queryClient.invalidateQueries({ queryKey: ["my-interview-profile"] });
    },
    onError: (err) => {
      toast.error(err.message || "Có lỗi xảy ra khi nộp đơn ứng tuyển.");
    },
  });

  const isApplied = profileError ? false : !!profile;

  // Render pending state
  if (isApplied) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-10 text-center space-y-6 shadow-xl shadow-slate-100/50">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Clock size={40} />
          </div>

          <h2 className="text-3xl font-extrabold text-slate-900">
            Hồ sơ ứng tuyển đang chờ phê duyệt
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto leading-relaxed">
            Hệ thống đã nhận được đơn ứng tuyển làm Chuyên gia phỏng vấn của
            bạn. Ban quản trị đang tiến hành xác minh CV và hồ sơ kinh nghiệm
            của bạn. Kết quả sẽ được thông báo sớm nhất.
          </p>

          <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left space-y-3 text-sm">
            <p>
              <strong className="text-brand-600">Vị trí chuyên môn:</strong>{" "}
              {profile.title}
            </p>
            <p>
              <strong className="text-brand-600">Công ty hiện tại:</strong>{" "}
              {profile.company}
            </p>
            <p>
              <strong className="text-brand-600">Số năm kinh nghiệm:</strong>{" "}
              {profile.yearsExperience} năm
            </p>
            {profile.subcategories && (
              <p>
                <strong className="text-brand-600">Kỹ năng ứng tuyển:</strong>{" "}
                {profile.subcategories.map((s) => s.name).join(", ")}
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              to="/dashboard"
              className="bg-[#0077b6] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-600 transition shadow-lg shadow-brand-100 block text-center"
            >
              Quay lại Bảng điều khiển
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Next / Prev step controllers
  const handleNextStep = () => {
    if (step === 1) {
      if (!title.trim() || !company.trim() || !description.trim()) {
        toast.warning("Vui lòng nhập đầy đủ thông tin chuyên môn!");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (selectedSubcategories.length === 0) {
        toast.warning("Vui lòng chọn ít nhất 1 kỹ năng thế mạnh!");
        return;
      }
      setStep(3);
    }
  };

  const handleSubcategoryToggle = (id) => {
    if (selectedSubcategories.includes(id)) {
      setSelectedSubcategories(
        selectedSubcategories.filter((sId) => sId !== id),
      );
    } else {
      if (selectedSubcategories.length >= 5) {
        toast.warning("Chỉ được chọn tối đa 5 kỹ năng công nghệ!");
        return;
      }
      setSelectedSubcategories([...selectedSubcategories, id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!verificationImage && verificationDocs.length === 0) {
      toast.warning(
        "Vui lòng tải lên ảnh chân dung hoặc CV đính kèm để xác thực!",
      );
      return;
    }
    submitApplicationMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-[2rem] border border-[#e2e8f0] p-8 sm:p-12 shadow-2xl shadow-slate-100/50 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ff6b35] bg-[#fff7ed] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Award size={14} /> Trở thành Mentor / Interviewer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Đăng Ký Hồ Sơ Ứng Tuyển
          </h1>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Hãy chia sẻ kinh nghiệm thực chiến của bạn để hỗ trợ cộng đồng lập
            trình viên Việt và kiếm thêm thu nhập xứng đáng.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
          {[
            { num: 1, label: "Thông tin" },
            { num: 2, label: "Kỹ năng" },
            { num: 3, label: "Xác minh" },
          ].map((s) => (
            <div
              key={s.num}
              className="flex items-center gap-2 flex-1 last:flex-none"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? "bg-[#0077b6] text-white ring-4 ring-[#0077b6]/20"
                    : step > s.num
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > s.num ? <Check size={14} /> : s.num}
              </div>
              <span
                className={`text-xs font-bold ${step === s.num ? "text-[#0f172a]" : "text-slate-400"}`}
              >
                {s.label}
              </span>
              {s.num < 3 && <div className="h-0.5 bg-slate-100 flex-1" />}
            </div>
          ))}
        </div>

        {submitApplicationMutation.isPending ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#0077b6] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700">
              Đang lưu trữ hồ sơ và upload tài liệu xác minh...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Tên hiển thị
                    </label>
                    <input
                      type="text"
                      value={user?.username || ""}
                      disabled
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Địa chỉ Email
                    </label>
                    <input
                      type="text"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Chức danh chuyên môn{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase
                        size={16}
                        className="absolute left-3.5 top-3.5 text-slate-400"
                      />
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ví dụ: Senior Frontend Engineer, Tech Lead..."
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:outline-none focus:border-brand-500 rounded-xl text-sm text-slate-900 transition"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Công ty hiện tại <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building
                        size={16}
                        className="absolute left-3.5 top-3.5 text-slate-400"
                      />
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ví dụ: VNG Corp, FPT Software..."
                        className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:outline-none focus:border-brand-500 rounded-xl text-sm text-slate-900 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Số năm kinh nghiệm làm việc thực tế:{" "}
                    <span className="text-brand-600 font-extrabold">
                      {yearsExperience} năm
                    </span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={yearsExperience}
                    onChange={(e) =>
                      setYearsExperience(parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>1 năm</span>
                    <span>5 năm</span>
                    <span>10 năm</span>
                    <span>15 năm</span>
                    <span>20 năm+</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Giới thiệu bản thân & Lý do ứng tuyển{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows="5"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả ngắn gọn về kinh nghiệm, các công nghệ bạn thành thạo, dự án tiêu biểu và động lực muốn làm người phỏng vấn thử trên DevPrep..."
                    className="w-full p-4 border border-slate-200 focus:outline-none focus:border-brand-500 rounded-2xl text-sm text-slate-900 transition resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 bg-[#0077b6] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-brand-600 transition shadow-lg shadow-brand-100 cursor-pointer"
                  >
                    Tiếp tục bước tiếp theo
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Skills Selection */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-[#f0f7ff] border border-[#bae6fd] p-5 rounded-2xl text-xs text-[#0077b6] space-y-1">
                  <p className="font-bold">Lưu ý khi chọn Kỹ năng:</p>
                  <p>
                    • Hãy chọn các kỹ năng thuộc lĩnh vực chuyên môn mạnh nhất
                    của bạn.
                  </p>
                  <p>
                    • Bạn được chọn tối đa **5 kỹ năng** công nghệ thế mạnh.
                  </p>
                  <p>
                    • Ứng viên sẽ lọc và đặt lịch hẹn phỏng vấn thử với bạn dựa
                    trên các kỹ năng này.
                  </p>
                </div>

                <div className="space-y-6">
                  {categoriesData.map((category) => (
                    <div key={category.id} className="space-y-3">
                      <h4 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                        <Layers size={15} className="text-[#ff6b35]" />
                        {category.name}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {category.subCategories?.map((sub) => {
                          const isSelected = selectedSubcategories.includes(
                            sub.id,
                          );
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => handleSubcategoryToggle(sub.id)}
                              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                                isSelected
                                  ? "bg-brand-50 border-brand-500 text-brand-600 shadow-2xs"
                                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <span>{sub.name}</span>
                              {isSelected && (
                                <Check size={14} className="text-brand-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft size={16} /> Quay lại
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 bg-[#0077b6] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-brand-600 transition shadow-lg shadow-brand-100 cursor-pointer"
                  >
                    Tiếp tục bước tiếp theo
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Verification Uploads */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Avatar upload */}
                  <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center space-y-4">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto shadow-xs border border-slate-100">
                      <Upload className="text-slate-400" size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Ảnh chân dung xác thực
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Ảnh chân dung rõ mặt, lịch sự (JPG, PNG)
                      </p>
                    </div>

                    <input
                      type="file"
                      id="face-image"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setVerificationImage(file);
                      }}
                    />
                    <label
                      htmlFor="face-image"
                      className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-50 transition shadow-2xs inline-block cursor-pointer"
                    >
                      {verificationImage
                        ? "Thay thế ảnh đã chọn"
                        : "Tải ảnh lên"}
                    </label>

                    {verificationImage && (
                      <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 justify-center">
                        <CheckCircle2 size={13} /> {verificationImage.name}
                      </p>
                    )}
                  </div>

                  {/* Documents upload */}
                  <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center space-y-4">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto shadow-xs border border-slate-100">
                      <FileText className="text-slate-400" size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        CV & Bằng cấp liên quan
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Tải lên tối đa 3 tài liệu dạng PDF, ZIP, DOCX
                      </p>
                    </div>

                    <input
                      type="file"
                      id="cv-docs"
                      multiple
                      accept=".pdf,.zip,.docx,.doc"
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        if (files.length > 3) {
                          toast.warning(
                            "Chỉ được tải lên tối đa 3 tệp đính kèm!",
                          );
                          return;
                        }
                        setVerificationDocs(files);
                      }}
                    />
                    <label
                      htmlFor="cv-docs"
                      className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-50 transition shadow-2xs inline-block cursor-pointer"
                    >
                      {verificationDocs.length > 0
                        ? "Thay thế tệp đã chọn"
                        : "Tải tệp lên"}
                    </label>

                    {verificationDocs.length > 0 && (
                      <div className="space-y-1">
                        {verificationDocs.map((doc, idx) => (
                          <p
                            key={idx}
                            className="text-xs text-emerald-600 font-bold flex items-center gap-1 justify-center"
                          >
                            <CheckCircle2 size={13} /> {doc.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ArrowLeft size={16} /> Quay lại
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 cursor-pointer"
                  >
                    Nộp đơn ứng tuyển ngay
                    <Check size={16} />
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
