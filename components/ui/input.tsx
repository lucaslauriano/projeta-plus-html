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
            error ? 'text-destructive' : 'text-foreground'
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
          'shadow border border-border',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-muted-foreground/70',
          'focus-visible:outline-none focus-visible:ring-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-destructive focus-visible:ring-destructive'
            : 'focus-visible:ring-primary focus-visible:border-primary',
          className
        )}
        {...props}
      />
      {helperText && (
        <p
          className={cn(
            'mt-1 text-sm',
            error ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export { Input };
