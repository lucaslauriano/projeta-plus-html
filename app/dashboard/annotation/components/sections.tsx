// my-sketchup-login-app/app/dashboard/anotacaocorte/page.tsx
'use client'; // Este componente deve ser um Client Component

import React, { useState, useEffect } from 'react';
// Certifique-se de que types.d.ts está configurado para o TypeScript

export default function AnnotationSection() {
  // ... (Cole todo o conteúdo do seu app/anotacaocorte/page.tsx anterior aqui)
  // ... (O código é o mesmo da última resposta, mas agora vive em /dashboard/anotacaocorte)

  // States para os inputs do formulário
  const [alturaAnotacoesCm, setAlturaAnotacoesCm] = useState('145');
  const [escala, setEscala] = useState('25');

  // Estado para feedback da operação
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load saved values from SketchUp
  const loadSketchUpValues = () => {
    if (window.sketchup) {
      window.sketchup.send_action('loadSectionAnnotationDefaults');
    }
  };

  //  todo
  useEffect(() => {
    window.handleRubyResponse = (response) => {
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
    window.handleSectionDefaults = (defaults) => {
      console.log('Loading section defaults from SketchUp:', defaults);
      if (defaults.line_height_cm)
        setAlturaAnotacoesCm(defaults.line_height_cm);
      if (defaults.scale_factor) setEscala(defaults.scale_factor);
    };

    // Load values when component mounts
    loadSketchUpValues();

    return () => {
      if (window.handleRubyResponse) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete window.handleRubyResponse;
      }
      if (window.handleSectionDefaults) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete window.handleSectionDefaults;
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');
    setIsLoading(true);

    const args = {
      line_height_cm: alturaAnotacoesCm,
      scale_factor: escala,
    };

    const payload = {
      module_name: 'SectionAnnotation',
      function_name: 'create_lines_from_section_planes',
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
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto'>
        <h1 className='text-3xl font-bold mb-6 text-center text-gray-800'>
          Criar Anotações de Corte
        </h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='alturaAnotacoesCm'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Altura das Anotações (em cm):
            </label>
            <input
              type='number'
              id='alturaAnotacoesCm'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              value={alturaAnotacoesCm}
              onChange={(e) => setAlturaAnotacoesCm(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='escala'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Escala:
            </label>
            <input
              type='number'
              id='escala'
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
              value={escala}
              onChange={(e) => setEscala(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className='flex items-center justify-between'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50'
              disabled={isLoading}
            >
              {isLoading ? 'Executando...' : 'Gerar Anotações'}
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
