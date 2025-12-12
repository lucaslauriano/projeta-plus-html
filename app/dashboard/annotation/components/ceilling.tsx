'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useCeilingAnnotation } from '@/hooks/useCeilingAnnotation';
import { Input } from '@/components/ui/input';

const AnnotationCeilingContent = dynamic(
  () => Promise.resolve(AnnotationCeilingInner),
  {
    ssr: false,
  }
);

export default function AnnotationCeiling() {
  return <AnnotationCeilingContent />;
}

function AnnotationCeilingInner() {
  const [level, setLevel] = useState('0,00');
  const { startCeilingAnnotation, isLoading: isCeilingLoading } =
    useCeilingAnnotation();

  const handleCeilingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startCeilingAnnotation();
  };

  return (
    <div className='w-full max-w-lg mx-auto space-y-5'>
      <div className='space-y-3  rounded-xl '>
        <form onSubmit={handleCeilingSubmit} className='space-y-2'>
          <Input
            type='text'
            placeholder='Ex: 0,00'
            label='Nível do Piso (m)'
            tooltip='Anotar a área da face selecionada e a altura do pé-direito,
                  calculadas automaticamente de acordo com o eixo Z, lembrando
                  de informar o nível do piso caso seja diferente de 0,00.'
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
    </div>
  );
}
