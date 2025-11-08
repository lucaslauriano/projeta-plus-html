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
  const [level, setLevel] = useState('0,00');
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
    <div className='space-y-4'>
      {/* Forro Section */}
      <div className='w-full mx-auto border border-border rounded-md p-4'>
        <h2 className='text-md font-medium mb-1 text-start'>Forro</h2>
        <p className='text-xs text-muted-foreground mb-4 text-start'>
          Gere anotação com a área e a altura do pé-direito, calculadas
          automaticamente a partir do ponto 0 (Z) somado ao nível do piso.
        </p>
        <form
          onSubmit={handleCeilingSubmit}
          className='w-full flex flex-col gap-y-4 items-center justify-center'
        >
          <Input
            type='text'
            placeholder='Ex: A ou C1'
            className='w-full'
            label='Nível do Piso:'
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          />
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
      <div className='w-full mx-auto border border-border rounded-md p-4 space-y-8'>
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
