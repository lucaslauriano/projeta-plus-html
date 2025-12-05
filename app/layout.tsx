import type React from 'react';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ContrastProvider } from '@/contexts/ContrastContext';
import { SketchupProvider } from '@/contexts/SketchupContext';
import './globals.css';
import { ToastContainer } from 'react-toastify';

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
                <ToastContainer
                  position='bottom-right'
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  className='!bottom-6 !right-6'
                />
              </SketchupProvider>
            </ContrastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
