import { motion } from "motion/react";
import Navbar from "../components/Homepage/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Compass,
  ArrowUpRight,
  Code2,
  Database,
  Terminal,
  Layers,
  Sparkles
} from "lucide-react";

export default function ResourcesPage() {
  const guides = [
    {
      icon: Code2,
      category: "Coding & Algorithm",
      title: "Cẩm nang xử lý các bài toán thuật toán phổ biến",
      desc: "Tổng hợp các dạng thuật toán thường gặp như Two Pointers, Sliding Window, DFS/BFS, Dynamic Programming và chiến lược tối ưu hóa thời gian chạy Big O.",
      readTime: "15 phút đọc"
    },
    {
      icon: Layers,
      category: "System Design",
      title: "Thiết kế hệ thống: Từ nguyên lý đến thực tế",
      desc: "Hướng dẫn cách tiếp cận bài toán thiết kế hệ thống quy mô lớn (Scaling, Load Balancing, Caching, Database Sharding) dành cho các kỹ sư trung và cao cấp.",
      readTime: "25 phút đọc"
    },
    {
      icon: Terminal,
      category: "Behavioral",
      title: "Làm chủ phỏng vấn hành vi bằng phương pháp STAR",
      desc: "Phương pháp chuẩn quốc tế giúp bạn trình bày các dự án cũ, giải quyết mâu thuẫn trong team và thể hiện năng lực lãnh đạo một cách thuyết phục nhất.",
      readTime: "10 phút đọc"
    }
  ];

  const cheatsheets = [
    {
      icon: Code2,
      title: "React & Frontend Core Cheatsheet",
      tags: ["React 19", "Hooks", "CSS Grid", "Performance"],
      color: "border-sky-200 hover:border-sky-500 hover:shadow-sky-50"
    },
    {
      icon: Database,
      title: "Database Optimization & SQL Guide",
      tags: ["Indexes", "Query Optimization", "ACID", "NoSQL"],
      color: "border-emerald-200 hover:border-emerald-500 hover:shadow-emerald-50"
    },
    {
      icon: Terminal,
      title: "Node.js & Backend Architecture",
      tags: ["Event Loop", "Express", "RESTful API", "Security"],
      color: "border-indigo-200 hover:border-indigo-500 hover:shadow-indigo-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Tài nguyên <span className="text-[#0077b6]">Học tập</span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed">
              Thư viện tài liệu ôn tập, tóm tắt kiến thức (Cheat Sheets) và lộ trình phát triển được biên soạn và chọn lọc kỹ lưỡng từ các chuyên gia IT.
            </p>
          </motion.div>
        </section>

        {/* Categories Section (Guides) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Cẩm nang phỏng vấn IT</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {guides.map((guide, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between hover:shadow-2xl hover:shadow-brand-50/50 transition-all duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider px-3 py-1 rounded-full bg-brand-50">
                      {guide.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{guide.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm mb-6">
                    {guide.desc}
                  </p>
                </div>

                <button className="inline-flex items-center gap-2 text-brand-600 font-bold text-sm hover:gap-3 transition-all pt-4 border-t border-slate-100 w-full text-left">
                  Đọc cẩm nang ngay
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Cheat Sheets Section */}
        <section className="bg-slate-900 py-24 text-white rounded-[3rem] max-w-7xl mx-auto px-6 sm:px-12 mb-24">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/5 border border-white/10 text-brand-300 rounded-xl flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-extrabold">Tóm tắt công nghệ (Cheat Sheets)</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {cheatsheets.map((sheet, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <sheet.icon className="w-10 h-10 text-brand-300 mb-6" />
                  <h3 className="text-xl font-bold mb-4">{sheet.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {sheet.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-xs bg-white/10 px-2.5 py-1 rounded-md text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="bg-white text-slate-900 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition shadow-lg w-full text-center">
                  Xem bản đầy đủ
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Roadmaps Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[#fff7ed] text-[#ff6b35] rounded-xl flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Lộ trình học tập đề xuất</h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-xl shadow-slate-100/50">
            <div className="grid lg:grid-cols-3 gap-8 items-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {[
                { title: "Frontend Developer", desc: "Lộ trình từ HTML/CSS căn bản, React/Next.js nâng cao, Quản lý State, Cấu trúc dự án và Kỹ thuật tối ưu hóa SEO/Performance." },
                { title: "Backend Developer", desc: "Xây dựng tư duy RESTful API, EventLoop trong Node.js, Cấu trúc Cơ sở dữ liệu SQL/NoSQL, Caching, Queue và Docker containerization." },
                { title: "System Design Master", desc: "Dành cho Senior Engineer muốn nâng cao tư duy thiết kế hệ thống lớn phân tán, chịu tải tốt, tính khả dụng cao và giải pháp bảo mật dữ liệu." }
              ].map((map, idx) => (
                <div key={idx} className={`pt-8 lg:pt-0 lg:px-8 first:pl-0 last:pr-0`}>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ff6b35] uppercase tracking-wider mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Lộ trình {idx + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{map.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm mb-6">{map.desc}</p>
                  <Link to="/register" className="text-slate-900 font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                    Khám phá lộ trình
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Card */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-extrabold mb-4">Bạn muốn đóng góp tài liệu?</h2>
            <p className="text-brand-100 max-w-xl mx-auto mb-8 text-lg">
              Nếu bạn là chuyên gia và muốn chia sẻ các cẩm nang, tài liệu hữu ích cho cộng đồng, hãy đăng ký tài khoản chuyên gia ngay.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition shadow-lg"
              >
                Đăng ký làm Chuyên gia
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
