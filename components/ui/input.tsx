import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  prefix?: string;
  error?: boolean;
  className?: string;
  tooltip?: string;
}

function Input({
  prefix,
  className,
  type,
  label,
  helperText,
  tooltip,
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
            tooltip && 'flex justify-between gap-1',
            error ? 'text-destructive' : 'text-foreground'
          )}
        >
          {label}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type='button'
                    className='p-1 hover:bg-accent rounded-md transition-colors'
                  >
                    <Info className='w-4 h-4 text-muted-foreground' />
                  </button>
                </TooltipTrigger>
                <TooltipContent className='max-w-xs'>
                  <p className='text-sm font-normal'>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </label>
      )}
      <div
        className={cn(
          'flex items-stretch w-full rounded-xl overflow-hidden transition-all',
          'border-1 shadow-sm',
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
            'flex h-8 w-full bg-background px-4 py-2 text-sm font-medium transition-colors',
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
