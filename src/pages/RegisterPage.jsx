import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "../hooks/auth/useGoogleLogin";
import { useToast } from "../context/ToastContext";
import { savePendingRegistration } from "../utils/registrationStorage";
import { GOOGLE_CLIENT_ID } from "../config/env";
import {
  validateConfirmPassword,
  validateEmail,
  validateUsername,
  validatePassword,
} from "../utils/validation";
import "../styles/auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const googleLoginMutation = useGoogleLogin();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const isBusy = googleLoginMutation.isPending;

  function handleContinue(event) {
    event.preventDefault();

    const nextErrors = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      toast.warning("Vui lòng điền đầy đủ thông tin hợp lệ");
      return;
    }

    const trimmedEmail = email.trim();
    savePendingRegistration({
      username: username,
      email: trimmedEmail,
      password,
    });
    navigate("/register/verify", { state: { email: trimmedEmail } });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand__mark">DP</div>
          <div>
            <p className="auth-brand__title">DevPrep</p>
            <p className="auth-brand__subtitle">Bắt đầu hành trình của bạn</p>
          </div>
        </div>

        <h1 className="auth-heading">Tạo tài khoản</h1>
        <p className="auth-description">
          Nhập thông tin cá nhân. Mã xác thực OTP sẽ được gửi tới Email của bạn.
        </p>

        <form className="auth-form" onSubmit={handleContinue} noValidate>
          <div className="auth-field">
            <label htmlFor="register-username">Tên hiển thị (Username)</label>
            <input
              id="register-username"
              type="text"
              autoComplete="username"
              placeholder="Tối thiểu 3 ký tự"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={errors.username ? "auth-field__input--error" : ""}
            />
            {errors.username ? (
              <p className="auth-field__error">{errors.username}</p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={errors.email ? "auth-field__input--error" : ""}
            />
            {errors.email ? (
              <p className="auth-field__error">{errors.email}</p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Mật khẩu</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="Tối thiểu 8 ký tự"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={errors.password ? "auth-field__input--error" : ""}
            />
            {errors.password ? (
              <p className="auth-field__error">{errors.password}</p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={
                errors.confirmPassword ? "auth-field__input--error" : ""
              }
            />
            {errors.confirmPassword ? (
              <p className="auth-field__error">{errors.confirmPassword}</p>
            ) : null}
          </div>

          <button type="submit" className="auth-submit" disabled={isBusy}>
            Tiếp tục xác thực OTP
          </button>
        </form>

        {/* Google Registration / Sign-in Below Form */}
        {GOOGLE_CLIENT_ID ? (
          <>
            <div className="auth-divider">
              <span>hoặc đăng ký nhanh bằng Google</span>
            </div>

            <div className="auth-google">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (!credentialResponse.credential) {
                    toast.error("Đăng ký Google thất bại. Vui lòng thử lại.");
                    return;
                  }

                  googleLoginMutation.mutate(credentialResponse.credential);
                }}
                onError={() => {
                  toast.error("Đăng ký Google bị hủy hoặc thất bại.");
                }}
                theme="outline"
                size="large"
                width="100%"
                text="signup_with"
              />
            </div>
          </>
        ) : null}

        <p className="auth-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
