'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSketchup } from '@/contexts/SketchupContext';
import { toast } from 'sonner';
import { registerHandlers } from '@/utils/register-handlers';

interface WindowWithHandlers extends Window {
  handlePickSaveFilePathLightningResult?: (result: {
    success: boolean;
    path?: string;
    message?: string;
  }) => void;
}

declare const window: WindowWithHandlers;

// ========================================
// TYPES & INTERFACES
// ========================================

export interface LightningItem {
  legenda: string;
  luminaria: string;
  marca_luminaria: string;
  lampada: string;
  marca_lampada: string;
  temperatura: string;
  irc: string;
  lumens: string;
  dimer: string;
  ambiente: string;
  quantidade: number;
}

export interface LightningType {
  id: string;
  name: string;
  prefix: string;
}

export interface LightningData {
  items: LightningItem[];
  total: number;
  summary: {
    totalItems: number;
    uniqueItems: number;
  };
}

export interface ColumnPreferences {
  [column: string]: boolean;
}

interface SketchupResult {
  success: boolean;
  message?: string;
}

interface GetLightningTypesResult extends SketchupResult {
  types?: LightningType[];
}

interface GetLightningDataResult extends SketchupResult {
  type: string;
  data: LightningData;
}

interface GetColumnPreferencesResult extends SketchupResult {
  preferences?: string[];
}

interface ExportResult extends SketchupResult {
  path?: string;
}

