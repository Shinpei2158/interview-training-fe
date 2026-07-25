import { ArrowRight } from "lucide-react";
import { FaFacebook, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 hover:opacity-90 transition-opacity">
              <div className="w-9 h-9 bg-gradient-to-br from-[#0077b6] to-[#1e6091] rounded-lg flex items-center justify-center shadow-xs">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0f172a]">
                DevPrep
              </span>
            </Link>
            <p className="text-[#64748b] leading-relaxed mb-8 max-w-sm">
              Nền tảng hàng đầu dành cho việc ôn luyện phỏng vấn IT. Thu hẹp khoảng cách giữa kiến thức lý thuyết và thành công sự nghiệp thông qua các buổi phỏng vấn giả lập thực tế và sự hướng dẫn từ các chuyên gia giàu kinh nghiệm.
            </p>
            <div className="flex gap-4">
              {[FaTwitter, FaGithub, FaLinkedin, FaFacebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-[#e2e8f0] flex items-center justify-center text-[#64748b] hover:text-[#0077b6] hover:border-[#0077b6] hover:bg-[#f0f7ff] transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#0f172a] mb-6">Khám phá</h4>
            <ul className="space-y-4 text-[#64748b]">
              <li>
                <Link to="/about" className="hover:text-[#0077b6] transition">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-[#0077b6] transition">
                  Tính năng cốt lõi
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-[#0077b6] transition">
                  Tài nguyên học tập
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-[#0077b6] transition">
                  Cộng đồng DevPrep
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0f172a] mb-6">Tính năng hệ thống</h4>
            <ul className="space-y-4 text-[#64748b]">
              <li>
                <Link to="/register" className="hover:text-[#0077b6] transition">
                  Luyện trắc nghiệm IT
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#0077b6] transition">
                  Đặt lịch phỏng vấn thử
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#0077b6] transition">
                  Phòng phỏng vấn ảo
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#0077b6] transition">
                  Trở thành Người phỏng vấn
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0f172a] mb-6">Đăng ký nhận bản tin</h4>
            <p className="text-[#64748b] mb-4 text-sm">
              Nhận ngay các mẹo phỏng vấn mới nhất và thông tin cập nhật nền tảng từ DevPrep.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Địa chỉ email của bạn"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl py-3 px-4 pr-12 text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:bg-white"
              />
              <button className="absolute right-2 top-2 w-8 h-8 bg-[#0077b6] text-white rounded-lg flex items-center justify-center hover:bg-[#0096c7] transition">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e2e8f0] flex flex-col md:flex-row justify-between items-center gap-4 text-[#64748b] text-sm">
          <p>© 2026 Nền tảng DevPrep. Bảo lưu mọi quyền.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#0077b6] transition">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-[#0077b6] transition">
              Điều khoản dịch vụ
            </a>
            <a href="#" className="hover:text-[#0077b6] transition">
              Chính sách Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
