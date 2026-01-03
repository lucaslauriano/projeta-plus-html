'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSketchup } from '@/contexts/SketchupContext';
import { toast } from 'sonner';
import { registerHandlers } from '@/utils/register-handlers';

export interface FurnitureItem {
  code: string;
  name: string;
  color: string;
  brand: string;
  type: string;
  dimension: string;
  environment: string;
  link: string;
  observations: string;
  value: string;
  quantity: number;
  total: number;
  ids: number[];
}

export interface CategoryData {
  category: string;
  items: FurnitureItem[];
  total: number;
  itemCount: number;
}

export interface CategoryPreferences {
  [category: string]: {
    show: boolean;
    export: boolean;
  };
}

export interface ColumnPreferences {
  [column: string]: boolean;
}

interface SketchupResult {
  success: boolean;
  message?: string;
}

interface GetFurnitureTypesResult extends SketchupResult {
  types?: string[];
}

interface GetCategoryDataResult extends SketchupResult {
  category: string;
  data: CategoryData;
}

interface GetCategoryPreferencesResult extends SketchupResult {
  preferences?: CategoryPreferences;
}

interface GetColumnPreferencesResult extends SketchupResult {
  preferences?: ColumnPreferences;
}

interface PickSaveFilePathResult extends SketchupResult {
  path?: string;
}

interface WindowWithHandlers extends Window {
  handlePickSaveFilePathResult?: (result: PickSaveFilePathResult) => void;
}

