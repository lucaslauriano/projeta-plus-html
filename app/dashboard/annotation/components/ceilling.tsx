'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useCeilingAnnotation } from '@/hooks/useCeilingAnnotation';
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
    <div className='w-full max-w-lg mx-auto space-y-5'>
      {/* Forro Section */}
      <div className='space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-foreground'>Forro</h3>
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
                  Anotação com área da face selecionada e altura do pé-direito,
                  calculadas automaticamente. Não esquecer de informar o nível
                  do piso caso seja diferente de 0,00.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <form onSubmit={handleCeilingSubmit} className='space-y-4'>
          <Input
            type='text'
            placeholder='Ex: 0,00'
            label='Nível do Piso'
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          />
          <Button
            type='submit'
            size='lg'
            disabled={isCeilingLoading}
            className='w-full'
          >
            {isCeilingLoading ? 'Ativando...' : 'Criar Anotação'}
          </Button>
        </form>
      </div>

      {/* Iluminação Section */}
      <div className='space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-foreground'>Iluminação</h3>
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
                  Anotar os circuitos: digite no campo o valor do circuito,
                  clique para anotar e selecione as faces de interruptores.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className='space-y-4'>
          {/* Circuitos Form */}
          <form onSubmit={handleLightingSubmit} className='space-y-4'>
            <Input
              type='text'
              placeholder='Ex: C1 ou A'
              value={circuitText}
              onChange={(e) => setCircuitText(e.target.value)}
              required
            />
            <Button
              size='lg'
              type='submit'
              disabled={isLightingLoading}
              className='w-full'
            >
              {isLightingLoading ? 'Ativando...' : 'Anotar Circuitos'}
            </Button>
          </form>

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
                    Clique no botão para ligar os circuitos e selecione os
                    códigos dos circuitos.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Ligar Circuitos Form */}
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
  );
}
