import { ArrowRight } from "lucide-react";
import { FaFacebook, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-[#0077b6] to-[#1e6091] rounded-lg flex items-center justify-center shadow-xs">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0f172a]">
                DevPrep<span className="text-[#0077b6]">AI</span>
              </span>
            </div>
            <p className="text-[#64748b] leading-relaxed mb-8 max-w-sm">
              The premier platform for IT interview preparation. Bridging the
              gap between knowledge and career success through real-world
              simulation and expert mentorship.
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
            <h4 className="font-bold text-[#0f172a] mb-6">Platform</h4>
            <ul className="space-y-4 text-[#64748b]">
              <li>
                <a href="#" className="hover:text-[#0077b6] transition">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0077b6] transition">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0077b6] transition">
                  Mentors
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0077b6] transition">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0f172a] mb-6">Resources</h4>
            <ul className="space-y-4 text-[#64748b]">
              <li>
                <a href="#" className="hover:text-[#0077b6] transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0077b6] transition">
                  Interview Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0077b6] transition">
                  Cheat Sheets
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#0077b6] transition">
                  Community Forums
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0f172a] mb-6">Join Newsletter</h4>
            <p className="text-[#64748b] mb-4 text-sm">
              Get the latest interview tips and platform updates.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl py-3 px-4 pr-12 text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:bg-white"
              />
              <button className="absolute right-2 top-2 w-8 h-8 bg-[#0077b6] text-white rounded-lg flex items-center justify-center hover:bg-[#0096c7] transition">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e2e8f0] flex flex-col md:flex-row justify-between items-center gap-4 text-[#64748b] text-sm">
          <p>© 2026 DevPrep AI Platform. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#0077b6]">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#0077b6]">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#0077b6]">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>

  );
}
