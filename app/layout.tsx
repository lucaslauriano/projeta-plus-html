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
  title: 'SaaS Billing Dashboard',
  description: 'Modern SaaS billing with Clerk + Stripe integration',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <html lang='en' className={`${manrope.variable} antialiased`}>
        <body>
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
        </body>
      </html>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang='en' className={`${manrope.variable} antialiased`}>
        <body>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
