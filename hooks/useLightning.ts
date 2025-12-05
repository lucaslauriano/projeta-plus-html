'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

interface LightningItem {
  id: string;
  name: string;
  path: string;
}

interface LightningGroup {
  id: string;
  title: string;
  items: LightningItem[];
}

interface LightningData {
  groups: LightningGroup[];
  components_path?: string;
}

interface LightningResult {
  success: boolean;
  message?: string;
  groups?: LightningGroup[];
  components_path?: string;
  block_name?: string;
}

export function useLightning() {
  const [data, setData] = useState<LightningData>({
    groups: [],
  });
  const [isBusy, setIsBusy] = useState(false);

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  const callSketchupMethod = useCallback((method: string, params?: Record<string, unknown>) => {
    if (window.sketchup) {
      const sketchup = window.sketchup as Record<string, (payload?: string) => void>;
      sketchup[method]?.(params ? JSON.stringify(params) : undefined);
    } else {
      console.warn(`[MOCK MODE] ${method}:`, params);
      // Mock response para desenvolvimento
      if (method === 'getLightningBlocks') {
        setTimeout(() => {
          window.handleGetLightningBlocksResult?.({
            success: true,
            groups: [
              {
                id: 'geral',
                title: 'Geral',
                items: [
                  {
                    id: '1',
                    name: 'Trilho Eletrificado de Sobrepor',
                    path: 'Geral/Trilho Eletrificado de Sobrepor.skp',
                  },
                ],
              },
            ],
          });
        }, 500);
      }
    }
  }, []);

  // ========================================
  // HANDLERS (recebem respostas do Ruby)
  // ========================================

  useEffect(() => {
    window.handleGetLightningBlocksResult = (result: LightningResult) => {
      setIsBusy(false);
      if (result.success) {
        setData({
          groups: result.groups || [],
          components_path: result.components_path,
        });
      } else {
        toast.error(result.message || 'Erro ao carregar blocos');
      }
    };

    window.handleImportLightningBlockResult = (result: LightningResult) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(`Bloco importado: ${result.block_name}`);
      } else {
        toast.error(result.message || 'Erro ao importar bloco');
      }
    };

    window.handleOpenLightningFolderResult = (result: LightningResult) => {
      if (result.success) {
        toast.success('Pasta de blocos aberta');
      } else {
        toast.error(result.message || 'Erro ao abrir pasta');
      }
    };

    // Cleanup
    return () => {
      delete window.handleGetLightningBlocksResult;
      delete window.handleImportLightningBlockResult;
      delete window.handleOpenLightningFolderResult;
    };
  }, []);

  // ========================================
  // PUBLIC METHODS
  // ========================================

  const getBlocks = useCallback(() => {
    setIsBusy(true);
    callSketchupMethod('getLightningBlocks');
  }, [callSketchupMethod]);

  const importBlock = useCallback((blockPath: string) => {
    setIsBusy(true);
    callSketchupMethod('importLightningBlock', { path: blockPath });
  }, [callSketchupMethod]);

  const openBlocksFolder = useCallback(() => {
    callSketchupMethod('openLightningBlocksFolder');
  }, [callSketchupMethod]);

  // ========================================
  // LIFECYCLE
  // ========================================

  useEffect(() => {
    getBlocks();
  }, [getBlocks]);

  // ========================================
  // RETURN
  // ========================================

  return {
    data,
    isBusy,
    getBlocks,
    importBlock,
    openBlocksFolder,
  };
}

