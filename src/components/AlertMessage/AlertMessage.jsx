
import "./AlertMessage.css";

function AlertMessage({
  type = "info",
  title,
  message,
  children,
  onClose,
  className = "",
}) {
  const alertContent = message || children;

  if (!alertContent) {
    return null;
  }

  const icons = {
    success: "✓",
    error: "!",
    warning: "⚠",
    info: "i",
  };

  const classes = [
    "alert-message",
    `alert-message--${type}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <span className="alert-message__icon" aria-hidden="true">
        {icons[type] || icons.info}
      </span>

      <div className="alert-message__content">
        {title && (
          <h3 className="alert-message__title">
            {title}
          </h3>
        )}

        <div className="alert-message__description">
          {alertContent}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          className="alert-message__close"
          onClick={onClose}
          aria-label="Dismiss message"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default AlertMessage;
