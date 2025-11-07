'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useCeilingAnnotation } from '@/hooks/useCeilingAnnotation';
import { useLightingAnnotation } from '@/hooks/useLightingAnnotation';
import { useCircuitConnection } from '@/hooks/useCircuitConnection';
import { Input } from '@/components/ui/input';

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
  const [circuitText, setCircuitText] = useState('C1');
  const { startCeilingAnnotation, isLoading: isCeilingLoading } =
    useCeilingAnnotation();

  const {
    startLightingAnnotation,
    isLoading: isLightingLoading,
    defaults,
  } = useLightingAnnotation();

  const { startCircuitConnection, isLoading: isCircuitLoading } =
    useCircuitConnection();

  const handleCeilingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startCeilingAnnotation();
  };

  const handleLightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startLightingAnnotation({
      circuit_text: circuitText,
      circuit_scale: defaults.circuit_scale,
      circuit_height_cm: defaults.circuit_height_cm,
      circuit_font: defaults.circuit_font,
      circuit_text_color: defaults.circuit_text_color,
    });
  };

  const handleCircuitConnectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startCircuitConnection();
  };

  return (
    <div className='border border-border rounded-md p-4 space-y-8'>
      {/* Forro Section */}
      <div className='w-full mx-auto'>
        <h2 className='text-lg font-semibold mb-4 text-start'>Forro</h2>
        <form
          onSubmit={handleCeilingSubmit}
          className='w-full flex items-center justify-center'
        >
          <Button
            type='submit'
            size='lg'
            disabled={isCeilingLoading}
            className='w-[150px]'
          >
            {isCeilingLoading ? 'Ativando Ferramenta...' : 'Área + PD'}
          </Button>
        </form>
      </div>

      {/* Iluminação Section */}
      <div className='w-full mx-auto'>
        <h2 className='text-lg font-semibold mb-4 text-start'>Iluminação</h2>
        <div className='flex flex-col items-center space-y-4'>
          <form
            onSubmit={handleLightingSubmit}
            className='w-full flex flex-col gap-y-4 items-center justify-center'
          >
            <Input
              type='text'
              placeholder='Ex: A ou C1'
              className='w-full'
              label='Circuito'
              value={circuitText}
              onChange={(e) => setCircuitText(e.target.value)}
              required
            />
            <Button
              size='lg'
              type='submit'
              disabled={isLightingLoading}
              className='w-[150px]'
            >
              {isLightingLoading ? 'Ativando Ferramenta...' : 'Circuitos'}
            </Button>
          </form>

          <form
            onSubmit={handleCircuitConnectionSubmit}
            className='w-full flex items-center justify-center'
          >
            <Button
              size='lg'
              type='submit'
              disabled={isCircuitLoading}
              className='w-[150px]'
            >
              {isCircuitLoading ? 'Ativando Ferramenta...' : 'Ligar Circuitos'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
