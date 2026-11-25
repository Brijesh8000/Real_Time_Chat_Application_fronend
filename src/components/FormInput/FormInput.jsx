
import { useId } from "react";
import "./FormInput.css";

function FormInput({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  hint = "",
  required = false,
  disabled = false,
  autoComplete,
  maxLength,
  className = "",
  ...rest
}) {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const describedBy = [
    hint ? hintId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div
      className={`form-input ${className}`.trim()}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="form-input__label"
        >
          {label}

          {required && (
            <span
              className="form-input__required"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`form-input__field ${
          error ? "form-input__field--error" : ""
        }`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      />

      {hint && !error && (
        <p
          id={hintId}
          className="form-input__hint"
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="form-input__error"
          role="alert"
        >
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
    </div>
  );
}

export default FormInput;
