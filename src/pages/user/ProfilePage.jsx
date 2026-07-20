import { useState, useRef, useEffect } from "react";
import { 
  User as UserIcon, 
  Mail, 
  Award, 
  Calendar, 
  Camera, 
  Loader2, 
  Edit3, 
  Check, 
  X 
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
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
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
    : "Recently";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">User Dashboard</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
          My Account Profile
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage your personal details, avatar, credentials, and achievements.
        </p>
      </div>

      {/* Profile Card & Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
        {/* Banner with modern gradient */}
        <div className="h-36 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0))]" />
        </div>

        {/* Profile Info Overlay Row */}
        <div className="px-8 pb-6 relative flex flex-col md:flex-row md:items-end justify-between -mt-16 gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
            {/* Avatar block */}
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-slate-50 relative">
                <img 
                  src={user?.avatarUrl || "https://via.placeholder.com/128"} 
                  alt="Avatar" 
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                
                {/* Upload overlay */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white w-8 h-8 drop-shadow-sm" />
                </div>

                {/* Local Loader overlay */}
                {uploadAvatarMutation.isPending && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
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
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 justify-center md:justify-start">
                {user?.username}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                  {user?.role}
                </span>
              </h2>
              <p className="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-1">
                <Mail size={14} />
                {user?.email}
              </p>
            </div>
          </div>

          {/* Quick Edit Trigger Button */}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition active:scale-95"
            >
              <Edit3 size={15} />
              Edit Details
            </button>
          )}
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: stats/details (points, role, calendar) */}
        <div className="space-y-6">
          {/* Points card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition duration-300">
              <Award size={140} className="text-indigo-400" />
            </div>
            <p className="text-indigo-300/80 text-xs font-semibold uppercase tracking-wider">Total Earnings</p>
            <h3 className="text-4xl font-black mt-2 tracking-tight flex items-baseline gap-1">
              {user?.point || 0}
              <span className="text-sm font-medium text-indigo-300">pts</span>
            </h3>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed">
              Earn points by performing mock interviews, studying quizzes, and performing well!
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b pb-3">Account Details</h4>
            
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Award size={16} className="text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">User Role</p>
                <p className="font-semibold text-slate-800">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Calendar size={16} className="text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Joined Platform</p>
                <p className="font-semibold text-slate-800">{joinedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form details (Username, bio, etc.) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Profile Settings</h3>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Display Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">
                  Display Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    required
                    minLength={3}
                    maxLength={100}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                    placeholder="Enter username"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium">
                    <UserIcon size={16} className="text-slate-400" />
                    {user?.username}
                  </div>
                )}
              </div>

              {/* Bio Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">
                  Bio / Description
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    maxLength={200}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition resize-none"
                    placeholder="Write a brief intro about yourself..."
                  />
                ) : (
                  <div className="min-h-[100px] px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                    {user?.bio || "No description provided yet."}
                  </div>
                )}
              </div>

              {/* Read-only Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 block">
                  Email Address (Read-only)
                </label>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50/50 border border-slate-100/50 rounded-xl text-slate-400 text-sm">
                  <Mail size={16} className="text-slate-300" />
                  {user?.email}
                </div>
              </div>

              {/* Action buttons (only in Edit mode) */}
              {isEditing && (
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={updateMutation.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 transition active:scale-95 disabled:opacity-50"
                  >
                    <X size={15} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending || !username.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition active:scale-95 disabled:opacity-50"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    Save Changes
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
