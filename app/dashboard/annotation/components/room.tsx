'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the component to avoid SSR issues
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
  const [alturaPiso, setAlturaPiso] = useState('');
  const [mostrarPd, setMostrarPd] = useState('');
  const [pd, setPd] = useState('');
  const [mostrarNivel, setMostrarNivel] = useState('');
  const [nivel, setNivel] = useState('');

  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fontesDisponiveis = [
    'Arial',
    'Arial Narrow',
    'Century Gothic',
    'Helvetica',
    'Times New Roman',
    'Verdana',
  ];

  useEffect(() => {
    // Check if we're in SketchUp environment
    if (typeof window !== 'undefined' && window.sketchup) {
      setSketchup(window.sketchup);
    } else {
      console.warn('SketchUp API not available - running in browser mode');
    }
  }, []);

  // Load saved values from SketchUp
  const loadSketchUpValues = useCallback(() => {
    if (sketchup && typeof sketchup.send_action === 'function') {
      sketchup.send_action('loadRoomAnnotationDefaults');
    } else {
      console.warn('SketchUp send_action not available');
    }
  }, [sketchup]);

  // Efeito para registrar a função `handleRubyResponse` no objeto `window`
  useEffect(() => {
    window.handleRubyResponse = (response) => {
      console.log('###############:', response);
      setIsLoading(false);
      if (response.success) {
        setStatusMessage(`Sucesso: ${response.message}`);
        console.log('Resposta Ruby Sucesso:', response.message);
      } else {
        setStatusMessage(`Erro: ${response.message}`);
        console.error('Resposta Ruby Erro:', response.message);
      }
    };

    // Register function to receive default values from Ruby
    window.handleRoomDefaults = (defaults) => {
      console.log('Loading defaults from SketchUp:', defaults);
      if (defaults.scale) setScale(defaults.scale);
      if (defaults.font) setFont(defaults.font);
      if (defaults.floor_height) setAlturaPiso(defaults.floor_height);
      if (defaults.show_pd) setMostrarPd(defaults.show_pd);
      if (defaults.pd) setPd(defaults.pd);
      if (defaults.show_level) setMostrarNivel(defaults.show_level);
      if (defaults.level) setNivel(defaults.level);
    };

    // Load values when component mounts
    loadSketchUpValues();

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
    };
  }, [sketchup, loadSketchUpValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    setIsLoading(true);

    const args = {
      scale_str: scale,
      font: font,
      altura_piso_str: alturaPiso,
      mostrar_pd: mostrarPd,
      pd_str: pd,
      mostrar_nivel: mostrarNivel,
      nivel_str: nivel,
    };

    const payload = {
      module_name: 'RoomAnnotation',
      function_name: 'add_text_to_selected_instance',
      args: args,
    };
    try {
      if (typeof window !== 'undefined' && sketchup) {
        sketchup.send_action(
          'executeExtensionFunction',
          JSON.stringify(payload)
        );
      } else {
        console.warn('SketchUp API not available - simulating call');
        setStatusMessage('Simulação: SketchUp API não disponível');
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
        <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>
          Adicionar Nome do Ambiente
        </h1>
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
          <div>
            <label
              htmlFor='scale'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Escala do Texto:
            </label>
            <input
              type='number'
              id='scale'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor='font'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Fonte:
            </label>
            <select
              id='font'
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={font}
              onChange={(e) => setFont(e.target.value)}
              disabled={isLoading}
            >
              {fontesDisponiveis.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor='alturaPiso'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Altura Piso (Z) (m):
            </label>
            <input
              type='text'
              id='alturaPiso'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={alturaPiso}
              onChange={(e) => setAlturaPiso(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor='mostrarPd'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Mostrar PD?:
            </label>
            <select
              id='mostrarPd'
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={mostrarPd}
              onChange={(e) => setMostrarPd(e.target.value)}
              disabled={isLoading}
            >
              <option value='Sim'>Sim</option>
              <option value='Não'>Não</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='pd'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              PD (m):
            </label>
            <input
              type='text'
              id='pd'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={pd}
              onChange={(e) => setPd(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor='mostrarNivel'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Mostrar Nível?:
            </label>
            <select
              id='mostrarNivel'
              className='shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={mostrarNivel}
              onChange={(e) => setMostrarNivel(e.target.value)}
              disabled={isLoading}
            >
              <option value='Sim'>Sim</option>
              <option value='Não'>Não</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='nivel'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Nível Piso:
            </label>
            <input
              type='text'
              id='nivel'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className='col-span-1 md:col-span-2 flex items-center justify-between mt-4'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 cursor-pointer'
              disabled={isLoading}
            >
              {isLoading ? 'Executando...' : 'Adicionar Nome do Ambiente'}
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
