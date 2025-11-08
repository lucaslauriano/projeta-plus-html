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
    <div className='w-full max-w-lg mx-auto space-y-4'>
      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Nome do Ambiente */}
        <div className='space-y-2'>
          <Input
            id='environmentName'
            type='text'
            label='Nome do Ambiente'
            value={environmentName}
            onChange={(e) => setEnvironmentName(e.target.value)}
            required
            disabled={isLoading}
            placeholder='Ex: Sala de Estar'
          />
        </div>

        {/* Pé Direito Section */}
        <div className='space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-semibold text-foreground'>
              Pé Direito
            </h3>
            <Checkbox
              id='showCeillingHeight'
              label='Mostrar'
              disabled={isLoading}
              checked={showCeillingHeight}
              onCheckedChange={(checked) =>
                setShowCeillingHeight(
                  checked === 'indeterminate' ? false : checked
                )
              }
            />
          </div>
          {showCeillingHeight && (
            <Input
              type='text'
              id='ceillingHeight'
              value={ceillingHeight}
              onChange={(e) => setCeillingHeight(e.target.value)}
              required={showCeillingHeight}
              disabled={isLoading}
              placeholder='2,50'
              label='Altura (m)'
            />
          )}
        </div>

        {/* Nível do Piso Section */}
        <div className='space-y-3 p-4 bg-muted/30 rounded-xl border border-border/50'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-semibold text-foreground'>
              Nível do Piso
            </h3>
            <Checkbox
              id='showLevel'
              label='Mostrar'
              disabled={isLoading}
              checked={showLevel}
              onCheckedChange={(checked) =>
                setShowLevel(checked === 'indeterminate' ? false : checked)
              }
            />
          </div>

          {showLevel && (
            <div className='space-y-3'>
              <Checkbox
                id='isAutoLevel'
                label='Nível Automático'
                disabled={isLoading}
                checked={isAutoLevel}
                onCheckedChange={(checked) =>
                  setIsAutoLevel(checked === 'indeterminate' ? true : checked)
                }
              />

              {!isAutoLevel && (
                <Input
                  type='text'
                  id='level'
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder='0,00'
                  label='Valor do Nível'
                />
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button type='submit' size='lg' disabled={isLoading} className='w-full'>
          {isLoading ? 'Executando...' : 'Criar Anotação'}
        </Button>
      </form>
    </div>
  );
}
