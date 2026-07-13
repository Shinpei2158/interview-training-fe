const REGISTRATION_KEY = "pending_registration";

export function savePendingRegistration({ username, email, password }) {
  sessionStorage.setItem(
    REGISTRATION_KEY,
    JSON.stringify({ username, email, password }),
  );
}

export function getPendingRegistration() {
  const raw = sessionStorage.getItem(REGISTRATION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPendingRegistration() {
  sessionStorage.removeItem(REGISTRATION_KEY);
}
