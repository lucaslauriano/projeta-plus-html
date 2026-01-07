'use client';

/**
 * Main hook for Sketchup entity management
 * Orchestrates state, handlers, and Ruby method calls
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useSketchup } from '@/contexts/SketchupContext';
import type { EntityConfig, CustomMethodConfig } from '../types';
import { useSketchupState } from './useSketchupState';
import { useSketchupHandlers } from './useSketchupHandlers';
import { useSketchupMock } from './useSketchupMock';
import { validateRequired } from '../utils/validationUtils';
import { useConfirm } from '../useConfirm';

export interface UseSketchupEntityReturn<TData, TMethods> {
  // State
  data: TData;
  setData: (data: TData | ((prev: TData) => TData)) => void;
  isBusy: boolean;
  isLoading: boolean;
  isAvailable: boolean;

  // Standard CRUD methods
  getItems?: () => Promise<void>;
  addItem?: (params: Record<string, unknown>) => Promise<boolean>;
  updateItem?: (
    id: string,
    params: Record<string, unknown>
  ) => Promise<boolean>;
  deleteItem?: (id: string) => Promise<void>;

  // JSON persistence methods
  saveToJson?: () => Promise<void>;
  loadFromJson?: () => Promise<void>;
  loadDefault?: () => Promise<void>;
  loadFromFile?: () => Promise<void>;
  importToModel?: () => Promise<void>;
  exportFromModel?: () => Promise<void>;

  // Utility methods
  clearAll: () => void;
  resetState: () => void;

  // Custom methods (dynamically added)
  [key: string]: unknown;
}

/**
 * Universal hook for Sketchup entity management
 * Handles CRUD operations, JSON persistence, handlers, and mock mode
 */
