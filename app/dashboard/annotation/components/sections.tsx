'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { useAnnotations } from '@/hooks/useAnnotations';

const AnnotationSectionContent = dynamic(
  () => Promise.resolve(AnnotationSectionInner),
  {
    ssr: false,
  }
);

export default function AnnotationSection() {
  return <AnnotationSectionContent />;
}

function AnnotationSectionInner() {
  const { activateViewAnnotationTool, startSectionAnnotation, isLoading } =
    useAnnotations();

  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startSectionAnnotation();
  };

  const handleViewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    activateViewAnnotationTool();
  };

  return (
    <div className='w-full max-w-lg mx-auto'>
      <div className='space-y-2 gap-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-foreground'>Cortes</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  className='p-1 hover:bg-accent rounded-md transition-colors'
                >
                  <Info className='w-4 h-4 text-muted-foreground' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-sm'>
                  Anota automaticamente todas as seções existentes no modelo,
                  atribuindo o nome da seção conforme o identificador do corte
                  definido nas informações da entidade.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <form onSubmit={handleSectionSubmit} className='w-full'>
          <Button
            type='submit'
            disabled={isLoading}
            size='sm'
            className='w-full'
          >
            {isLoading ? 'Ativando...' : 'Criar Anotação'}
          </Button>
        </form>

        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-foreground'>Vistas</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  className='p-1 hover:bg-accent rounded-md transition-colors'
                >
                  <Info className='w-4 h-4 text-muted-foreground' />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-sm'>
                  Insere a simbologia de indicação de vistas no centro da face
                  selecionada. Utilize essa simbologia para gerar cortes por
                  ambiente na área de Seções do SketchUp Inteligente.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <form onSubmit={handleViewSubmit} className='w-full'>
          <Button
            type='submit'
            size='sm'
            disabled={isLoading}
            className='w-full'
          >
            {isLoading ? 'Ativando...' : 'Inserir Anotação'}
          </Button>
        </form>
      </div>
    </div>
  );
}
