import { ArrowRight } from "lucide-react";
import { FaFacebook, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-900">
                DevPrep<span className="text-brand-500">AI</span>
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed mb-8 max-w-sm">
              The premier platform for IT interview preparation. Bridging the
              gap between knowledge and career success through real-world
              simulation and expert mentorship.
            </p>
            <div className="flex gap-4">
              {[FaTwitter, FaGithub, FaLinkedin, FaFacebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:border-brand-600 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-slate-600">
              <li>
                <a href="#" className="hover:text-brand-600 transition">
                  How it Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-600 transition">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-600 transition">
                  Mentors
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-600 transition">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Resources</h4>
            <ul className="space-y-4 text-slate-600">
              <li>
                <a href="#" className="hover:text-brand-600 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-600 transition">
                  Interview Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-600 transition">
                  Cheat Sheets
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-600 transition">
                  Community Forums
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Join Newsletter</h4>
            <p className="text-slate-600 mb-4 text-sm">
              Get the latest interview tips and platform updates.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-2 w-8 h-8 bg-brand-600 text-white rounded-lg flex items-center justify-center hover:bg-brand-700 transition">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© 2026 DevPrep AI Platform. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-brand-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-brand-600">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