export function useLightningReports() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  const [types, setTypes] = useState<LightningType[]>([]);
  const [lightningData, setLightningData] = useState<
    Record<string, LightningData>
  >({});
  const [columnPrefs, setColumnPrefs] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const getLightningTypes = useCallback(async () => {
    if (!isAvailable) {
      toast.error('SketchUp não disponível');
      return;
    }
    setIsBusy(true);
    await callSketchupMethod('getLightningTypes', {});
  }, [callSketchupMethod, isAvailable]);

  const getLightningData = useCallback(
    async (type: string) => {
      if (!isAvailable) {
        toast.error('SketchUp não disponível');
        return;
      }
      setIsBusy(true);
      await callSketchupMethod('getLightningData', { type });
    },
    [callSketchupMethod, isAvailable]
  );

  const getColumnPreferences = useCallback(async () => {
    if (!isAvailable) return;
    await callSketchupMethod('getLightningColumnPreferences', {});
  }, [callSketchupMethod, isAvailable]);

  const saveColumnPreferences = useCallback(
    async (preferences: string[]) => {
      if (!isAvailable) {
        toast.error('SketchUp não disponível');
        return;
      }
      await callSketchupMethod('saveLightningColumnPreferences', {
        preferences,
      });
    },
    [callSketchupMethod, isAvailable]
  );

  const exportCSV = useCallback(
    async (type: string, data: LightningItem[], columns: string[]) => {
      console.log('[useLightningReports] exportCSV called', {
        type,
        dataLength: data.length,
        columns,
      });

      if (!isAvailable) {
        toast.error('SketchUp não disponível');
        return;
      }

      try {
        setIsBusy(true);
        console.log('[useLightningReports] Requesting file path...');

        // Primeiro solicita ao usuário onde salvar o arquivo
        const pathResult = await new Promise<{
          success: boolean;
          path?: string;
          message?: string;
        }>((resolve) => {
          const handler = (result: {
            success: boolean;
            path?: string;
            message?: string;
          }) => {
            console.log('[useLightningReports] Path result received:', result);
            // Limpa o handler imediatamente após resolver
            delete window.handlePickSaveFilePathLightningResult;
            resolve(result);
          };
          window.handlePickSaveFilePathLightningResult = handler;
          callSketchupMethod('pickSaveFilePathLightning', {
            defaultName: type,
            fileType: 'csv',
          });
        });

        if (!pathResult.success || !pathResult.path) {
          console.log('[useLightningReports] Export cancelled or no path');
          toast.info(pathResult.message || 'Exportação cancelada');
          setIsBusy(false);
          return;
        }

        console.log('[useLightningReports] Exporting to:', pathResult.path);
        // Agora exporta para o caminho escolhido
        await callSketchupMethod('exportLightningCSV', {
          type,
          data,
          columns,
          path: pathResult.path,
        });
        console.log(
          '[useLightningReports] Export method called, waiting for response...'
        );
      } catch (error) {
        console.error('[useLightningReports] Error exporting CSV:', error);
        toast.error('Erro ao exportar CSV');
        setIsBusy(false);
      }
    },
    [callSketchupMethod, isAvailable]
  );

  const exportXLSX = useCallback(
    async (type: string, data: LightningItem[], columns: string[]) => {
      console.log('[useLightningReports] exportXLSX called', {
        type,
        dataLength: data.length,
        columns,
      });

      if (!isAvailable) {
        toast.error('SketchUp não disponível');
        return;
      }

      try {
        setIsBusy(true);
        console.log('[useLightningReports] Requesting file path...');

        // Primeiro solicita ao usuário onde salvar o arquivo
        const pathResult = await new Promise<{
          success: boolean;
          path?: string;
          message?: string;
        }>((resolve) => {
          const handler = (result: {
            success: boolean;
            path?: string;
            message?: string;
          }) => {
            console.log('[useLightningReports] Path result received:', result);
            // Limpa o handler imediatamente após resolver
            delete window.handlePickSaveFilePathLightningResult;
            resolve(result);
          };
          window.handlePickSaveFilePathLightningResult = handler;
          callSketchupMethod('pickSaveFilePathLightning', {
            defaultName: type,
            fileType: 'xlsx',
          });
        });

        if (!pathResult.success || !pathResult.path) {
          console.log('[useLightningReports] Export cancelled or no path');
          toast.info(pathResult.message || 'Exportação cancelada');
          setIsBusy(false);
          return;
        }

        console.log('[useLightningReports] Exporting to:', pathResult.path);
        // Agora exporta para o caminho escolhido
        await callSketchupMethod('exportLightningXLSX', {
          type,
          data,
          columns,
          path: pathResult.path,
        });
        console.log(
          '[useLightningReports] Export method called, waiting for response...'
        );
      } catch (error) {
        console.error('[useLightningReports] Error exporting XLSX:', error);
        toast.error('Erro ao exportar XLSX');
        setIsBusy(false);
      }
    },
    [callSketchupMethod, isAvailable]
  );

  useEffect(() => {
    const cleanup = registerHandlers({
      handleGetLightningTypesResult: (response) => {
        const result = response as GetLightningTypesResult;
        console.log('[LightningReports] Got types:', result);
        setIsBusy(false);
        if (result.success && result.types) {
          setTypes(result.types);
        } else {
          toast.error(result.message || 'Erro ao carregar tipos de iluminação');
        }
      },

      handleGetLightningDataResult: (response) => {
        const result = response as GetLightningDataResult;
        console.log('[LightningReports] Got data:', result);
        setIsBusy(false);
        if (result.success) {
          setLightningData((prev) => ({
            ...prev,
            [result.type]: result.data,
          }));
        } else {
          toast.error(result.message || 'Erro ao carregar dados de iluminação');
        }
      },

      handleGetLightningColumnPreferencesResult: (response) => {
        const result = response as GetColumnPreferencesResult;
        if (result.success && result.preferences) {
          setColumnPrefs(result.preferences);
        }
      },

      handleSaveLightningColumnPreferencesResult: (response) => {
        const result = response as SketchupResult;
        if (result.success) {
          toast.success('Preferências salvas com sucesso!');
        } else {
          toast.error(result.message || 'Erro ao salvar preferências');
        }
      },

      handleExportLightningCSVResult: (response) => {
        const result = response as ExportResult;
        setIsBusy(false);
        if (result.success) {
          toast.success('Arquivo CSV exportado com sucesso!');
          if (result.path) {
            console.log('[LightningReports] File saved at:', result.path);
          }
        } else {
          toast.error(result.message || 'Erro ao exportar CSV');
        }
      },

      handleExportLightningXLSXResult: (response) => {
        const result = response as ExportResult;
        setIsBusy(false);
        if (result.success) {
          toast.success('Arquivo XLSX exportado com sucesso!');
          if (result.path) {
            console.log('[LightningReports] File saved at:', result.path);
          }
        } else {
          toast.error(result.message || 'Erro ao exportar XLSX');
        }
      },
    });

    // Load initial data
    if (isAvailable) {
      getLightningTypes();
      getColumnPreferences();
    }

    return cleanup;
  }, [isAvailable, getLightningTypes, getColumnPreferences]);

  // ========================================
  // RETURN
  // ========================================

  return {
    // State
    types,
    lightningData,
    columnPrefs,
    isBusy,
    isLoading,
    isAvailable,

    // Methods
    getLightningTypes,
    getLightningData,
    getColumnPreferences,
    saveColumnPreferences,
    exportCSV,
    exportXLSX,
  };
}
