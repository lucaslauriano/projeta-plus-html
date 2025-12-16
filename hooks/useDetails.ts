'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSketchup } from '@/contexts/SketchupContext';

export function useDetails() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();
  const [styles, setStyles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    window.handleCreateCarpentryDetailResult = (result: {
      success: boolean;
      message: string;
      layer_name?: string;
    }) => {
      setIsProcessing(false);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    window.handleCreateGeneralDetailsResult = (result: {
      success: boolean;
      message: string;
      count?: number;
    }) => {
      setIsProcessing(false);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    window.handleGetStylesResult = (result: {
      success: boolean;
      message: string;
      styles?: string[];
    }) => {
      setIsProcessing(false);
      if (result.success && result.styles) {
        setStyles(result.styles);
      } else {
        toast.error(result.message);
      }
    };

    window.handleDuplicateSceneResult = (result: {
      success: boolean;
      message: string;
      scene_name?: string;
    }) => {
      setIsProcessing(false);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    window.handleTogglePerspectiveResult = (result: {
      success: boolean;
      message: string;
      angle_index?: number;
    }) => {
      setIsProcessing(false);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    };

    return () => {
      delete window.handleCreateCarpentryDetailResult;
      delete window.handleCreateGeneralDetailsResult;
      delete window.handleGetStylesResult;
      delete window.handleDuplicateSceneResult;
      delete window.handleTogglePerspectiveResult;
    };
  }, []);

  const createCarpentryDetail = useCallback(async () => {
    if (!isAvailable) {
      toast.error('SketchUp não está disponível');
      return false;
    }
    setIsProcessing(true);
    try {
      await callSketchupMethod('createCarpentryDetail');
      return true;
    } catch {
      setIsProcessing(false);
      toast.error('Erro ao criar detalhamento de marcenaria');
      return false;
    }
  }, [isAvailable, callSketchupMethod]);

  const createGeneralDetails = useCallback(async () => {
    if (!isAvailable) {
      toast.error('SketchUp não está disponível');
      return false;
    }
    setIsProcessing(true);
    try {
      await callSketchupMethod('createGeneralDetails');
      return true;
    } catch {
      setIsProcessing(false);
      toast.error('Erro ao criar detalhamento geral');
      return false;
    }
  }, [isAvailable, callSketchupMethod]);

  const getStyles = useCallback(async () => {
    if (!isAvailable) {
      toast.error('SketchUp não está disponível');
      return false;
    }
    setIsProcessing(true);
    try {
      await callSketchupMethod('getStyles');
      return true;
    } catch {
      setIsProcessing(false);
      toast.error('Erro ao obter estilos');
      return false;
    }
  }, [isAvailable, callSketchupMethod]);

  const duplicateScene = useCallback(
    async (style: string, suffix: string) => {
      if (!isAvailable) {
        toast.error('SketchUp não está disponível');
        return false;
      }
      if (!suffix.trim()) {
        toast.error('Informe um sufixo para a cena');
        return false;
      }
      if (!style) {
        toast.error('Selecione um estilo');
        return false;
      }
      setIsProcessing(true);
      try {
        await callSketchupMethod('duplicateScene', {
          estilo: style,
          sufixo: suffix,
        });
        return true;
      } catch {
        setIsProcessing(false);
        toast.error('Erro ao duplicar cenas');
        return false;
      }
    },
    [isAvailable, callSketchupMethod]
  );

  const togglePerspective = useCallback(async () => {
    if (!isAvailable) {
      toast.error('SketchUp não está disponível');
      return false;
    }
    setIsProcessing(true);
    try {
      await callSketchupMethod('togglePerspective');
      return true;
    } catch {
      setIsProcessing(false);
      toast.error('Erro ao alternar perspectiva');
      return false;
    }
  }, [isAvailable, callSketchupMethod]);

  return {
    styles,
    isProcessing: isProcessing || isLoading,
    isAvailable,
    createCarpentryDetail,
    createGeneralDetails,
    getStyles,
    duplicateScene,
    togglePerspective,
  };
}
