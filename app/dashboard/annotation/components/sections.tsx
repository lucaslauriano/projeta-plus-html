'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useSectionAnnotation } from '@/hooks/useSectionAnnotation';
import { useViewIndication } from '@/hooks/useViewIndication';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

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
  const { startSectionAnnotation, isLoading: sectionLoading } =
    useSectionAnnotation();
  const { activateViewIndicationTool, isLoading: viewLoading } =
    useViewIndication();

  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startSectionAnnotation();
  };

  const handleViewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    activateViewIndicationTool();
  };

  return (
    <div className='w-full max-w-lg mx-auto space-y-4'>
      {/* Cortes */}
      <div className='space-y-3 gap-y-4 p-4 bg-muted/30 rounded-xl border border-border/50'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-foreground'>
            Cortes
            <p className='text-xs font-extralight'>Vai ficar uma merdinha</p>
          </h3>
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
              <TooltipContent className='max-w-xs'>
                <p className='text-sm'>
                  Anotação de todas as seções no modelo, com o nome atribuído
                  automaticamente.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <form onSubmit={handleSectionSubmit} className='w-full'>
          <Button
            type='submit'
            disabled={sectionLoading}
            size='sm'
            className='w-full'
          >
            {sectionLoading ? 'Ativando...' : 'Criar Anotação'}
          </Button>
        </form>

        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-foreground'>
            Vistas
            <p className='font-extralight'>Palmeiras n tem mundial</p>
          </h3>
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
              <TooltipContent className='max-w-xs'>
                <p className='text-sm'>
                  Inserir bloco de indicação de vistas no centro da face
                  selecionada.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <form onSubmit={handleViewSubmit} className='w-full'>
          <Button
            type='submit'
            disabled={viewLoading}
            size='sm'
            className='w-full'
          >
            {viewLoading ? 'Ativando...' : 'Inserir Anotação'}
          </Button>
        </form>
      </div>
    </div>
  );
}
