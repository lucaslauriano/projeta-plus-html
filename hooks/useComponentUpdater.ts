import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export type ComponentUpdaterDefaults = {
  last_attribute: string;
  last_value: string;
  last_situation_type: string;
};

export type ComponentUpdaterArgs = {
  attribute_type: string;
  new_value: string;
  situation_type: string;
};

export function useComponentUpdater() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const [defaults, setDefaults] = useState<ComponentUpdaterDefaults>({
    last_attribute: 'scale',
    last_value: '',
    last_situation_type: '1',
  });

  const loadDefaults = useCallback(async () => {
    await callSketchupMethod('loadComponentUpdaterDefaults', {});
  }, [callSketchupMethod]);

  useEffect(() => {
    // Load defaults when hook is initialized
    loadDefaults();

    // Register result handler
    window.handleComponentUpdaterDefaults = (
      response: ComponentUpdaterDefaults
    ) => {
      if (response) {
        setDefaults(response);
      }
    };

    window.handleComponentUpdaterResult = (response: {
      success: boolean;
      message: string;
    }) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
        console.error('Component updater error:', response.message);
      }
    };

    return () => {
      if (window.handleComponentUpdaterDefaults) {
        delete window.handleComponentUpdaterDefaults;
      }
      if (window.handleComponentUpdaterResult) {
        delete window.handleComponentUpdaterResult;
      }
    };
  }, [loadDefaults]);

  const updateComponentAttributes = async (args: ComponentUpdaterArgs) => {
    await callSketchupMethod(
      'updateComponentAttributes',
      args as unknown as Record<string, unknown>
    );
  };

  return {
    updateComponentAttributes,
    loadDefaults,
    defaults,
    isLoading,
    isAvailable,
  };
}
