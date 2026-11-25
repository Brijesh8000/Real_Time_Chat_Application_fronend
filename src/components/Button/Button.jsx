
import "./Button.css";

function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  icon,
  className = "",
  ...rest
}) {
  const buttonClasses = [
    "app-button",
    `app-button--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <span className="app-button__spinner" aria-hidden="true" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && (
            <span className="app-button__icon" aria-hidden="true">
              {icon}
            </span>
          )}

          <span>{children}</span>
        </>
      )}
    </button>
  );
}

export default Button;
