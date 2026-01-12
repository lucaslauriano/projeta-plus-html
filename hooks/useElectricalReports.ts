'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSketchup } from '@/contexts/SketchupContext';
import { toast } from 'sonner';
import { registerHandlers } from '@/utils/register-handlers';

interface WindowWithHandlers extends Window {
  handlePickSaveFilePathResult?: (result: {
    success: boolean;
    path?: string;
    message?: string;
  }) => void;
}

declare const window: WindowWithHandlers;

export interface ElectricalReportType {
  id: string;
  title: string;
}

export interface ElectricalDataItem {
  ambiente?: string;
  uso?: string;
  suporte?: string;
  altura?: string;
  modelo?: string;
  modulo_1?: string;
  modulo_2?: string;
  modulo_3?: string;
  modulo_4?: string;
  modulo_5?: string;
  modulo_6?: string;
  peca?: string;
  quantidade: number;
}

export interface ElectricalReportData {
  success: boolean;
  report_type: string;
  data: ElectricalDataItem[];
  total: number;
  count: number;
  message?: string;
}

interface SketchupResult {
  success: boolean;
  message?: string;
}

interface GetReportTypesResult extends SketchupResult {
  types?: ElectricalReportType[];
}

export function useElectricalReports() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  const [reportTypes, setReportTypes] = useState<ElectricalReportType[]>([]);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [reportData, setReportData] = useState<ElectricalDataItem[]>([]);
  const [reportStats, setReportStats] = useState({ total: 0, count: 0 });
  const [isBusy, setIsBusy] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const cleanup = registerHandlers({
      handleGetElectricalReportTypesResult: (response) => {
        const result = response as GetReportTypesResult;
        setIsBusy(false);
        if (result.success) {
          const types = result.types || [];
          setReportTypes(types);
          if (types.length > 0) {
            setSelectedReportType((current) => current || types[0].id);
          }
        } else {
          toast.error(result.message || 'Erro ao carregar tipos de relatório');
        }
      },

      handleGetElectricalReportDataResult: (response) => {
        const result = response as ElectricalReportData;
        setIsBusy(false);
        if (result.success) {
          setReportData(result.data || []);
          setReportStats({
            total: result.total || 0,
            count: result.count || 0,
          });
        } else {
          toast.error(result.message || 'Erro ao carregar dados do relatório');
        }
      },

      handleExportElectricalCSVResult: (response) => {
        const result = response as SketchupResult;
        setIsBusy(false);
        if (result.success) {
          toast.success(result.message || 'Exportado com sucesso!');
        } else {
          toast.error(result.message || 'Erro ao exportar CSV');
        }
      },

      handleExportElectricalXLSXResult: (response) => {
        const result = response as SketchupResult;
        setIsBusy(false);
        if (result.success) {
          toast.success(result.message || 'Exportado com sucesso!');
        } else {
          toast.error(result.message || 'Erro ao exportar XLSX');
        }
      },
    });

    return cleanup;
  }, []); // Removido selectedReportType das dependências

  // ========================================
  // PUBLIC METHODS
  // ========================================

  const getReportTypes = useCallback(async () => {
    setIsBusy(true);
    await callSketchupMethod('getElectricalReportTypes', {});
  }, [callSketchupMethod]);

  const getReportData = useCallback(
    async (reportType: string) => {
      setIsBusy(true);
      await callSketchupMethod('getElectricalReportData', { reportType });
    },
    [callSketchupMethod]
  );

  const exportCSV = useCallback(
    async (reportType: string) => {
      try {
        setIsBusy(true);
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
            // Limpa o handler imediatamente após resolver
            delete window.handlePickSaveFilePathElectricalResult;
            resolve(result);
          };
          window.handlePickSaveFilePathElectricalResult = handler;
          callSketchupMethod('pickSaveFilePathElectrical', {
            defaultName: reportType,
            fileType: 'csv',
          });
        });

        if (!pathResult.success || !pathResult.path) {
          toast.info(pathResult.message || 'Exportação cancelada');
          setIsBusy(false);
          return;
        }

        // Agora exporta para o caminho escolhido
        await callSketchupMethod('exportElectricalCSV', {
          reportType,
          path: pathResult.path,
        });
      } catch (error) {
        console.error('Error exporting CSV:', error);
        toast.error('Erro ao exportar CSV');
        setIsBusy(false);
      }
    },
    [callSketchupMethod]
  );

  const exportXLSX = useCallback(
    async (reportType: string) => {
      try {
        setIsBusy(true);
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
            // Limpa o handler imediatamente após resolver
            delete window.handlePickSaveFilePathElectricalResult;
            resolve(result);
          };
          window.handlePickSaveFilePathElectricalResult = handler;
          callSketchupMethod('pickSaveFilePathElectrical', {
            defaultName: reportType,
            fileType: 'xlsx',
          });
        });

        if (!pathResult.success || !pathResult.path) {
          toast.info(pathResult.message || 'Exportação cancelada');
          setIsBusy(false);
          return;
        }

        // Agora exporta para o caminho escolhido
        await callSketchupMethod('exportElectricalXLSX', {
          reportType,
          path: pathResult.path,
        });
      } catch (error) {
        console.error('Error exporting XLSX:', error);
        toast.error('Erro ao exportar XLSX');
        setIsBusy(false);
      }
    },
    [callSketchupMethod]
  );

  const refreshData = useCallback(async () => {
    if (selectedReportType) {
      await getReportData(selectedReportType);
    }
  }, [selectedReportType, getReportData]);

  // ========================================
  // LIFECYCLE
  // ========================================

  useEffect(() => {
    getReportTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedReportType) {
      // Evita carregar dados na primeira montagem (quando setamos o tipo inicial)
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      setIsBusy(true);
      callSketchupMethod('getElectricalReportData', {
        reportType: selectedReportType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedReportType]);

  // ========================================
  // RETURN
  // ========================================

  return {
    // State
    reportTypes,
    selectedReportType,
    reportData,
    reportStats,
    isBusy: isBusy || isLoading,
    isAvailable,

    // Methods
    getReportTypes,
    getReportData,
    setSelectedReportType,
    exportCSV,
    exportXLSX,
    refreshData,
  };
}
