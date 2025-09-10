import type React from 'react';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Projeta Plus Dashboard',
  description: 'SketchUp integration dashboard for Projeta Plus',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <html lang='en' className={`${manrope.variable} antialiased h-full`}>
      <body className='h-full'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {publishableKey ? (
            <ClerkProvider publishableKey={publishableKey}>
              {children}
            </ClerkProvider>
          ) : (
            <div className='min-h-screen flex items-center justify-center bg-background'>
              <div className='text-center space-y-4 p-8'>
                <h1 className='text-2xl font-bold text-destructive'>
                  Configuration Error
                </h1>
                <p className='text-muted-foreground max-w-md'>
                  Missing Clerk configuration. Please add your{' '}
                  <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> environment
                  variable.
                </p>
                <p className='text-sm text-muted-foreground'>
                  Get your keys at{' '}
                  <a
                    href='https://dashboard.clerk.com'
                    className='text-primary hover:underline'
                  >
                    dashboard.clerk.com
                  </a>
                </p>
              </div>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
