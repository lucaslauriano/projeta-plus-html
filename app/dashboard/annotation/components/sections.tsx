// my-sketchup-login-app/app/dashboard/anotacaocorte/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the component to avoid SSR issues
const AnnotationSectionContent = dynamic(
  () => Promise.resolve(AnnotationSectionInner),
  {
    ssr: false,
  }
);

export default function AnnotationSection() {
  return <AnnotationSectionContent />;
}

function AnnotationSectionInner() {
  const [sketchup, setSketchup] = useState<Window['sketchup'] | undefined>(
    undefined
  );

  // States para os inputs do formulário
  const [alturaAnotacoesCm, setAlturaAnotacoesCm] = useState('');
  const [escala, setEscala] = useState('');

  // Estado para feedback da operação
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sketchup) {
      setSketchup(window.sketchup);
    } else {
      console.warn('SketchUp API not available - running in browser mode');
    }
  }, []);

  // Load saved values from SketchUp
  const loadSketchUpValues = useCallback(() => {
    if (sketchup) {
      // Try the direct method call first, fallback to action callback
      if (typeof sketchup.loadSectionAnnotationDefaults === 'function') {
        sketchup.loadSectionAnnotationDefaults();
      } else {
        // Fallback: trigger the action callback directly
        console.log('Direct method not available, using action callback');
        window.location.href = 'skp:loadSectionAnnotationDefaults@';
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
  }, [sketchup, loadSketchUpValues]);

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
        setStatusMessage('SketchUp API não disponível');
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
      <div className='w-full max-w-md mx-auto'>
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
              className='bg-lime-600 hover:bg-lime-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50'
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
