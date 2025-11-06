'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useRoomAnnotation } from '@/hooks/useRoomAnnotation';

export function RoomAnnotation() {
  const { startRoomAnnotation, isLoading } = useRoomAnnotation();

  const [level, setLevel] = useState('');
  const [showLevel, setShowLevel] = useState(true);
  const [isAutoLevel, setIsAutoLevel] = useState(true);
  const [ceillingHeight, setCeillingHeight] = useState('');
  const [environmentName, setEnvironmentName] = useState('');
  const [showCeillingHeight, setShowCeillingHeight] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const args = {
      enviroment_name: environmentName,
      show_ceilling_height: showCeillingHeight,
      ceilling_height: ceillingHeight,
      show_level: showLevel,
      is_auto_level: isAutoLevel,
      level_value: level,
    };

    startRoomAnnotation(args);
  };

  return (
    <div className='border border-border rounded-md p-4'>
      <div className='w-full mx-auto'>
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
          <Input
            id='environmentName'
            type='text'
            label='Nome do Ambiente:'
            value={environmentName}
            onChange={(e) => setEnvironmentName(e.target.value)}
            required
            disabled={isLoading}
            placeholder='Ex: Sala de Estar'
          />

          <div className='flex items-center space-x-4'>
            <div className='w-2/4'>
              <Input
                type='text'
                id='ceillingHeight'
                value={ceillingHeight}
                onChange={(e) => setCeillingHeight(e.target.value)}
                required={showCeillingHeight}
                disabled={isLoading}
                placeholder='2,50'
                label='Pé Direito (m):'
              />
            </div>
            <div className='w-2/4 flex items-center justify-start'>
              <Checkbox
                id='showCeillingHeight'
                label='Mostrar Pé Direito?'
                disabled={isLoading}
                checked={showCeillingHeight}
                onCheckedChange={(checked) =>
                  setShowCeillingHeight(
                    checked === 'indeterminate' ? false : checked
                  )
                }
              />
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='w-2/4'>
              <Input
                type='text'
                id='level'
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                required
                disabled={isLoading || isAutoLevel}
                placeholder='0,00'
                label='Nível Piso:'
              />
            </div>
            <div className='w-2/4 pt-6 flex items-center justify-start'>
              <Checkbox
                id='showLevel'
                label='Mostrar Nível'
                disabled={isLoading}
                checked={showLevel}
                onCheckedChange={(checked) =>
                  setShowLevel(checked === 'indeterminate' ? false : checked)
                }
              />
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='w-2/4'></div>
            <div className='w-2/4 flex items-center justify-start'>
              <Checkbox
                id='isAutoLevel'
                label='Nível Automático'
                disabled={isLoading || !showLevel}
                checked={isAutoLevel}
                onCheckedChange={(checked) =>
                  setIsAutoLevel(checked === 'indeterminate' ? true : checked)
                }
              />
            </div>
          </div>

          <div className='flex items-center justify-center mt-4 w-full'>
            <Button
              type='submit'
              size='lg'
              disabled={isLoading}
              className='min-w-[150px]'
            >
              {isLoading ? 'Executando...' : 'Anotação de Ambiente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
