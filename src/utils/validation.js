const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUsername(username, { minLength = 3 } = {}) {
  if (!username?.trim()) {
    return "Username is required";
  }

  if (username.length < minLength) {
    return `Username must be at least ${minLength} characters`;
  }

  return "";
}

export function validateEmail(email) {
  if (!email?.trim()) {
    return "Email is required";
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return "Enter a valid email address";
  }

  return "";
}

export function validatePassword(password, { minLength = 8 } = {}) {
  if (!password) {
    return "Password is required";
  }

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }

  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
}
