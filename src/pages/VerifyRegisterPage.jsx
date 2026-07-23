import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useRegister } from "../hooks/auth/useRegister";
import { sendRegisterOtp } from "../api/auth";
import { useToast } from "../context/ToastContext";
import {
  clearPendingRegistration,
  getPendingRegistration,
} from "../utils/registrationStorage";
import { getErrorMessage } from "../utils/error";
import "../styles/auth.css";

export default function VerifyRegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const registerMutation = useRegister();
  const [pending] = useState(() => getPendingRegistration());
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    if (!pending) {
      navigate("/register", { replace: true });
    }
  }, [pending, navigate]);

  const sendOtpMutation = useMutation({
    mutationFn: () => sendRegisterOtp(pending.email),
    onSuccess: (data) => {
      setOtpSent(true);
      toast.success(data.message || "Mã OTP đã được gửi đến email của bạn");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  if (!pending) {
    return null;
  }

  function handleSendOtp(event) {
    event.preventDefault();
    sendOtpMutation.mutate();
  }

  function handleVerify(event) {
    event.preventDefault();

    if (!otpSent) {
      toast.warning("Vui lòng ấn gửi mã OTP về email trước");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Vui lòng nhập đúng 6 chữ số mã OTP");
      return;
    }

    setOtpError("");

    registerMutation.mutate(
      {
        username: pending.username,
        email: pending.email,
        password: pending.password,
        otp,
      },
      {
        onSuccess: () => {
          clearPendingRegistration();
        },
      },
    );
  }

  const isBusy = registerMutation.isPending || sendOtpMutation.isPending;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand__mark">DP</div>
          <div>
            <p className="auth-brand__title">DevPrep AI</p>
            <p className="auth-brand__subtitle">Xác thực tài khoản</p>
          </div>
        </div>

        <h1 className="auth-heading">Xác thực Email</h1>
        <p className="auth-description">
          Mã xác thực 6 chữ số sẽ được gửi tới email <strong>{pending.email}</strong>.
        </p>

        <form className="auth-form" onSubmit={handleVerify} noValidate>
          <button
            type="button"
            className="auth-submit auth-submit--secondary"
            onClick={handleSendOtp}
            disabled={isBusy}
          >
            {sendOtpMutation.isPending ? "Đang gửi OTP…" : "Gửi Mã OTP"}
          </button>

          <div className="auth-field">
            <label htmlFor="register-otp">Mã xác nhận (6 chữ số)</label>
            <input
              id="register-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
              className={`text-center text-xl tracking-[0.4em] font-bold ${
                otpError ? "auth-field__input--error" : ""
              }`}
              disabled={isBusy || !otpSent}
            />
            {otpError ? <p className="auth-field__error text-center">{otpError}</p> : null}
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={isBusy || !otpSent}
          >
            {registerMutation.isPending
              ? "Đang tạo tài khoản…"
              : "Xác nhận & Tạo tài khoản"}
          </button>
        </form>

        <p className="auth-footer">
          Sai email? <Link to="/register">Quay lại</Link>
        </p>
      </div>
    </div>
  );
}
