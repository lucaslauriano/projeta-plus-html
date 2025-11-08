'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useSectionAnnotation } from '@/hooks/useSectionAnnotation';
import { useViewIndication } from '@/hooks/useViewIndication';

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
      <div className='space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50'>
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold text-foreground'>Cortes</h3>
          <p className='text-xs text-muted-foreground'>
            Ativar ferramenta de anotação de cortes no modelo
          </p>
        </div>
        <form onSubmit={handleSectionSubmit} className='w-full'>
          <Button
            type='submit'
            disabled={sectionLoading}
            size='lg'
            className='w-full'
          >
            {sectionLoading ? 'Ativando...' : 'Criar Anotação de Corte'}
          </Button>
        </form>
      </div>

      {/* Vista */}
      <div className='space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50'>
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold text-foreground'>Vista</h3>
          <p className='text-xs text-muted-foreground'>
            Ativar ferramenta de anotação de vistas no modelo
          </p>
        </div>
        <form onSubmit={handleViewSubmit} className='w-full'>
          <Button
            type='submit'
            disabled={viewLoading}
            size='lg'
            className='w-full'
          >
            {viewLoading ? 'Ativando...' : 'Criar Anotação de Vista'}
          </Button>
        </form>
      </div>
    </div>
  );
}
