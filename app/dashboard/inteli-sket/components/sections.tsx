'use client';

import React from 'react';
import { ScanLine, Grid3x3, Eye, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SectionsComponent() {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            <ScanLine className='w-4 h-4' />
            Seções
          </h2>
        </div>
      </div>

      <div className='flex flex-col gap-3 w-full'>
        <Button
          className='w-full flex items-center gap-3 justify-center text-base'
          variant='default'
        >
          <Grid3x3 className='w-5 h-5' />
          Cortes Gerais
        </Button>

        <Button
          className='w-full flex items-center gap-3 justify-center text-base'
          variant='default'
        >
          <Eye className='w-5 h-5' />
          Vistas Auto
        </Button>

        <Button
          className='w-full flex items-center gap-3 justify-center text-base'
          variant='default'
        >
          <Scissors className='w-5 h-5' />
          Corte Individual
        </Button>
      </div>
    </div>
  );
}
