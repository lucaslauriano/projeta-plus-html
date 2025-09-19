'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface RoomDefaults {
  floor_height?: string;
  show_ceilling_height?: string;
  ceilling_height?: string;
  show_level?: string;
  level?: string;
}

interface GlobalSettings {
  font?: string;
  scale_numerator?: number;
  scale_denominator?: number;
  floor_level?: number;
}

const RoomAnnotationContent = dynamic(
  () => Promise.resolve(RoomAnnotationInner),
  {
    ssr: false,
  }
);

export default function RoomAnnotation() {
  return <RoomAnnotationContent />;
}

function RoomAnnotationInner() {
  const [sketchup, setSketchup] = useState<Window['sketchup'] | undefined>(
    undefined
  );

  const [scale, setScale] = useState('');
  const [font, setFont] = useState('');

  const [environmentName, setEnvironmentName] = useState('');
  const [floorHeight, setFloorHeight] = useState('');
  const [showCeillingHeight, setShowCeillingHeight] = useState('');
  const [ceillingHeight, setCeillingHeight] = useState('');
  const [showLevel, setShowLevel] = useState('');
  const [level, setLevel] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // Available fonts are now managed by global settings from backend

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sketchup) {
      setSketchup(window.sketchup as Window['sketchup']);
    } else {
      console.warn('SketchUp API not available - running in browser mode');
    }
  }, []);

  const loadSketchUpValues = useCallback(() => {
    if (sketchup) {
      if (typeof sketchup.loadRoomAnnotationDefaults === 'function') {
        sketchup.loadRoomAnnotationDefaults();
      } else {
        console.log('Direct method not available, using action callback');
        window.location.href = 'skp:loadRoomAnnotationDefaults@';
      }
    } else {
      console.warn('SketchUp API not available');
    }
  }, [sketchup]);

  useEffect(() => {
    window.handleRubyResponse = (response) => {
      setIsLoading(false);
      if (response.success) {
        toast.success(`Sucesso: ${response.message}`);
      } else {
        toast.error(`Erro: ${response.message}`);
      }
    };

    window.handleRoomDefaults = (defaults: RoomDefaults) => {
      console.log('Loading defaults from SketchUp:', defaults);
      if (defaults.floor_height) setFloorHeight(defaults.floor_height);
      if (defaults.show_ceilling_height)
        setShowCeillingHeight(defaults.show_ceilling_height);
      if (defaults.ceilling_height) setCeillingHeight(defaults.ceilling_height);
      if (defaults.show_level) setShowLevel(defaults.show_level);
      if (defaults.level) setLevel(defaults.level);
    };

    window.handleGlobalSettings = (settings: GlobalSettings) => {
      console.log('Loading global settings from SketchUp:', settings);
      if (settings.font) setFont(settings.font);
      // Calculate scale from numerator/denominator
      if (settings.scale_numerator && settings.scale_denominator) {
        const scaleValue =
          settings.scale_denominator / settings.scale_numerator;
        setScale(scaleValue.toString());
      }
      // Use floor level from global settings as default if not set
      if (settings.floor_level && !floorHeight) {
        setFloorHeight(settings.floor_level.toString().replace('.', ','));
      }
    };

    // Load both room defaults and global settings
    loadSketchUpValues();

    // Load global settings for scale and font
    if (sketchup) {
      if (typeof sketchup.loadGlobalSettings === 'function') {
        sketchup.loadGlobalSettings();
      } else {
        window.location.href = 'skp:loadGlobalSettings@';
      }
    }

    return () => {
      if (window.handleRubyResponse) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete window.handleRubyResponse;
      }
      if (window.handleRoomDefaults) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete window.handleRoomDefaults;
      }
      if (window.handleGlobalSettings) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete window.handleGlobalSettings;
      }
    };
  }, [sketchup, loadSketchUpValues, floorHeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const args = {
      enviroment_name: environmentName,
      scale: parseFloat(scale) || 25.0,
      font: font,
      floor_height: floorHeight,
      show_ceilling_height: showCeillingHeight,
      ceilling_height: ceillingHeight,
      show_level: showLevel,
      level: level,
    };

    const payload = {
      module_name: 'ProjetaPlus::Modules::ProRoomAnnotation',
      function_name: 'start_interactive_annotation',
      args: args,
    };
    try {
      if (typeof window !== 'undefined' && sketchup) {
        if (typeof sketchup?.executeExtensionFunction === 'function') {
          sketchup?.executeExtensionFunction(JSON.stringify(payload));
        } else {
          console.log(
            'Direct method not available, using action callback URL scheme'
          );
          window.location.href = `skp:executeExtensionFunction@${encodeURIComponent(
            JSON.stringify(payload)
          )}`;
        }
      } else {
        console.warn('SketchUp API not available - simulating call');
        toast.error('Simulação: SketchUp API não disponível');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error calling SketchUp API:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Erro: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  return (
    <div className='p-4'>
      <div className='w-full max-w-2xl mx-auto'>
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
          <Input
            type='text'
            id='floorHeight'
            value={floorHeight}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9,]/g, '');
              setFloorHeight(value);
            }}
            required
            disabled={isLoading}
            placeholder='0,00'
            label='Altura Piso (Z) (m):'
          />
          <Select
            label='Mostrar Pé Direito?'
            disabled={isLoading}
            value={showCeillingHeight}
            onValueChange={setShowCeillingHeight}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione uma opção' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Sim'>Sim</SelectItem>
              <SelectItem value='Não'>Não</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type='text'
            id='ceillingHeight'
            value={ceillingHeight}
            onChange={(e) => setCeillingHeight(e.target.value)}
            required
            disabled={isLoading}
            placeholder='2,50'
            label='Pé Direito (m):'
          />
          <Select
            label='Mostrar Nível?'
            disabled={isLoading}
            value={showLevel}
            onValueChange={setShowLevel}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecione uma opção' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Sim'>Sim</SelectItem>
              <SelectItem value='Não'>Não</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type='text'
            id='level'
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
            disabled={isLoading}
            placeholder='0,00'
            label='Nível Piso:'
          />
          <div className='col-span-1 md:col-span-2 flex items-center justify-between mt-4'>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Executando...' : 'Criar Anotação de Ambiente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
