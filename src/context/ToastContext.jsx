import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type, message, duration = 4000) => {
      const id = ++toastId;

      setToasts((current) => [...current, { id, type, message }]);

      if (duration > 0) {
        window.setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  const toast = useMemo(
    () => ({
      success: (message) => showToast("success", message),
      warning: (message) => showToast("warning", message),
      error: (message) => showToast("error", message),
    }),
    [showToast],
  );

  const value = useMemo(
    () => ({ toasts, removeToast, toast }),
    [toasts, removeToast, toast],
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
