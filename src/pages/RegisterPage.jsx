import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { savePendingRegistration } from "../utils/registrationStorage";
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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

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
      toast.warning("Please fix the highlighted fields");
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
          <div className="auth-brand__mark">IT</div>
          <div>
            <p className="auth-brand__title">Interview Training</p>
            <p className="auth-brand__subtitle">Start your learning journey</p>
          </div>
        </div>

        <h1 className="auth-heading">Create account</h1>
        <p className="auth-description">
          Enter your details. We will verify your email on the next step.
        </p>

        <form className="auth-form" onSubmit={handleContinue} noValidate>
          <div className="auth-field">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              type="text"
              autoComplete="username"
              placeholder="At least 3 characters"
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
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={errors.password ? "auth-field__input--error" : ""}
            />
            {errors.password ? (
              <p className="auth-field__error">{errors.password}</p>
            ) : null}
          </div>

          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
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

          <button type="submit" className="auth-submit">
            Continue to verification
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
