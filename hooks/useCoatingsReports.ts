'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSketchup } from '@/contexts/SketchupContext';
import { toast } from 'sonner';
import { registerHandlers } from '@/utils/register-handlers';

interface WindowWithHandlers extends Window {
  handlePickSaveFilePathCoatingsResult?: (result: {
    success: boolean;
    path?: string;
    message?: string;
  }) => void;
}

declare const window: WindowWithHandlers;

export interface CoatingItem {
  ambiente: string;
  material: string;
  marca: string;
  acabamento: string;
  area: number;
  acrescimo: number;
  total: number;
}

interface SketchupResult {
  success: boolean;
  message?: string;
}

interface LoadDataResult extends SketchupResult {
  data: CoatingItem[];
}

interface AddMaterialResult extends SketchupResult {
  material?: {
    name: string;
    area: number;
  };
}

interface ExportResult extends SketchupResult {
  path?: string;
}

export function useCoatingsReports() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  const [coatingsData, setCoatingsData] = useState<CoatingItem[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const loadData = useCallback(async () => {
    if (!isAvailable) {
      toast.error('SketchUp não disponível');
      return;
    }
    setIsBusy(true);
    await callSketchupMethod('loadCoatingsData', {});
  }, [callSketchupMethod, isAvailable]);

  const saveData = useCallback(
    async (data: CoatingItem[]) => {
      if (!isAvailable) {
        toast.error('SketchUp não disponível');
        return;
      }
      await callSketchupMethod('saveCoatingsData', { data });
    },
    [callSketchupMethod, isAvailable]
  );

  const addSelectedMaterial = useCallback(async () => {
    if (!isAvailable) {
      toast.error('SketchUp não disponível');
      return;
    }
    setIsBusy(true);
    await callSketchupMethod('addSelectedMaterial', {});
  }, [callSketchupMethod, isAvailable]);

  const exportCSV = useCallback(
    async (data: CoatingItem[], columns: string[]) => {
      if (!isAvailable) {
        toast.error('SketchUp não disponível');
        return;
      }

      try {
        setIsBusy(true);

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
            delete window.handlePickSaveFilePathCoatingsResult;
            resolve(result);
          };
          window.handlePickSaveFilePathCoatingsResult = handler;
          callSketchupMethod('pickSaveFilePathCoatings', {
            defaultName: 'revestimentos',
            fileType: 'csv',
          });
        });

        if (!pathResult.success || !pathResult.path) {
          toast.info(pathResult.message || 'Exportação cancelada');
          setIsBusy(false);
          return;
        }

        await callSketchupMethod('exportCoatingsCSV', {
          data,
          columns,
          path: pathResult.path,
        });
      } catch (error) {
        console.error('Error exporting CSV:', error);
        toast.error('Erro ao exportar CSV');
        setIsBusy(false);
      }
    },
    [callSketchupMethod, isAvailable]
  );

  const exportXLSX = useCallback(
    async (data: CoatingItem[], columns: string[]) => {
      if (!isAvailable) {
        toast.error('SketchUp não disponível');
        return;
      }

      try {
        setIsBusy(true);

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
            delete window.handlePickSaveFilePathCoatingsResult;
            resolve(result);
          };
          window.handlePickSaveFilePathCoatingsResult = handler;
          callSketchupMethod('pickSaveFilePathCoatings', {
            defaultName: 'revestimentos',
            fileType: 'xlsx',
          });
        });

        if (!pathResult.success || !pathResult.path) {
          toast.info(pathResult.message || 'Exportação cancelada');
          setIsBusy(false);
          return;
        }

        await callSketchupMethod('exportCoatingsXLSX', {
          data,
          columns,
          path: pathResult.path,
        });
      } catch (error) {
        console.error('Error exporting XLSX:', error);
        toast.error('Erro ao exportar XLSX');
        setIsBusy(false);
      }
    },
    [callSketchupMethod, isAvailable]
  );

  const updateItem = useCallback(
    (index: number, updates: Partial<CoatingItem>) => {
      const newData = [...coatingsData];
      newData[index] = { ...newData[index], ...updates };

      if (updates.acrescimo !== undefined || updates.area !== undefined) {
        const area = newData[index].area;
        const acrescimo = newData[index].acrescimo || 0;
        newData[index].total = parseFloat(
          (area * (1 + acrescimo / 100)).toFixed(2)
        );
      }

      setCoatingsData(newData);
      saveData(newData);
    },
    [coatingsData, saveData]
  );

  const removeItem = useCallback(
    (index: number) => {
      const newData = coatingsData.filter((_, i) => i !== index);
      setCoatingsData(newData);
      saveData(newData);
      toast.success('Item removido');
    },
    [coatingsData, saveData]
  );

  useEffect(() => {
    const cleanup = registerHandlers({
      handleLoadCoatingsDataResult: (response) => {
        const result = response as LoadDataResult;
        console.log('[CoatingsReports] Load data result:', result);
        setIsBusy(false);
        if (result.success) {
          setCoatingsData(result.data || []);
        } else {
          toast.error(result.message || 'Erro ao carregar dados');
        }
      },

      handleSaveCoatingsDataResult: (response) => {
        const result = response as SketchupResult;
        if (!result.success) {
          toast.error(result.message || 'Erro ao salvar dados');
        }
      },

      handleAddSelectedMaterialResult: (response) => {
        const result = response as AddMaterialResult;
        console.log('[CoatingsReports] Add material result:', result);
        setIsBusy(false);

        if (result.success && result.material) {
          const newItem: CoatingItem = {
            ambiente: '',
            material: result.material.name,
            marca: '',
            acabamento: '',
            area: result.material.area,
            acrescimo: 0,
            total: result.material.area,
          };

          setCoatingsData((prev) => {
            const newData = [...prev, newItem];
            callSketchupMethod('saveCoatingsData', { data: newData });
            return newData;
          });
          toast.success(`Material "${result.material.name}" adicionado!`);
        } else {
          toast.error(result.message || 'Erro ao adicionar material');
        }
      },

      handleExportCoatingsCSVResult: (response) => {
        const result = response as ExportResult;
        setIsBusy(false);
        if (result.success) {
          toast.success('Arquivo CSV exportado com sucesso!');
          if (result.path) {
            console.log('[CoatingsReports] File saved at:', result.path);
          }
        } else {
          toast.error(result.message || 'Erro ao exportar CSV');
        }
      },

      handleExportCoatingsXLSXResult: (response) => {
        const result = response as ExportResult;
        setIsBusy(false);
        if (result.success) {
          toast.success('Arquivo XLSX exportado com sucesso!');
          if (result.path) {
            console.log('[CoatingsReports] File saved at:', result.path);
          }
        } else {
          toast.error(result.message || 'Erro ao exportar XLSX');
        }
      },
    });

    return cleanup;
  }, [callSketchupMethod]);

  useEffect(() => {
    if (isAvailable) {
      loadData();
    }
  }, [isAvailable, loadData]);

  const summary = {
    totalItems: coatingsData.length,
    totalArea: parseFloat(
      coatingsData.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)
    ),
    uniqueEnvironments: new Set(
      coatingsData.map((item) => item.ambiente).filter(Boolean)
    ).size,
  };

  return {
    // State
    isBusy,
    summary,
    isLoading,
    isAvailable,
    coatingsData,

    // Methods
    loadData,
    saveData,
    exportCSV,
    updateItem,
    removeItem,
    exportXLSX,
    addSelectedMaterial,
  };
}
