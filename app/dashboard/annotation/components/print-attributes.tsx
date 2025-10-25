'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useHeightAnnotation } from '@/hooks/useHeightAnnotation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AVAILABLE_FONTS = [
  'Century Gothic',
  'Arial',
  'Arial Narrow',
  'Verdana',
  'Times New Roman',
];

export function PrintAttributes() {
  const { startHeightAnnotation, defaults, isLoading } = useHeightAnnotation();

  const [scale, setScale] = useState(defaults.scale.toString());
  const [heightZCm, setHeightZCm] = useState(defaults.height_z_cm);
  const [font, setFont] = useState(defaults.font);
  const [showUsage, setShowUsage] = useState(defaults.show_usage);

  // Sync state when defaults change
  React.useEffect(() => {
    setScale(defaults.scale.toString());
    setHeightZCm(defaults.height_z_cm);
    setFont(defaults.font);
    setShowUsage(defaults.show_usage);
  }, [defaults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const scaleNum = parseInt(scale);
    if (isNaN(scaleNum) || scaleNum <= 0) {
      alert('Escala deve ser um número positivo');
      return;
    }

    const heightNum = parseFloat(heightZCm);
    if (isNaN(heightNum) || heightNum <= 0) {
      alert('Altura Z deve ser um número positivo');
      return;
    }

    await startHeightAnnotation({
      scale: scaleNum,
      height_z_cm: heightZCm,
      font,
      show_usage: showUsage,
    });
  };

  return (
    <div className='border border-border rounded-md p-4'>
      <div className='w-full mx-auto'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Scale Input */}
          <div>
            <Input
              id='scale'
              type='number'
              label='Escala:'
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              required
              disabled={isLoading}
              placeholder='Ex: 25'
            />
          </div>

          {/* Height Z Input */}
          <div>
            <Input
              id='heightZ'
              type='number'
              step='0.1'
              label='Altura Z (cm):'
              value={heightZCm}
              onChange={(e) => setHeightZCm(e.target.value)}
              required
              disabled={isLoading}
              placeholder='Ex: 145'
            />
          </div>

          {/* Font Select */}
          <div>
            <label
              htmlFor='font'
              className='text-sm font-medium leading-none mb-2 block'
            >
              Fonte:
            </label>
            <Select value={font} onValueChange={setFont} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder='Selecione uma fonte' />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_FONTS.map((fontOption) => (
                  <SelectItem key={fontOption} value={fontOption}>
                    {fontOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

        {/* Instructions */}
        <div className='mt-4 p-3 bg-muted rounded-md text-sm'>
          <p className='font-medium mb-1'>Instruções:</p>
          <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
            <li>Use as setas ↑↓←→ para mudar a posição do texto</li>
            <li>Pressione Ctrl para alternar rotação (0° / 90°)</li>
            <li>Use +/- para ajustar a distância do texto</li>
            <li>ESC para cancelar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
