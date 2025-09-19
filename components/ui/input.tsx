import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  className?: string;
}

function Input({
  className,
  type,
  label,
  helperText,
  error,
  ...props
}: InputProps) {
  return (
    <div className='w-full'>
      {label && (
        <label
          className={cn(
            'block text-sm font-medium mb-1',
            error ? 'text-red-500' : 'text-foreground dark:text-foreground'
          )}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        data-slot='input'
        className={cn(
          'flex h-9 w-full rounded-md bg-background dark:bg-background/10 px-3 py-1 text-sm transition-colors',
          'shadow border border-gray-300 dark:border-gray-600 ',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground/70',
          'focus-visible:outline-none focus-visible:ring-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-500 focus-visible:ring-red-500'
            : 'focus-visible:ring-lime-500 focus-visible:border-lime-500',
          className
        )}
        {...props}
      />
      {helperText && (
        <p
          className={cn(
            'mt-1 text-sm',
            error ? 'text-red-500' : 'text-muted-foreground'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export { Input };
