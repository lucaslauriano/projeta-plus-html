// my-sketchup-login-app/app/page.tsx
'use client'; // Este componente será um Client Component

import { useState, useEffect } from 'react';

// Define a interface para o objeto global SketchUp, injetado pelo HtmlDialog
declare global {
  interface Window {
    sketchup: {
      send_action: (action: string, ...args: unknown[]) => void;
    };
    // Função que será exposta para o Ruby chamar de volta o JavaScript para status de login
    updateLoginStatus: (
      success: boolean,
      message: string,
      nextView: string | null
    ) => void;
    // NOVA: Função para Ruby dizer ao JS qual conteúdo de botão exibir
    displayButtonContent: (buttonId: string) => void;
    close: () => void; // Adiciona o método close, caso SketchUp o injete para fechar o diálogo
  }
}

// Tipo para o estado de feedback do login
type LoginStatus = {
  success: boolean;
  message: string;
};

// Tipo para a view atual
type CurrentView =
  | 'login'
  | 'button1'
  | 'button2'
  | 'button3'
  | 'button4'
  | 'button5'
  | 'welcome';

export default function AppMainPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState<LoginStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de login interno do JS
  const [currentView, setCurrentView] = useState<CurrentView>('welcome'); // View inicial 'welcome'

  // useEffect para expor funções ao escopo global de `window`
  useEffect(() => {
    // Função para Ruby chamar de volta o JavaScript com status de login
    window.updateLoginStatus = (
      success: boolean,
      message: string,
      nextView: string | null
    ) => {
      setLoginStatus({ success, message });
      setIsLoading(false);
      if (success) {
        setIsLoggedIn(true);
        if (nextView) {
          setCurrentView(nextView as CurrentView); // Mudar para a view do botão após login
        } else {
          setCurrentView('welcome'); // Ou para uma tela de boas-vindas padrão
        }
      } else {
        setIsLoggedIn(false);
        setCurrentView('login'); // Em caso de falha, permanece na tela de login
      }
    };

    // NOVA: Função para Ruby dizer ao JS qual conteúdo de botão exibir
    window.displayButtonContent = (buttonId: string) => {
      // Verifique se o buttonId é válido para as suas views
      if (
        ['button1', 'button2', 'button3', 'button4', 'button5'].includes(
          buttonId
        )
      ) {
        setCurrentView(buttonId as CurrentView);
      } else {
        setCurrentView('welcome'); // Default para uma view de boas-vindas ou erro
      }
    };

    // Função de limpeza
    return () => {
      if (window.updateLoginStatus) {
        // @ts-expect-error: updateLoginStatus may not exist on window in some environments
        delete window.updateLoginStatus;
      }
      if (window.displayButtonContent) {
        // @ts-expect-error: displayButtonContent may not exist on window in some environments
        delete window.displayButtonContent;
      }
    };
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus(null);
    setIsLoading(true);

    if (window.sketchup) {
      window.sketchup.send_action('loginUser', username, password);
    } else {
      // Simulação para desenvolvimento no navegador
      console.warn('window.sketchup não está disponível. Simulando login...');
      setTimeout(() => {
        if (username === 'test' && password === 'password') {
          window.updateLoginStatus(
            true,
            'Simulação de login bem-sucedida!',
            'welcome'
          ); // Ou 'button1' se quiser simular um clique
        } else {
          window.updateLoginStatus(
            false,
            'Simulação: Credenciais inválidas.',
            null
          );
        }
      }, 1000);
    }
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return (
        // Conteúdo da tela de Login
        <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
          <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
            Projeta Plus Login
          </h2>
          <form onSubmit={handleLoginSubmit}>
            <div className='mb-4'>
              <label
                htmlFor='username'
                className='block text-gray-700 text-sm font-bold mb-2'
              >
                Usuário:
              </label>
              <input
                type='text'
                id='username'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className='mb-6'>
              <label
                htmlFor='password'
                className='block text-gray-700 text-sm font-bold mb-2'
              >
                Senha:
              </label>
              <input
                type='password'
                id='password'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
              {loginStatus && (
                <p
                  className={`text-sm ${
                    loginStatus.success ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {loginStatus.message}
                </p>
              )}
            </div>
          </form>
          <p className='mt-6 text-center text-gray-600 text-sm'>
            Ainda não tem conta?{' '}
            <a href='#' className='text-blue-500 hover:text-blue-800'>
              Registre-se
            </a>
          </p>
        </div>
      );
    } else {
      // Conteúdo após o login, mostrando a view atual
      return (
        <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center'>
          {currentView === 'welcome' && (
            <h1 className='text-3xl font-bold text-gray-800'>
              Bem-vindo ao Projeta Plus!
            </h1>
          )}
          {currentView === 'button1' && (
            <h1 className='text-3xl font-bold text-blue-600'>
              Conteúdo do Botão 1
            </h1>
          )}
          {currentView === 'button2' && (
            <h1 className='text-3xl font-bold text-green-600'>
              Conteúdo do Botão 2
            </h1>
          )}
          {currentView === 'button3' && (
            <h1 className='text-3xl font-bold text-yellow-600'>
              Conteúdo do Botão 3
            </h1>
          )}
          {currentView === 'button4' && (
            <h1 className='text-3xl font-bold text-purple-600'>
              Conteúdo do Botão 4
            </h1>
          )}
          {currentView === 'button5' && (
            <h1 className='text-3xl font-bold text-red-600'>
              Conteúdo do Botão 5
            </h1>
          )}

          <p className='mt-4 text-gray-700'>
            Clique nos botões da toolbar para mudar o conteúdo aqui.
          </p>
          {/* Você pode adicionar mais componentes e lógica de navegação interna aqui */}
        </div>
      );
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 p-4'>
      {renderContent()}
    </div>
  );
}
