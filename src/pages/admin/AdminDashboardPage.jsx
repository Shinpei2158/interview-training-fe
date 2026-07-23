import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/api/users";
import {
  fetchAdminQuizzes,
  fetchAdminReports,
  fetchPendingInterviewerRequests,
  fetchAdminOverviewStats,
} from "@/api/admin";
import {
  Users,
  ShieldCheck,
  GraduationCap,
  Calendar,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  UserCheck,
  FileText,
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
  AreaChart,
  Area,
} from "recharts";

export default function AdminDashboardPage() {
  const { data: overviewData } = useQuery({
    queryKey: ["admin-overview-stats"],
    queryFn: fetchAdminOverviewStats,
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => fetchUsers({ size: 1000 }),
  });

  const { data: quizzes = [], isLoading: loadingQuizzes } = useQuery({
    queryKey: ["admin-quizzes"],
    queryFn: fetchAdminQuizzes,
  });

  const { data: reports = [], isLoading: loadingReports } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: fetchAdminReports,
  });

  const { data: pendingInterviewers = [] } = useQuery({
    queryKey: ["admin-pending-interviewers"],
    queryFn: fetchPendingInterviewerRequests,
  });

  const rawUsers = useMemo(() => {
    return Array.isArray(usersData?.data?.content)
      ? usersData.data.content
      : Array.isArray(usersData?.content)
        ? usersData.content
        : Array.isArray(usersData)
          ? usersData
          : [];
  }, [usersData]);

  const totalUsers = overviewData?.totalUsers ?? rawUsers.length;
  const totalInterviewers =
    overviewData?.totalInterviewers ??
    rawUsers.filter((u) => u.role === "INTERVIEWER").length;
  const totalQuizzes = overviewData?.totalQuizzes ?? quizzes.length;
  const completedInterviews = overviewData?.completedInterviews ?? 0;
  const pendingQuizApprovals =
    overviewData?.pendingQuizApprovals ??
    quizzes.filter((q) => q.status === "PENDING" || q.status === "DRAFT")
      .length;
  const openReports =
    overviewData?.openReports ?? reports.filter((r) => !r.resolved).length;
  const pendingInterviewerApprovals =
    overviewData?.pendingInterviewerApprovals ?? pendingInterviewers.length;

  // Compute dynamic Role Distribution
  const roleDistribution = useMemo(() => {
    if (
      overviewData?.roleDistribution &&
      overviewData.roleDistribution.length > 0
    ) {
      return overviewData.roleDistribution;
    }
    const counts = { USER: 0, INTERVIEWER: 0, ADMIN: 0 };
    rawUsers.forEach((u) => {
      if (counts[u.role] !== undefined) counts[u.role]++;
      else counts.USER++;
    });

    return [
      { name: "Users", value: counts.USER, color: "#0077b6" },
      { name: "Interviewers", value: counts.INTERVIEWER, color: "#ff6b35" },
      { name: "Admins", value: counts.ADMIN, color: "#10b981" },
    ].filter((r) => r.value > 0);
  }, [rawUsers, overviewData]);

  // Dynamic Monthly Registrations
  const monthlyRegistrations = useMemo(() => {
    return overviewData?.monthlyRegistrations || [];
  }, [overviewData]);

  // Dynamic Platform Activity
  const platformActivity = useMemo(() => {
    return overviewData?.platformActivity || [];
  }, [overviewData]);

  const isLoadingStats = loadingUsers || loadingQuizzes || loadingReports;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1e6091] via-[#0077b6] to-[#0096c7] rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0))]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#bae6fd]">
              System Administration
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Admin Overview & Control Center 🛡️
            </h1>
            <p className="text-[#e0f2fe] text-sm leading-relaxed">
              Theo dõi thời gian thực các chỉ số hệ thống, quản lý tài khoản
              người dùng, phê duyệt bộ đề thi và xử lý báo cáo sự cố.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#0f172a] font-bold text-xs hover:bg-[#f0f7ff] transition active:scale-95 shadow-2xs"
            >
              <UserCheck size={16} className="text-[#0077b6]" />
              Duyệt Interviewer ({pendingInterviewerApprovals})
            </Link>
            <Link
              to="/admin/quizzes"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#ff6b35] hover:bg-[#e85d04] text-white font-bold text-xs shadow-2xs transition active:scale-95"
            >
              <FileText size={16} />
              Duyệt Quiz ({pendingQuizApprovals})
            </Link>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              Tổng Người Dùng
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#f0f7ff] text-[#0077b6] flex items-center justify-center border border-[#bae6fd]">
              <Users size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">
            {isLoadingStats ? "…" : totalUsers.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#10b981] font-semibold flex items-center gap-1">
            <TrendingUp size={12} /> Dữ liệu trực tuyến
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              Interviewer
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#fff7ed] text-[#ff6b35] flex items-center justify-center border border-[#ffedd5]">
              <ShieldCheck size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">
            {isLoadingStats ? "…" : totalInterviewers}
          </h3>
          <p className="text-[11px] text-[#ff6b35] font-semibold">
            {pendingInterviewerApprovals} chờ xác minh
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              Bộ Câu Hỏi Phỏng Vấn
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center border border-[#c3e6cb]">
              <GraduationCap size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">
            {isLoadingStats ? "…" : totalQuizzes}
          </h3>
          <p className="text-[11px] text-[#137333] font-semibold">
            {pendingQuizApprovals} chờ duyệt
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              Ca Phỏng Vấn
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#f0f7ff] text-[#0077b6] flex items-center justify-center border border-[#bae6fd]">
              <Calendar size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">
            {isLoadingStats ? "…" : completedInterviews.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#0077b6] font-semibold">
            Hoàn thành thành công
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e2e8f0] shadow-2xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
              Báo Cáo Sự Cố
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#fee2e2] text-[#dc2626] flex items-center justify-center border border-[#fca5a5]">
              <AlertTriangle size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#dc2626] tracking-tight">
            {isLoadingStats ? "…" : openReports}
          </h3>
          <p className="text-[11px] text-[#dc2626] font-semibold">
            Cần xử lý ngay
          </p>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Registration & Interview Trends */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0f172a]">
                Tăng trưởng Người dùng & Số lượt Phỏng vấn
              </h3>
              <p className="text-xs text-[#64748b]">
                Thống kê số tài khoản mới & số ca phỏng vấn theo các tháng gần
                nhất
              </p>
            </div>
            <span className="text-xs font-bold text-[#0077b6] bg-[#f0f7ff] px-3 py-1 rounded-full border border-[#bae6fd]">
              Năm 2026
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRegistrations}>
                <XAxis
                  dataKey="month"
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
                />
                <Bar
                  dataKey="users"
                  name="User Mới"
                  fill="#0077b6"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="interviews"
                  name="Lượt Phỏng Vấn"
                  fill="#ff6b35"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: User Role Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0f172a]">
              Phân bố Vai trò Hệ thống (Roles)
            </h3>
            <p className="text-xs text-[#64748b]">
              Tỷ lệ Candidate, Interviewer & Admin
            </p>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
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
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Area Chart: Daily Activity & Scores */}
      <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0f172a]">
              Tần suất Làm bài kiểm tra thử hàng ngày & Điểm trung bình (%)
            </h3>
            <p className="text-xs text-[#64748b]">
              Giám sát chất lượng học tập và lưu lượng làm bài kiểm tra trong tuần
            </p>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={platformActivity}>
              <defs>
                <linearGradient id="attemptsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0077b6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0077b6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="quizAttempts"
                name="Lượt làm bài"
                stroke="#0077b6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#attemptsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Admin Modules Quick Nav Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="group bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs hover:shadow-md hover:border-[#bae6fd] transition-all flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] text-[#0077b6] flex items-center justify-center font-bold">
              <Users size={20} />
            </div>
            <h4 className="text-base font-bold text-[#0f172a] group-hover:text-[#0077b6] transition-colors">
              Quản lý Người dùng & Duyệt Role
            </h4>
            <p className="text-xs text-[#64748b]">
              Ban/Unban, chuyển role USER -&gt; INTERVIEWER & xem bằng cấp.
            </p>
          </div>
          <ChevronRight
            size={20}
            className="text-[#64748b] group-hover:text-[#0077b6] group-hover:translate-x-1 transition"
          />
        </Link>

        <Link
          to="/admin/quizzes"
          className="group bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs hover:shadow-md hover:border-[#bae6fd] transition-all flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center font-bold">
              <GraduationCap size={20} />
            </div>
            <h4 className="text-base font-bold text-[#0f172a] group-hover:text-[#0077b6] transition-colors">
              Duyệt Bộ Đề Phỏng Vấn (Quizzes)
            </h4>
            <p className="text-xs text-[#64748b]">
              Phê duyệt Quiz public, yêu cầu sửa đổi hoặc ẩn bài vi phạm.
            </p>
          </div>
          <ChevronRight
            size={20}
            className="text-[#64748b] group-hover:text-[#0077b6] group-hover:translate-x-1 transition"
          />
        </Link>

        <Link
          to="/admin/reports"
          className="group bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-2xs hover:shadow-md hover:border-[#bae6fd] transition-all flex items-center justify-between"
        >
          <div className="space-y-1">
            <div className="w-10 h-10 rounded-xl bg-[#fee2e2] text-[#dc2626] flex items-center justify-center font-bold">
              <AlertTriangle size={20} />
            </div>
            <h4 className="text-base font-bold text-[#0f172a] group-hover:text-[#0077b6] transition-colors">
              Xử lý Báo cáo Sự cố
            </h4>
            <p className="text-xs text-[#64748b]">
              Xử lý khiếu nại ca phỏng vấn, lỗi câu hỏi & hành vi vi phạm.
            </p>
          </div>
          <ChevronRight
            size={20}
            className="text-[#64748b] group-hover:text-[#0077b6] group-hover:translate-x-1 transition"
          />
        </Link>
      </div>
    </div>
  );
}
