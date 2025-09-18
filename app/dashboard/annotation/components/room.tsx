'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';

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

  // Global settings from backend
  const [scale, setScale] = useState('');
  const [font, setFont] = useState('');

  // Room annotation specific fields
  const [environmentName, setEnvironmentName] = useState('');
  const [floorHeight, setFloorHeight] = useState('');
  const [showCeillingHeight, setShowCeillingHeight] = useState('');
  const [ceillingHeight, setCeillingHeight] = useState('');
  const [showLevel, setShowLevel] = useState('');
  const [level, setLevel] = useState('');

  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Available fonts are now managed by global settings from backend

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sketchup) {
      setSketchup(window.sketchup);
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
        setStatusMessage(`Sucesso: ${response.message}`);
      } else {
        setStatusMessage(`Erro: ${response.message}`);
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
    setStatusMessage('');
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
        if (typeof sketchup.executeExtensionFunction === 'function') {
          sketchup.executeExtensionFunction(JSON.stringify(payload));
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
        //  setStatusMessage('Simulação: SketchUp API não disponível');
        toast.error('Simulação: SketchUp API não disponível');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error calling SketchUp API:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage(`Erro: ${errorMessage}`);
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
          <div>
            <label
              htmlFor='environmentName'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Nome do Ambiente:
            </label>
            <input
              type='text'
              id='environmentName'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={environmentName}
              onChange={(e) => setEnvironmentName(e.target.value)}
              required
              disabled={isLoading}
              placeholder='Ex: Sala de Estar'
            />
          </div>
          <div>
            <label
              htmlFor='floorHeight'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Altura Piso (Z) (m):
            </label>
            <input
              type='text'
              id='floorHeight'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={floorHeight}
              onChange={(e) => setFloorHeight(e.target.value)}
              required
              disabled={isLoading}
              placeholder='0,00'
            />
          </div>
          <div>
            <label
              htmlFor='showCeillingHeight'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Mostrar Pé Direito?:
            </label>
            <select
              id='showCeillingHeight'
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={showCeillingHeight}
              onChange={(e) => setShowCeillingHeight(e.target.value)}
              disabled={isLoading}
            >
              <option value=''>Selecione uma opção</option>
              <option value='Sim'>Sim</option>
              <option value='Não'>Não</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='ceillingHeight'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Pé Direito (m):
            </label>
            <input
              type='text'
              id='ceillingHeight'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={ceillingHeight}
              onChange={(e) => setCeillingHeight(e.target.value)}
              required
              disabled={isLoading}
              placeholder='2,50'
            />
          </div>
          <div>
            <label
              htmlFor='showLevel'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Mostrar Nível?:
            </label>
            <select
              id='showLevel'
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={showLevel}
              onChange={(e) => setShowLevel(e.target.value)}
              disabled={isLoading}
            >
              <option value=''>Selecione uma opção</option>
              <option value='Sim'>Sim</option>
              <option value='Não'>Não</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='level'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Nível Piso:
            </label>
            <input
              type='text'
              id='level'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              disabled={isLoading}
              placeholder='0,00'
            />
          </div>
          <div className='col-span-1 md:col-span-2 flex items-center justify-between mt-4'>
            <button
              type='submit'
              className='bg-lime-500 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 cursor-pointer'
              disabled={isLoading}
            >
              {isLoading ? 'Executando...' : 'Iniciar Anotação de Ambiente'}
            </button>
            {statusMessage && (
              <p
                className={`text-sm ${
                  statusMessage.startsWith('Sucesso')
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {statusMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
