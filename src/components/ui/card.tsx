import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    { className = '', variant = 'default', padding = 'md', children, ...props },
    ref
  ) => {
    const variants = {
      default: 'bg-background-elevated border border-border',
      elevated: 'bg-background-elevated border border-border shadow-md',
      bordered: 'bg-transparent border border-border',
      ghost: 'bg-transparent',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-6',
    };

    return (
      <div
        ref={ref}
        className={`
          rounded-lg
          ${variants[variant]}
          ${paddings[padding]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex flex-col gap-1.5 mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', children, ...props }, ref) => (
    <h3
      ref={ref}
      className={`text-lg font-semibold text-foreground ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = '', children, ...props }, ref) => (
    <p
      ref={ref}
      className={`text-sm text-foreground-muted ${className}`}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

type CardContentProps = HTMLAttributes<HTMLDivElement>;

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`${className}`} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

type CardFooterProps = HTMLAttributes<HTMLDivElement>;

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex items-center gap-3 mt-4 pt-4 border-t border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
export type { CardProps };
