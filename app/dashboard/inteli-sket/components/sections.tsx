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
            Seções
          </h2>
        </div>
      </div>

      <div className='flex flex-col gap-3 w-full'>
        <Button size='sm' variant='default'>
          <Grid3x3 className='w-5 h-5' />
          Cortes Gerais
        </Button>

        <Button size='sm' variant='default'>
          <Eye className='w-5 h-5' />
          Vistas Auto
        </Button>

        <Button size='sm' variant='default'>
          <Scissors className='w-5 h-5' />
          Corte Individual
        </Button>
      </div>
    </div>
  );
}
