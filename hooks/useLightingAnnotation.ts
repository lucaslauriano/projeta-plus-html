import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSketchup } from '@/contexts/SketchupContext';

export function useLightingAnnotation() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const [defaults, setDefaults] = useState({
    circuit_text: 'C1',
    circuit_scale: 1.0,
    circuit_height_cm: 250,
    circuit_font: 'Arial',
    circuit_text_color: '#000000',
  });

  useEffect(() => {
    // Load defaults when hook is initialized
    loadDefaults();

    // Register result handler
    window.handleLightingDefaults = (response) => {
      if (response) {
        setDefaults(response);
        console.log('Lighting annotation defaults loaded:', response);
      }
    };

    window.handleLightingAnnotationResult = (response) => {
      if (response.success) {
        toast.success(response.message);
        console.log('Lighting annotation success:', response.message);
      } else {
        toast.error(response.message);
        console.error('Lighting annotation error:', response.message);
      }
    };

    return () => {
      if (window.handleLightingDefaults) {
        delete window.handleLightingDefaults;
      }
      if (window.handleLightingAnnotationResult) {
        delete window.handleLightingAnnotationResult;
      }
    };
  }, []);

  const loadDefaults = async () => {
    await callSketchupMethod('loadLightingAnnotationDefaults', {});
  };

  const startLightingAnnotation = async (args = {}) => {
    const params = {
      circuit_text: defaults.circuit_text,
      circuit_scale: defaults.circuit_scale,
      circuit_height_cm: defaults.circuit_height_cm,
      circuit_font: defaults.circuit_font,
      circuit_text_color: defaults.circuit_text_color,
      ...args,
    };
    await callSketchupMethod('startLightingAnnotation', params);
  };

  return {
    startLightingAnnotation,
    loadDefaults,
    defaults,
    isLoading,
    isAvailable,
  };
}
