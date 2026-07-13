import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { validateEmail } from "../utils/validation";
import "../styles/auth.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  function handleContinue(event) {
    event.preventDefault();

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      toast.warning("Enter a valid email first");
      return;
    }

    setErrors({});
    navigate("/forgot-password/verify", {
      state: { email: email.trim() },
    });
  }

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

        <h1 className="auth-heading">Forgot password</h1>
        <p className="auth-description">
          Enter your account email. On the next step we will send a 6-digit
          verification code.
        </p>

        <form className="auth-form" onSubmit={handleContinue} noValidate>
          <div className="auth-field">
            <label htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
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

          <button type="submit" className="auth-submit">
            Continue to verification
          </button>
        </form>

        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
