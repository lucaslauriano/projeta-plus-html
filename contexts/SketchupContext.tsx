'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { toast } from 'react-toastify';

interface SketchupContextType {
  sketchup: Window['sketchup'] | undefined;
  isLoading: boolean;
  callSketchupMethod: (
    method: string,
    args?: Record<string, unknown>
  ) => Promise<void>;
  isAvailable: boolean;
}

const SketchupContext = createContext<SketchupContextType | undefined>(
  undefined
);

interface SketchupProviderProps {
  children: ReactNode;
}

export function SketchupProvider({ children }: SketchupProviderProps) {
  const [sketchup, setSketchup] = useState<Window['sketchup'] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const isAvailable = typeof window !== 'undefined' && !!sketchup;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.sketchup) {
      setSketchup(window.sketchup);
    } else {
      console.warn('SketchUp API not available - running in browser mode');
    }
  }, []);

  useEffect(() => {
    window.handleRubyResponse = (response) => {
      setIsLoading(false);
      if (response.success) {
        console.log('SketchUp Ruby Success:', response.message);
      } else {
        console.error('SketchUp Ruby Error:', response.message);
      }
    };

    return () => {
      if (window.handleRubyResponse) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        delete window.handleRubyResponse;
      }
    };
  }, []);

  const callSketchupMethod = async (
    method: string,
    args: Record<string, unknown> = {}
  ) => {
    console.log('callSketchupMethod', method, args);
    if (!isAvailable) {
      toast.error('SketchUp API não disponível');
      return;
    }

    setIsLoading(true);

    try {
      const sketchupMethod = (sketchup as Record<string, unknown>)?.[method];
      if (typeof sketchupMethod === 'function') {
        sketchupMethod(JSON.stringify(args));
      } else {
        console.log('Direct method not available, using action callback');
        window.location.href = `skp:${method}@${encodeURIComponent(
          JSON.stringify(args)
        )}`;
      }
    } catch (error) {
      console.error('Error calling SketchUp API:', error);
      toast.error('Erro ao chamar SketchUp API: ' + error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const value: SketchupContextType = {
    sketchup,
    isLoading,
    callSketchupMethod,
    isAvailable,
  };

  return (
    <SketchupContext.Provider value={value}>
      {children}
    </SketchupContext.Provider>
  );
}

export function useSketchup() {
  const context = useContext(SketchupContext);
  if (context === undefined) {
    throw new Error('useSketchup must be used within a SketchupProvider');
  }
  return context;
}
