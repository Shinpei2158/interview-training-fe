import { motion } from "motion/react";
import Navbar from "../components/Homepage/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Sparkles,
  Heart,
  Scale,
  Smile,
  Quote
} from "lucide-react";

export default function CommunityPage() {
  const values = [
    {
      icon: Smile,
      title: "Tôn trọng & Lịch sự",
      desc: "Mọi thành viên (ứng viên & chuyên gia) luôn cư xử lịch thiệp, tôn trọng sự khác biệt và giúp đỡ nhau cùng tiến bộ trong môi trường ôn luyện chuyên nghiệp."
    },
    {
      icon: MessageSquare,
      title: "Chia sẻ cởi mở",
      desc: "Chúng tôi khuyến khích các chuyên gia chia sẻ kiến thức thực tế và ứng viên chia sẻ kinh nghiệm phỏng vấn từ các công ty họ từng tham gia để mọi người cùng học hỏi."
    },
    {
      icon: Scale,
      title: "Công bằng & Minh bạch",
      desc: "Hệ thống đánh giá chuyên gia và ứng viên minh bạch dựa trên chất lượng các buổi phỏng vấn thực tế, đảm bảo quyền lợi tốt nhất cho mọi thành viên."
    }
  ];

  const testimonials = [
    {
      quote: "Nhờ luyện phỏng vấn 1-1 trên DevPrep mà mình học được cách giải thích thuật toán mạch lạc hơn. Kết quả là mình đỗ ngay vào vị trí Software Engineer mong đợi!",
      author: "Nguyễn Văn Nam",
      role: "Software Engineer @ FPT Software",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nam"
    },
    {
      quote: "Các bộ đề trắc nghiệm React và Javascript trên DevPrep cực kỳ sát với các câu hỏi phỏng vấn thực tế. Mình đã ôn tập ở đây mỗi ngày trước khi thi tuyển.",
      author: "Lê Minh Thư",
      role: "Frontend Developer @ VNG Corporation",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thu"
    },
    {
      quote: "Phòng phỏng vấn ảo rất mượt mà. Việc kết hợp video call và viết code thời gian thực giúp mình làm quen trước với cảm giác phỏng vấn thật dưới áp lực thời gian.",
      author: "Phạm Minh Hoàng",
      role: "Backend Engineer @ Viettel Group",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoang"
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
              Cộng đồng <span className="text-[#0077b6]">DevPrep</span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed">
              Nơi kết nối hàng ngàn lập trình viên tài năng và chuyên gia công nghệ hàng đầu Việt Nam để cùng nhau chia sẻ, học hỏi và bứt phá sự nghiệp IT.
            </p>
          </motion.div>
        </section>

        {/* Community Values */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-[#0077b6] uppercase tracking-widest mb-4">Quy chuẩn ứng xử</h2>
            <p className="text-3xl font-extrabold text-slate-900">Văn hóa cộng đồng của chúng tôi</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100/50 hover:-translate-y-1 transition duration-300"
              >
                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center mb-6 shrink-0">
                  <val.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials (Success Stories) */}
        <section className="bg-brand-900 py-24 text-white rounded-[3rem] max-w-7xl mx-auto px-6 sm:px-12 mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Câu chuyện thành công</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Học viên nói gì về DevPrep?</h2>
            <p className="text-brand-200 mt-4 max-w-2xl mx-auto text-sm">
              Những chia sẻ chân thực từ các bạn lập trình viên đã đạt được kết quả mong đợi sau quá trình rèn luyện trên nền tảng.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <Quote className="w-8 h-8 text-brand-300 mb-4 opacity-55" />
                  <p className="text-brand-100 text-sm leading-relaxed mb-6 italic">
                    "{test.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-white/10 pt-4 mt-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-white/20">
                    <img src={test.avatar} alt={test.author} className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{test.author}</h4>
                    <p className="text-xs text-brand-300 font-medium">{test.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats & Trust */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <div className="bg-white rounded-3xl border border-slate-100 p-12 shadow-xl shadow-slate-100/50 max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Cùng nhau xây dựng cộng đồng IT lớn mạnh</h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              DevPrep không chỉ cung cấp công cụ ôn luyện, chúng tôi xây dựng một văn hóa sẻ chia để giúp mỗi kỹ sư Việt Nam tự tin vươn ra biển lớn.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="bg-[#ff6b35] hover:bg-[#e85d04] text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg"
              >
                Gia nhập cộng đồng ngay
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
