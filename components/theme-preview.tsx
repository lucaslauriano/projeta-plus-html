'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export function ThemePreview() {
  return (
    <div className='space-y-6 mt-4'>
      <Card>
        <CardHeader>
          <CardTitle>Visualização de Cores</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 '>
          {/* Color Swatches */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='space-y-2'>
              <div className='h-20 rounded-lg bg-primary flex items-center justify-center'>
                <span className='text-primary-foreground font-semibold text-sm'>
                  Primary
                </span>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='h-20 rounded-lg bg-secondary flex items-center justify-center'>
                <span className='text-secondary-foreground font-semibold text-sm'>
                  Secondary
                </span>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='h-20 rounded-lg bg-accent flex items-center justify-center'>
                <span className='text-accent-foreground font-semibold text-sm'>
                  Accent
                </span>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='h-20 rounded-lg bg-muted flex items-center justify-center'>
                <span className='text-muted-foreground font-semibold text-sm'>
                  Muted
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-sm'>Botões</h3>
            <div className='flex flex-wrap gap-2'>
              <Button variant='default'>Default</Button>
              <Button variant='secondary'>Secondary</Button>
              <Button variant='outline'>Outline</Button>
              <Button variant='ghost'>Ghost</Button>
              <Button variant='destructive'>Destructive</Button>
            </div>
          </div>

          {/* Badges */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-sm'>Badges</h3>
            <div className='flex flex-wrap gap-2'>
              <Badge variant='default'>Default</Badge>
              <Badge variant='secondary'>Secondary</Badge>
              <Badge variant='outline'>Outline</Badge>
              <Badge variant='destructive'>Destructive</Badge>
            </div>
          </div>

          {/* Alerts */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-sm'>Alertas</h3>
            <Alert>
              <Info className='h-4 w-4' />
              <div>
                <strong>Info:</strong> Este é um alerta informativo
              </div>
            </Alert>
            <Alert variant='default'>
              <CheckCircle className='h-4 w-4' />
              <div>
                <strong>Sucesso:</strong> Operação concluída com sucesso
              </div>
            </Alert>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <div>
                <strong>Erro:</strong> Algo deu errado
              </div>
            </Alert>
          </div>

          {/* Typography */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-sm'>Tipografia</h3>
            <div className='space-y-2'>
              <h1 className='text-4xl font-bold'>Heading 1</h1>
              <h2 className='text-3xl font-semibold'>Heading 2</h2>
              <h3 className='text-2xl font-semibold'>Heading 3</h3>
              <p className='text-base'>
                Este é um parágrafo de texto normal. O contraste entre o texto e
                o fundo deve ser adequado para leitura confortável.
              </p>
              <p className='text-sm text-muted-foreground'>
                Este é um texto secundário com cor menos proeminente.
              </p>
            </div>
          </div>

          {/* Borders and Dividers */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-sm'>Bordas</h3>
            <div className='border border-border p-4 rounded-lg'>
              <p className='text-sm'>
                Card com borda. Teste de visibilidade das bordas.
              </p>
            </div>
            <div className='h-px bg-border' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
