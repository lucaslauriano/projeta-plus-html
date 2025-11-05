import type React from 'react';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ContrastProvider } from '@/contexts/ContrastContext';
import { SketchupProvider } from '@/contexts/SketchupContext';
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
  return (
    <ClerkProvider>
      <html
        lang='en'
        className={`${manrope.variable} antialiased h-full`}
        suppressHydrationWarning
      >
        <body className='h-full'>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <ContrastProvider>
              <SketchupProvider>{children}</SketchupProvider>
            </ContrastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
