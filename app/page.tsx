'use client';

import { SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Plus, FileText, Package, FileOutput } from 'lucide-react';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <div className='h-full bg-background overflow-y-auto'>
      <SignedOut>
        <LandingPage />
      </SignedOut>
    </div>
  );
}

function AnimatedSubtitle() {
  const subtitles = [
    'Turbine seu SketchUp com anotações inteligentes e ferramentas profissionais',
    'Do conceito ao projeto executivo em tempo recorde',
    'Projete mais rápido. Anote melhor. Entregue com confiança.',
    'Transforme seu SketchUp em uma máquina de projetos executivos',
    'Plugins profissionais para arquitetos que valorizam seu tempo',
    'Inteligência encontra design. Criatividade encontra produtividade.',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % subtitles.length);
        setFadeIn(true);
      }, 1000);
    }, 4000);

    return () => clearInterval(interval);
  }, [subtitles.length]);

  return (
    <p
      className={`text-xl font-serif text-muted-foreground mb-8 leading-relaxed transition-opacity duration-500 ${
        fadeIn ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {subtitles[currentIndex]}
    </p>
  );
}

function LandingPage() {
  return (
    <div className='flex flex-col'>
      <header className='border-b bg-card'>
        <div className='container mx-auto px-3 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-2 w-full'>
            <h1 className='text-xl font-bold font-sans flex mt-2'>
              Projeta <Plus className='h-4 w-4 mt-1 font-bold text-secondary' />
            </h1>
          </div>
          <SignInButton mode='modal'>
            <Button variant='outline'>Sign In</Button>
          </SignInButton>
          <ThemeToggleButton />
        </div>
      </header>

      <main className='flex-1'>
        <section className='py-20 px-4'>
          <div className='container mx-auto text-center max-w-4xl'>
            <div className='flex items-center justify-center space-x-3 w-full'>
              <h1 className='flex items-center text-5xl font-bold font-sans mb-6 text-foreground'>
                Projeta <Plus className='h-10 w-10 font-bold text-secondary' />
              </h1>
            </div>
            <AnimatedSubtitle />
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <SignInButton mode='modal'>
                <Button size='lg' className='text-lg px-8' variant='secondary'>
                  Comece Agora
                </Button>
              </SignInButton>
              <Button variant='outline' size='lg' className='text-lg px-8 '>
                Premium Plus
              </Button>
            </div>
          </div>
        </section>

        <section className='py-10 px-4 bg-muted/30'>
          <div className='container mx-auto max-w-6xl'>
            <h3 className='text-3xl font-bold font-sans text-center mb-12'>
              Tudo que você precisa para projetos profissionais
            </h3>
            <div className='grid md:grid-cols-3 gap-8'>
              <Card>
                <CardHeader>
                  <FileText className='h-12 w-12 text-secondary mb-4' />
                  <CardTitle className='font-sans'>
                    Anotações Inteligentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='font-serif'>
                    Anote ambientes, alturas, vistas, circuitos elétricos e
                    seções automaticamente. Documentação profissional em
                    segundos.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Package className='h-12 w-12 text-secondary mb-4' />
                  <CardTitle className='font-sans'>
                    Bibliotecas Completas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='font-serif'>
                    Mobiliário, iluminação, esquadrias, revestimentos e rodapés.
                    Componentes prontos para seus projetos de interiores.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FileOutput className='h-12 w-12 text-secondary mb-4' />
                  <CardTitle className='font-sans'>
                    Relatórios Automáticos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='font-serif'>
                    Gere layouts customizados e relatórios detalhados
                    automaticamente. Do modelo 3D à prancha final em minutos.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t bg-card py-8'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <div>
              <h4 className='font-bold font-sans mb-4 flex items-center'>
                Projeta <Plus className='h-4 w-4 ml-1 text-secondary' />
              </h4>
              <p className='text-sm text-muted-foreground font-serif'>
                Plugins profissionais para SketchUp que transformam seu workflow
                de projetos.
              </p>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-2 gap-4 mb-4 justify-center items-center'>
              <div>
                <h4 className='font-bold font-sans mb-4'>Produto</h4>
                <ul className='space-y-2 text-sm text-muted-foreground font-serif'>
                  <li>
                    <a
                      href='#'
                      className='hover:text-foreground transition-colors'
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='hover:text-foreground transition-colors'
                    >
                      Preços
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='hover:text-foreground transition-colors'
                    >
                      Documentação
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className='font-bold font-sans mb-4'>Empresa</h4>
                <ul className='space-y-2 text-sm text-muted-foreground font-serif'>
                  <li>
                    <a
                      href='#'
                      className='hover:text-foreground transition-colors'
                    >
                      Sobre
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='hover:text-foreground transition-colors'
                    >
                      Contato
                    </a>
                  </li>
                  <li>
                    <a
                      href='#'
                      className='hover:text-foreground transition-colors'
                    >
                      Suporte
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className='border-t pt-8 text-center'>
            <p className='text-sm text-muted-foreground font-serif'>
              © {new Date().getFullYear()} Panda Experience. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
