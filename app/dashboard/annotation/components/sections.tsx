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
    <div className='space-y-4'>
      <div className='flex flex-col space-y-4 border border-border rounded-md p-4 '>
        <h2 className='text-md font-semibold mb-4 text-start'>Cortes</h2>
        <form
          onSubmit={handleSectionSubmit}
          className='w-full flex items-center justify-center'
        >
          <Button
            type='submit'
            disabled={sectionLoading}
            size='lg'
            className='w-[150px]'
          >
            {sectionLoading ? 'Ativando Ferramenta...' : 'Anotação de Corte'}
          </Button>
        </form>
      </div>
      <div className='flex flex-col space-y-4 border border-border rounded-md p-4'>
        <h2 className='text-md font-semibold mb-4 text-start'>Vista</h2>
        <form
          onSubmit={handleViewSubmit}
          className='w-full flex items-center justify-center'
        >
          <Button
            type='submit'
            disabled={viewLoading}
            size='lg'
            className='w-[150px]'
          >
            {viewLoading ? 'Ativando Ferramenta...' : 'Anotação de Vista'}
          </Button>
        </form>
      </div>
    </div>
  );
}
