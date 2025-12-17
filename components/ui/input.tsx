import * as React from 'react';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Label } from '@/components/ui/label';

function Input({
  className,
  type,
  label,
  tooltip,
  error,
  ref,
  ...props
}: React.ComponentProps<'input'> & {
  label?: string;
  tooltip?: string;
  error?: string;
  ref?: React.Ref<HTMLInputElement>;
}) {
  const inputElement = (
    <>
      <input
        id={props.id}
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className='text-sm text-destructive pt-1'>{error}</p>}
    </>
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
                    <Info className='w-4 h-4 text-muted-foreground' />
                  </button>
                </TooltipTrigger>
                <TooltipContent className='max-w-xs'>
                  <p className='text-sm font-normal'>{tooltip}</p>
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