export function useFurnitureReports() {
  const { callSketchupMethod, isLoading, isAvailable } = useSketchup();

  const [categories, setCategories] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState<
    Record<string, CategoryData>
  >({});
  const [categoryPrefs, setCategoryPrefs] = useState<CategoryPreferences>({});
  const [columnPrefs, setColumnPrefs] = useState<ColumnPreferences>({});
  const [isBusy, setIsBusy] = useState(false);

  // ========================================
  // PUBLIC METHODS
  // ========================================

  const getFurnitureTypes = useCallback(async () => {
    setIsBusy(true);
    await callSketchupMethod('getFurnitureTypes', {});
  }, [callSketchupMethod]);

  const getCategoryData = useCallback(
    async (category: string) => {
      setIsBusy(true);
      await callSketchupMethod('getCategoryData', { category });
    },
    [callSketchupMethod]
  );

  // ========================================
  // HANDLERS
  // ========================================

  useEffect(() => {
    const cleanup = registerHandlers({
      handleGetFurnitureTypesResult: (result: GetFurnitureTypesResult) => {
        console.log('[FurnitureReports] Got types:', result);
        setIsBusy(false);
        if (result.success) {
          setCategories(result.types || []);
        } else {
          toast.error(result.message || 'Erro ao carregar tipos de mobiliário');
        }
      },

      handleGetCategoryDataResult: (response) => {
        const result = response as GetCategoryDataResult;
        setIsBusy(false);
        if (result.success) {
          setCategoryData((prev) => ({
            ...prev,
            [result.category]: result.data,
          }));
        } else {
          toast.error(result.message || 'Erro ao carregar dados da categoria');
        }
      },

      handleGetCategoryPreferencesResult: (
        result: GetCategoryPreferencesResult
      ) => {
        if (result.success) {
          setCategoryPrefs(result.preferences || {});
        }
      },

      handleSaveCategoryPreferencesResult: (result: SketchupResult) => {
        if (result.success) {
          toast.success('Preferências salvas com sucesso!');
        } else {
          toast.error(result.message || 'Erro ao salvar preferências');
        }
      },

      handleGetColumnPreferencesResult: (
        result: GetColumnPreferencesResult
      ) => {
        if (result.success) {
          setColumnPrefs(result.preferences || {});
        }
      },

      handleSaveColumnPreferencesResult: (result: SketchupResult) => {
        if (result.success) {
          toast.success('Colunas salvas com sucesso!');
        } else {
          toast.error(result.message || 'Erro ao salvar colunas');
        }
      },

      handleExportCategoryCSVResult: (result: SketchupResult) => {
        setIsBusy(false);
        if (result.success) {
          toast.success(result.message || 'Exportado com sucesso!');
        } else {
          toast.error(result.message || 'Erro ao exportar CSV');
        }
      },

      handleExportXLSXResult: (result: SketchupResult) => {
        setIsBusy(false);
        if (result.success) {
          toast.success(result.message || 'Exportado com sucesso!');
        } else {
          toast.error(result.message || 'Erro ao exportar XLSX');
        }
      },

      handleIsolateFurnitureItemResult: (result: SketchupResult) => {
        if (result.success) {
          toast.success('Item isolado com sucesso!');
        } else {
          toast.error(result.message || 'Erro ao isolar item');
        }
      },

      handleDeleteFurnitureItemResult: (result: SketchupResult) => {
        if (result.success) {
          toast.success('Item removido com sucesso!');
          // Recarrega os dados das categorias carregadas
          setCategoryData((prev) => {
            const categories = Object.keys(prev);
            categories.forEach((cat) => {
              getCategoryData(cat);
            });
            return prev;
          });
        } else {
          toast.error(result.message || 'Erro ao remover item');
        }
      },
    });

    return cleanup;
  }, [getCategoryData]);

  const getCategoryPreferences = useCallback(async () => {
    await callSketchupMethod('getCategoryPreferences', {});
  }, [callSketchupMethod]);

  const saveCategoryPreferences = useCallback(
    async (preferences: CategoryPreferences) => {
      setCategoryPrefs(preferences);
      await callSketchupMethod('saveCategoryPreferences', { preferences });
    },
    [callSketchupMethod]
  );

  const getColumnPreferences = useCallback(async () => {
    await callSketchupMethod('getColumnPreferences', {});
  }, [callSketchupMethod]);

  const saveColumnPreferences = useCallback(
    async (preferences: ColumnPreferences) => {
      setColumnPrefs(preferences);
      await callSketchupMethod('saveColumnPreferences', { preferences });
    },
    [callSketchupMethod]
  );

  const exportCategoryCSV = useCallback(
    async (category: string) => {
      try {
        setIsBusy(true);
        // Primeiro solicita ao usuário onde salvar o arquivo
        const pathResult = await new Promise<{
          success: boolean;
          path?: string;
          message?: string;
        }>((resolve) => {
          const handler = (result: PickSaveFilePathResult) => {
            // Limpa o handler imediatamente após resolver
            delete (window as WindowWithHandlers)
              .handlePickSaveFilePathFurnitureResult;
            resolve(result);
          };
          (window as WindowWithHandlers).handlePickSaveFilePathFurnitureResult =
            handler;
          callSketchupMethod('pickSaveFilePathFurniture', {
            defaultName: category,
            fileType: 'csv',
          });
        });

        if (!pathResult.success || !pathResult.path) {
          toast.info(pathResult.message || 'Exportação cancelada');
          setIsBusy(false);
          return;
        }

        // Agora exporta para o caminho escolhido
        await callSketchupMethod('exportCategoryCSV', {
          category,
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
    async (
      categories: string[],
      format: 'csv' | 'xlsx' = 'xlsx',
      isConsolidated: boolean = true
    ) => {
      try {
        setIsBusy(true);

        // Determinar nome do arquivo baseado no contexto
        const fileExtension = format;
        let defaultFileName: string;

        if (isConsolidated || categories.length > 1) {
          // Exportação consolidada ou múltiplas categorias
          defaultFileName = `furniture_report_consolidated.${fileExtension}`;
        } else {
          // Exportação individual - usar nome da categoria
          const categoryName = categories[0].replace(/[^a-zA-Z0-9]/g, '_');
          defaultFileName = `${categoryName}.${fileExtension}`;
        }

        // Primeiro solicita ao usuário onde salvar o arquivo
        const pathResult = await new Promise<{
          success: boolean;
          path?: string;
          message?: string;
        }>((resolve) => {
          const handler = (result: PickSaveFilePathResult) => {
            // Limpa o handler imediatamente após resolver
            delete (window as WindowWithHandlers)
              .handlePickSaveFilePathFurnitureResult;
            resolve(result);
          };
          (window as WindowWithHandlers).handlePickSaveFilePathFurnitureResult =
            handler;
          callSketchupMethod('pickSaveFilePathFurniture', {
            defaultName: defaultFileName,
            fileType: fileExtension,
          });
        });

        if (!pathResult.success || !pathResult.path) {
          toast.info(pathResult.message || 'Exportação cancelada');
          setIsBusy(false);
          return;
        }

        // Agora exporta para o caminho escolhido com o formato especificado
        if (format === 'csv' && categories.length === 1) {
          // Se for CSV e uma única categoria, usar exportCategoryCSV
          await callSketchupMethod('exportCategoryCSV', {
            category: categories[0],
            path: pathResult.path,
          });
        } else {
          // Para XLSX ou múltiplas categorias em CSV, usar exportXLSX
          await callSketchupMethod('exportXLSX', {
            categories,
            path: pathResult.path,
          });
        }
      } catch (error) {
        console.error('Error exporting:', error);
        toast.error(`Erro ao exportar ${format.toUpperCase()}`);
        setIsBusy(false);
      }
    },
    [callSketchupMethod]
  );

  const isolateFurnitureItem = useCallback(
    async (entityId: number) => {
      await callSketchupMethod('isolateFurnitureItem', { entityId });
    },
    [callSketchupMethod]
  );

  const deleteFurnitureItem = useCallback(
    async (entityId: number) => {
      await callSketchupMethod('deleteFurnitureItem', { entityId });
    },
    [callSketchupMethod]
  );

  const refreshAllData = useCallback(async () => {
    setIsBusy(true);
    await getFurnitureTypes();
    await getCategoryPreferences();
    await getColumnPreferences();
  }, [getFurnitureTypes, getCategoryPreferences, getColumnPreferences]);

  // ========================================
  // LIFECYCLE
  // ========================================

  useEffect(() => {
    refreshAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========================================
  // RETURN
  // ========================================

  return {
    // State
    categories,
    categoryData,
    categoryPrefs,
    columnPrefs,
    isBusy: isBusy || isLoading,
    isAvailable,

    // Methods
    getFurnitureTypes,
    getCategoryData,
    getCategoryPreferences,
    saveCategoryPreferences,
    getColumnPreferences,
    saveColumnPreferences,
    exportCategoryCSV,
    exportXLSX,
    isolateFurnitureItem,
    deleteFurnitureItem,
    refreshAllData,
  };
}
