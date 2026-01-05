import * as React from 'react';

import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

function Input({
  className,
  type,
  label,
  tooltip,
  error,
  ref,
  leftIcon,
  rightIcon,
  ...props
}: React.ComponentProps<'input'> & {
  label?: string;
  tooltip?: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}) {
  const inputElement = (
    <div className='relative flex items-center gap-2'>
      {leftIcon && (
        <div className='absolute left-3 top-1/2 -translate-y-1/2'>
          {leftIcon}
        </div>
      )}

      <input
        id={props.id}
        type={type}
        className={cn(
          'flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-none  focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
      {rightIcon && (
        <div className='absolute right-3 top-1/2 -translate-y-1/2'>
          {rightIcon}
        </div>
      )}
      {error && <p className='text-sm text-destructive pt-1'>{error}</p>}
    </div>
  );

  if (!label) {
    return <div>{inputElement}</div>;
  }

  return (
    <div>
      <Label htmlFor={props.id}>
        <div className='flex justify-between pb-2'>
          {label}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type='button'
                    className='hover:bg-accent rounded-md transition-colors'
                  >
                    <Info className='w-4 h-4' />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className='text-sm '>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {inputElement}
      </Label>
    </div>
  );
}

export { Input };
