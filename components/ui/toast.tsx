'use client';

import {
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  CircleCheckIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      closeButton={true}
      icons={{
        success: <CircleCheckIcon className='size-4' />,
        info: <InfoIcon className='size-4' />,
        warning: <TriangleAlertIcon className='size-4' />,
        error: <OctagonXIcon className='size-4' />,
        loading: <Loader2Icon className='size-4 animate-spin' />,
      }}
      toastOptions={{
        classNames: {
          toast: 'group toast',
          success:
            '!bg-green-50 !dark:bg-green-950 !text-green-900 !dark:text-green-100 !border-green-200 !dark:border-green-800',
          error:
            '!bg-red-50 !dark:bg-red-950 !text-red-900 !dark:text-red-100 !border-red-200 !dark:border-red-800',
          warning:
            '!bg-yellow-50 !dark:bg-yellow-950 !text-yellow-900 !dark:text-yellow-100 !border-yellow-200 !dark:border-yellow-800',
          info: '!bg-blue-50 !dark:bg-blue-950 !text-blue-900 !dark:text-blue-100 !border-blue-200 !dark:border-blue-800',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
          '--success-bg': 'hsl(142 76% 95%)',
          '--success-text': 'hsl(142 76% 20%)',
          '--success-border': 'hsl(142 76% 80%)',
          '--error-bg': 'hsl(0 84% 95%)',
          '--error-text': 'hsl(0 84% 20%)',
          '--error-border': 'hsl(0 84% 80%)',
          '--warning-bg': 'hsl(48 96% 95%)',
          '--warning-text': 'hsl(48 96% 20%)',
          '--warning-border': 'hsl(48 96% 80%)',
          '--info-bg': 'hsl(214 95% 95%)',
          '--info-text': 'hsl(214 95% 20%)',
          '--info-border': 'hsl(214 95% 80%)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
