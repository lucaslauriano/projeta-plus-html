'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useAnnotations } from '@/hooks/useAnnotations';

export function RoomAnnotation() {
  const { startRoomAnnotation, isLoading } = useAnnotations();

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

  const roomTooltipContent = `Insira o nome do ambiente e, a partir da face selecionada, o sistema identifica automaticamente a área (m²). O pé-direito é anotado a partir do valor inserido no campo, enquanto o nível do piso pode ser definido manualmente ou automaticamente pelo eixo Z do modelo.`;
  return (
    <div className='w-full max-w-lg mx-auto space-y-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Input
            id='environmentName'
            type='text'
            label='Nome do Ambiente'
            tooltip={roomTooltipContent}
            value={environmentName}
            onChange={(e) => setEnvironmentName(e.target.value)}
            required
            disabled={isLoading}
            placeholder='Ex: Sala de Estar'
          />
        </div>

        <div className='space-y-2 p-2 bg-muted/30 rounded-xl border border-border/50'>
          <div className='flex items-center'>
            <Checkbox
              id='showCeillingHeight'
              label='Mostrar Pé Direito'
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
              placeholder='Ex: 2,60'
              label='Altura (m)'
            />
          )}
        </div>

        <div className='space-y-2 p-2 bg-muted/30 rounded-xl border border-border/50'>
          <div className='flex items-center '>
            <Checkbox
              id='showLevel'
              label='Mostrar Nível do Piso'
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
                  label='Nível do Piso Manual (m)'
                />
              )}
            </div>
          )}
        </div>

        <Button type='submit' size='sm' disabled={isLoading} className='w-full'>
          {isLoading ? 'Executando...' : 'Criar Anotação'}
        </Button>
      </form>
    </div>
  );
}
