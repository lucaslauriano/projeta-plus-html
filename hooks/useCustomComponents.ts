'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useConfirm } from './useConfirm';

interface CustomComponentItem {
  id: string;
  name: string;
  path: string;
  source: string;
}

interface CustomComponentGroup {
  id: string;
  title: string;
  items: CustomComponentItem[];
  source: string;
}

interface CustomComponentsData {
  groups: CustomComponentGroup[];
}

interface CustomComponentResult {
  success: boolean;
  message?: string;
  groups?: CustomComponentGroup[];
  filename?: string;
  category?: string;
  count?: number;
}

export function useCustomComponents() {
  const { confirm, ConfirmDialog } = useConfirm();
  const [data, setData] = useState<CustomComponentsData>({
    groups: [],
  });
  const [isBusy, setIsBusy] = useState(false);

  const callSketchupMethod = useCallback(
    (method: string, params?: Record<string, unknown>) => {
      if (window.sketchup) {
        const sketchup = window.sketchup as Record<
          string,
          (payload?: string) => void
        >;
        sketchup[method]?.(params ? JSON.stringify(params) : undefined);
      } else {
        console.warn(`[MOCK MODE] ${method}:`, params);
      }
    },
    []
  );

  const getCustomComponents = useCallback(() => {
    setIsBusy(true);
    callSketchupMethod('getCustomComponents');
  }, [callSketchupMethod]);

  useEffect(() => {
    window.handleGetCustomComponentsResult = (
      result: CustomComponentResult
    ) => {
      setIsBusy(false);
      if (result.success) {
        setData({
          groups: result.groups || [],
        });
      } else {
        toast.error(
          result.message || 'Erro ao carregar componentes customizados'
        );
      }
    };

    window.handleUploadCustomComponentResult = (
      result: CustomComponentResult
    ) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(`Componente adicionado: ${result.filename}`);
        getCustomComponents();
      } else {
        toast.error(result.message || 'Erro ao fazer upload');
      }
    };

    window.handleDeleteCustomComponentResult = (
      result: CustomComponentResult
    ) => {
      setIsBusy(false);
      if (result.success) {
        toast.success('Componente removido com sucesso');
        getCustomComponents();
      } else {
        toast.error(result.message || 'Erro ao remover componente');
      }
    };

    window.handleOpenCustomFolderResult = (result: CustomComponentResult) => {
      if (result.success) {
        toast.success('Pasta de componentes customizados aberta');
      } else {
        toast.error(result.message || 'Erro ao abrir pasta');
      }
    };

    window.handleSyncFolderResult = (result: CustomComponentResult) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(`${result.count} componente(s) sincronizado(s)`);
        getCustomComponents();
      } else {
        toast.error(result.message || 'Erro ao sincronizar pasta');
      }
    };

    // Cleanup
    return () => {
      delete window.handleGetCustomComponentsResult;
      delete window.handleUploadCustomComponentResult;
      delete window.handleDeleteCustomComponentResult;
      delete window.handleOpenCustomFolderResult;
      delete window.handleSyncFolderResult;
    };
  }, [getCustomComponents]);

  const uploadComponent = useCallback(
    (category: string = 'Geral') => {
      setIsBusy(true);
      callSketchupMethod('uploadCustomComponent', { category });
    },
    [callSketchupMethod]
  );

  const deleteComponent = useCallback(
    async (blockPath: string) => {
      const confirmed = await confirm({
        title: 'Remover componente',
        description: 'Deseja realmente remover este componente?',
        confirmText: 'Remover',
        cancelText: 'Cancelar',
        variant: 'destructive',
      });
      if (confirmed) {
        setIsBusy(true);
        callSketchupMethod('deleteCustomComponent', { path: blockPath });
      }
    },
    [confirm, callSketchupMethod]
  );

  const openCustomFolder = useCallback(() => {
    callSketchupMethod('openCustomComponentsFolder');
  }, [callSketchupMethod]);

  const syncFolder = useCallback(() => {
    setIsBusy(true);
    callSketchupMethod('syncCustomComponentsFolder');
  }, [callSketchupMethod]);

  // ========================================
  // LIFECYCLE
  // ========================================

  useEffect(() => {
    getCustomComponents();
  }, [getCustomComponents]);

  // ========================================
  // RETURN
  // ========================================

  return {
    data,
    isBusy,
    getCustomComponents,
    uploadComponent,
    deleteComponent,
    openCustomFolder,
    syncFolder,
    ConfirmDialog,
  };
}
