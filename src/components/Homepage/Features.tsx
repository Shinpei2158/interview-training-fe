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
    title: "HD Video Calls",
    description:
      "Participate in real-time technical interviews with smooth video and low-latency audio.",
    icon: Video,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Smart Chat System",
    description:
      "Instant messaging with interviewers for quick questions and post-interview follow-ups.",
    icon: MessagesSquare,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Community Groups",
    description:
      "Join tech-specific groups to share experiences, questions, and networking opportunities.",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Interactive Quizzes",
    description:
      "Test your knowledge with our curated set of IT quizzes across 20+ technologies.",
    icon: Trophy,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Learning Resources",
    description:
      "Access a vast library of interview guides, cheat sheets, and solved technical problems.",
    icon: BookOpen,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Mock AI Insights",
    description:
      "Get AI-powered feedback on your performance, communication style, and code quality.",
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
            Core Platform
          </h2>
          <p className="text-4xl font-extrabold text-slate-900 mb-6">
            Everything You Need to Succeed
          </p>
          <p className="max-w-2xl mx-auto text-slate-600 text-lg">
            We provide a comprehensive suite of tools designed to simulate real
            IT interviews and build your confidence step by step.
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
