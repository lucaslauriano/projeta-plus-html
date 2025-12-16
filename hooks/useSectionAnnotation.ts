import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export function useSectionAnnotation() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  useEffect(() => {
    window.handleSectionAnnotationResult = (response) => {
      if (response.success) {
        toast.success(response.message);
        console.log('Section annotation success:', response.message);
      } else {
        toast.error(response.message);
        console.error('Section annotation error:', response.message);
      }
    };

    return () => {
      if (window.handleSectionAnnotationResult) {
        delete window.handleSectionAnnotationResult;
      }
    };
  }, []);

  const startSectionAnnotation = async () => {
    await callSketchupMethod('startSectionAnnotation', {});
  };

  return {
    startSectionAnnotation,
    isLoading,
    isAvailable,
  };
}
