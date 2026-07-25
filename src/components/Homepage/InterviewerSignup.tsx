import { DollarSign, Globe, Award, TrendingUp } from "lucide-react";
import { FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function InterviewerSignup() {
  return (
    <section className="py-24 bg-brand-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-brand-100 flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-12 lg:p-20">
            <h2 className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-4">
              Trở thành Người phỏng vấn
            </h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Chia sẻ kinh nghiệm &{" "}
              <span className="text-brand-600">Kiếm thêm thu nhập</span>
            </h3>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              Bạn là lập trình viên cấp cao, Tech Lead hoặc Solution Architect? Hãy gia nhập đội ngũ chuyên gia của chúng tôi để hướng dẫn thế hệ tiếp theo. Tự chủ động thời gian biểu, chia sẻ kiến thức thực chiến và tạo thêm nguồn thu nhập hấp dẫn.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Thu nhập xứng đáng</p>
                  <p className="text-sm text-slate-500">
                    Nhận thù lao hấp dẫn cho mỗi giờ phỏng vấn giả lập và đánh giá ứng viên.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    Lịch trình linh hoạt
                  </p>
                  <p className="text-sm text-slate-500">
                    Làm việc bất cứ khi nào bạn rảnh, từ bất cứ đâu trên thế giới.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Mở rộng thương hiệu cá nhân</p>
                  <p className="text-sm text-slate-500">
                    Kết nối với cộng đồng công nghệ tài năng và khẳng định vị thế chuyên môn của bạn.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/register"
              className="bg-brand-900 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors shadow-xl inline-block"
            >
              Đăng ký làm Chuyên gia
            </Link>
          </div>

          <div className="lg:w-1/2 relative bg-brand-600 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative h-full flex flex-col justify-center p-12 text-white">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl mb-8">
                <Award className="w-12 h-12 mb-4 text-brand-200" />
                <p className="text-2xl font-bold mb-2">
                  "Cách tuyệt vời để đóng góp cho cộng đồng"
                </p>
                <p className="opacity-80 italic">
                  "Tôi đã phỏng vấn hơn 50 ứng viên trên DevPrep. Thực sự rất ý nghĩa khi giúp đỡ các bạn trẻ rút ngắn lộ trình chạm tới công việc mơ ước, đồng thời giúp tôi hệ thống hóa kiến thức và có thêm nguồn thu nhập tốt."
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <FaUserTie className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="font-bold">Trần Thu Trang</p>
                    <p className="text-sm opacity-70">
                      Tech Lead @ VNG Corporation
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm opacity-60 uppercase tracking-widest font-bold">
                    Chuyên gia hoạt động
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <p className="text-3xl font-bold">2.5 tỷ+</p>
                  <p className="text-sm opacity-60 uppercase tracking-widest font-bold">
                    VNĐ Thù lao đã trả
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
