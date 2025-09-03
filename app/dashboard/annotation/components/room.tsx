'use client';

import React, { useState, useEffect } from 'react';
// Certifique-se de que types.d.ts está configurado para o TypeScript

export default function RoomAnnotation() {
  const [sketchup, setSketchup] = useState<Window['sketchup'] | undefined>(
    undefined
  );

  useEffect(() => {
    setSketchup(window.sketchup);
  }, []);

  const [scale, setScale] = useState('25');
  const [font, setFont] = useState('Century Gothic');
  const [alturaPiso, setAlturaPiso] = useState('0,00');
  const [mostrarPd, setMostrarPd] = useState('Sim');
  const [pd, setPd] = useState('0,00');
  const [mostrarNivel, setMostrarNivel] = useState('Sim');
  const [nivel, setNivel] = useState('0,00');

  // Estado para feedback da operação
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fontes disponíveis (do seu módulo Ruby, mas replicadas aqui para a UI)
  const fontesDisponiveis = [
    'Arial',
    'Arial Narrow',
    'Century Gothic',
    'Helvetica',
    'Times New Roman',
    'Verdana',
  ];

  // Load saved values from SketchUp
  const loadSketchUpValues = () => {
    if (window.sketchup) {
      window.sketchup.send_action('loadRoomAnnotationDefaults');
    }
  };

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
  }, []);

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

    if (typeof window !== 'undefined' && window.sketchup) {
      window.sketchup.send_action(
        'executeExtensionFunction',
        JSON.stringify(payload)
      );
    } else {
      console.warn(
        'Simulando chamada Ruby: Não está no ambiente SketchUp.',
        payload
      );
      setIsLoading(false);
      setStatusMessage('Simulação: Verifique o console para a chamada Ruby.');
    }
  };

  return (
    <div className='p-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto'>
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
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50'
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