export function useSketchupEntity<TData = unknown, TMethods = unknown>(
  config: EntityConfig<TData, TMethods>
): UseSketchupEntityReturn<TData, TMethods> {
  const { callSketchupMethod, isAvailable } = useSketchup();
  const { confirm, ConfirmDialog } = useConfirm();

  // State management
  const {
    data,
    setData,
    isBusy,
    setIsBusy,
    isLoading,
    setIsLoading,
    resetState,
  } = useSketchupState({
    initialData: config.initialData,
  });

  // Mock mode
  const { isMockMode, callMockMethod, getMockData } = useSketchupMock({
    mockData: config.mockData,
  });

  // Get items method
  const getItems = useCallback(async () => {
    const method = (config.methods as Record<string, string>).get;
    if (!method) return;

    if (isMockMode) {
      const mockData = getMockData(
        config.entityName,
        config.mockData?.[config.entityName as keyof TData] || []
      );
      await callMockMethod(method, undefined, {
        [config.entityName]: mockData,
      });
      return;
    }

    setIsLoading(true);
    setIsBusy(true);
    await callSketchupMethod(method);
  }, [
    config.methods,
    config.entityName,
    config.mockData,
    isMockMode,
    getMockData,
    callMockMethod,
    setIsLoading,
    setIsBusy,
    callSketchupMethod,
  ]);

  // Handlers management
  useSketchupHandlers({
    config: config.handlers,
    setData,
    setIsBusy,
    setIsLoading,
    isAvailable,
    entityName: config.entityName,
    onReload: getItems,
  });

  // Add item method
  const addItem = useCallback(
    async (params: Record<string, unknown>): Promise<boolean> => {
      const method = (config.methods as Record<string, string>).add;
      if (!method) return false;

      // Validation
      const nameError = validateRequired(
        params.name,
        `Nome ${config.entityNameSingular || config.entityName}`
      );
      if (nameError) {
        const toast = (await import('sonner')).toast;
        toast.error(nameError);
        return false;
      }

      if (isMockMode) {
        await callMockMethod(method, params, { success: true });
        return true;
      }

      setIsBusy(true);
      await callSketchupMethod(method, params);
      return true;
    },
    [
      config.methods,
      config.entityName,
      config.entityNameSingular,
      isMockMode,
      callMockMethod,
      setIsBusy,
      callSketchupMethod,
    ]
  );

  // Update item method
  const updateItem = useCallback(
    async (id: string, params: Record<string, unknown>): Promise<boolean> => {
      const method = (config.methods as Record<string, string>).update;
      if (!method) return false;

      if (isMockMode) {
        await callMockMethod(method, { id, ...params }, { success: true });
        return true;
      }

      setIsBusy(true);
      await callSketchupMethod(method, { id, ...params });
      return true;
    },
    [config.methods, isMockMode, callMockMethod, setIsBusy, callSketchupMethod]
  );

  // Delete item method
  const deleteItem = useCallback(
    async (id: string): Promise<void> => {
      const method = (config.methods as Record<string, string>).delete;
      if (!method) return;

      const confirmed = await confirm({
        title: `Remover ${config.entityNameSingular || 'item'}`,
        description: `Deseja realmente remover ${
          config.entityNameSingular || 'este item'
        }?`,
        confirmText: 'Remover',
        cancelText: 'Cancelar',
        variant: 'destructive',
      });
      if (!confirmed) return;

      if (isMockMode) {
        await callMockMethod(method, { id }, { success: true });
        return;
      }

      setIsBusy(true);
      await callSketchupMethod(method, { id });
    },
    [
      confirm,
      config.methods,
      config.entityNameSingular,
      isMockMode,
      callMockMethod,
      setIsBusy,
      callSketchupMethod,
    ]
  );

  // JSON persistence methods
  const saveToJson = useCallback(async () => {
    const method = (config.methods as Record<string, string>).saveToJson;
    if (!method) return;

    if (isMockMode) {
      const toast = (await import('sonner')).toast;
      toast.info('Configurações salvas (modo simulação)');
      return;
    }

    setIsBusy(true);
    await callSketchupMethod(method, data as Record<string, unknown>);
  }, [config.methods, isMockMode, setIsBusy, callSketchupMethod, data]);

  const loadFromJson = useCallback(async () => {
    const method = (config.methods as Record<string, string>).loadFromJson;
    if (!method) return;

    if (isMockMode) {
      const toast = (await import('sonner')).toast;
      toast.info('Configurações carregadas (modo simulação)');
      return;
    }

    setIsLoading(true);
    setIsBusy(true);
    await callSketchupMethod(method);
  }, [config.methods, isMockMode, setIsLoading, setIsBusy, callSketchupMethod]);

  const loadDefault = useCallback(async () => {
    const method = (config.methods as Record<string, string>).loadDefault;
    if (!method) return;

    if (isMockMode) {
      const toast = (await import('sonner')).toast;
      toast.info('Dados padrão carregados (modo simulação)');
      return;
    }

    setIsLoading(true);
    setIsBusy(true);
    await callSketchupMethod(method);
  }, [config.methods, isMockMode, setIsLoading, setIsBusy, callSketchupMethod]);

  const loadFromFile = useCallback(async () => {
    const method = (config.methods as Record<string, string>).loadFromFile;
    if (!method) return;

    if (isMockMode) {
      const toast = (await import('sonner')).toast;
      toast.info('Arquivo carregado (modo simulação)');
      return;
    }

    setIsLoading(true);
    setIsBusy(true);
    await callSketchupMethod(method);
  }, [config.methods, isMockMode, setIsLoading, setIsBusy, callSketchupMethod]);

  const importToModel = useCallback(async () => {
    const method = (config.methods as Record<string, string>).import;
    if (!method) return;

    if (isMockMode) {
      const toast = (await import('sonner')).toast;
      toast.info('Importado (modo simulação)');
      return;
    }

    setIsBusy(true);
    await callSketchupMethod(method, data as Record<string, unknown>);
  }, [config.methods, isMockMode, setIsBusy, callSketchupMethod, data]);

  const exportFromModel = useCallback(async () => {
    const method = (config.methods as Record<string, string>).export;
    if (!method) return;

    if (isMockMode) {
      const toast = (await import('sonner')).toast;
      toast.info('Exportado (modo simulação)');
      return;
    }

    setIsBusy(true);
    await callSketchupMethod(method);
  }, [config.methods, isMockMode, setIsBusy, callSketchupMethod]);

  // Clear all data
  const clearAll = useCallback(async () => {
    const confirmed = await confirm({
      title: 'Limpar todos os dados',
      description: 'Deseja realmente limpar todos os dados?',
      confirmText: 'Limpar',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });
    if (!confirmed) return;
    resetState();
  }, [confirm, resetState]);

  // Create custom methods from config
  const customMethods = useMemo(() => {
    if (!config.customMethods) return {};

    const methods: Record<string, (...args: unknown[]) => Promise<void>> = {};

    Object.entries(config.customMethods).forEach(
      ([methodName, methodConfig]: [string, CustomMethodConfig]) => {
        methods[methodName] = async (...args: unknown[]) => {
          // Validation
          if (methodConfig.validate) {
            const params =
              methodConfig.params?.reduce((acc, param, idx) => {
                acc[param] = args[idx];
                return acc;
              }, {} as Record<string, unknown>) || {};

            const error = methodConfig.validate(params);
            if (error) {
              const toast = (await import('sonner')).toast;
              toast.error(error);
              return;
            }
          }

          if (isMockMode) {
            const toast = (await import('sonner')).toast;
            toast.info(`${methodName} executado (modo simulação)`);
            return;
          }

          setIsBusy(true);

          const params = methodConfig.params?.reduce((acc, param, idx) => {
            acc[param] = args[idx];
            return acc;
          }, {} as Record<string, unknown>);

          await callSketchupMethod(methodConfig.rubyMethod, params);
        };
      }
    );

    return methods;
  }, [config.customMethods, isMockMode, setIsBusy, callSketchupMethod]);

  // Auto-load on mount
  useEffect(() => {
    if (config.autoLoad !== false) {
      if ((config.methods as Record<string, string>).loadFromJson) {
        loadFromJson();
      } else if ((config.methods as Record<string, string>).get) {
        getItems();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // State
    data,
    setData,
    isBusy,
    isLoading,
    isAvailable,

    // CRUD methods (only if configured)
    ...(((config.methods as Record<string, string>).get && { getItems }) || {}),
    ...(((config.methods as Record<string, string>).add && { addItem }) || {}),
    ...(((config.methods as Record<string, string>).update && { updateItem }) ||
      {}),
    ...(((config.methods as Record<string, string>).delete && { deleteItem }) ||
      {}),

    // JSON persistence methods (only if configured)
    ...(((config.methods as Record<string, string>).saveToJson && {
      saveToJson,
    }) ||
      {}),
    ...(((config.methods as Record<string, string>).loadFromJson && {
      loadFromJson,
    }) ||
      {}),
    ...(((config.methods as Record<string, string>).loadDefault && {
      loadDefault,
    }) ||
      {}),
    ...(((config.methods as Record<string, string>).loadFromFile && {
      loadFromFile,
    }) ||
      {}),
    ...(((config.methods as Record<string, string>).import && {
      importToModel,
    }) ||
      {}),
    ...(((config.methods as Record<string, string>).export && {
      exportFromModel,
    }) ||
      {}),

    // Utility methods
    clearAll,
    resetState,

    // Custom methods
    ...customMethods,

    // Dialog component
    ConfirmDialog,
  } as UseSketchupEntityReturn<TData, TMethods>;
}
