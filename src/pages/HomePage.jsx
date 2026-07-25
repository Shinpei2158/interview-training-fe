import Navbar from "@/components/Homepage/Navbar";
import Hero from "@/components/Homepage/Hero";
import Stats from "@/components/Homepage/Stats";
import Features from "@/components/Homepage/Features";
import InterviewerSignup from "@/components/Homepage/InterviewerSignup";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />

        {/* About Section - Brief inline description */}
        <section
          id="about"
          className="py-24 bg-white border-y border-slate-100"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-100 border-8 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
                    alt="Collaborative Interview"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-lg font-medium opacity-90 mb-2">
                      Đồng hành cùng lập trình viên Việt
                    </p>
                    <p className="text-3xl font-bold">
                      Thu hẹp khoảng cách giữa kiến thức lý thuyết và thực tiễn sự nghiệp.
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-4">
                  Sứ mệnh của chúng tôi
                </h2>
                <h3 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                  Thiết kế bởi Lập trình viên, <br /> Dành cho Lập trình viên.
                </h3>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  DevPrep được xây dựng dựa trên niềm tin rằng việc chuẩn bị phỏng vấn truyền thống đang bị hạn chế. Việc chỉ giải bài tập thuật toán thôi là chưa đủ. Bạn cần trang bị kỹ năng giải quyết vấn đề thực tế, tư duy thiết kế hệ thống và khả năng trình bày lưu loát quyết định kỹ thuật dưới áp lực phòng phỏng vấn.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-700 font-medium">
                      Mô phỏng phỏng vấn thực tế trực tiếp với chuyên gia
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-700 font-medium">
                      Nhận đánh giá và phản hồi chi tiết ngay sau buổi học
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-700 font-medium">
                      Hệ thống ôn luyện trắc nghiệm IT toàn diện theo lộ trình
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InterviewerSignup />

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-[#1e6091] to-[#0077b6] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0f172a] blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
              Bắt đầu phỏng vấn và chinh phục công việc mơ ước!
            </h2>
            <p className="text-[#e0f2fe] text-xl mb-12 opacity-95">
              Gia nhập cùng hàng ngàn lập trình viên đã đỗ vào các công ty công nghệ hàng đầu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-[#ff6b35] hover:bg-[#e85d04] text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-2xl hover:scale-105 active:scale-95 duration-200 block text-center"
              >
                Bắt đầu phỏng vấn ngay
              </Link>
              <Link
                to="/about"
                className="bg-transparent border-2 border-white/40 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition block text-center"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
