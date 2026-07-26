import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizProgress } from "@/api/quiz";
import { fetchMyInterviewBookings } from "@/api/interviews";
import { formatDateTime } from "@/components/interview/common/interviewUtils";
import {
  GraduationCap,
  Award,
  Calendar,
  Clock,
  TrendingUp,
  Target,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function UserDashboardView({ user }) {
  const { data: progressList = [], isLoading: loadingProgress } = useQuery({
    queryKey: ["my-quiz-progress"],
    queryFn: fetchQuizProgress,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["my-interview-bookings"],
    queryFn: () => fetchMyInterviewBookings({ page: 0, size: 20 }),
  });

  const upcomingInterviews = (bookingsData?.content || [])
    .filter((b) => b.status === "ACCEPTED")
    .slice(0, 3);

  const finishedTests = progressList.filter((p) => p.status === "FINISHED");
  const totalStudied = progressList.length;

  const avgScore = finishedTests.length
    ? Math.round(
        (finishedTests.reduce(
          (sum, item) =>
            sum + (item.score || 0) / Math.max(item.totalQuestions || 1, 1),
          0,
        ) /
          finishedTests.length) *
          100,
      )
    : 0;

  // Tính toán dữ liệu biểu đồ Tiến Độ thực tế theo Thứ trong tuần
  const performanceData = useMemo(() => {
    const daysMap = {
      "Thứ 2": { day: "Thứ 2", totalScore: 0, count: 0 },
      "Thứ 3": { day: "Thứ 3", totalScore: 0, count: 0 },
      "Thứ 4": { day: "Thứ 4", totalScore: 0, count: 0 },
      "Thứ 5": { day: "Thứ 5", totalScore: 0, count: 0 },
      "Thứ 6": { day: "Thứ 6", totalScore: 0, count: 0 },
      "Thứ 7": { day: "Thứ 7", totalScore: 0, count: 0 },
      "Chủ nhật": { day: "Chủ nhật", totalScore: 0, count: 0 },
    };

    const dayNames = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];

    finishedTests.forEach((item) => {
      const date = item.updatedAt ? new Date(item.updatedAt) : new Date();
      const dayName = dayNames[date.getDay()];
      const pct = Math.round(
        ((item.score || 0) / Math.max(item.totalQuestions || 1, 1)) * 100,
      );

      if (daysMap[dayName]) {
        daysMap[dayName].totalScore += pct;
        daysMap[dayName].count += 1;
      }
    });

    return [
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ nhật",
    ].map((d) => ({
      day: d,
      score: daysMap[d].count
        ? Math.round(daysMap[d].totalScore / daysMap[d].count)
        : 0,
      attempts: daysMap[d].count,
    }));
  }, [finishedTests]);

  // Tính toán dữ liệu Phân bổ Kỹ năng từ Category / Quiz Title
  const skillMasteryData = useMemo(() => {
    if (!progressList.length) return [];

    const categoryCounts = {};
    progressList.forEach((p) => {
      const cat = p.categoryName || p.quizTitle?.split(" ")[0] || "General";
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const colors = ["#0077b6", "#10b981", "#ff6b35", "#f59e0b", "#8b5cf6"];
    return Object.entries(categoryCounts).map(([name, count], index) => ({
      name,
      value: Math.round((count / progressList.length) * 100),
      color: colors[index % colors.length],
    }));
  }, [progressList]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Welcome Card */}
      <div className="bg-gradient-to-r from-[#1e6091] via-[#0077b6] to-[#0096c7] rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0))]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#bae6fd]">
              Candidate Dashboard
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Xin chào, {user?.username || "Ứng viên"}!
            </h1>
            <p className="text-[#e0f2fe] text-sm leading-relaxed">
              Tiếp tục ôn luyện câu hỏi phỏng vấn và thực hiện mock interview để
              nâng cao sự tự tin cùng chuyên gia.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#ff6b35] hover:bg-[#e85d04] text-white font-bold text-sm shadow-md transition active:scale-95"
            >
              <GraduationCap size={18} />
              Luyện tập ngay
            </Link>
            <Link
              to="/interview"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-xs transition active:scale-95"
            >
              <Calendar size={18} />
              Tìm Interviewer
            </Link>
          </div>
        </div>
      </div>

      {/* Summary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Bài kiểm tra đã hoàn thành
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#f0f7ff] text-[#0077b6] flex items-center justify-center border border-[#bae6fd]">
              <GraduationCap size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">
            {totalStudied}
          </h3>
          <p className="text-xs text-[#10b981] font-semibold flex items-center gap-1">
            <TrendingUp size={13} /> +15% so với tuần trước
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Điểm số trung bình
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center border border-[#c3e6cb]">
              <Target size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">
            {avgScore}%
          </h3>
          <p className="text-xs text-[#137333] font-semibold">
            Đạt mức Xuất sắc (Excellent)
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Buổi phỏng vấn đã đặt
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#fff7ed] text-[#ff6b35] flex items-center justify-center border border-[#ffedd5]">
              <Calendar size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">
            {(bookingsData?.content || []).length}
          </h3>
          <p className="text-xs text-[#ff6b35] font-semibold">
            {upcomingInterviews.length} buổi sắp tới
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-wider">
              Điểm thưởng tích lũy
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center border border-[#fde68a]">
              <Award size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">
            {user?.point}{" "}
            <span className="text-sm font-medium text-[#64748b]">pts</span>
          </h3>
          <p className="text-xs text-[#d97706] font-semibold">
            Có thể dùng để đặt phỏng vấn
          </p>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Score Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#0f172a]">
                Biểu đồ tiến độ kết quả kiểm tra thử
              </h3>
              <p className="text-xs text-[#64748b]">
                Điểm số phần trăm theo ngày trong tuần gần nhất
              </p>
            </div>
            <span className="text-xs font-bold text-[#0077b6] bg-[#f0f7ff] px-3 py-1 rounded-full border border-[#bae6fd]">
              Tuần này
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
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
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(val) => [`${val}%`, "Điểm số"]}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#0077b6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart: Skill Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#0f172a]">
              Phân bổ câu hỏi theo kỹ năng
            </h3>
            <p className="text-xs text-[#64748b]">Tỷ lệ chủ đề đã luyện tập</p>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillMasteryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {skillMasteryData.map((entry, index) => (
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
                  formatter={(val) => [`${val}%`, "Tỷ lệ"]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming Interviews & Recent Progress Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Mock Interviews */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
            <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
              <Calendar size={18} className="text-[#0077b6]" />
              Lịch phỏng vấn sắp tới
            </h3>
            <Link
              to="/interview/schedule"
              className="text-xs font-semibold text-[#0077b6] hover:underline flex items-center gap-1"
            >
              Xem tất cả <ChevronRight size={14} />
            </Link>
          </div>

          {upcomingInterviews.length === 0 ? (
            <p className="text-xs text-[#64748b] text-center py-6">
              Bạn chưa có buổi phỏng vấn nào sắp tới.
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingInterviews.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex items-center justify-between gap-3 hover:border-[#bae6fd] transition"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#0f172a]">
                      {b.profileTitle}
                    </h4>
                    <p className="text-xs text-[#64748b]">
                      Interviewer:{" "}
                      <span className="font-bold text-[#0077b6]">
                        {b.interviewerName}
                      </span>
                    </p>
                    <p className="text-[11px] font-medium text-[#0f172a] flex items-center gap-1 pt-0.5">
                      <Clock size={12} className="text-[#0077b6]" />
                      {formatDateTime(b.scheduledAt)}
                    </p>
                  </div>
                  <Link
                    to={`/interview/room/${b.id}`}
                    className="px-3.5 py-2 rounded-xl bg-[#ff6b35] text-white text-xs font-bold hover:bg-[#e85d04] transition active:scale-95 shrink-0"
                  >
                    Vào phòng
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quiz Progress */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_4px_16px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
            <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
              <GraduationCap size={18} className="text-[#0077b6]" />
              Kết quả ôn tập gần đây
            </h3>
            <Link
              to="/my-progress"
              className="text-xs font-semibold text-[#0077b6] hover:underline flex items-center gap-1"
            >
              Xem chi tiết <ChevronRight size={14} />
            </Link>
          </div>

          {loadingProgress ? (
            <p className="text-xs text-[#64748b] text-center py-6">
              Đang tải tiến độ...
            </p>
          ) : progressList.length === 0 ? (
            <p className="text-xs text-[#64748b] text-center py-6">
              Chưa có kết quả làm bài kiểm tra thử nào.
            </p>
          ) : (
            <div className="space-y-3">
              {progressList.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border border-[#e2e8f0] bg-white flex items-center justify-between gap-3 hover:bg-[#f0f7ff]/40 transition"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#0f172a]">
                      {p.quizTitle}
                    </h4>
                    <p className="text-[11px] text-[#64748b] mt-0.5">
                      {p.completedQuestions}/{p.totalQuestions} câu đúng
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#e6f4ea] text-[#137333] border border-[#c3e6cb]">
                    {p.scorePercentage}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
