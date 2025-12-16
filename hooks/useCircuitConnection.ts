import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export function useCircuitConnection() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  useEffect(() => {
    window.handleCircuitConnectionResult = (response) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
        console.error('Circuit connection error:', response.message);
      }
    };

    return () => {
      if (window.handleCircuitConnectionResult) {
        delete window.handleCircuitConnectionResult;
      }
    };
  }, []);

  const startCircuitConnection = async () => {
    await callSketchupMethod('startCircuitConnection', {});
  };

  return {
    startCircuitConnection,
    isLoading,
    isAvailable,
  };
}
