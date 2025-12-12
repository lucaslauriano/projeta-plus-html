import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';
import { LightingDefaults } from '@/types/global';

export function useLightingAnnotation() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const [defaults, setDefaults] = useState({
    circuit_text: 'C1',
    circuit_scale: 1.0,
    circuit_height_cm: 250,
    circuit_font: 'Arial',
    circuit_text_color: '#000000',
  });

  const loadDefaults = useCallback(async () => {
    await callSketchupMethod('loadLightingAnnotationDefaults', {});
  }, [callSketchupMethod]);

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
  }, [loadDefaults]);

  const startLightingAnnotation = async (args: Partial<LightingDefaults>) => {
    const params = {
      circuit_text: args.circuit_text || defaults.circuit_text,
      circuit_scale: args.circuit_scale ?? defaults.circuit_scale,
      circuit_height_cm: args.circuit_height_cm ?? defaults.circuit_height_cm,
      circuit_font: args.circuit_font || defaults.circuit_font,
      circuit_text_color:
        args.circuit_text_color || defaults.circuit_text_color,
    };
    await callSketchupMethod(
      'startLightingAnnotation',
      params as unknown as Record<string, unknown>
    );
  };

  return {
    startLightingAnnotation,
    loadDefaults,
    defaults,
    isLoading,
    isAvailable,
  };
}
