import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground-muted mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full h-10 px-3
              bg-background-elevated border border-border
              text-foreground text-base
              placeholder:text-foreground-subtle
              rounded-md
              transition-all duration-150
              hover:border-border-hover
              focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-error focus:border-error focus:ring-error' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-foreground-subtle">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
