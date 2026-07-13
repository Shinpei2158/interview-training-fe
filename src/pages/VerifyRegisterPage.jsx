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
      toast.success(data.message || "OTP sent to your email");
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
      toast.warning("Send OTP to your email first");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Enter the 6-digit OTP");
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
          <div className="auth-brand__mark">IT</div>
          <div>
            <p className="auth-brand__title">Interview Training</p>
            <p className="auth-brand__subtitle">Verify your email</p>
          </div>
        </div>

        <h1 className="auth-heading">Verify registration</h1>
        <p className="auth-description">
          We sent a 6-digit code to <strong>{pending.email}</strong>. It expires
          in 3 minutes.
        </p>

        <form className="auth-form" onSubmit={handleVerify} noValidate>
          <button
            type="button"
            className="auth-submit auth-submit--secondary"
            onClick={handleSendOtp}
            disabled={isBusy}
          >
            {sendOtpMutation.isPending ? "Sending OTP…" : "Send OTP"}
          </button>

          <div className="auth-field">
            <label htmlFor="register-otp">Verification code</label>
            <input
              id="register-otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ""))
              }
              className={otpError ? "auth-field__input--error" : ""}
              disabled={isBusy || !otpSent}
            />
            {otpError ? <p className="auth-field__error">{otpError}</p> : null}
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={isBusy || !otpSent}
          >
            {registerMutation.isPending
              ? "Creating account…"
              : "Verify and create account"}
          </button>
        </form>

        <p className="auth-footer">
          Wrong email? <Link to="/register">Go back</Link>
        </p>
      </div>
    </div>
  );
}
