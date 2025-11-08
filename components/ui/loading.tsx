import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({
  message = 'Carregando...',
  fullScreen = false,
  size = 'md',
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const content = (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div className='relative'>
        {/* Animated ring */}
        <div
          className={cn(
            'absolute inset-0 rounded-full border-4 border-primary/20',
            sizeClasses[size]
          )}
        />
        {/* Spinning loader */}
        <Loader2
          className={cn('animate-spin text-primary', sizeClasses[size])}
        />
      </div>

      {message && (
        <div className='flex flex-col items-center gap-2'>
          <p
            className={cn('font-medium text-foreground', textSizeClasses[size])}
          >
            {message}
          </p>
          <div className='flex gap-1'>
            <span
              className='h-2 w-2 bg-primary rounded-full animate-bounce'
              style={{ animationDelay: '0ms' }}
            />
            <span
              className='h-2 w-2 bg-primary rounded-full animate-bounce'
              style={{ animationDelay: '150ms' }}
            />
            <span
              className='h-2 w-2 bg-primary rounded-full animate-bounce'
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
        <div className='rounded-3xl bg-card border border-border shadow-2xl p-12'>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-[400px] w-full'>
      {content}
    </div>
  );
}
