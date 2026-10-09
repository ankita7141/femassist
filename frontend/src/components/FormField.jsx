import { useState } from 'react';
import './FormField.css';

export default function FormField({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  hint,
  autoComplete,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">{label}</label>

      <div className="form-field__input-wrap">
        <input
          id={id}
          name={name}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`form-field__input ${error ? 'form-field__input--error' : ''}`}
        />

        {isPassword && (
          <button
            type="button"
            className="form-field__toggle"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>

      {error && <span className="form-field__error">{error}</span>}
      {!error && hint && <span className="form-field__hint">{hint}</span>}
    </div>
  );
}