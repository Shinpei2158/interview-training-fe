import { motion } from "motion/react";
import {
  Video,
  MessagesSquare,
  Users,
  BookOpen,
  Lightbulb,
  Trophy,
} from "lucide-react";

const features = [
  {
    title: "Phòng phỏng vấn trực tuyến",
    description:
      "Thực hiện phỏng vấn giả lập với cuộc gọi video chất lượng cao, độ trễ thấp và tích hợp khung chat tiện lợi.",
    icon: Video,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Trình soạn thảo Code tương tác",
    description:
      "Lập trình cộng tác thời gian thực ngay trong phòng phỏng vấn, giúp chuyên gia trực tiếp theo dõi và đánh giá mã nguồn.",
    icon: MessagesSquare,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Kết nối Chuyên gia đầu ngành",
    description:
      "Dễ dàng tìm kiếm và kết nối với các Tech Lead, Senior Developer đến từ các công ty công nghệ hàng đầu.",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Luyện trắc nghiệm thông minh",
    description:
      "Ngân hàng câu hỏi trắc nghiệm IT đa dạng trên 20+ chủ đề công nghệ, hỗ trợ chế độ Học (Study) và Thi thử (Test).",
    icon: Trophy,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Theo dõi & Đánh giá tiến độ",
    description:
      "Ghi nhận chi tiết lộ trình ôn tập, các câu hỏi đã lưu và lịch sử phỏng vấn để đo lường mức độ cải thiện kỹ năng.",
    icon: BookOpen,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Cổng thông tin Chuyên gia",
    description:
      "Công cụ quản lý lịch rảnh linh hoạt, phê duyệt yêu cầu phỏng vấn và đóng góp bộ đề thi trắc nghiệm mới cho cộng đồng.",
    icon: Lightbulb,
    color: "bg-pink-100 text-pink-600",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand-600 uppercase tracking-[0.2em] mb-4">
            TÍNH NĂNG CỐT LÕI
          </h2>
          <p className="text-4xl font-extrabold text-slate-900 mb-6">
            Mọi công cụ bạn cần để bứt phá
          </p>
          <p className="max-w-2xl mx-auto text-slate-600 text-lg">
            Chúng tôi cung cấp một hệ sinh thái toàn diện được thiết kế để giả lập chính xác các buổi phỏng vấn IT thực tế và giúp bạn nâng cao sự tự tin từng bước.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl border border-slate-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-50 transition-all group"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
