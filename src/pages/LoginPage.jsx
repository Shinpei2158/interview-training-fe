import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useLogin } from "../hooks/auth/useLogin";
import { useGoogleLogin } from "../hooks/auth/useGoogleLogin";
import { validateEmail, validatePassword } from "../utils/validation";
import { useToast } from "../context/ToastContext";
import { GOOGLE_CLIENT_ID } from "../config/env";
import "../styles/auth.css";

export default function LoginPage() {
  const { toast } = useToast();
  const loginMutation = useLogin();
  const googleLoginMutation = useGoogleLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const isBusy = loginMutation.isPending || googleLoginMutation.isPending;

  function validateForm() {
    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      toast.warning("Vui lòng điền đầy đủ các trường thông tin");
      return;
    }

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand__mark">DP</div>
          <div>
            <p className="auth-brand__title">DevPrep</p>
            <p className="auth-brand__subtitle">
              Luyện tập phỏng vấn thông minh
            </p>
          </div>
        </div>

        <h1 className="auth-heading">Đăng nhập</h1>
        <p className="auth-description">
          Chào mừng bạn quay lại! Đăng nhập để tiếp tục hành trình học tập.
        </p>

        {/* Standard Email/Password Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={errors.email ? "auth-field__input--error" : ""}
              disabled={isBusy}
            />
            {errors.email ? (
              <p className="auth-field__error">{errors.email}</p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={errors.password ? "auth-field__input--error" : ""}
              disabled={isBusy}
            />
            {errors.password ? (
              <p className="auth-field__error">{errors.password}</p>
            ) : null}
            <p className="auth-field__hint">
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </p>
          </div>

          <button type="submit" className="auth-submit" disabled={isBusy}>
            {loginMutation.isPending ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>

        {/* Google Sign-in Below Form */}
        {GOOGLE_CLIENT_ID ? (
          <>
            <div className="auth-divider">
              <span>hoặc đăng nhập với Google</span>
            </div>

            <div className="auth-google">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (!credentialResponse.credential) {
                    toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
                    return;
                  }

                  googleLoginMutation.mutate(credentialResponse.credential);
                }}
                onError={() => {
                  toast.error("Đăng nhập Google bị hủy hoặc thất bại.");
                }}
                theme="outline"
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>
          </>
        ) : null}

        <p className="auth-footer">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
