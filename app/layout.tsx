import type React from 'react';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Montserrat } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ContrastProvider } from '@/contexts/ContrastContext';
import { SketchupProvider } from '@/contexts/SketchupContext';
import './globals.css';
import { Toaster } from '@/components/ui/toast';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
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
  return (
    <ClerkProvider>
      <html
        lang='en'
        className={`${montserrat.variable} antialiased h-full`}
        suppressHydrationWarning
      >
        <body className='h-full' suppressHydrationWarning>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
          >
            <ContrastProvider>
              <SketchupProvider>
                <div className=' bg-background h-full overflow-hidden '>
                  {children}
                </div>
                <Toaster />
              </SketchupProvider>
            </ContrastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
