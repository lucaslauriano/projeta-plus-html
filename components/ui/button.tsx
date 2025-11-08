import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus:outline-none focus-visible:outline-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white shadow-md hover:shadow-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80',
        destructive:
          'bg-destructive text-white shadow-md hover:shadow-lg hover:bg-destructive/90 focus-visible:ring-destructive/50 dark:bg-destructive/80 dark:hover:bg-destructive/70',
        outline:
          'border-2 border-border bg-background shadow-sm hover:bg-accent/50 hover:border-primary/30 hover:shadow-md dark:bg-card dark:border-border dark:hover:bg-accent/50',
        secondary:
          'bg-secondary/10 text-secondary-foreground border border-secondary/20 shadow-sm hover:bg-secondary/20 hover:shadow-md',
        ghost:
          'hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/30 active:bg-accent/60',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80',
      },
      size: {
        default: 'h-11 px-8 py-2.5 has-[>svg]:px-6',
        sm: 'h-9 rounded-lg gap-1.5 px-5 text-xs has-[>svg]:px-4',
        lg: 'h-12 rounded-xl px-10 text-base has-[>svg]:px-8',
        icon: 'size-11 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
