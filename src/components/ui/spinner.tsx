import { HTMLAttributes, forwardRef } from 'react';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className = '', size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    return (
      <div
        ref={ref}
        className={`
          animate-spin
          rounded-full
          border-2 border-border
          border-t-accent
          ${sizes[size]}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner };
export type { SpinnerProps };
