import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'secondary'
    | 'outline'
    | 'accent'
    | 'success'
    | 'warning'
    | 'error';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-background-muted text-foreground-muted',
      secondary:
        'bg-background-subtle text-foreground-muted border border-border',
      outline: 'bg-transparent text-foreground-muted border border-border',
      accent: 'bg-accent/10 text-accent border border-accent/20',
      success: 'bg-success/10 text-success border border-success/20',
      warning: 'bg-warning/10 text-warning border border-warning/20',
      error: 'bg-error/10 text-error border border-error/20',
    };

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center
          px-2 py-0.5
          text-xs font-medium
          rounded
          ${variants[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };
