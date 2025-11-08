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
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className='w-full'>
      {label && (
        <label
          className={cn(
            'block text-sm font-semibold mb-2',
            error ? 'text-destructive' : 'text-foreground'
          )}
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-stretch w-full rounded-xl overflow-hidden transition-all',
          'border-2 shadow-sm',
          isFocused && !error
            ? 'border-primary ring-2 ring-primary/20'
            : error
            ? 'border-destructive'
            : 'border-border hover:border-primary/30'
        )}
      >
        {prefix && (
          <div className='flex shrink-0 items-center justify-center px-3 text-sm bg-muted/50 border-r border-border'>
            <span className='text-muted-foreground font-medium'>{prefix}</span>
          </div>
        )}
        <input
          type={type}
          data-slot='input'
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'flex h-11 w-full bg-background px-4 py-2 text-sm font-medium transition-colors',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground/60',
            'focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'border-0',
            className
          )}
          autoComplete='on'
          {...props}
        />
      </div>
      {helperText && (
        <p
          className={cn(
            'mt-1.5 text-xs',
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
