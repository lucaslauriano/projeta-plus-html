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
              Configure e aplique anotações de altura nos elementos
            </p>
          </div>

          {/* Tooltip with Instructions */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type='button'
                className='p-2 rounded-lg hover:bg-accent/50 transition-colors'
              >
                <InfoIcon className='h-4 w-4 text-muted-foreground' />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side='left'
              className='max-w-xs p-4 bg-popover border-border'
            >
              <div className='space-y-3'>
                <p className='text-xs font-semibold text-foreground'>
                  Instruções:
                </p>
                <ul className='space-y-2 text-xs text-muted-foreground'>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary font-mono font-semibold'>
                      ↑↓←→
                    </span>
                    <span>Mudar posição do texto</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary font-mono font-semibold'>
                      Ctrl
                    </span>
                    <span>Alternar rotação (0° / 90°)</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary font-mono font-semibold'>
                      +/-
                    </span>
                    <span>Ajustar distância do texto</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='text-primary font-mono font-semibold'>
                      ESC
                    </span>
                    <span>Cancelar</span>
                  </li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
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
            {isLoading ? 'Executando...' : 'Criar Anotação de Altura'}
          </Button>
        </form>
      </div>
    </TooltipProvider>
  );
}
