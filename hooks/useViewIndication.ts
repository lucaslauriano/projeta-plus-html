import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export function useViewIndication() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  useEffect(() => {
    window.handleViewIndicationResult = (response) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    };

    return () => {
      if (window.handleViewIndicationResult) {
        delete window.handleViewIndicationResult;
      }
    };
  }, []);

  const activateViewIndicationTool = async () => {
    await callSketchupMethod('activate_view_indication_tool', {});
  };

  const getViewIndicationSettings = async () => {
    await callSketchupMethod('get_view_indication_settings', {});
  };

  const updateViewIndicationSettings = async (
    settings: Record<string, unknown>
  ) => {
    await callSketchupMethod('update_view_indication_settings', settings);
  };

  return {
    activateViewIndicationTool,
    getViewIndicationSettings,
    updateViewIndicationSettings,
    isLoading,
    isAvailable,
  };
}
