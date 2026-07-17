import * as React from 'react';
import { cn } from '../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary-600 text-white shadow-md hover:bg-primary-700 hover:shadow-primary-500/30 hover:shadow-lg dark:bg-primary-500 dark:hover:bg-primary-400',
      secondary: 'bg-dark-800 text-white shadow-sm hover:bg-dark-900 hover:shadow-md dark:bg-white dark:text-dark-900 dark:hover:bg-gray-200',
      outline: 'border-2 border-gray-200 bg-transparent hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 dark:border-dark-600 dark:hover:border-primary-400 dark:hover:bg-dark-800 dark:hover:text-primary-400',
      ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-dark-800',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold tracking-wide transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 hover:-translate-y-0.5',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
