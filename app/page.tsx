'use client';

import { SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';
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

  if (!isLoaded) {
    return (
      <div className='h-full flex items-center justify-center bg-background'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className='h-full flex items-center justify-center bg-background'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='h-full flex items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center space-y-6'>
            <div className='flex items-center space-x-2'>
              <h1 className='text-3xl font-bold font-sans flex items-center'>
                Projeta <Plus className='h-6 w-6 font-bold text-secondary' />
              </h1>
            </div>

            <p className='text-center text-muted-foreground'>
              Faça login para acessar suas ferramentas profissionais de projeto
            </p>

            <SignInButton mode='modal'>
              <Button size='lg' className='w-full' variant='secondary'>
                Entrar
              </Button>
            </SignInButton>

            <div className='absolute top-4 right-4'>
              <ThemeToggleButton />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
