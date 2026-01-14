'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  steps?: Array<{ label: string }>;
  description?: string | React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  steps,
  icon: Icon,
  description,
}: EmptyStateProps) {
  return (
    <div>
      <div className='flex flex-col items-center justify-center py-6 px-4'>
        <div className='rounded-full bg-muted p-6 mb-4'>
          <Icon className='w-12 h-12 text-primary' />
        </div>
        <h3 className='text-md font-semibold mb-2 text-center'>{title}</h3>

        {description &&
          (typeof description === 'string' ? (
            <p className='text-sm text-muted-foreground text-center max-w-md mb-4'>
              {description}
            </p>
          ) : (
            <div className='text-sm text-muted-foreground text-center max-w-md mb-4'>
              {description}
            </div>
          ))}

        {steps && steps.length > 0 && (
          <div className='flex flex-col md:flex-row items-center gap-2 text-xs text-muted-foreground'>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className='flex items-center gap-1'>
                  <div className='w-2 h-2 rounded-full bg-primary' />
                  <span>{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <>
                    <span className='hidden md:inline'>→</span>
                    <span className='md:hidden'>↓</span>
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
