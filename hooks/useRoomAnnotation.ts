import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

interface RoomAnnotationArgs {
  enviroment_name: string;
  show_ceilling_height: boolean;
  ceilling_height: string;
  show_level: boolean;
  is_auto_level: boolean;
  level_value: string;
}

export function useRoomAnnotation() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  useEffect(() => {
    window.handleRoomAnnotationResult = (response) => {
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    };

    return () => {
      if (window.handleRoomAnnotationResult) {
        delete window.handleRoomAnnotationResult;
      }
    };
  }, []);

  const startRoomAnnotation = async (args: RoomAnnotationArgs) => {
    await callSketchupMethod(
      'startRoomAnnotation',
      args as unknown as Record<string, unknown>
    );
  };

  return {
    startRoomAnnotation,
    isLoading,
    isAvailable,
  };
}
