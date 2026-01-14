'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSketchup } from '@/contexts/SketchupContext';
import { toast } from 'sonner';
import { registerHandlers } from '@/utils/register-handlers';

// ========================================
// TYPES & INTERFACES
// ========================================

export interface BaseboardItem {
  modelo: string;
  soma: number;
  barra: number;
  total: number;
}

export interface BaseboardData {
  items: BaseboardItem[];
  total: number;
  summary: {
    totalLength: number;
    totalUnits: number;
    uniqueModels: number;
  };
}

interface SketchupResult {
  success: boolean;
  message?: string;
}

interface GetBaseboardDataResult extends SketchupResult {
  data: BaseboardData;
}

interface ExportResult extends SketchupResult {
  path?: string;
}

// ========================================
// HOOK
// ========================================

export function useBaseboardReports() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  const [baseboardData, setBaseboardData] = useState<BaseboardData | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  // ========================================
  // PUBLIC METHODS
  // ========================================

  const getBaseboardData = useCallback(async () => {
    if (!isAvailable) {
      toast.error('SketchUp não disponível');
      return;
    }
    setIsBusy(true);
    await callSketchupMethod('getBaseboardData', {});
  }, [callSketchupMethod, isAvailable]);

  const exportCSV = useCallback(
    async (data: BaseboardItem[]) => {
      if (!isAvailable) {
        toast.error('SketchUp não disponível');
        return;
      }
      setIsBusy(true);
      await callSketchupMethod('exportBaseboardCSV', { data });
    },
    [callSketchupMethod, isAvailable]
  );

  const exportXLSX = useCallback(
    async (data: BaseboardItem[]) => {
      if (!isAvailable) {
        toast.error('SketchUp não disponível');
        return;
      }
      setIsBusy(true);
      await callSketchupMethod('exportBaseboardXLSX', { data });
    },
    [callSketchupMethod, isAvailable]
  );

  // Helper para atualizar um item específico
  const updateItem = useCallback(
    (index: number, updates: Partial<BaseboardItem>) => {
      if (!baseboardData) return;

      const newItems = [...baseboardData.items];
      newItems[index] = { ...newItems[index], ...updates };

      // Recalcular total se barra foi alterada
      if (updates.barra !== undefined) {
        const soma = newItems[index].soma;
        newItems[index].total = Math.ceil(soma / updates.barra);
      }

      // Recalcular summary
      const totalLength = newItems.reduce((sum, item) => sum + item.soma, 0);
      const totalUnits = newItems.reduce((sum, item) => sum + item.total, 0);

      setBaseboardData({
        ...baseboardData,
        items: newItems,
        total: totalUnits,
        summary: {
          totalLength: parseFloat(totalLength.toFixed(2)),
          totalUnits,
          uniqueModels: newItems.length,
        },
      });
    },
    [baseboardData]
  );

  // ========================================
  // HANDLERS
  // ========================================

  useEffect(() => {
    const cleanup = registerHandlers({
      handleGetBaseboardDataResult: (response) => {
        const result = response as GetBaseboardDataResult;
        console.log('[BaseboardReports] Got data:', result);
        setIsBusy(false);
        if (result.success) {
          setBaseboardData(result.data);
        } else {
          toast.error(result.message || 'Erro ao carregar dados de rodapés');
        }
      },

      handleExportBaseboardCSVResult: (response) => {
        const result = response as ExportResult;
        setIsBusy(false);
        if (result.success) {
          toast.success('Arquivo CSV exportado com sucesso!');
          if (result.path) {
            console.log('[BaseboardReports] File saved at:', result.path);
          }
        } else {
          toast.error(result.message || 'Erro ao exportar CSV');
        }
      },

      handleExportBaseboardXLSXResult: (response) => {
        const result = response as ExportResult;
        setIsBusy(false);
        if (result.success) {
          toast.success('Arquivo XLSX exportado com sucesso!');
          if (result.path) {
            console.log('[BaseboardReports] File saved at:', result.path);
          }
        } else {
          toast.error(result.message || 'Erro ao exportar XLSX');
        }
      },
    });

    // Não carrega dados automaticamente - usuário deve clicar no botão
    // if (isAvailable) {
    //   getBaseboardData();
    // }

    return cleanup;
  }, []);

  // ========================================
  // RETURN
  // ========================================

  return {
    // State
    baseboardData,
    isBusy,
    isLoading,
    isAvailable,

    // Methods
    getBaseboardData,
    updateItem,
    exportCSV,
    exportXLSX,
  };
}
