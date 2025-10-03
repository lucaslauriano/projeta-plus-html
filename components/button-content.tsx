// Suponha que este código esteja em app/button1/page.tsx ou em qualquer outro Client Component
'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { GlobalSettings } from '@/types/global';
import React, { useEffect, useState } from 'react';

// Global types are now defined in types/global.d.ts

export default function Button1ContentPage() {
  const [sketchup, setSketchup] = useState<Window['sketchup'] | undefined>(
    undefined
  );

  useEffect(() => {
    setSketchup(window.sketchup);
  }, []);

  const sendMessageToSketchUp = () => {
    // Pegar alguma informação dinâmica, por exemplo, o nome do modelo ativo no SketchUp
    // (Para este exemplo, vamos simular, pois obter o nome do arquivo *diretamente* do JS
    // sem uma API do Ruby seria difícil. O Ruby precisa enviar isso primeiro para o JS).
    // Ou, pegar um valor de um input do usuário, ou qualquer string.
    const message = `Olá SketchUp! Esta mensagem veio do Botão 1 na Vercel.`;

    // Se window.sketchup existe (estamos dentro de um HtmlDialog do SketchUp)
    if (sketchup) {
      // Chama a função 'showMessageBox' registrada no Ruby, passando a mensagem como argumento
      sketchup.showMessageBox(message);
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
    if (sketchup) {
      sketchup.requestModelName();
      console.log('Solicitando nome do modelo ao SketchUp...');
    } else {
      console.warn(
        'Não está rodando no ambiente SketchUp. window.sketchup não disponível.'
      );
      alert('Simulando solicitação de nome do modelo ao SketchUp.');
    }
  };

  const loadGlobalSettings = () => {
    // Neste exemplo, vamos pedir para o SketchUp enviar o nome do modelo para o JS,
    // e o JS então exibirá. Isso requer um callback Ruby->JS e um JS->Ruby.
    if (sketchup) {
      sketchup.requestAllSettings();
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
  }, []);

  // Este useEffect ouvirá por mensagens que o Ruby envia para o JS
  useEffect(() => {
    // Definimos uma função global que o Ruby pode chamar via execute_script
    window.receiveAllSettingsFromRuby = (settings: GlobalSettings) => {
      alert(`Configurações do SketchUp: ${settings}`);
      console.log('Configurações do SketchUp recebidas do Ruby:', settings);
    };

    // Cleanup quando o componente é desmontado
    return () => {
      if (window.receiveAllSettingsFromRuby) {
        delete window.receiveAllSettingsFromRuby;
      }
    };
  }, []);

  return (
    <Card className='p-5 w-full'>
      <CardHeader>Teste de conexão com o SketchUp</CardHeader>

      <button
        onClick={sendMessageToSketchUp}
        className='mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded'
      >
        Enviar Mensagem para SketchUp
      </button>

      <button
        onClick={showSketchUpModelInfo}
        className='mt-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-2 px-4 rounded'
      >
        Modelo ao SketchUp
      </button>
      <button
        onClick={loadGlobalSettings}
        className='mt-4 bg-accent hover:bg-accent/80 text-accent-foreground font-bold py-2 px-4 rounded'
      >
        Carregar Configurações Globais do SketchUp
      </button>
    </Card>
  );
}
