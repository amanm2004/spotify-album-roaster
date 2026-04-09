import { HTMLAttributes, forwardRef } from 'react';

interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

const Separator = forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className = '', orientation = 'horizontal', ...props }, ref) => (
    <hr
      ref={ref}
      className={`
        shrink-0
        bg-border
        ${orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'}
        ${className}
      `}
      {...props}
    />
  )
);

Separator.displayName = 'Separator';

export { Separator };
export type { SeparatorProps };
