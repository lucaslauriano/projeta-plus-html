'use client';

/**
 * Handler management for window callbacks from Ruby
 */

import { useEffect, useMemo, useCallback } from 'react';
import type { HandlerConfig, HandlerContext, HandlerResult } from '../types';
import { createToastContext } from '../utils/toastUtils';

export interface UseSketchupHandlersOptions<TData> {
  config: HandlerConfig<TData>;
  setData: (data: TData | ((prev: TData) => TData)) => void;
  setIsBusy: (busy: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  isAvailable: boolean;
  entityName?: string;
  onReload?: () => void;
}

export interface UseSketchupHandlersReturn {
  handlers: Record<string, (result: HandlerResult) => void>;
  registerHandlers: () => void;
  unregisterHandlers: () => void;
}

/**
 * Hook for managing window handlers that receive Ruby callbacks
 */
export function useSketchupHandlers<TData>(
  options: UseSketchupHandlersOptions<TData>
): UseSketchupHandlersReturn {
  const {
    config,
    setData,
    setIsBusy,
    setIsLoading,
    isAvailable,
    entityName = 'entity',
    onReload,
  } = options;

  // Create handler context
  const context: HandlerContext<TData> = useMemo(
    () => ({
      setData,
      setIsBusy,
      setIsLoading,
      isAvailable,
      toast: createToastContext(),
    }),
    [setData, setIsBusy, setIsLoading, isAvailable]
  );

  // Create standard handlers
  const createStandardHandler = useCallback(
    (
      handlerFn?: (result: HandlerResult, ctx: HandlerContext<TData>) => void,
      defaultMessage?: string
    ) => {
      return (result: HandlerResult) => {
        setIsBusy(false);
        setIsLoading(false);

        if (handlerFn) {
          handlerFn(result, context);
        } else if (result.success) {
          if (result.message || defaultMessage) {
            context.toast.success(result.message || defaultMessage!);
          }
        } else {
          context.toast.error(result.message || 'Erro na operação');
        }
      };
    },
    [context, setIsBusy, setIsLoading]
  );

  // Build handlers object
  const handlers = useMemo(() => {
    const handlerMap: Record<string, (result: HandlerResult) => void> = {};

    // GET handler
    if (config.onGet) {
      handlerMap[`handleGet${capitalize(entityName)}Result`] =
        createStandardHandler(config.onGet);
    }

    // ADD handler
    if (config.onAdd) {
      handlerMap[`handleAdd${capitalize(entityName)}Result`] = (
        result: HandlerResult
      ) => {
        setIsBusy(false);
        if (result.success) {
          context.toast.success(
            result.message || `${capitalize(entityName)} adicionado com sucesso`
          );
          config.onAdd!(result, context);
          onReload?.();
        } else {
          context.toast.error(result.message || 'Erro ao criar');
        }
      };
    }

    // UPDATE handler
    if (config.onUpdate) {
      handlerMap[`handleUpdate${capitalize(entityName)}Result`] = (
        result: HandlerResult
      ) => {
        setIsBusy(false);
        if (result.success) {
          context.toast.success(
            result.message || `${capitalize(entityName)} atualizado com sucesso`
          );
          config.onUpdate!(result, context);
          onReload?.();
        } else {
          context.toast.error(result.message || 'Erro ao atualizar');
        }
      };
    }

    // DELETE handler
    if (config.onDelete) {
      handlerMap[`handleDelete${capitalize(entityName)}Result`] = (
        result: HandlerResult
      ) => {
        setIsBusy(false);
        if (result.success) {
          context.toast.success(
            result.message || `${capitalize(entityName)} removido com sucesso`
          );
          config.onDelete!(result, context);
          onReload?.();
        } else {
          context.toast.error(result.message || 'Erro ao remover');
        }
      };
    }

    // SAVE TO JSON handler
    if (config.onSaveToJson) {
      handlerMap[`handleSave${capitalize(entityName)}ToJsonResult`] =
        createStandardHandler(
          config.onSaveToJson,
          'Configurações salvas com sucesso'
        );
    }

    // LOAD FROM JSON handler
    if (config.onLoadFromJson) {
      handlerMap[`handleLoad${capitalize(entityName)}FromJsonResult`] =
        createStandardHandler(
          config.onLoadFromJson,
          'Configurações carregadas com sucesso'
        );
    }

    // LOAD DEFAULT handler
    if (config.onLoadDefault) {
      handlerMap[`handleLoadDefault${capitalize(entityName)}Result`] =
        createStandardHandler(
          config.onLoadDefault,
          'Dados padrão carregados com sucesso'
        );
    }

    // LOAD FROM FILE handler
    if (config.onLoadFromFile) {
      handlerMap[`handleLoad${capitalize(entityName)}FromFileResult`] =
        createStandardHandler(
          config.onLoadFromFile,
          'Arquivo carregado com sucesso'
        );
    }

    // IMPORT handler
    if (config.onImport) {
      handlerMap[`handleImport${capitalize(entityName)}Result`] = (
        result: HandlerResult
      ) => {
        setIsBusy(false);
        if (result.success) {
          context.toast.success(result.message || 'Importado com sucesso');
          config.onImport!(result, context);
          onReload?.();
        } else {
          context.toast.error(result.message || 'Erro ao importar');
        }
      };
    }

    // EXPORT handler
    if (config.onExport) {
      handlerMap[`handleExport${capitalize(entityName)}Result`] =
        createStandardHandler(config.onExport, 'Exportado com sucesso');
    }

    // Custom handlers
    Object.entries(config).forEach(([key, handler]) => {
      if (
        !key.startsWith('on') &&
        typeof handler === 'function' &&
        !handlerMap[key]
      ) {
        handlerMap[key] = createStandardHandler(handler);
      }
    });

    return handlerMap;
  }, [config, entityName, context, setIsBusy, createStandardHandler, onReload]);

  // Register handlers on window
  const registerHandlers = useCallback(() => {
    Object.entries(handlers).forEach(([name, fn]) => {
      (window as unknown as Record<string, unknown>)[name] = fn;
    });
  }, [handlers]);

  // Unregister handlers from window
  const unregisterHandlers = useCallback(() => {
    Object.keys(handlers).forEach((name) => {
      delete (window as unknown as Record<string, unknown>)[name];
    });
  }, [handlers]);

  // Auto-register/unregister on mount/unmount
  useEffect(() => {
    registerHandlers();
    return () => {
      unregisterHandlers();
    };
  }, [registerHandlers, unregisterHandlers]);

  return {
    handlers,
    registerHandlers,
    unregisterHandlers,
  };
}

/**
 * Capitalizes first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
