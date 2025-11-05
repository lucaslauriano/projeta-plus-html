'use client';

import { useRef } from 'react';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Package,
  Layers,
  Zap,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type PricingSectionProps = {
  userPlan: 'free' | 'premium';
};

export function PricingSection({ userPlan }: PricingSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Pricing Table - Only for Free Users */}
      {userPlan === 'free' && (
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-bold font-sans'>Seja Premium!</h2>
              <p className='text-sm text-muted-foreground font-serif'>
                Desbloqueie todos os recursos e módulos
              </p>
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='icon'
                onClick={() => scroll('left')}
                className='hidden md:flex'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => scroll('right')}
                className='hidden md:flex'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className='flex gap-6 overflow-x-auto py-4 snap-x snap-mandatory no-scrollbar'
          >
            {/* Free Plan */}
            <Card className='relative min-w-[280px] md:min-w-[380px] snap-start flex-shrink-0'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='font-sans'>Free</CardTitle>
                  <Badge variant='outline' className='bg-muted'>
                    Atual
                  </Badge>
                </div>
                <div className='mt-4'>
                  <span className='text-3xl font-bold font-sans'>R$ 0</span>
                  <span className='text-muted-foreground font-serif'>/mês</span>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h4 className='font-bold text-sm mb-2'>Módulos Inclusos:</h4>
                  <ul className='space-y-2 mb-4'>
                    {[
                      { text: '✓ Anotações', available: true },
                      { text: 'Iluminação', available: false },
                      { text: 'Esquadrias', available: false },
                      { text: 'Mobiliário', available: false },
                      { text: 'Revestimentos & Rodapés', available: false },
                      { text: 'Pontos Técnicos', available: false },
                    ].map((module, i) => (
                      <li key={i} className='flex items-center gap-2'>
                        {module.available ? (
                          <Check className='h-4 w-4 text-secondary' />
                        ) : (
                          <X className='h-4 w-4 text-muted-foreground' />
                        )}
                        <span
                          className={`text-sm font-serif ${
                            module.available
                              ? 'text-foreground font-medium'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {module.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='border-t pt-3'>
                  <h4 className='font-bold text-sm mb-2'>Recursos:</h4>
                  <ul className='space-y-2'>
                    {[{ text: 'Biblioteca básica', available: true }].map(
                      (feature, i) => (
                        <li key={i} className='flex items-center gap-2'>
                          {feature.available ? (
                            <Check className='h-4 w-4 text-secondary' />
                          ) : (
                            <X className='h-4 w-4 text-muted-foreground' />
                          )}
                          <span
                            className={`text-sm font-serif ${
                              feature.available
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className='relative border-secondary shadow-lg min-w-[280px] md:min-w-[380px] snap-start flex-shrink-0'>
              <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                <Badge variant='secondary' className='bg-secondary text-white'>
                  <Zap className='h-3 w-3 mr-1' />
                  Recomendado
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className='font-sans'>Premium</CardTitle>
                <div className='mt-4'>
                  <span className='text-3xl font-bold font-sans'>R$ 349</span>
                  <span className='text-muted-foreground font-serif'>/mês</span>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h4 className='font-bold text-sm mb-2'>Módulos Inclusos:</h4>
                  <ul className='space-y-2 mb-4'>
                    {[
                      'Anotações',
                      'Iluminação',
                      'Esquadrias',
                      'Mobiliário',
                      'Revestimentos & Rodapés',
                      'Pontos Técnicos',
                    ].map((module, i) => (
                      <li key={i} className='flex items-center gap-2'>
                        <Check className='h-4 w-4 text-secondary' />
                        <span className='text-sm font-serif font-medium'>
                          {module}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='border-t pt-3'>
                  <h4 className='font-bold text-sm mb-2'>Recursos:</h4>
                  <ul className='space-y-2 mb-4'>
                    {[
                      'Biblioteca completa',
                      'Relatórios avançados',
                      'Atualizações exclusivas',
                    ].map((feature, i) => (
                      <li key={i} className='flex items-center gap-2'>
                        <Check className='h-4 w-4 text-secondary' />
                        <span className='text-sm font-serif'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className='w-full' variant='secondary' size='lg'>
                  Fazer Upgrade Agora
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Premium User Content */}
      {userPlan === 'premium' && (
        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='font-sans'>Projetos Recentes</CardTitle>
              <CardDescription className='font-serif'>
                Seus últimos projetos do SketchUp
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {[
                {
                  name: 'Apartamento 302',
                  date: '2 horas atrás',
                  components: 45,
                },
                {
                  name: 'Escritório Cliente A',
                  date: '1 dia atrás',
                  components: 78,
                },
                {
                  name: 'Casa Praia',
                  date: '3 dias atrás',
                  components: 123,
                },
                {
                  name: 'Reforma Sala Comercial',
                  date: '5 dias atrás',
                  components: 34,
                },
              ].map((project, i) => (
                <div key={i} className='flex items-center justify-between'>
                  <div>
                    <p className='font-medium font-serif'>{project.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {project.date}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium font-sans'>
                      {project.components} comp.
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='font-sans'>Ações Rápidas</CardTitle>
              <CardDescription className='font-serif'>
                Acesso rápido às ferramentas
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button className='w-full justify-start' variant='outline'>
                <FileText className='mr-2 h-4 w-4' />
                Criar Nova Anotação
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <Package className='mr-2 h-4 w-4' />
                Biblioteca de Componentes
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <Layers className='mr-2 h-4 w-4' />
                Gerar Relatório
              </Button>
              <Button className='w-full justify-start' variant='outline'>
                <Zap className='mr-2 h-4 w-4' />
                Configurações
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
