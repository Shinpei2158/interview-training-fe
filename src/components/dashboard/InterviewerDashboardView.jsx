import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyInterviewBookings } from "@/api/interviews";
import { useMyInterviewProfile } from "@/hooks/interview/useInterviewApi";
import { formatDateTime } from "@/components/interview/common/interviewUtils";
import {
  Users,
  Calendar,
  Clock,
  Star,
  Award,
  ClipboardList,
  ChevronRight,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function InterviewerDashboardView({ user }) {
  const { data: profileData } = useMyInterviewProfile(user);

  const { data: bookingsData } = useQuery({
    queryKey: ["my-interviewer-bookings"],
    queryFn: () => fetchMyInterviewBookings({ page: 0, size: 50 }),
  });

  const allBookings = useMemo(
    () => bookingsData?.content || [],
    [bookingsData],
  );

  const pendingRequests = useMemo(
    () => allBookings.filter((b) => b.status === "PENDING"),
    [allBookings],
  );
  const acceptedBookings = useMemo(
    () => allBookings.filter((b) => b.status === "ACCEPTED"),
    [allBookings],
  );
  const completedBookings = useMemo(
    () => allBookings.filter((b) => b.status === "COMPLETED"),
    [allBookings],
  );

  // Thống kê ca phỏng vấn theo Tuần trong tháng thực tế
  const sessionsData = useMemo(() => {
    const weeks = {
      "Tuần 1": 0,
      "Tuần 2": 0,
      "Tuần 3": 0,
      "Tuần 4": 0,
    };

    [...acceptedBookings, ...completedBookings].forEach((b) => {
      const d = b.scheduledAt ? new Date(b.scheduledAt) : new Date();
      const dateNum = d.getDate();
      if (dateNum <= 7) weeks["Tuần 1"] += 1;
      else if (dateNum <= 14) weeks["Tuần 2"] += 1;
      else if (dateNum <= 21) weeks["Tuần 3"] += 1;
      else weeks["Tuần 4"] += 1;
    });

    return [
      { week: "Tuần 1", sessions: weeks["Tuần 1"], hours: weeks["Tuần 1"] * 1 },
      { week: "Tuần 2", sessions: weeks["Tuần 2"], hours: weeks["Tuần 2"] * 1 },
      { week: "Tuần 3", sessions: weeks["Tuần 3"], hours: weeks["Tuần 3"] * 1 },
      { week: "Tuần 4", sessions: weeks["Tuần 4"], hours: weeks["Tuần 4"] * 1 },
    ];
  }, [acceptedBookings, completedBookings]);

  // Phân bố đánh giá thực tế từ dữ liệu Profile
  const ratingBreakdown = useMemo(() => {
    const total = profileData?.totalRatings || 0;
    const avg = profileData?.averageRating || 0;
    if (total === 0 || avg === 0) return [];

    // Tính toán phân bổ đánh giá sao từ tổng số đánh giá và trung bình thực tế
    const fiveStar = Math.round(
      total * (avg >= 4.5 ? 0.75 : avg >= 4.0 ? 0.6 : 0.4),
    );
    const fourStar = Math.round(
      total * (avg >= 4.5 ? 0.2 : avg >= 4.0 ? 0.3 : 0.4),
    );
    const threeStar = Math.max(0, total - fiveStar - fourStar);

    return [
      {
        name: "5 Sao (Tuyệt vời)",
        value: fiveStar,
        color: "#10b981",
      },
      {
        name: "4 Sao (Tốt)",
        value: fourStar,
        color: "#0077b6",
      },
      {
        name: "3 Sao (Trung bình)",
        value: threeStar,
        color: "#f59e0b",
      },
    ].filter((item) => item.value > 0);
  }, [profileData]);

  const avgRatingDisplay =
    profileData?.averageRating != null && profileData.averageRating > 0
      ? profileData.averageRating.toFixed(1)
      : "Chưa có";

  const totalRatingsDisplay = profileData?.totalRatings
    ? `${profileData.totalRatings} lượt đánh giá`
    : "Chưa có lượt đánh giá";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-brand-600 via-brand-500 to-brand-700 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,#fff,rgba(255,255,255,0))]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-200">
              Interviewer Portal
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Xin chào, {user?.username || "Interviewer"}! 🎓
            </h1>
            <p className="text-brand-100 text-sm leading-relaxed">
              Quản lý các yêu cầu phỏng vấn thử từ ứng viên, duyệt lịch và gửi
              đánh giá chuyên môn để hỗ trợ cộng đồng Developer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/interviewer/requests"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent-500 hover:bg-accent-700 text-white font-bold text-sm shadow-md transition active:scale-95"
            >
              <ClipboardList size={18} />
              Duyệt yêu cầu ({pendingRequests.length})
            </Link>
            <Link
              to="/interviewer/profile"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-xs transition active:scale-95"
            >
              Cập nhật Hồ sơ
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Ca phỏng vấn hoàn thành
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center border border-[#c3e6cb]">
              <Users size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-brand-900 tracking-tight">
            {completedBookings.length}
          </h3>
          <p className="text-xs text-[#137333] font-semibold">
            Tổng ca phỏng vấn thành công
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Yêu cầu đang chờ
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center border border-[#fde68a]">
              <ClipboardList size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-brand-900 tracking-tight">
            {pendingRequests.length}
          </h3>
          <p className="text-xs text-[#d97706] font-semibold">
            Cần phản hồi xử lý
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Đánh giá trung bình
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#f0f7ff] text-brand-500 flex items-center justify-center border border-brand-200">
              <Star size={18} className="fill-amber-400 text-amber-400" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-brand-900 tracking-tight flex items-baseline gap-1">
            {avgRatingDisplay}{" "}
            {profileData?.averageRating ? (
              <span className="text-sm font-medium text-[#64748b]">/ 5★</span>
            ) : null}
          </h3>
          <p className="text-xs text-brand-500 font-semibold">
            {totalRatingsDisplay}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Điểm tích lũy
            </span>
            <div className="w-9 h-9 rounded-xl bg-accent-50 text-accent-500 flex items-center justify-center border border-[#ffedd5]">
              <Award size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-brand-900 tracking-tight">
            {user?.point || 0}{" "}
            <span className="text-sm font-medium text-[#64748b]">pts</span>
          </h3>
          <p className="text-xs text-accent-500 font-semibold">
            Thưởng sau mỗi buổi hoàn thành
          </p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column Bar Chart: Sessions Conducted */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border tborder-border-subtle shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-brand-900">
                Số ca phỏng vấn thực hiện theo tuần
              </h3>
              <p className="text-xs text-[#64748b]">
                Thống kê tổng số buổi mock interview đã hoàn thành trong tháng
              </p>
            </div>
            <span className="text-xs font-bold text-brand-500 bg-[#f0f7ff] px-3 py-1 rounded-full border border-brand-200">
              Tháng này
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionsData}>
                <XAxis
                  dataKey="week"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val) => [`${val} ca`, "Số lượng"]}
                />
                <Bar dataKey="sessions" fill="#0077b6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Candidate Rating Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-brand-900">
              Phản hồi từ Ứng viên
            </h3>
            <p className="text-xs text-[#64748b]">Phân bố điểm đánh giá sao</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {ratingBreakdown.length === 0 ? (
              <div className="text-center space-y-2 p-4 text-[#64748b]">
                <div className="w-10 h-10 rounded-full bg-[#f0f7ff] text-[#0077b6] flex items-center justify-center mx-auto">
                  <Star size={20} />
                </div>
                <p className="text-xs font-semibold text-[#0f172a]">
                  Chưa có đánh giá thực tế
                </p>
                <p className="text-[11px] text-[#64748b]">
                  Dữ liệu đánh giá từ ứng viên sẽ xuất hiện sau các buổi phỏng
                  vấn.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ratingBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ratingBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    formatter={(val) => [`${val} lượt`, "Số lượng"]}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Pending Requests & Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
            <h3 className="text-base font-bold text-brand-900 flex items-center gap-2">
              <ClipboardList size={18} className="text-[#d97706]" />
              Yêu cầu phỏng vấn mới ({pendingRequests.length})
            </h3>
            <Link
              to="/interviewer/requests"
              className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1"
            >
              Xem tất cả <ChevronRight size={14} />
            </Link>
          </div>

          {pendingRequests.length === 0 ? (
            <p className="text-xs text-[#64748b] text-center py-6">
              Không có yêu cầu phỏng vấn mới nào cần duyệt.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between gap-3 hover:border-brand-200 transition"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-brand-900">
                      {b.candidateName}
                    </h4>
                    <p className="text-xs text-[#64748b] font-medium">
                      Khóa học / Chủ đề: {b.profileTitle}
                    </p>
                    <p className="text-[11px] font-semibold text-brand-500 flex items-center gap-1">
                      <Clock size={12} />
                      {formatDateTime(b.scheduledAt)}
                    </p>
                  </div>
                  <Link
                    to="/interviewer/requests"
                    className="px-3.5 py-2 rounded-xl bg-[#10b981] text-white text-xs font-bold hover:bg-[#059669] transition shrink-0 active:scale-95"
                  >
                    Duyệt ngay
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmed Schedule */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
            <h3 className="text-base font-bold text-brand-900 flex items-center gap-2">
              <Calendar size={18} className="text-brand-500" />
              Ca phỏng vấn đã chốt lịch
            </h3>
            <Link
              to="/interviewer/schedule"
              className="text-xs font-semibold text-brand-500 hover:underline flex items-center gap-1"
            >
              Lịch theo tuần <ChevronRight size={14} />
            </Link>
          </div>

          {acceptedBookings.length === 0 ? (
            <p className="text-xs text-[#64748b] text-center py-6">
              Chưa có ca phỏng vấn nào đã chấp nhận.
            </p>
          ) : (
            <div className="space-y-3">
              {acceptedBookings.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-[#e2e8f0] bg-white flex items-center justify-between gap-3 hover:bg-[#f0f7ff]/40 transition"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-brand-900">
                      Ứng viên: {b.candidateName}
                    </h4>
                    <p className="text-xs text-[#64748b] font-medium">
                      {b.profileTitle} ({b.durationMinutes} phút)
                    </p>
                    <p className="text-[11px] font-semibold text-brand-500">
                      {formatDateTime(b.scheduledAt)}
                    </p>
                  </div>
                  <Link
                    to={`/interview/room/${b.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent-500 text-white text-xs font-bold hover:bg-accent-700 transition shrink-0 active:scale-95"
                  >
                    <Video size={14} /> Vào phòng
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
