import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          variant === 'default' &&
            'bg-red-600 text-white hover:bg-red-700',
          variant === 'outline' &&
            'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
          size === 'default' && 'h-10 px-4 text-sm',
          size === 'lg' && 'h-12 px-8 text-base',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
