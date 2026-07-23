import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  User as UserIcon, 
  Mail, 
  Award, 
  Calendar, 
  Camera, 
  Loader2, 
  Edit3, 
  Check, 
  X,
  KeyRound
} from "lucide-react";
import { useUserProfile, useUpdateUserProfile, useUploadUserAvatar } from "@/hooks/user/useUserApi";

export default function ProfilePage() {
  const { data: user, isLoading: isProfileLoading } = useUserProfile();
  const updateMutation = useUpdateUserProfile();
  const uploadAvatarMutation = useUploadUserAvatar();

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const fileInputRef = useRef(null);

  // Sync state with fetched user data
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    updateMutation.mutate(
      { username, bio },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };

  const handleCancel = () => {
    if (user) {
      setUsername(user.username || "");
      setBio(user.bio || "");
    }
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatarMutation.mutate(file);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#0077b6]" />
      </div>
    );
  }

  // Format creation date
  const joinedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Mới tham gia";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#0077b6]">Quản Lý Tài Khoản</p>
        <h1 className="mt-1 text-3xl font-extrabold text-[#0f172a] tracking-tight">
          Hồ Sơ Cá Nhân
        </h1>
        <p className="text-[#64748b] mt-1 text-sm">
          Cập nhật ảnh đại diện, thông tin cá nhân, tiểu sử và xem điểm thưởng của bạn.
        </p>
      </div>

      {/* Profile Card & Info */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] overflow-hidden transition-all hover:shadow-lg">
        {/* Banner with brand blue gradient */}
        <div className="h-36 bg-gradient-to-r from-[#1e6091] via-[#0077b6] to-[#0096c7] relative">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0))]" />
        </div>

        {/* Profile Info Overlay Row */}
        <div className="px-8 pb-6 relative flex flex-col md:flex-row md:items-end justify-between -mt-16 gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
            {/* Avatar block */}
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-[#f8fafc] relative">
                <img 
                  src={user?.avatarUrl || "https://via.placeholder.com/128"} 
                  alt="Avatar" 
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                
                {/* Upload overlay */}
                <div className="absolute inset-0 bg-[#0f172a]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white w-8 h-8 drop-shadow-sm" />
                </div>

                {/* Local Loader overlay */}
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0077b6]" />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Title & Email info */}
            <div className="text-center md:text-left space-y-1">
              <h2 className="text-2xl font-bold text-[#0f172a] flex items-center gap-2 justify-center md:justify-start">
                {user?.username}
                <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd]">
                  {user?.role}
                </span>
              </h2>
              <p className="text-[#64748b] text-sm flex items-center justify-center md:justify-start gap-1.5 font-medium">
                <Mail size={14} className="text-[#0077b6]" />
                {user?.email}
              </p>
            </div>
          </div>

          {/* Quick Edit & Change Password Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#e2e8f0] rounded-xl text-xs font-bold text-[#0f172a] bg-white hover:bg-[#f0f7ff] hover:text-[#0077b6] hover:border-[#bae6fd] transition active:scale-95 shadow-2xs"
              >
                <Edit3 size={15} />
                Chỉnh Sửa Thông Tin
              </button>
            )}

            <Link
              to="/change-password"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-[#0077b6]/30 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0077b6] to-[#1e6091] hover:from-[#005f92] hover:to-[#174b72] transition active:scale-95 shadow-md shadow-[#0077b6]/20"
            >
              <KeyRound size={15} />
              Đổi Mật Khẩu
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: stats/details (points, role, calendar) */}
        <div className="space-y-6">
          {/* Points card */}
          <div className="bg-gradient-to-br from-[#1e6091] via-[#0077b6] to-[#0f172a] rounded-3xl p-6 text-white shadow-md border border-[#1e6091] relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-15 group-hover:scale-110 transition duration-300">
              <Award size={140} className="text-[#0077b6]" />
            </div>
            <p className="text-[#bae6fd] text-xs font-bold uppercase tracking-wider">Điểm Tích Lũy</p>
            <h3 className="text-4xl font-black mt-2 tracking-tight flex items-baseline gap-1 text-white">
              {user?.point || 0}
              <span className="text-sm font-medium text-[#e0f2fe]">pts</span>
            </h3>
            <p className="text-[#cbd5e1] text-xs mt-3 leading-relaxed">
              Tích lũy điểm thông qua bài kiểm tra thử và dùng điểm để đặt các ca phỏng vấn chuyên sâu với Interviewer.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] space-y-4">
            <h4 className="font-bold text-[#0f172a] text-sm border-b border-[#e2e8f0] pb-3">Chi Tiết Tài Khoản</h4>
            
            <div className="flex items-center gap-3 text-sm text-[#64748b]">
              <Award size={16} className="text-[#0077b6]" />
              <div>
                <p className="text-xs text-[#64748b]">Vai trò hệ thống</p>
                <p className="font-bold text-[#0f172a]">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#64748b]">
              <Calendar size={16} className="text-[#0077b6]" />
              <div>
                <p className="text-xs text-[#64748b]">Ngày tham gia</p>
                <p className="font-bold text-[#0f172a]">{joinedDate}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e2e8f0]">
              <Link
                to="/change-password"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f0f7ff] hover:bg-[#e0f2fe] text-[#0077b6] text-xs font-bold transition"
              >
                <span className="flex items-center gap-2">
                  <KeyRound size={16} />
                  Bảo Mật & Mật Khẩu
                </span>
                <span>Đổi →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right column: Form details (Username, bio, etc.) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.06)] space-y-6">
            <h3 className="text-lg font-bold text-[#0f172a]">Thiết Lập Thông Tin</h3>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Display Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0f172a] block">
                  Tên Hiển Thị (Username)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={100}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] font-medium focus:outline-none focus:ring-2 focus:ring-[#0077b6]/20 focus:border-[#0077b6] transition bg-white"
                    placeholder="Nhập tên hiển thị"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#0f172a] text-sm font-semibold">
                    <UserIcon size={16} className="text-[#0077b6]" />
                    {user?.username}
                  </div>
                )}
              </div>

              {/* Bio Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0f172a] block">
                  Tiểu Sử / Giới Thiệu
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    maxLength={200}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-xl border border-[#e2e8f0] px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0077b6]/20 focus:border-[#0077b6] transition resize-none bg-white"
                    placeholder="Viết lời giới thiệu ngắn về kinh nghiệm hoặc mục tiêu của bạn..."
                  />
                ) : (
                  <div className="min-h-[100px] px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#64748b] text-sm whitespace-pre-line leading-relaxed">
                    {user?.bio || "Chưa có lời giới thiệu nào."}
                  </div>
                )}
              </div>

              {/* Read-only Email Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#64748b] block">
                  Địa Chỉ Email (Chỉ đọc)
                </label>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[#64748b] text-sm font-medium">
                  <Mail size={16} className="text-[#0077b6]" />
                  {user?.email}
                </div>
              </div>

              {/* Action buttons (only in Edit mode) */}
              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e2e8f0]">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-xs font-bold text-[#64748b] bg-white hover:bg-[#f8fafc] transition active:scale-95 disabled:opacity-50"
                  >
                    <X size={15} />
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending || !username.trim()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#ff6b35] hover:bg-[#e85d04] shadow-md transition active:scale-95 disabled:opacity-50"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    Lưu Thay Đổi
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
