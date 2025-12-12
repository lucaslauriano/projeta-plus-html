'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useLightingAnnotation } from '@/hooks/useLightingAnnotation';
import { useCircuitConnection } from '@/hooks/useCircuitConnection';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const AnnotationLightingContent = dynamic(
  () => Promise.resolve(AnnotationLightingInner),
  {
    ssr: false,
  }
);

export default function AnnotationLighting() {
  return <AnnotationLightingContent />;
}

function AnnotationLightingInner() {
  const [circuitText, setCircuitText] = useState('C1');
  const {
    startLightingAnnotation,
    isLoading: isLightingLoading,
    defaults,
  } = useLightingAnnotation();

  const { startCircuitConnection, isLoading: isCircuitLoading } =
    useCircuitConnection();

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
    <div className='w-full max-w-lg mx-auto space-y-5'>
      <div className='space-y-3 rounded-xl'>
        <div className='space-y-4'>
          <form onSubmit={handleLightingSubmit} className='space-y-2'>
            <Input
              type='text'
              placeholder='Ex: C1 ou A'
              label='Código do Circuito'
              value={circuitText}
              tooltip='Anotar os circuitos digitando o valor no campo, clicando para
                  registrar e selecionando as faces dos interruptores,
                  utilizando as setas para alterar a direção.'
              onChange={(e) => setCircuitText(e.target.value)}
              required
            />
            <Button
              type='submit'
              disabled={isLightingLoading}
              className='w-full'
            >
              {isLightingLoading ? 'Ativando...' : 'Anotar Circuitos'}
            </Button>
          </form>

          <div className='flex flex-col space-y-2'>
            <div className='flex items-center justify-between'>
              <h4 className='text-sm font-medium text-foreground'>
                Ligar Circuitos
              </h4>
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
                      Ligar os circuitos clicando no botão e selecionando os
                      códigos correspondentes criados anteriormente.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <form onSubmit={handleCircuitConnectionSubmit}>
              <Button
                size='lg'
                type='submit'
                disabled={isCircuitLoading}
                className='w-full'
              >
                {isCircuitLoading ? 'Ativando...' : 'Ligar Circuitos'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
