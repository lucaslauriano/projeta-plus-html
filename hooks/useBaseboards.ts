'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface BaseboardsItem {
  id: string;
  name: string;
  path: string;
}

interface BaseboardsGroup {
  id: string;
  title: string;
  items: BaseboardsItem[];
}

interface BaseboardsData {
  groups: BaseboardsGroup[];
  components_path?: string;
}

interface BaseboardsResult {
  success: boolean;
  message?: string;
  groups?: BaseboardsGroup[];
  components_path?: string;
  block_name?: string;
}

export function useBaseboards() {
  const [data, setData] = useState<BaseboardsData>({
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
        // Mock response para desenvolvimento
        if (method === 'getBaseboardsBlocks') {
          setTimeout(() => {
            window.handleGetBaseboardsBlocksResult?.({
              success: true,
              groups: [
                {
                  id: 'geral',
                  title: 'Geral',
                  items: [
                    {
                      id: '1',
                      name: 'Rodapé Exemplo',
                      path: 'Geral/Rodapé Exemplo.skp',
                    },
                  ],
                },
              ],
            });
          }, 500);
        }
      }
    },
    []
  );

  useEffect(() => {
    window.handleGetBaseboardsBlocksResult = (result: BaseboardsResult) => {
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

    window.handleImportBaseboardsBlockResult = (result: BaseboardsResult) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(`Bloco importado: ${result.block_name}`);
      } else {
        toast.error(result.message || 'Erro ao importar bloco');
      }
    };

    window.handleOpenBaseboardsFolderResult = (result: BaseboardsResult) => {
      if (result.success) {
        toast.success('Pasta de blocos aberta');
      } else {
        toast.error(result.message || 'Erro ao abrir pasta');
      }
    };

    // Cleanup
    return () => {
      delete window.handleGetBaseboardsBlocksResult;
      delete window.handleImportBaseboardsBlockResult;
      delete window.handleOpenBaseboardsFolderResult;
    };
  }, []);

  const getBlocks = useCallback(() => {
    setIsBusy(true);
    callSketchupMethod('getBaseboardsBlocks');
  }, [callSketchupMethod]);

  const importBlock = useCallback(
    (blockPath: string) => {
      setIsBusy(true);
      callSketchupMethod('importBaseboardsBlock', { path: blockPath });
    },
    [callSketchupMethod]
  );

  const openBlocksFolder = useCallback(() => {
    callSketchupMethod('openBaseboardsBlocksFolder');
  }, [callSketchupMethod]);

  useEffect(() => {
    getBlocks();
  }, [getBlocks]);

  return {
    data,
    isBusy,
    getBlocks,
    importBlock,
    openBlocksFolder,
  };
}
