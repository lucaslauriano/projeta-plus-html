import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  prefix?: string;
  error?: boolean;
  className?: string;
}

function Input({
  prefix,
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
      <div className='flex items-stretch w-full'>
        {prefix && (
          <div
            className={cn(
              'flex shrink-0 items-center justify-center rounded-l-md px-3 text-sm',
              'border border-r-0 border-border bg-muted/50',
              error ? 'border-destructive' : 'border-border'
            )}
          >
            <span className='text-muted-foreground'>{prefix}</span>
          </div>
        )}
        <input
          type={type}
          data-slot='input'
          className={cn(
            'flex h-9 w-full rounded-md bg-background dark:bg-background/10 px-3 py-1 text-sm transition-colors',
            'shadow border border-border',
            prefix && 'rounded-l-none border-l-0',
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
      </div>
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
