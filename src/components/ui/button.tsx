import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = '', variant = 'primary', size = 'md', children, ...props },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium transition-all duration-150
      border border-transparent
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
      disabled:opacity-50 disabled:pointer-events-none
      cursor-pointer
    `;

    const variants = {
      primary: `
        bg-accent text-accent-foreground
        hover:bg-accent-subtle
        active:scale-[0.98]
      `,
      secondary: `
        bg-background-muted text-foreground
        border-border
        hover:bg-background-subtle hover:border-border-hover
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-foreground-muted
        hover:bg-background-subtle hover:text-foreground
        active:scale-[0.98]
      `,
      outline: `
        bg-transparent border-border text-foreground
        hover:bg-background-subtle hover:border-border-hover
        active:scale-[0.98]
      `,
      danger: `
        bg-error text-white
        hover:bg-red-600
        active:scale-[0.98]
      `,
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-10 px-4 text-base rounded-md',
      lg: 'h-12 px-6 text-lg rounded-md',
      icon: 'h-10 w-10 rounded-md',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
