// Suponha que este código esteja em app/button1/page.tsx ou em qualquer outro Client Component
'use client';

import React, { useEffect } from 'react';

// Declarar a interface global para 'window.sketchup'
// Isso ajuda o TypeScript a reconhecer 'window.sketchup'
declare global {
  interface Window {
    sketchup: {
      send_action: (action: string, ...args: unknown[]) => void;
      // Você pode adicionar outras funções aqui se o Ruby as injetar,
      // como uma função para fechar o diálogo: close: () => void;
    };
    receiveModelNameFromRuby?: (modelName: string) => void;
  }
}

export default function Button1ContentPage() {
  const sendMessageToSketchUp = () => {
    // Pegar alguma informação dinâmica, por exemplo, o nome do modelo ativo no SketchUp
    // (Para este exemplo, vamos simular, pois obter o nome do arquivo *diretamente* do JS
    // sem uma API do Ruby seria difícil. O Ruby precisa enviar isso primeiro para o JS).
    // Ou, pegar um valor de um input do usuário, ou qualquer string.
    const message = `Olá SketchUp! Esta mensagem veio do Botão 1 na Vercel.`;

    // Se window.sketchup existe (estamos dentro de um HtmlDialog do SketchUp)
    if (window.sketchup) {
      // Chama a função 'showMessageBox' registrada no Ruby, passando a mensagem como argumento
      window.sketchup.send_action('showMessageBox', message);
      console.log('Mensagem enviada para o SketchUp:', message);
    } else {
      console.warn(
        'Não está rodando no ambiente SketchUp. window.sketchup não disponível.'
      );
      alert('Simulando envio de mensagem para o SketchUp: ' + message);
    }
  };

  const showSketchUpModelInfo = () => {
    // Neste exemplo, vamos pedir para o SketchUp enviar o nome do modelo para o JS,
    // e o JS então exibirá. Isso requer um callback Ruby->JS e um JS->Ruby.
    if (window.sketchup) {
      window.sketchup.send_action('requestModelName');
      console.log('Solicitando nome do modelo ao SketchUp...');
    } else {
      console.warn(
        'Não está rodando no ambiente SketchUp. window.sketchup não disponível.'
      );
      alert('Simulando solicitação de nome do modelo ao SketchUp.');
    }
  };

  // Este useEffect ouvirá por mensagens que o Ruby envia para o JS
  useEffect(() => {
    // Definimos uma função global que o Ruby pode chamar via execute_script
    window.receiveModelNameFromRuby = (modelName: string) => {
      alert(`Nome do Modelo do SketchUp: ${modelName}`);
      console.log('Nome do Modelo recebido do Ruby:', modelName);
    };

    // Cleanup quando o componente é desmontado
    return () => {
      if (window.receiveModelNameFromRuby) {
        delete window.receiveModelNameFromRuby;
      }
    };
  }, []); // Executa apenas uma vez na montagem

  return (
    <div className='min-h-screen flex items-center justify-center bg-blue-100 p-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center'>
        <h1 className='text-4xl font-extrabold text-blue-700 mb-4'>
          Conteúdo do Botão 1
        </h1>
        <p className='text-gray-700'>
          Esta é a funcionalidade específica do Botão 1.
        </p>

        <button
          onClick={sendMessageToSketchUp}
          className='mt-6 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
        >
          Enviar Mensagem para SketchUp
        </button>

        <button
          onClick={showSketchUpModelInfo}
          className='mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded'
        >
          Pedir Nome do Modelo ao SketchUp
        </button>

        <p className='mt-4 text-sm text-gray-500'>
          Este diálogo é independente dos outros.
        </p>
      </div>
    </div>
  );
}
