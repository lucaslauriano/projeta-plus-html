import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export type HeightDefaults = {
  show_usage: boolean;
};

export function useHeightAnnotation() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const [defaults, setDefaults] = useState<HeightDefaults>({
    show_usage: false,
  });

  const loadDefaults = useCallback(async () => {
    await callSketchupMethod('loadHeightAnnotationDefaults', {});
  }, [callSketchupMethod]);

  useEffect(() => {
    loadDefaults();

    window.handleHeightDefaults = (response: HeightDefaults) => {
      if (response) {
        setDefaults(response);
      }
    };

    window.handleHeightAnnotationResult = (response: {
      success: boolean;
      message: string;
    }) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
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
