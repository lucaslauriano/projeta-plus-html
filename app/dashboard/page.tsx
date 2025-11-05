'use client';

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Package, Layers, Clock, Zap, Check, X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  // Verificar se o usuário tem plano premium no metadata do Clerk
  const hasPremiumPlan =
    user?.publicMetadata?.plan === 'premium' ||
    user?.publicMetadata?.plan === 'pro_user';
  const userPlan: 'free' | 'premium' = hasPremiumPlan ? 'premium' : 'free';

  if (!isLoaded) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-muted-foreground'>Carregando...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold font-sans'>Dashboard</h1>
          <p className='text-muted-foreground font-serif'>
            Bem-vindo ao Projeta Plus! Aqui está seu resumo.
          </p>
        </div>
        <Badge
          variant='secondary'
          className={
            userPlan === 'free'
              ? 'bg-muted text-muted-foreground'
              : 'bg-secondary/20 text-secondary'
          }
        >
          {userPlan === 'free' ? 'Plano Free' : 'Plano Premium'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium font-serif'>
              Projetos Criados
            </CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-sans'>
              {userPlan === 'free' ? '3' : '47'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {userPlan === 'free'
                ? 'Limite: 5 projetos'
                : 'Projetos ilimitados'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium font-serif'>
              Módulos Ativos
            </CardTitle>
            <Package className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-sans'>
              {userPlan === 'free' ? '1/6' : '6/6'}
            </div>
            <p className='text-xs text-muted-foreground'>
              {userPlan === 'free' ? 'Apenas Anotações' : 'Todos os módulos'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium font-serif'>
              Anotações
            </CardTitle>
            <Layers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-sans'>
              {userPlan === 'free' ? '8' : '156'}
            </div>
            <p className='text-xs text-muted-foreground'>Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium font-serif'>
              Tempo Economizado
            </CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold font-sans'>
              {userPlan === 'free' ? '2h' : '18h'}
            </div>
            <p className='text-xs text-muted-foreground'>Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Table - Only for Free Users */}
      {userPlan === 'free' && (
        <div className='space-y-4'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold font-sans mb-2'>
              Desbloqueie Todo o Potencial do Projeta Plus
            </h2>
            <p className='text-muted-foreground font-serif'>
              Upgrade para Premium e transforme seu workflow
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            {/* Free Plan */}
            <Card className='relative'>
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
                    {[
                      { text: 'Até 5 projetos', available: true },
                      { text: 'Biblioteca básica', available: true },
                      { text: 'Suporte por email', available: true },
                      { text: 'Relatórios avançados', available: false },
                      { text: 'Exportação premium', available: false },
                    ].map((feature, i) => (
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
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className='relative border-secondary shadow-lg'>
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
                      'Projetos ilimitados',
                      'Biblioteca completa',
                      'Relatórios avançados',
                      'Exportação premium',
                      'Suporte prioritário',
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
    </div>
  );
}
