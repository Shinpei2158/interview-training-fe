import { DollarSign, Globe, Award, TrendingUp } from "lucide-react";
import { FaUserTie } from "react-icons/fa";

export default function InterviewerSignup() {
  return (
    <section className="py-24 bg-brand-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-brand-100 flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-12 lg:p-20">
            <h2 className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-4">
              Become an Interviewer
            </h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Share Your Expertise &{" "}
              <span className="text-brand-600">Earn Money</span>
            </h3>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed">
              Are you a senior developer or technical lead? Join our platform to
              mentor aspiring candidates. Set your own schedule, share valuable
              insights, and monetize your experience.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Competitive Pay</p>
                  <p className="text-sm text-slate-500">
                    Earn up to $150 per hour-long mock session.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    Flexible Scheduling
                  </p>
                  <p className="text-sm text-slate-500">
                    Work whenever you want, from anywhere in the world.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Build Your Network</p>
                  <p className="text-sm text-slate-500">
                    Connect with talent and grow your professional brand.
                  </p>
                </div>
              </div>
            </div>

            <button className="bg-brand-900 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors shadow-xl">
              Apply as Interviewer
            </button>
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
                  "Great way to give back"
                </p>
                <p className="opacity-80 italic">
                  "I've interviewed over 50 candidates on DevPrep. It's
                  incredibly rewarding to help others land their first big tech
                  role while earning extra income."
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <FaUserTie className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <p className="font-bold">Sarah Jenkins</p>
                    <p className="text-sm opacity-70">
                      Senior Engineer @ Google
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm opacity-60 uppercase tracking-widest font-bold">
                    Active Mentors
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                  <p className="text-3xl font-bold">$2M+</p>
                  <p className="text-sm opacity-60 uppercase tracking-widest font-bold">
                    Paid Out
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
