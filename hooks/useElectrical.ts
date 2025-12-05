'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

interface ElectricalItem {
  id: string;
  name: string;
  path: string;
}

interface ElectricalGroup {
  id: string;
  title: string;
  items: ElectricalItem[];
}

interface ElectricalData {
  groups: ElectricalGroup[];
  components_path?: string;
}

interface ElectricalResult {
  success: boolean;
  message?: string;
  groups?: ElectricalGroup[];
  components_path?: string;
  block_name?: string;
}

export function useElectrical() {
  const [data, setData] = useState<ElectricalData>({
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
        if (method === 'getElectricalBlocks') {
          setTimeout(() => {
            window.handleGetElectricalBlocksResult?.({
              success: true,
              groups: [
                {
                  id: 'pontos-eletricos',
                  title: 'Pontos Elétricos',
                  items: [
                    {
                      id: '1',
                      name: 'Passagem com Canos 50mm',
                      path: 'Geral/Passagem com Canos 50mm.skp',
                    },
                    { id: '2', name: 'Ponto - S', path: 'Geral/Ponto - S.skp' },
                    {
                      id: '3',
                      name: 'Ponto Alerta',
                      path: 'Geral/Ponto Alerta.skp',
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
    window.handleGetElectricalBlocksResult = (result: ElectricalResult) => {
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

    window.handleImportElectricalBlockResult = (result: ElectricalResult) => {
      setIsBusy(false);
      if (result.success) {
        toast.success(`Bloco importado: ${result.block_name}`);
      } else {
        toast.error(result.message || 'Erro ao importar bloco');
      }
    };

    window.handleOpenElectricalFolderResult = (result: ElectricalResult) => {
      if (result.success) {
        toast.success('Pasta de blocos aberta');
      } else {
        toast.error(result.message || 'Erro ao abrir pasta');
      }
    };

    window.handleExportElectricalReportResult = (result: ElectricalResult) => {
      if (result.success) {
        toast.success('Relatório exportado com sucesso');
      } else {
        toast.error(result.message || 'Erro ao exportar relatório');
      }
    };

    // Cleanup
    return () => {
      delete window.handleGetElectricalBlocksResult;
      delete window.handleImportElectricalBlockResult;
      delete window.handleOpenElectricalFolderResult;
      delete window.handleExportElectricalReportResult;
    };
  }, []);

  const getBlocks = useCallback(() => {
    setIsBusy(true);
    callSketchupMethod('getElectricalBlocks');
  }, [callSketchupMethod]);

  const importBlock = useCallback(
    (blockPath: string) => {
      setIsBusy(true);
      callSketchupMethod('importElectricalBlock', { path: blockPath });
    },
    [callSketchupMethod]
  );

  const openBlocksFolder = useCallback(() => {
    callSketchupMethod('openElectricalBlocksFolder');
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
