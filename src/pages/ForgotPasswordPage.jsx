import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowLeft, ShieldCheck, Lock, CheckCircle2, Loader2, RefreshCw, KeyRound } from "lucide-react";
import { sendForgotPasswordOtp, resetPassword } from "../api/auth";
import { useToast } from "../context/ToastContext";
import { validateEmail } from "../utils/validation";
import { getErrorMessage } from "../utils/error";
import "../styles/auth.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const initialEmail = location.state?.email || "";

  // Step 1: Request OTP via email | Step 2: Enter OTP & New Password
  const [step, setStep] = useState(initialEmail ? 2 : 1);

  // Form states
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  // Mutation 1: Send OTP to Email
  const sendOtpMutation = useMutation({
    mutationFn: (targetEmail) => sendForgotPasswordOtp(targetEmail || email),
    onSuccess: (data) => {
      toast.success(data.message || "Mã OTP đã được gửi đến email của bạn");
      setStep(2);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Mutation 2: Reset Password with OTP
  const resetPasswordMutation = useMutation({
    mutationFn: () => resetPassword(email, otp, newPassword),
    onSuccess: (data) => {
      toast.success(data.message || "Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Step 1 Submit Handler (Request OTP)
  const handleRequestOtp = (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);

    if (emailErr) {
      setErrors({ email: "Vui lòng nhập địa chỉ email hợp lệ" });
      return;
    }

    setErrors({});
    sendOtpMutation.mutate(email.trim());
  };

  // Step 2 Submit Handler (Reset Password)
  const handleResetPassword = (e) => {
    e.preventDefault();
    const nextErrors = {};

    if (!/^\d{6}$/.test(otp)) {
      nextErrors.otp = "Mã OTP phải gồm 6 chữ số";
    }

    if (!newPassword || newPassword.length < 6) {
      nextErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Xác nhận mật khẩu mới không khớp";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    resetPasswordMutation.mutate();
  };

  const isBusy = sendOtpMutation.isPending || resetPasswordMutation.isPending;

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-brand__mark">DP</div>
          <div>
            <p className="auth-brand__title">DevPrep AI</p>
            <p className="auth-brand__subtitle">Luyện tập phỏng vấn thông minh</p>
          </div>
        </div>

        {/* Navigation & Step Indicator */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0077b6] transition-colors"
          >
            <ArrowLeft size={14} />
            Quay lại Đăng nhập
          </Link>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd]">
            Bước {step}/2
          </span>
        </div>

        <h1 className="auth-heading">Quên Mật Khẩu</h1>
        <p className="auth-description">
          {step === 1
            ? "Nhập email đăng ký của bạn để nhận mã xác thực OTP"
            : `Nhập mã OTP 6 chữ số và mật khẩu mới cho tài khoản ${email}`}
        </p>

        {step === 1 ? (
          /* STEP 1: Enter Email Form */
          <form onSubmit={handleRequestOtp} className="auth-form" noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email Đăng Ký</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={errors.email ? "auth-field__input--error" : ""}
              />
              {errors.email && (
                <p className="auth-field__error">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="auth-submit flex items-center justify-center gap-2"
            >
              {sendOtpMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang gửi mã OTP...
                </>
              ) : (
                "Gửi Mã Xác Thực OTP"
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: OTP Verification & New Password Form */
          <form onSubmit={handleResetPassword} className="auth-form" noValidate>
            <div className="bg-[#f0f7ff] border border-[#bae6fd] rounded-2xl p-3.5 flex items-start gap-2.5 mb-1">
              <Mail className="w-4 h-4 text-[#0077b6] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                Mã OTP đã được gửi tới <strong className="text-[#0077b6]">{email}</strong>. Vui lòng kiểm tra hòm thư chính và thư rác.
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="otp" className="text-center block">Mã OTP (6 chữ số)</label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className={`text-center text-xl tracking-[0.4em] font-bold ${
                  errors.otp ? "auth-field__input--error" : ""
                }`}
              />
              {errors.otp && (
                <p className="auth-field__error text-center">{errors.otp}</p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="new-password">Mật Khẩu Mới</label>
              <input
                id="new-password"
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className={errors.newPassword ? "auth-field__input--error" : ""}
              />
              {errors.newPassword && (
                <p className="auth-field__error">{errors.newPassword}</p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="confirm-password">Xác Nhận Mật Khẩu Mới</label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className={errors.confirmPassword ? "auth-field__input--error" : ""}
              />
              {errors.confirmPassword && (
                <p className="auth-field__error">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="auth-submit flex items-center justify-center gap-2"
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Đặt Lại Mật Khẩu"
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isBusy}
                className="text-slate-500 hover:text-slate-800 font-semibold transition"
              >
                ← Thay đổi email
              </button>

              <button
                type="button"
                onClick={() => sendOtpMutation.mutate(email)}
                disabled={isBusy}
                className="inline-flex items-center gap-1 text-[#0077b6] font-bold hover:underline transition disabled:opacity-50"
              >
                <RefreshCw size={12} className={sendOtpMutation.isPending ? "animate-spin" : ""} />
                Gửi lại OTP
              </button>
            </div>
          </form>
        )}

        <p className="auth-footer">
          Đã nhớ mật khẩu? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      </div>
    </div>
  );
}
