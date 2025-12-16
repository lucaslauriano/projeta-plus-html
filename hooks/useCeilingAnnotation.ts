import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export function useCeilingAnnotation() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const [defaults, setDefaults] = useState({
    floor_level: '0.00',
  });

  useEffect(() => {
    // Load defaults when hook is initialized
    loadDefaults();

    // Register result handler
    window.handleCeilingDefaults = (response) => {
      if (response) {
        setDefaults(response);
      }
    };

    window.handleCeilingAnnotationResult = (response) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
        console.error('Ceiling annotation error:', response.message);
      }
    };

    return () => {
      if (window.handleCeilingDefaults) {
        delete window.handleCeilingDefaults;
      }
      if (window.handleCeilingAnnotationResult) {
        delete window.handleCeilingAnnotationResult;
      }
    };
  }, []);

  const loadDefaults = async () => {
    await callSketchupMethod('loadCeilingAnnotationDefaults', {});
  };

  const startCeilingAnnotation = async (args = {}) => {
    const params = {
      scale: 1.0,
      font: 'Arial',
      floor_level: defaults.floor_level,
      ...args,
    };
    await callSketchupMethod('startCeilingAnnotation', params);
  };

  return {
    startCeilingAnnotation,
    loadDefaults,
    defaults,
    isLoading,
    isAvailable,
  };
}
