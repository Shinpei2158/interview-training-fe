import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { sendChangePasswordOtp, confirmChangePassword } from "../api/auth";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../hooks/auth/useAuth";
import { getErrorMessage } from "../utils/error";
import "../styles/auth.css";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: user } = useAuth();

  // Step 1: Passwords input | Step 2: OTP verification
  const [step, setStep] = useState(1);

  // Form states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [errors, setErrors] = useState({});

  // Mutation 1: Send OTP with old & new password validation
  const sendOtpMutation = useMutation({
    mutationFn: () => sendChangePasswordOtp(oldPassword, newPassword),
    onSuccess: (data) => {
      toast.success(data.message || "Mã OTP đã được gửi đến email của bạn");
      setStep(2);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Mutation 2: Confirm OTP to finalize password change
  const confirmMutation = useMutation({
    mutationFn: () => confirmChangePassword(otp),
    onSuccess: (data) => {
      toast.success(data.message || "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  // Step 1 Submit handler
  const handleRequestOtp = (e) => {
    e.preventDefault();
    const nextErrors = {};

    if (!oldPassword) {
      nextErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!newPassword || newPassword.length < 6) {
      nextErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Xác nhận mật khẩu mới không khớp";
    }

    if (oldPassword && newPassword && oldPassword === newPassword) {
      nextErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    sendOtpMutation.mutate();
  };

  // Step 2 Submit handler
  const handleConfirmOtp = (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: "Mã OTP phải gồm 6 chữ số" });
      return;
    }

    setErrors({});
    confirmMutation.mutate();
  };

  const isBusy = sendOtpMutation.isPending || confirmMutation.isPending;

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-brand__mark">DP</div>
          <div>
            <p className="auth-brand__title">DevPrep</p>
            <p className="auth-brand__subtitle">Luyện tập phỏng vấn thông minh</p>
          </div>
        </div>

        {/* Navigation & Step Indicator */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0077b6] transition-colors"
          >
            <ArrowLeft size={14} />
            Quay lại Hồ sơ
          </Link>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#f0f7ff] text-[#0077b6] border border-[#bae6fd]">
            Bước {step}/2
          </span>
        </div>

        <h1 className="auth-heading">Đổi Mật Khẩu</h1>
        <p className="auth-description">
          {step === 1
            ? "Nhập mật khẩu hiện tại và mật khẩu mới để nhận mã OTP xác thực"
            : `Nhập mã OTP 6 chữ số đã được gửi tới email ${user?.email || ""}`}
        </p>

        {step === 1 ? (
          /* STEP 1: Passwords Input Form */
          <form onSubmit={handleRequestOtp} className="auth-form" noValidate>
            <div className="auth-field">
              <label htmlFor="old-password">Mật Khẩu Hiện Tại</label>
              <input
                id="old-password"
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className={errors.oldPassword ? "auth-field__input--error" : ""}
              />
              {errors.oldPassword && (
                <p className="auth-field__error">{errors.oldPassword}</p>
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
          /* STEP 2: OTP Verification Form */
          <form onSubmit={handleConfirmOtp} className="auth-form" noValidate>
            <div className="bg-[#f0f7ff] border border-[#bae6fd] rounded-2xl p-3.5 flex items-start gap-2.5 mb-1">
              <Mail className="w-4 h-4 text-[#0077b6] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                Mã OTP đã được gửi đến email <strong className="text-[#0077b6]">{user?.email}</strong>. Vui lòng kiểm tra hòm thư chính và thư rác.
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="otp" className="text-center block">Nhập Mã OTP (6 chữ số)</label>
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

            <button
              type="submit"
              disabled={isBusy || otp.length !== 6}
              className="auth-submit flex items-center justify-center gap-2"
            >
              {confirmMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang xác nhận...
                </>
              ) : (
                "Xác Nhận Đổi Mật Khẩu"
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isBusy}
                className="text-slate-500 hover:text-slate-800 font-semibold transition"
              >
                ← Sửa thông tin mật khẩu
              </button>

              <button
                type="button"
                onClick={() => sendOtpMutation.mutate()}
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
          Quay lại <Link to="/profile">Hồ sơ cá nhân</Link>
        </p>
      </div>
    </div>
  );
}
