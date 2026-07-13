import { useToast } from '../../context/ToastContext';
import './ToastContainer.css';

const ICONS = {
  success: '✓',
  warning: '!',
  error: '×',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-viewport" aria-live="polite" aria-label="Notifications">
      {toasts.map((item) => (
        <div key={item.id} className={`toast toast--${item.type}`} role="alert">
          <span className="toast__icon" aria-hidden="true">
            {ICONS[item.type]}
          </span>
          <p className="toast__message">{item.message}</p>
          <button
            type="button"
            className="toast__close"
            aria-label="Dismiss"
            onClick={() => removeToast(item.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
