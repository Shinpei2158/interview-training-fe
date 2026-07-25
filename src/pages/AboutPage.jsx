import { motion } from "motion/react";
import Navbar from "../components/Homepage/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Target, Eye, ShieldCheck, Heart, Award, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden mb-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-brand-50 to-transparent -z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-6xl font-extrabold text-[#0f172a] mb-6 tracking-tight">
                Về <span className="text-[#0077b6]">DevPrep</span>
              </h1>
              <p className="max-w-3xl mx-auto text-xl text-slate-600 leading-relaxed">
                Nền tảng tiên phong đồng hành cùng lập trình viên Việt Nam trên con đường chinh phục các nhà tuyển dụng công nghệ hàng đầu thông qua kiến thức thực chiến và kết nối chuyên gia.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Sứ mệnh */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Sứ mệnh của chúng tôi</h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Thu hẹp khoảng cách lớn giữa kiến thức học thuật tại nhà trường và thực tế phỏng vấn khốc liệt tại doanh nghiệp. Chúng tôi cung cấp các bộ đề ôn luyện trắc nghiệm chất lượng cao và môi trường phỏng vấn giả lập sống động giúp ứng viên trang bị cả kiến thức kỹ thuật lẫn kỹ năng mềm.
                </p>
              </div>
              <div className="text-brand-600 font-semibold">
                Kiến tạo tương lai cho IT Việt →
              </div>
            </motion.div>

            {/* Tầm nhìn */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-[#fff7ed] text-[#ff6b35] rounded-2xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Tầm nhìn phát triển</h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Trở thành nền tảng đào tạo và kết nối phỏng vấn công nghệ hàng đầu tại khu vực. DevPrep hướng tới việc xây dựng một hệ sinh thái mở, nơi các lập trình viên giàu kinh nghiệm có thể chia sẻ giá trị, đồng thời là bệ phóng vững chắc cho hàng trăm ngàn kỹ sư công nghệ trẻ khởi đầu sự nghiệp.
                </p>
              </div>
              <div className="text-[#ff6b35] font-semibold">
                Vươn tầm khu vực →
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="bg-brand-900 py-24 text-white mb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-brand-300 uppercase tracking-widest mb-4">Giá trị cốt lõi</h2>
              <p className="text-3xl sm:text-4xl font-extrabold">Kim chỉ nam cho mọi hoạt động</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Chất lượng hàng đầu",
                  desc: "Mọi câu hỏi trắc nghiệm, tài liệu hướng dẫn và chuyên gia phỏng vấn đều được kiểm duyệt kỹ lưỡng để đảm bảo tính thực tế."
                },
                {
                  icon: Users,
                  title: "Đồng hành & Chia sẻ",
                  desc: "Chúng tôi xây dựng mối quan hệ tin cậy giữa Mentor và Mentee, nơi sự thành công của học viên là động lực lớn nhất."
                },
                {
                  icon: Award,
                  title: "Liên tục đổi mới",
                  desc: "Công nghệ thay đổi mỗi ngày, chúng tôi không ngừng cải tiến bộ câu hỏi, tính năng phòng phỏng vấn để cập nhật xu hướng mới nhất."
                }
              ].map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition duration-300"
                >
                  <val.icon className="w-10 h-10 text-brand-300 mb-6" />
                  <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                  <p className="text-brand-100 leading-relaxed text-sm">{val.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl font-extrabold mb-4">Sẵn sàng nâng tầm kỹ năng của bạn?</h2>
            <p className="text-brand-100 max-w-xl mx-auto mb-8 text-lg">
              Tham gia luyện tập trắc nghiệm miễn phí hoặc đặt lịch phỏng vấn thử cùng chuyên gia công nghệ ngay hôm nay.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="bg-[#ff6b35] hover:bg-[#e85d04] text-white px-8 py-3.5 rounded-xl font-bold shadow-lg transition duration-200 hover:scale-105 active:scale-95"
              >
                Đăng ký tài khoản
              </Link>
              <Link
                to="/features"
                className="bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition"
              >
                Tìm hiểu tính năng
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
