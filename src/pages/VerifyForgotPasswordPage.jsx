import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPassword, sendForgotPasswordOtp } from "../api/auth";
import { useToast } from "../context/ToastContext";
import { validatePassword } from "../utils/validation";
import { getErrorMessage } from "../utils/error";
import "../styles/auth.css";

export default function VerifyForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const email = location.state?.email ?? "";
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const sendOtpMutation = useMutation({
    mutationFn: () => sendForgotPasswordOtp(email),
    onSuccess: (data) => {
      setOtpSent(true);
      toast.success(data.message || "OTP sent to your email");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const resetMutation = useMutation({
    mutationFn: () => resetPassword(email, otp, newPassword),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successful");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  if (!email) {
    return null;
  }

  function handleSendOtp(event) {
    event.preventDefault();
    sendOtpMutation.mutate();
  }

  function handleReset(event) {
    event.preventDefault();

    if (!otpSent) {
      toast.warning("Send OTP to your email first");
      return;
    }

    const nextErrors = {
      otp: !/^\d{6}$/.test(otp) ? "Enter the 6-digit OTP" : "",
      newPassword: validatePassword(newPassword),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      toast.warning("Please fix the highlighted fields");
      return;
    }

    resetMutation.mutate();
  }

  const isBusy = sendOtpMutation.isPending || resetMutation.isPending;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand__mark">IT</div>
          <div>
            <p className="auth-brand__title">Interview Training</p>
            <p className="auth-brand__subtitle">Reset your password</p>
          </div>
        </div>

        <h1 className="auth-heading">Verify reset code</h1>
        <p className="auth-description">
          Enter the 6-digit code sent to <strong>{email}</strong>, then choose a
          new password.
        </p>

        <form className="auth-form" onSubmit={handleReset} noValidate>
          <button
            type="button"
            className="auth-submit auth-submit--secondary"
            onClick={handleSendOtp}
            disabled={isBusy}
          >
            {sendOtpMutation.isPending ? "Sending OTP…" : "Send OTP"}
          </button>

          <div className="auth-field">
            <label htmlFor="forgot-otp">Verification code</label>
            <input
              id="forgot-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
              className={errors.otp ? "auth-field__input--error" : ""}
              disabled={isBusy || !otpSent}
            />
            {errors.otp ? (
              <p className="auth-field__error">{errors.otp}</p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="forgot-password">New password</label>
            <input
              id="forgot-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={errors.newPassword ? "auth-field__input--error" : ""}
              disabled={isBusy || !otpSent}
            />
            {errors.newPassword ? (
              <p className="auth-field__error">{errors.newPassword}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={isBusy || !otpSent}
          >
            {resetMutation.isPending ? "Resetting…" : "Reset password"}
          </button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
