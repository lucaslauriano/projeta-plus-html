import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useSketchup } from '@/contexts/SketchupContext';

export type HeightDefaults = {
  scale: number;
  height_z_cm: string;
  font: string;
  show_usage: boolean;
};

export function useHeightAnnotation() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const [defaults, setDefaults] = useState<HeightDefaults>({
    scale: 25,
    height_z_cm: '145',
    font: 'Century Gothic',
    show_usage: false,
  });

  const loadDefaults = useCallback(async () => {
    await callSketchupMethod('loadHeightAnnotationDefaults', {});
  }, [callSketchupMethod]);

  useEffect(() => {
    // Load defaults when hook is initialized
    loadDefaults();

    // Register result handler
    window.handleHeightDefaults = (response: HeightDefaults) => {
      if (response) {
        setDefaults(response);
        console.log('Height annotation defaults loaded:', response);
      }
    };

    window.handleHeightAnnotationResult = (response: {
      success: boolean;
      message: string;
    }) => {
      if (response.success) {
        toast.success(response.message);
        console.log('Height annotation success:', response.message);
      } else {
        toast.error(response.message);
        console.error('Height annotation error:', response.message);
      }
    };

    return () => {
      if (window.handleHeightDefaults) {
        delete window.handleHeightDefaults;
      }
      if (window.handleHeightAnnotationResult) {
        delete window.handleHeightAnnotationResult;
      }
    };
  }, [loadDefaults]);

  const startHeightAnnotation = async (args: Partial<HeightDefaults>) => {
    const params = {
      scale: args.scale ?? defaults.scale,
      height_z_cm: args.height_z_cm || defaults.height_z_cm,
      font: args.font || defaults.font,
      show_usage: args.show_usage ?? defaults.show_usage,
    };
    await callSketchupMethod(
      'startHeightAnnotation',
      params as unknown as Record<string, unknown>
    );
  };

  return {
    startHeightAnnotation,
    loadDefaults,
    defaults,
    isLoading,
    isAvailable,
  };
}
