import { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

interface RoomAnnotationArgs {
  enviroment_name?: string;
  floor_height?: string | number;
  show_ceilling_height?: string;
  ceilling_height?: string | number;
  show_level?: string;
  level?: string | number;
  scale?: number;
  font?: string;
}

export function useRoomAnnotation() {
  useEffect(() => {
    window.handleRoomAnnotationResult = (result) => {
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    return () => {
      delete window.handleRoomAnnotationResult;
    };
  }, []);

  const startAnnotation = useCallback((args: RoomAnnotationArgs) => {
    if (!window.sketchup?.startRoomAnnotation) {
      toast.error('Not running in SketchUp environment');
      return;
    }

    try {
      window.sketchup.startRoomAnnotation(args);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error('Error starting room annotation: ' + errorMessage);
    }
  }, []);

  return { startAnnotation };
}
