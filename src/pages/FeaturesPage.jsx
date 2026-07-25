import { motion } from "motion/react";
import Navbar from "../components/Homepage/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {
  Trophy,
  Calendar,
  Video,
  UserCheck,
  ChevronRight,
  Code,
  LineChart,
  BookOpen
} from "lucide-react";

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Trophy,
      title: "Luyện trắc nghiệm IT thông minh",
      desc: "Ngân hàng câu hỏi khổng lồ với hơn 20+ chủ đề công nghệ như React, Node.js, Golang, System Design, SQL... Cung cấp hai chế độ: ôn tập tự do và làm bài thi thử giới hạn thời gian thực tế.",
      details: ["Chế độ Học (Study) có giải thích chi tiết", "Chế độ Kiểm tra (Test) chấm điểm tự động", "Lưu trữ câu hỏi yêu thích để ôn lại", "Biểu đồ theo dõi tiến độ học tập cá nhân"],
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50"
    },
    {
      icon: Calendar,
      title: "Kết nối & Đặt lịch Chuyên gia",
      desc: "Duyệt danh sách các người phỏng vấn giàu kinh nghiệm (Tech Lead, Senior Developer) từ các công ty công nghệ uy tín. Đặt lịch phỏng vấn thử phù hợp với thời gian rảnh của bạn.",
      details: ["Xem hồ sơ chi tiết & đánh giá của chuyên gia", "Lịch rảnh cập nhật thời gian thực", "Hệ thống thông báo tự động về lịch hẹn", "Quản lý yêu cầu phỏng vấn trực quan"],
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Video,
      title: "Phòng phỏng vấn ảo trực tuyến",
      desc: "Không gian mô phỏng phỏng vấn thực tế chuyên nghiệp ngay trên trình duyệt web mà không cần cài đặt thêm phần mềm thứ ba.",
      details: ["Gọi Video & Audio độ trễ thấp", "Trình soạn thảo mã nguồn cộng tác thời gian thực", "Hộp thoại Chat nhắn tin trực tiếp", "Bảng nháp vẽ sơ đồ & ghi chú chung"],
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50"
    },
    {
      icon: UserCheck,
      title: "Cổng thông tin Chuyên gia",
      desc: "Hệ thống dành riêng cho các Mentor công nghệ muốn chia sẻ kinh nghiệm, hỗ trợ thế hệ trẻ và gia tăng thu nhập thụ động hấp dẫn.",
      details: ["Quản lý và duyệt yêu cầu phỏng vấn từ ứng viên", "Tự do cấu hình thời gian rảnh của bản thân", "Bộ công cụ biên soạn câu hỏi trắc nghiệm mới", "Thống kê thù lao minh bạch & nhanh chóng"],
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Khám phá <span className="text-[#0077b6]">Tính năng</span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed">
              DevPrep mang đến giải pháp học tập và luyện phỏng vấn IT toàn diện, kết hợp hài hòa giữa lý thuyết trắc nghiệm vững chắc và phỏng vấn giả lập thực tế sinh động.
            </p>
          </motion.div>
        </section>

        {/* Detailed Features List */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mb-24">
          {mainFeatures.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`flex flex-col lg:flex-row gap-12 items-center ${idx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Left text info */}
              <div className="w-full lg:w-1/2">
                <div className={`w-14 h-14 rounded-2xl ${feat.bgColor} flex items-center justify-center mb-6`}>
                  <feat.icon className="w-7 h-7 text-slate-800" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{feat.title}</h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">{feat.desc}</p>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {feat.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right decorative visual card */}
              <div className="w-full lg:w-1/2">
                <div className={`aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br ${feat.color} p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
                  {/* Decorative circle shapes */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex justify-between items-start">
                    <span className="text-white/60 font-mono text-lg font-bold">0{idx + 1}</span>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold">
                      DevPrep AI Platform
                    </div>
                  </div>

                  <div className="text-white relative z-10">
                    <h3 className="text-2xl font-bold mb-2">{feat.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-6">Mô hình hoạt động trực quan giúp ứng viên dễ dàng tương tác và làm chủ lộ trình học tập của chính mình.</p>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition shadow-lg"
                    >
                      Bắt đầu thử ngay
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Highlight Section */}
        <section className="bg-slate-900 py-20 text-white rounded-[3rem] max-w-7xl mx-auto px-6 sm:px-12 mb-24">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-extrabold mb-4 leading-tight">Tại sao nên chọn DevPrep?</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Chúng tôi liên tục cập nhật công nghệ mới, thiết lập quy trình học tập khép kín từ trắc nghiệm kiến thức đến thực hành phỏng vấn, giúp bạn luôn tự tin trước các nhà tuyển dụng.
              </p>
            </div>
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
              {[
                { icon: Code, title: "Thực chiến tối đa", desc: "Không chỉ học vẹt câu hỏi, bạn được viết code và trả lời trực tiếp như trong các buổi phỏng vấn thật sự." },
                { icon: LineChart, title: "Lộ trình cá nhân hóa", desc: "Theo dõi tiến độ, lưu trữ câu hỏi và phân tích điểm yếu để kịp thời cải thiện trước ngày phỏng vấn." },
                { icon: UserCheck, title: "Chuyên gia tin cậy", desc: "100% người phỏng vấn được xác thực thông tin hồ sơ nghề nghiệp và kiểm tra năng lực sư phạm." },
                { icon: BookOpen, title: "Tài liệu phong phú", desc: "Tru cập miễn phí kho tài liệu tổng hợp cẩm nang phỏng vấn, cheat sheets công nghệ hữu ích." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 text-brand-300 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Trải nghiệm tất cả tính năng ngay bây giờ</h2>
          <p className="text-slate-600 mb-8 text-lg">Đăng ký tài khoản miễn phí để khám phá thế giới ôn luyện phỏng vấn IT đỉnh cao.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-[#ff6b35] hover:bg-[#e85d04] text-white px-8 py-4 rounded-xl font-bold transition shadow-lg hover:scale-105 active:scale-95 duration-200"
            >
              Đăng ký tài khoản miễn phí
            </Link>
            <Link
              to="/login"
              className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition"
            >
              Đăng nhập
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
