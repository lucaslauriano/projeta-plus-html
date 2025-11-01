'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useHeightAnnotation } from '@/hooks/useHeightAnnotation';

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
    <div className='border border-border rounded-md p-4'>
      <div className='w-full mx-auto'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Show Usage Checkbox */}
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='showUsage'
              checked={showUsage}
              onCheckedChange={(checked) => setShowUsage(checked as boolean)}
              disabled={isLoading}
            />
            <label
              htmlFor='showUsage'
              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
            >
              Mostrar uso?
            </label>
          </div>

          {/* Submit Button */}
          <div className='flex items-center justify-center mt-4'>
            <Button
              type='submit'
              size='lg'
              disabled={isLoading}
              className='min-w-[150px]'
            >
              {isLoading ? 'Executando...' : 'Anotação de Altura'}
            </Button>
          </div>
        </form>

        <div className='mt-4 p-3 bg-muted rounded-md text-sm'>
          <p className='font-medium mb-1'>Instruções:</p>
          <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
            <li>Use as setas ↑ ↓ ← → para mudar a posição do texto</li>
            <li>Pressione Ctrl para alternar rotação (0° / 90°)</li>
            <li>Use +/- para ajustar a distância do texto</li>
            <li>ESC para cancelar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
