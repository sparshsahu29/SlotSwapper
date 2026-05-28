import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'danger', 'success', 'ghost'
  disabled = false,
  loading = false,
  className = '',
  id,
}) => {
  let btnClass = 'btn-primary';
  if (variant === 'danger') btnClass = 'btn-danger';
  else if (variant === 'success') btnClass = 'btn-success';
  else if (variant === 'ghost') btnClass = 'btn-ghost';

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${btnClass} flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-98 ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
