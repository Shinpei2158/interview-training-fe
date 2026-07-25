import { motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-brand-900 hidden sm:block">
              DevPrep
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/about"
              className="text-slate-600 hover:text-brand-600 font-medium transition-colors"
            >
              Giới thiệu
            </Link>
            <Link
              to="/features"
              className="text-slate-600 hover:text-brand-600 font-medium transition-colors"
            >
              Tính năng
            </Link>
            <Link
              to="/resources"
              className="text-slate-600 hover:text-brand-600 font-medium transition-colors"
            >
              Tài liệu
            </Link>
            <Link
              to="/community"
              className="text-slate-600 hover:text-brand-600 font-medium transition-colors"
            >
              Cộng đồng
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-brand-600 font-semibold hover:text-brand-700"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="bg-brand-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
            >
              Đăng ký
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-brand-100 px-4 py-6 flex flex-col gap-4 shadow-xl"
        >
          <Link
            to="/about"
            className="text-lg font-medium text-slate-700"
            onClick={() => setIsOpen(false)}
          >
            Giới thiệu
          </Link>
          <Link
            to="/features"
            className="text-lg font-medium text-slate-700"
            onClick={() => setIsOpen(false)}
          >
            Tính năng
          </Link>
          <Link
            to="/resources"
            className="text-lg font-medium text-slate-700"
            onClick={() => setIsOpen(false)}
          >
            Tài liệu
          </Link>
          <Link
            to="/community"
            className="text-lg font-medium text-slate-700"
            onClick={() => setIsOpen(false)}
          >
            Cộng đồng
          </Link>
          <Link
            to="/login"
            className="w-full py-3 text-center text-brand-600 font-bold border border-brand-200 rounded-xl"
            onClick={() => setIsOpen(false)}
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="w-full py-3 text-center bg-brand-600 text-white font-bold rounded-xl"
            onClick={() => setIsOpen(false)}
          >
            Đăng ký
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
