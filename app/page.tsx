'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';
import { Logo } from '@/components/icons/logo';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded || isSignedIn) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className='relative h-screen w-full overflow-hidden bg-background'>
      {/* Background images - Light: wave-light.png, Dark: wave-dark.png */}
      <div className='absolute inset-0'>
        {/* Light theme background */}
        <div
          className='absolute -top-5 inset-x-0 h-[60vh] dark:opacity-0 transition-opacity duration-300'
          style={{
            backgroundImage: 'url(/bg-light.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark theme background */}
        <div
          className='absolute -top-5 inset-x-0 h-[60vh] opacity-0 dark:opacity-100 transition-opacity duration-300'
          style={{
            backgroundImage: 'url(/bg-dark.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Topographic pattern overlay */}
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3) 1px, transparent 1px),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 2px, transparent 2px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 100px 100px',
          }}
        />
      </div>
      <div className='relative z-10 h-full flex items-end justify-center px-4'>
        <div className='w-full max-w-md'>
          <div className='bg-background p-8 space-y-8'>
            <div className='flex justify-center'>
              <Logo width={180} height={50} />
            </div>

            {/* Welcome text */}
            <div className='space-y-3 text-center'>
              <h1 className='text-xl font-bold text-foreground'> planejar, organizar e executar projetos</h1>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Faça login para acessar suas ferramentas
              </p>
            </div>

            {/* Continue button */}
            <SignInButton mode='modal'>
              <Button
                size='lg'
                className='w-full group relative overflow-hidden hover:bg-primary hover:text-primary-foreground'
                variant='ghost'
              >
                <span className='relative z-10 flex items-center justify-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors'>
                  Continuar
                  <ArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1' />
                </span>
              </Button>
            </SignInButton>
          </div>
        </div>
      </div>

      {/* Theme toggle button */}
      <div className='absolute top-6 right-6 z-20'>
        <ThemeToggleButton />
      </div>

      {/* Time display */}
      <div className='absolute top-6 left-6 z-20 text-foreground/80 text-sm font-medium'>
        {new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
}
