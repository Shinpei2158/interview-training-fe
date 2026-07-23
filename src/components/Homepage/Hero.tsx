import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  PlayCircle,
  Terminal,
  ShieldCheck,
  Code2,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-linear-to-b from-brand-50/50 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand-200/20 blur-3xl rounded-full -z-10" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-300/20 blur-3xl rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f7ff] border border-[#e0f2fe] text-[#0077b6] font-medium text-sm mb-6">
              <Terminal className="w-4 h-4 text-[#0077b6]" />
              <span>The Next-Gen Interview Platform for IT Experts</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-[#0f172a] leading-[1.1] mb-6">
              Master Your IT{" "}
              <span className="text-[#0077b6] italic">Interviews</span> with
              Professionals.
            </h1>
            <p className="text-xl text-[#64748b] mb-8 leading-relaxed max-w-xl">
              Connect with experienced IT interviewers from top tech companies.
              Practice real-world scenarios, get instant feedback, and land your
              dream job.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 bg-[#ff6b35] hover:bg-[#e85d04] text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl shadow-[#ff6b35]/20 hover:scale-105 active:scale-95 duration-200"
              >
                Bắt đầu phỏng vấn
                <ChevronRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-[#0f172a] hover:bg-[#f0f7ff] hover:text-[#0077b6] transition border border-[#e2e8f0]">
                <PlayCircle className="w-5 h-5 text-[#0077b6]" />
                Xem Demo
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                      alt="user"
                      className="w-full h-full"
                    />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-[#0077b6] flex items-center justify-center text-xs font-bold text-white">
                  +2k
                </div>
              </div>
              <p className="text-sm text-[#64748b] font-medium">
                Tham gia cùng{" "}
                <span className="text-[#0f172a] font-bold">2,500+</span>{" "}
                lập trình viên tháng này
              </p>
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden glass-panel p-4 aspect-[4/3] flex items-center justify-center">
              <div className="absolute top-8 right-8 bg-white/90 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                <ShieldCheck className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Verification
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    Certified Interviewers
                  </p>
                </div>
              </div>

              <div className="absolute bottom-12 left-8 bg-brand-600 text-white p-6 rounded-2xl shadow-2xl shadow-brand-500/50 max-w-[200px]">
                <Code2 className="w-10 h-10 mb-2" />
                <p className="text-lg font-bold leading-tight">
                  Mock Coding Sessions
                </p>
                <p className="text-xs opacity-80 mt-1">
                  Real-time collaboration & feedback
                </p>
              </div>

              {/* Central Graphic */}
              <div className="w-4/5 h-4/5 bg-brand-50 rounded-2xl border border-brand-100 flex items-center justify-center">
                <div className="grid grid-cols-3 gap-2 w-1/2 h-1/2">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-lg ${i % 2 === 0 ? "bg-brand-200" : "bg-brand-400"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Shadow decoration */}
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-brand-600/5 rounded-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
