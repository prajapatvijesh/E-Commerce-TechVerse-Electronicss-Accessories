import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-2 text-sm placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-700 dark:bg-dark-900/50 dark:text-gray-100 dark:focus:bg-dark-900 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'hover:border-gray-300 dark:hover:border-dark-600'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
