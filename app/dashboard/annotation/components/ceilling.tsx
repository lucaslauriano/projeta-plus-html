'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useCeilingAnnotation } from '@/hooks/useCeilingAnnotation';
import { useLightingAnnotation } from '@/hooks/useLightingAnnotation';
import { useCircuitConnection } from '@/hooks/useCircuitConnection';

const AnnotationLightingCeilingContent = dynamic(
  () => Promise.resolve(AnnotationCeilingInner),
  {
    ssr: false,
  }
);

export default function AnnotationLightingCeiling() {
  return <AnnotationLightingCeilingContent />;
}

function AnnotationCeilingInner() {
  const { startCeilingAnnotation, isLoading: isCeilingLoading } =
    useCeilingAnnotation();

  const { startLightingAnnotation, isLoading: isLightingLoading } =
    useLightingAnnotation();

  const { startCircuitConnection, isLoading: isCircuitLoading } =
    useCircuitConnection();

  const handleCeilingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startCeilingAnnotation();
  };

  const handleLightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startLightingAnnotation();
  };

  const handleCircuitConnectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startCircuitConnection();
  };

  return (
    <div className='space-y-8'>
      {/* Forro Section */}
      <div className='w-full mx-auto'>
        <h2 className='text-lg font-semibold mb-4 text-center'>Forro</h2>
        <form onSubmit={handleCeilingSubmit}>
          <div className='flex flex-col items-center space-y-4'>
            <Button type='submit' disabled={isCeilingLoading} size='lg'>
              {isCeilingLoading ? 'Ativando Ferramenta...' : 'Área + PD'}
            </Button>
          </div>
        </form>
      </div>

      {/* Iluminação Section */}
      <div className='w-full mx-auto'>
        <h2 className='text-lg font-semibold mb-4 text-center'>Iluminação</h2>
        <div className='flex flex-col items-center space-y-4'>
          <form onSubmit={handleLightingSubmit} className='w-full'>
            <Button
              type='submit'
              disabled={isLightingLoading}
              size='lg'
              className='w-full'
            >
              {isLightingLoading ? 'Ativando Ferramenta...' : 'Circuitos'}
            </Button>
          </form>

          <form onSubmit={handleCircuitConnectionSubmit} className='w-full'>
            <Button
              type='submit'
              disabled={isCircuitLoading}
              size='lg'
              className='w-full'
            >
              {isCircuitLoading ? 'Ativando Ferramenta...' : 'Ligar Circuitos'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
