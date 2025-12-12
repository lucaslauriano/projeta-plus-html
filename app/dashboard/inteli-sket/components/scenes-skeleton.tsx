'use client';

import React from 'react';

export function ScenesSkeleton() {
  return (
    <div className='space-y-2'>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className='border rounded-xl overflow-hidden bg-muted/20 p-4 animate-pulse'
        >
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 bg-muted rounded' />
            <div className='h-4 bg-muted rounded w-32' />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScenesEmptyState() {
  return (
    <div className='p-8 text-center border-2 border-dashed rounded-xl bg-muted/10'>
      <svg
        className='w-12 h-12 mx-auto mb-3 text-muted-foreground/50'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
        />
      </svg>
      <p className='text-sm text-muted-foreground'>Nenhum grupo cadastrado</p>
      <p className='text-xs text-muted-foreground mt-1'>
        Adicione um grupo para começar
      </p>
    </div>
  );
}

export function ScenesLoadingState() {
  return (
    <div className='p-8 text-center border-2 border-dashed rounded-xl bg-muted/10'>
      <svg
        className='w-12 h-12 mx-auto mb-3 text-muted-foreground/50 animate-spin'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
      <p className='text-sm text-muted-foreground'>Carregando cenas...</p>
      <p className='text-xs text-muted-foreground mt-1'>
        Aguarde enquanto buscamos seus dados
      </p>
    </div>
  );
}
