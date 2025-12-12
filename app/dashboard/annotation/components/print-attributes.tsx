'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useHeightAnnotation } from '@/hooks/useHeightAnnotation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export function PrintAttributes() {
  const { startHeightAnnotation, defaults, isLoading } = useHeightAnnotation();

  const [showUsage, setShowUsage] = useState(defaults.show_usage);

  React.useEffect(() => {
    setShowUsage(defaults.show_usage);
  }, [defaults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await startHeightAnnotation({
      show_usage: showUsage,
    });
  };

  return (
    <TooltipProvider>
      <div className='space-y-3  rounded-xl'>
        <div className='flex justify-between'>
          <h3 className='text-sm font-semibold text-foreground'>
            Anotação de Altura
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
                  Anotar a altura (ex.: H 60) ou a altura acompanhada do uso
                  (ex.: H 60 – PIA), aplicável somente a componentes dinâmicos
                  de pontos técnicos.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Show Usage Checkbox */}
          <Checkbox
            id='showUsage'
            label='Mostrar uso?'
            checked={showUsage}
            onCheckedChange={(checked) => setShowUsage(checked as boolean)}
            disabled={isLoading}
          />

          {/* Submit Button */}
          <Button
            type='submit'
            size='lg'
            disabled={isLoading}
            className='w-full'
          >
            {isLoading ? 'Executando...' : 'Criar Anotação'}
          </Button>
        </form>
      </div>
    </TooltipProvider>
  );
}
