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
import { InfoIcon } from 'lucide-react';

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
      <div className='space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <h3 className='text-sm font-semibold text-foreground'>
              Anotação de Altura
            </h3>
            <p className='text-xs text-muted-foreground'>
              Anotar a altura (ex: H 60) ou <br /> altura + uso (ex: H 60 - PIA). <br /> Apenas para componentes dinâmicos de pontos técnicos.
            </p>
          </div>

          
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
